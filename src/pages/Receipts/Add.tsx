import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import { TrashIcon } from "@heroicons/react/20/solid";
import { connect, ConnectedProps } from "react-redux";
import AccountList from "../../components/AccountList";
// Routing imports
// Link backend
import agent from "../../agent";
// Dashboard import
import Dashboard from "../../components/Dashboard";
// Icons and styling
import Icon from "../../components/Icon";
// Redux Notify
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";
import "../style.css";
import TagManager from "react-gtm-module";
import SaveButton from "../../components/SaveButton";
import DateBox from "../../components/DateBox";
import { withRouter } from "../../helpers/withRouter";
import { compose } from "redux";
import useEffectAfterInitialRender from "../../helpers/useEffectAfterInitialRender";
import AmountBox from "../../components/AmountBox";
import { convertDateToString } from "../../helpers/Convertdate";
import { format } from "date-fns";
import { string } from "prop-types";

const tagManagerArgs = {
  dataLayer: {
    userId: "001",
    userProject: "TaxAdda",
    page: "gsts",
  },
  dataLayerName: "PageDataLayer",
};

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
  onNotify: (title: string, message: string, type: string) =>
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        title,
        message,
        type,
      },
    }),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function ReceiptEntry(props: PropsFromRedux) {
  const navigate = useNavigate();

  // get no. of times user is on add/edit/duplicate page, so that we can determine how much to navigate back to go back to previous page which is not of this component

  const [pageCount, setPageCount] = useState(0);
  // codes for data table with three columns
  const numberOfInitialRows = 3;
  const [id, setId] = useState(numberOfInitialRows);
  const inputArray = {
    accountId: "",
    amount: "",
    id: id,
  };

  let initialInput: any = [];

  for (let i = 0; i < numberOfInitialRows; i++) {
    initialInput.push({
      accountId: "",
      amount: "",
      id: i,
    });
  }


  // set pagetype on basis of url
  const [pageType, setPageType] = useState("");
  const currentYear = (props as any).currentYear;
  const [date, setDate] = useState({ date: "", error: "" });
  const [narration, setNarration] = useState("");
  const [receivedInAccountId, setreceivedInAccountId] = useState("");

  useEffect(() => {
    setPageCount(pageCount + 1);
    const pageURL = (props as any).location.pathname.split("/");

    if (pageURL[4] === "add") {
      setPageType("add");
      const today = new Date();
      const formatedTodayDate = format(today, "dd-MM-yyyy");
      const stringDate = formatedTodayDate.toString();
      setDate({ date: stringDate, error: "" });
    }
    if (pageURL[4] === "duplicate") {
      setPageType("duplicate");
    }
    if (pageURL[4] === "edit") {
      setPageType("edit");
    }

    // first focus on narration so that when focus on date it gets selected whole
    focusOnNarration();
    focusOnDate();
  }, [(props as any).location.pathname]);

  const [arr, setArr] = useState(initialInput);
  const [total, setTotal] = useState("0.00");

  // focus on date on second render
  useEffectAfterInitialRender(
    () => {
      focusOnDate();
    },
    [],
    0
  );

  useEffectAfterInitialRender(
    () => {
      const pageURL = (props as any).location.pathname.split("/");

      if (
        (props as any).params?.organisationId &&
        (props as any).accounts &&
        (props as any).currentYear
      ) {
        if (pageURL[4] === "edit" || pageURL[4] === "duplicate") {
          const organisationId = (props as any).params?.organisationId;
          agent.ReceiptEntry.getsingleentrydetails(
            organisationId,
            (props as any).params?.id
          ).then((data: any) => {
            console.log(data);
            setDate({
              date: convertDateToString(data.entryDetails.date),
              error: "",
            });
            setNarration(data.entryDetails.narration);
            setArr(changeArrayFormatToShowData(data.entryDetails.entries));
            setreceivedInAccountId(data.entryDetails.receivedAccountId);
            
            let formattedTotal = new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: 2,
            }).format(data.entryDetails.amountToShow);
            setTotal(formattedTotal);

            setTimeout(() => {
              focusOnNarration();
              focusOnDate();
            }, 100);
          });
        }
      }
    },
    [
      (props as any).params?.organisationId,
      (props as any).accounts,
      (props as any).currentYear,
    ],
    0
  );

  const changeArrayFormatToShowData = (array: any) => {
    let properFormatArray = [];
    for (let i = 0; i < array.length; i++) {
      properFormatArray.push({
        accountId: array[i].accountId,
        amount: (array[i].amount = new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
        }).format(array[i].amount)),
        id: i,
      });
    }
    console.log("PFA");
    console.log(properFormatArray);

    return properFormatArray;
  };

  useEffect(() => {
    if (id > numberOfInitialRows) {
      setArr((s: any) => {
        return [...s, inputArray];
      });
    }
  }, [id]);

  const addRow = async () => {
    setId((id: number) => {
      return id + 1;
    });
  };

  // useEffect(() => {
  //   changeTotal();
  // }, [arr]);

  const changeValue = (id: string, newValue: any, totalChange = true) => {
    const index = id;
    console.log(newValue, typeof (newValue));

    setArr((s: any) => {
      const newArr = arr.map((obj: any) => ({ ...obj }));
      newArr.map((item: any) => {
        return item.id === index ? (item.amount = (newValue)) : null;
      });
      return newArr;
    });
  };

  const handleChange = (e: any) => {
    changeValue(e.id, e.newValue);
    changeTotal();
  };

  const setReceivedAccount = (e: any) => {
    console.log(e.account._id);
    
    setreceivedInAccountId(e.account._id);
  };

  const changeTotal = () => {
    let totalAmount: number = 0;

    arr.forEach((item: any) => {
      totalAmount += parseFloat(item.amount);
    });
    let formattedtotal = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
    }).format(totalAmount);

    setTotal(formattedtotal);
  };

  useEffect(() => {
    changeTotal();
  }, [arr]);

  const onAccountSelection = (e: any) => {
    const newData = [...arr];
    let object: any = newData.find((item: any) => item.id === e.account.id);
    if (e.account._id) {
      object.accountId = e.account._id;
    } else {
      object.accountId = "";
    }

    setArr(newData);
  };

  const addInput = async () => {
    setId((id: number) => {
      return id + 1;
    });
  };

  const deleteRow = (id: any) => {
    let newArr = arr.slice();
    newArr.splice(id, 1);
    changeTotal();
    console.log(newArr);

    setArr(newArr);
  };

  const dateFunction = (data: any) => {
    setDate(data);
  };

  function validateData(): string {
    let error: string = "";
    let totalAmount: number = 0;

    if (receivedInAccountId === "") {
      error = "Received In Field is mandatory";
      return error;
    }

    // Check if there is at least one row with both an account and an amount
    let hasAccountAndAmount = false;
    arr.forEach((input: any) => {
      if (input.accountId && input.amount) {
        hasAccountAndAmount = true;
      }
    });
    if (!hasAccountAndAmount) {
      error = "At least one row with both an account and an amount is required";
      return error;
    }

    // Check if there is an account selected in any row, then the amount is compulsory and vice-versa
    arr.forEach((input: any) => {
      if (input.accountId && !input.amount) {
        console.log("error occured");
        error = "Amount is required when an account is selected";
      } else if (!input.accountId && input.amount) {
        error = "Account is required when an amount is entered";
      }
    });
    if (error !== "") {
      return error;
    }

    // Calculate the total amount
    arr.forEach((input: any) => {
      totalAmount += input.amount;
    });

    // Check if the total amount is positive and not equal to zero
    if (totalAmount <= 0) {
      error = "Total amount must be positive and not equal to zero";
      return error;
    }

    return "";
    // return !hasError;
  }

  const onButtonClick = (buttonClicked: any) => {
    console.log(buttonClicked);

    let error = validateData();
    if (error !== "") {
      console.log("error notify");
      (props as any).onNotify(error, "", "danger");
      return;
    }
    const properFormatArray = [];

    for (const obj of arr) {
      let individualObject: any = obj;
      if (individualObject.amount !== "" && individualObject.account !== "") {
        const obj = {
          accountId: individualObject.accountId,
          amount: individualObject.amount,
        };
        properFormatArray.push(obj);
      }
    }
    console.log("PFA");
    console.log(properFormatArray);
    // console.log(parseInt(total.replace(/[,-]/g, "")));
    // // save the entry

    const organisationId = (props as any).params?.organisationId;
    const currentYear = (props as any).currentYear;
    if (
      buttonClicked === "Save & New" ||
      buttonClicked === "Save & Duplicate" ||
      buttonClicked === "Save & Close"
    ) {      
      agent.ReceiptEntry.add(
        organisationId,
        date.date,
        receivedInAccountId,
        parseInt(total.replace(/[,]/g, "")),
        properFormatArray,
        narration,
        currentYear
      )
        .then((response: any) => {
          if (buttonClicked === "Save & New") {
            setNarration("");
            setArr(initialInput);
            setTotal("0.00");
            setreceivedInAccountId("");
            (props as any).onNotify(
              "Receipt Entry Saved Successfully",
              "",
              "success"
            );
            navigate(`/${organisationId}/receipt-entry/add`);
            focusOnDate();
          }

          if (buttonClicked === "Save & Duplicate") {
            (props as any).onNotify(
              "Receipt Entry Added and Copied",
              "Entry is already saved and copied. You can now edit and save again.",
              "success"
            );
            navigate(
              `/${organisationId}/${(props as any).currentYear
              }/receipt-entry/duplicate/${response.entryId}`
            );
            focusOnDate();
          }

          if (buttonClicked === "Save & Close") {
            setNarration("");
            setDate({ date: "", error: "" });
            setArr(initialInput);
            setTotal("0.00");
            setreceivedInAccountId("");
            (props as any).onNotify(
              "Receipt Entry Saved Successfully",
              "",
              "success"
            );

            navigate(-1);
          }
        })
        .catch((err: any) => {
          (props as any).onNotify(
            "Could not add Receipt Entry",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    }
    if (
      buttonClicked === "Update & New" ||
      buttonClicked === "Update & Duplicate" ||
      buttonClicked === "Update & Close"
    ) {
      agent.ReceiptEntry.edit(
        organisationId,
        (props as any).params?.id,
        date.date,
        properFormatArray,
        narration,
        currentYear
      )
        .then((response: any) => {
          console.log(response);
          
          console.log(response);
          if (buttonClicked === "Update & New") {
            setNarration("");
            setArr(initialInput);
            setTotal("0.00");
            setreceivedInAccountId("");
            (props as any).onNotify(
              "Receipt Entry Updated Successfully",
              "",
              "success"
            );
            // navigate(`/${organisationId}/journal-entry/add`);
            focusOnDate();
          }

          if (buttonClicked === "Update & Duplicate") {
            (props as any).onNotify(
              "Receipt Entry Updated and Copied",
              "Entry is already updated and copied. You can now edit and save again.",
              "success"
            );
            navigate(
              `/${organisationId}/${(props as any).currentYear
              }/receipt-entry/duplicate/${response.entryId}`
            );
            focusOnDate();
          }

          if (buttonClicked === "Update & Close") {
            setNarration("");
            setArr(initialInput);
            setTotal("0.00");
            setreceivedInAccountId("");
            (props as any).onNotify(
              "Receipt Entry Updated Successfully",
              "",
              "success"
            );

            navigate(-1);
          }
        })
        .catch((err: any) => {
          console.log(err);
          (props as any).onNotify(
            "Could not add Receipt Entry",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    }
  };

  const focusOnDate = () => {
    document.getElementById("date")?.focus();
  };

  const focusOnNarration = () => {
    document.getElementById("narration")?.focus();
  };

  return (
    <Dashboard>
      <div className="bg-white pl-14 pt-8">
        <div>
          <h3 className="text-xl  font-medium leading-6 text-gray-900">
            {pageType === "add" && "Receipt Entry - Add"}
            {pageType === "edit" && "Receipt Entry - Edit"}
            {pageType === "duplicate" && " Entry - Duplicate"}
            <br />
            <br />
          </h3>

          <div>
            {/* Date */}

            <div className="sm:grid sm:grid-cols-9 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 sm:col-span-2"
              >
                Date*
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <DateBox
                  newDate={date.date}
                  currentYear={currentYear}
                  onBlurrFunction={dateFunction}
                />
              </div>

            </div>
            <div className="sm:grid sm:grid-cols-9 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="received For"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 sm:col-span-2"
              >
                Received In
              </label>
              <div className="mt-1 justify-start sm:col-span-2 sm:mt-0">
                <AccountList
                  onSelection={setReceivedAccount}
                  id={receivedInAccountId}
                  newAccount={
                    receivedInAccountId !== "" ? receivedInAccountId : ""
                  }
                  // this will update account when a row is deleted
                  filterByNature={["Cash", "Bank", "Bank OD/CC"]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1 divide-y divide-gray-200 sm:grid-cols-9 mr-96">
          <div className="pt-8 sm:col-span-4">
            <div className="grid font-bold text-center sm:grid-cols-9 my-1 ">
              <div className="sm:col-span-2   pr-2  py-1">
                {/* Received For */}
              </div>
              <div className="sm:col-span-4  pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
                Account
              </div>
              <div className="sm:col-span-2  pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
                Amount Received
              </div>
            </div>
            {arr.map((item: any, i: any) => {
              return (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-9 -my-2 ">
                  <div className="sm:col-span-2">
                    {i === 0 ? (
                      <label
                        htmlFor="Received For"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 sm:col-span-2"
                      >
                        Received For
                      </label>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="sm:col-span-4">
                    <div className="mt-1">
                      <AccountList
                        onSelection={onAccountSelection}
                        id={item.id}
                        // this will update account when a row is deleted
                        newAccount={item.accountId ? item.accountId : ""}
                        // filterByNature={["All"]}
                        filterByNature={[
                          "Capital",
                          "Creditors",
                          "Current Assets",
                          "Current Liabilities",
                          "Debtors",
                          "Deposits - Assets",
                          "Direct Expense",
                          "Direct Income",
                          "Duties & Taxes",
                          "Fixed Asset",
                          "Indirect Expense",
                          "Indirect Income",
                          "Investments",
                          "Loans and Advances - Asset",
                          "Miscellaneous Assets",
                          "Miscellaneous Liabilities",
                          "Provisions",
                          "Reserves",
                          "Secured Loan",
                          "Suspense",
                          "Unsecured Loan",
                        ]}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mt-1">
                      <AmountBox
                        negativeAllowed={true}
                        // defaultValue={0}
                        onChange={handleChange}
                        id={item.id}
                        newValue={item.amount}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-1 my-4 mx-1">
                    <TrashIcon
                      // id={item[0].id.replace("b", "z")}
                      // key={item[0].id.replace("b", "z")}
                      id={item.id}
                      key={item.id}
                      className="h-4 w-4"
                      aria-hidden="true"
                      color="gray"
                      onClick={() => deleteRow(item.id)}
                    />
                    <div />
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-1 sm:grid-cols-9 my-2">
              <div className="sm:col-span-2 text-left text-blue-700 pr-2 sm:text-sm mx-2"></div>
              <div className="sm:col-span-2 text-left text-blue-700 pr-2 sm:text-sm mx-2">
                <button type="button" onClick={addInput}>
                  +Add Row
                </button>
              </div>
              <div className="sm:col-span-2 text-right pr-2 sm:text-sm">
                Total
              </div>
              <div className="sm:col-span-2 text-right pr-2 sm:text-sm">
                {total}
              </div>
            </div>
            <br />

            {/* narration */}
            <div className="sm:grid sm:grid-cols-9 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="narration"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 sm:col-span-2"
              >
                Narration
              </label>
              <div className="mt-1 sm:col-span-5 sm:mt-0">
                <textarea
                  id="narration"
                  name="narration"
                  rows={5}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  onChange={(e: { target: { value: any } }) =>
                    setNarration(e.target.value)
                  }
                  value={narration}
                />
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:justify-end py-4 pr-24">
              <div className="pr-4">
                <button
                  type="button"
                  className="inline-flex mx-4 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
              {pageType === "edit" ? (
                <SaveButton
                  type="update"
                  options={["new", "close", "duplicate"]}
                  onButtonClick={onButtonClick}
                />
              ) : (
                <SaveButton
                  type="save"
                  options={["new", "close", "duplicate"]}
                  onButtonClick={onButtonClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

// export default AccountsList;

export default compose(
  connector,
  withRouter
)(ReceiptEntry) as React.ComponentType;
