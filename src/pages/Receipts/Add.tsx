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

function JournalEntry(props: PropsFromRedux) {
  const navigate = useNavigate();
  // codes for data table with three columns
  const numberOfInitialRows = 3;
  const [id, setId] = useState(numberOfInitialRows - 1);
  const inputArray = [
    {
      value: "0",
      id: `c${id}`,
      account: "",
    },
  ];

  const initialInput = [
    {
      value: "0",
      id: `c${0}`,
      account: "",
    },
    {
      value: "0",
      id: `c${1}`,
      account: "",
    },
    {
      value: "0",
      id: `c${2}`,
      account: "",
    },
  ];

  // set pagetype on basis of url

  // const [pageType, setPageType] = useState("");
  const currentYear = (props as any).currentYear;
  const [date, setDate] = useState({ date: "", error: "" });
  const [narration, setNarration] = useState("");

  const [arr, setArr] = useState(initialInput);
  const [total, setTotal] = useState(0);

  // focus on date on second render
  useEffectAfterInitialRender(
    () => {
      focusOnDate();
    },
    [],
    0
  );

  useEffect(() => {
    if (id > 2) {
      setArr((s: any) => {
        return [
          ...s,
          {
            value: "0",
            id: `c${id}`,
            account: "",
          },
        ];
      });
    }
  }, [id]);

  const addInput = async () => {
    setId((id) => {
      return id + 1;
    });
  };

  useEffect(() => {
    changeTotal();
  }, [arr]);

  // const changeArrayFormatToShowData = (array: any) => {
  //     const properFormatArray = [];
  //     const organisationId = (props as any).params?.organisationId;
  //     let accountsList = (props as any).accounts;
  //     let id = 0;

  //     for (const indArray of array) {
  //         const selectedAccount = accountsList.find(
  //             (account: any) => account._id === indArray.accountId
  //         );

  //         selectedAccount["id"] = `a${id}`;

  //         const obj = [
  //             {
  //                 value:
  //                     indArray.type === "debit"
  //                         ? new Intl.NumberFormat("en-IN", {
  //                             minimumFractionDigits: 2,
  //                         }).format(indArray.amount)
  //                         : "",
  //                 id: `b${id}`,
  //             },
  //             {
  //                 value:
  //                     indArray.type === "credit"
  //                         ? new Intl.NumberFormat("en-IN", {
  //                             minimumFractionDigits: 2,
  //                         }).format(indArray.amount)
  //                         : "",
  //                 id: `c${id}`,
  //             },
  //             selectedAccount,
  //         ];

  //         properFormatArray.push(obj);
  //         id += 1;
  //     }

  //     return properFormatArray;
  // };

  // value should NOT be both side debit and credit in same rwo

  const checkBothSide = (id: any) => {
    console.log("CHeck both side");

    // setArr((s: any) => {
    //     let newArray = arr.slice();
    //     const filteredArray = newArray.filter((item: any) => {
    //         for (const array of item) {
    //             if (array.id === id) {
    //                 return true;
    //             }
    //         }

    //         return false;
    //     });

    //     let shouldReset = false;

    //     // shouldReset other column only if that side has value, otherwise on click of tab it will reset other column which has value
    //     for (let object of filteredArray[0]) {
    //         if (object.id === id && object.value !== "") {
    //             shouldReset = true;
    //         }
    //     }

    //     if (shouldReset) {
    //         for (let object of filteredArray[0]) {
    //             if (object.id !== id) {
    //                 if (object.value && object.value !== "") {
    //                     object.value = "";
    //                 }
    //             }
    //         }
    //     }

    //     return newArray;
    // });
  };

  // get balancing figure in last row on selecting account
  // only if value is not entered already

  // const balancingFigure = (id: any) => {
  //     console.log("Figure Balancing");

  //     // get all rows with value
  //     //     let newArr = [];
  //     //     for (let object of arr) {
  //     //         if (object[0].value !== "" || object[1].value !== "") {
  //     //             newArr.push(object);
  //     //         }
  //     //     }
  //     //     // total of all rows for both sides
  //     //     let total = { b: 0, c: 0 };
  //     //     for (let array of newArr) {
  //     //         for (const object of array) {
  //     //             if (object.id) {
  //     //                 if (object.id.includes("b")) {
  //     //                     total.b += Number(object.value);
  //     //                 } else if (object.id.includes("c")) {
  //     //                     total.c += Number(object.value);
  //     //                 }
  //     //             }
  //     //         }
  //     //     }

  //     //     const difference = total.b - total.c;

  //     //     if (difference > 0) {
  //     //         changeValue(
  //     //             id.replace("a", "c"),
  //     //             new Intl.NumberFormat("en-IN", {
  //     //                 minimumFractionDigits: 2,
  //     //             }).format(difference)
  //     //         );
  //     //     }
  //     //     if (difference < 0) {
  //     //         changeValue(
  //     //             id.replace("a", "b"),
  //     //             new Intl.NumberFormat("en-IN", {
  //     //                 minimumFractionDigits: 2,
  //     //             }).format(difference * -1)
  //     //         );
  //     //     }
  //     //     if (total.b === total.c) {
  //     //         return;
  //     //     }
  //     };

  const changeValue = (id: string, newValue: any, totalChange = true) => {
    // set value in state
    const index = id;

    // checkBothSide(index);

    setArr((s: any) => {
      const newArr = s.slice();
      newArr.map((item: any) => {
        return item.id === index ? (item.value = newValue) : null;
      });
      return newArr;

      // for (const obj of newArr) {
      //     if(obj.id === index){
      //         obj.value = newValue;
      //     }
      //     //     const result = array.find((item: any) => item.id === index);
      //     //     if (result) {
      //     //         result.value = newValue;
      //     //         const indexOfResult = array.indexOf(result);
      //     //         const indexOfArray = newArr.indexOf(array);
      //     //         newArr[indexOfArray][indexOfResult] = result;
      //     //     }
      //     // }
      //     // if (totalChange) {
      //     //     changeTotal();
      //     // }
      //     console.log(newArr);

      //     return newArr;
      // }
    });
  };

  const handleChange = (e: any) => {
    changeValue(e.id, e.newValue);
  };

  const changeTotal = () => {
    console.log("Change total");
    let amountTotal = 0;

    arr.forEach((item: any) => {
      if (item.id) {
        if (item.id.includes("c")) {
          if (item.value && item.value !== "") {
            amountTotal += Number(item.value.replace(/,/g, ""));
          }
        }
      }
    });
    setTotal(amountTotal);
  };

  const onAccountSelection = (e: any) => {
    console.log("Account Selection");

    // balacingFigure to enter balancing figure in row when account selected
    // balancingFigure(e.account.id);
    setArr((s: any) => {
      const newArr = arr.slice();
      for (let obj of newArr) {
        if (obj.id === e.account.id) {
          let index = newArr.indexOf(obj);
          if (index !== -1) {
            newArr.splice(index, 1, { ...obj, account: e.account });
          }
        }
      }

      // const result2: any = array.find(
      //     (item: any) => item.id.charAt(0) === "a"
      // );

      // if (result) {
      //     // to remove account which is deselected and another account is selected
      //     let index = array.indexOf(result2);
      //     if (index !== -1) {
      //         array.splice(index, 1);
      //     }
      //     array.push(e.account);
      // }
      return newArr;
    });
  };

  const deleteRow = (e: any, id: any) => {
    const index = id.replace("c", "");

    setArr((s: any) => {
      let newArr = s.slice();

      newArr = newArr.filter((item: any) => {
        if (item.id.replace("c", "") === index) {
          return false;
        }
        return true;
      });
      changeTotal();
      return newArr;
    });
  };

  const dateFunction = (data: any) => {
    setDate(data);
  };

  const onButtonClick = (buttonClicked: any) => {
    console.log("BUtton CLicked!");
    for (const indArray of arr) {
      console.log(indArray);

      if (indArray.value === "0" || indArray.account === "") {
        (props as any).onNotify(
          "Please enter amount and account.",
          "If account is selected in any row, then amount should exists in debit side or credit side.",
          "danger"
        );
        return;
      }
    }
    // set data in proper format which backend can process
    const properFormatArray = [];

    for (const obj of arr) {
      let individualObject: any = obj;
      if (individualObject.value !== "" || individualObject.account !== "") {
        const obj = {
          accountId: individualObject.account._id,
          amount: (individualObject.value = Number(individualObject.value)),
        };
        properFormatArray.push(obj);
        console.log(properFormatArray);
      }
    }

    //     // // save the entry

    const organisationId = (props as any).params?.organisationId;
    const currentYear = (props as any).currentYear;
    if (
      buttonClicked === "Save & New" ||
      buttonClicked === "Save & Duplicate" ||
      buttonClicked === "Save & Close"
    ) {
      console.log({
        organisationId,
        date: date.date,
        receivedAmount: total,
        receivedAccountId: properFormatArray[0].accountId,
        entries: properFormatArray,
        narration,
        year: currentYear,
      });

      agent.JournalEntry.add(
        organisationId,
        date.date,
        properFormatArray,
        narration,
        currentYear
      )
        .then((response: any) => {
          if (buttonClicked === "Save & New") {
            setNarration("");
            setArr(initialInput);
            setTotal(0);
            (props as any).onNotify(
              "Receipt Entry Saved Successfully",
              "",
              "success"
            );
            // navigate(`/${organisationId}/journal-entry/add`);
            focusOnDate();
          }

          if (buttonClicked === "Save & Duplicate") {
            (props as any).onNotify(
              "Receipt Entry Added and Copied",
              "Entry is already saved and copied. You can now edit and save again.",
              "success"
            );
            navigate(
              `/${organisationId}/${
                (props as any).currentYear
              }/receipt-entry/duplicate/${response.entryId}`
            );
            focusOnDate();
          }

          if (buttonClicked === "Save & Close") {
            setNarration("");
            setDate({ date: "", error: "" });
            setArr(initialInput);
            setTotal(0);
            (props as any).onNotify(
              "Journal Entry Saved Successfully",
              "",
              "success"
            );

            navigate(-1);
          }
        })
        .catch((err: any) => {
          (props as any).onNotify(
            "Could not add Journal Entry",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    }
    //     // if (
    //     //     buttonClicked === "Update & New" ||
    //     //     buttonClicked === "Update & Duplicate" ||
    //     //     buttonClicked === "Update & Close"
    //     // ) {
    //     //     console.log((props as any).params?.id);
    //     //     agent.JournalEntry.edit(
    //     //         organisationId,
    //     //         (props as any).params?.id,
    //     //         date.date,
    //     //         properFormatArray,
    //     //         narration,
    //     //         currentYear
    //     //     )
    //     //         .then((response: any) => {
    //     //             if (buttonClicked === "Update & New") {
    //     //                 setNarration("");

    //     //                 setArr(initialInput);
    //     //                 setTotal({ b: 0, c: 0 });
    //     //                 (props as any).onNotify(
    //     //                     "Journal Entry Updated Successfully",
    //     //                     "",
    //     //                     "success"
    //     //                 );
    //     //                 // navigate(`/${organisationId}/journal-entry/add`);
    //     //                 focusOnDate();
    //     //             }

    //     //             if (buttonClicked === "Update & Duplicate") {
    //     //                 (props as any).onNotify(
    //     //                     "Journal Entry Updated and Copied",
    //     //                     "Entry is already updated and copied. You can now edit and save again.",
    //     //                     "success"
    //     //                 );
    //     //                 navigate(
    //     //                     `/${organisationId}/${(props as any).currentYear
    //     //                     }/journal-entry/duplicate/${response.entryId}`
    //     //                 );
    //     //                 focusOnDate();
    //     //             }

    //     //             if (buttonClicked === "Update & Close") {
    //     //                 setNarration("");
    //     //                 setDate({ date: "", error: "" });
    //     //                 setArr(initialInput);
    //     //                 setTotal({ b: 0, c: 0 });
    //     //                 (props as any).onNotify(
    //     //                     "Journal Entry Updated Successfully",
    //     //                     "",
    //     //                     "success"
    //     //                 );

    //     //                 navigate(-1);
    //     //             }
    //     //         })
    //     //         .catch((err: any) => {
    //     //             (props as any).onNotify(
    //     //                 "Could not add Journal Entry",
    //     //                 err?.response?.data?.message || err?.message || err,
    //     //                 "danger"
    //     //             );
    //     //         });
    //     // }
  };

  const focusOnDate = () => {
    document.getElementById("date")?.focus();
  };

  const focusOnNarration = () => {
    document.getElementById("narration")?.focus();
  };

  return (
    <Dashboard>
      <form className="divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-xl font-medium leading-6 text-gray-900">
              Receipt Add
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
            </div>
          </div>
        </div>
      </form>
      <div className="space-y-1 divide-y divide-gray-200 sm:grid-cols-9 mr-96">
        <div className="pt-8 sm:col-span-4">
          <div className="grid font-bold text-center sm:grid-cols-9 my-1 ">
            <div className="sm:col-span-2   pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
              Received For
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
                  {/* <div className="mt-1">
                                        <AmountBox
                                            defaultValue={0}
                                            onChange={handleChange}
                                            id={item[0].id}
                                            newValue={item[0].value}
                                        />
                                    </div> */}
                </div>
                <div className="sm:col-span-4">
                  <div className="mt-1">
                    <AccountList
                      onSelection={onAccountSelection}
                      id={item.id}
                      // this will update account when a row is deleted
                      newAccount={item[2] ? item[2] : ""}
                      filterByNature={["All"]}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-1">
                    <AmountBox
                      negativeAllowed={true}
                      defaultValue={0}
                      onChange={handleChange}
                      // id={item[1].id}
                      id={item.id}
                      newValue={item.value}
                    />
                  </div>
                </div>
                <div className="sm:col-span-1 my-4 mx-1">
                  <TrashIcon
                    // id={item[0].id.replace("b", "z")}
                    // key={item[0].id.replace("b", "z")}
                    id="afdadf"
                    key="afdac"
                    className="h-4 w-4"
                    aria-hidden="true"
                    color="gray"
                    onClick={(e) => deleteRow(e, item.id)}
                  />
                  <div />
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-1 sm:grid-cols-9 my-2">
            <div className="sm:col-span-4 text-left text-blue-700 pr-2 sm:text-sm mx-2">
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
                onChange={(e) => setNarration(e.target.value)}
                value={narration}
              />
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:justify-start py-4 pr-24">
            <div className="pr-4">
              <button
                type="button"
                className="inline-flex mx-4 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
            <SaveButton
              type="save"
              options={["new", "close", "duplicate"]}
              onButtonClick={onButtonClick}
            />
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
)(JournalEntry) as React.ComponentType;
