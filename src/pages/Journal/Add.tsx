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

  // get no. of times user is on add/edit/duplicate page, so that we can determine how much to navigate back to go back to previous page which is not of this component

  const [pageCount, setPageCount] = useState(0);

  // codes for data table with three columns
  const numberOfInitialRows = 3;
  const [id, setId] = useState(numberOfInitialRows);
  const inputArray = {
    accountId: "",
    debitAmount: "",
    creditAmount: "",
    id: id,
  };

  let initialInput: any = [];

  for (let i = 0; i < numberOfInitialRows; i++) {
    initialInput.push({
      accountId: "",
      debitAmount: "",
      creditAmount: "",
      id: i + 1,
    });
  }

  // set pagetype on basis of url

  const [pageType, setPageType] = useState("");
  const currentYear = (props as any).currentYear;
  const [date, setDate] = useState({ date: "", error: "" });
  const [narration, setNarration] = useState("");

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
  const [total, setTotal] = useState({ debitTotal: 0, creditTotal: 0 });

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
          agent.JournalEntry.getsingleentrydetails(
            organisationId,
            (props as any).params?.id
          ).then((data: any) => {
            setDate({
              date: convertDateToString(data.entryDetails.date),
              error: "",
            });
            setNarration(data.entryDetails.narration);
            setArr(changeArrayFormatToShowData(data.entryDetails.entries));
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
        debitAmount:
          array[i].debitAmount > 0
            ? new Intl.NumberFormat("en-IN", {
                minimumFractionDigits: 2,
              }).format(array[i].debitAmount)
            : "",
        creditAmount:
          array[i].creditAmount > 0
            ? new Intl.NumberFormat("en-IN", {
                minimumFractionDigits: 2,
              }).format(array[i].creditAmount)
            : "",
        id: i + 1,
      });
    }
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
    setId((id) => {
      return id + 1;
    });
  };

  useEffect(() => {
    changeTotal();
  }, [arr]);

  const onKeyUpFunction = (e: any) => {
    if (e.keyCode === 13) {
      console.log("dateinkeyfunction", date);
      onButtonClick("Save & Close");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyUpFunction);
    return () => {
      document.removeEventListener("keydown", onKeyUpFunction);
    };
  }, []);

  // get balancing figure in last row on selecting account
  // only if value is not entered already

  const balancingFigure = (id: any) => {
    // get all rows with value
    let newArr = [];
    for (let object of arr) {
      if (object.debitAmount !== "" || object.creditAmount !== "") {
        newArr.push(object);
      }
    }
    // total of all rows for both sides
    let total = { debitAmount: 0, creditAmount: 0 };

    for (const object of newArr) {
      total.debitAmount += Number(object.debitAmount);
      total.creditAmount += Number(object.creditAmount);
    }

    const difference = total.debitAmount - total.creditAmount;
    if (difference > 0) {
      let newArray = [...arr];
      let object: any = newArray.find((item: any) => item.id === id);

      // if creditAmount is empty then only add balancing figure
      if (object.creditAmount === "") {
        object.creditAmount = new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
        }).format(difference);

        setArr(newArray);
      }
    }
    if (difference < 0) {
      let newArray = [...arr];
      let object: any = newArray.find((item: any) => item.id === id);
      // if debitAmount is empty then only add balancing figure
      if (object.debitAmount === "") {
        object.debitAmount = new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
        }).format(difference * -1);
        setArr(newArray);
      }
    }
    if (total.debitAmount === total.creditAmount) {
      return;
    }
  };

  const handleDebitChange = (e: any) => {
    const newData = [...arr];
    let object: any = newData.find((item: any) => item.id.toString() === e.id);

    object.debitAmount = e.newValue;
    object.creditAmount = "";

    setArr(newData);
  };

  const handleCreditChange = (e: any) => {
    const newData = [...arr];
    let object: any = newData.find((item: any) => item.id.toString() === e.id);

    object.creditAmount = e.newValue;
    object.debitAmount = "";

    setArr(newData);
  };

  const onAccountSelection = (e: any) => {
    const newData = [...arr];

    let object: any = newData.find((item: any) => item.id === e.account.id);
    if (e.account._id) {
      object.accountId = e.account._id;
    } else {
      object.accountId = "";
    }

    setArr(newData);

    // balacingFigure to enter balancing figure in row when account selected
    balancingFigure(e.account.id);
  };

  const changeTotal = () => {
    let debitTotal: any = 0;
    let creditTotal: any = 0;

    debitTotal = arr.reduce((a: any, b: any) => {
      if (b.debitAmount !== "") {
        return a + Number(b.debitAmount.replace(/,/g, ""));
      }
      return a;
    }, 0);

    debitTotal = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
    }).format(debitTotal);

    creditTotal = arr.reduce((a: any, b: any) => {
      if (b.creditAmount !== "") {
        return a + Number(b.creditAmount.replace(/,/g, ""));
      }
      return a;
    }, 0);

    creditTotal = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
    }).format(creditTotal);

    setTotal(() => {
      return { debitTotal, creditTotal };
    });
  };

  const deleteRow = (id: any) => {
    let newData = [...arr];
    newData = newData.filter((item: any) => item.id !== id);
    setArr(newData);
  };

  const dateFunction = (date: any) => {
    console.log("datefunction", date);
    setDate(() => {
      return { date: date.date, error: "" };
    });
  };

  console.log("arr", arr);
  console.log("date", date);

  const onButtonClick = (buttonClicked: any) => {
    console.log("button clicked", buttonClicked);
    console.log("just button clicked", date);
    console.log("arr", arr);
    // check for date exists and error in date
    if (date.date === "") {
      console.log("date not exists");

      (props as any).onNotify("Please select date.", "", "danger");
      return;
    }
    if (date.error !== "" && date.error !== undefined) {
      console.log(date.error);
      console.log("date error");
      (props as any).onNotify(date.error, "", "danger");
      return;
    }

    if (total.debitTotal !== total.creditTotal) {
      (props as any).onNotify(
        "Debit and Credit total should be equal",
        "",
        "danger"
      );
      return;
    }
    // check for error in rows which have data
    for (const indObject of arr) {
      if (
        indObject.accountId !== "" &&
        indObject.debitAmount === "" &&
        indObject.creditAmount === ""
      ) {
        (props as any).onNotify(
          "Please enter amount.",
          "If account is selected in any row, then amount should exists in debit side or credit side.",
          "danger"
        );
        return;
      }
      if (
        (indObject.debitAmount !== "" || indObject.creditAmount !== "") &&
        indObject.accountId === ""
      ) {
        (props as any).onNotify(
          "Please select  account.",
          "If amount is entered in any row, then account should be selected.",
          "danger"
        );
        return;
      }
    }

    // deep copying array of objects to new array
    let entryArrayWithValue = arr.map((object: any) => ({ ...object }));

    // removing rows which have no data
    entryArrayWithValue = entryArrayWithValue.filter((item: any) => {
      if (item.accountId !== "") {
        return true;
      }
      return false;
    });

    if (entryArrayWithValue.length < 2) {
      (props as any).onNotify(
        "Could not add journal entry.",
        "Entry should have atleast 2 rows.",
        "danger"
      );
      return;
    }

    // removing id from array as backend does not need it
    for (const indObject of entryArrayWithValue) {
      delete indObject.id;
    }

    // save the entry
    const currentYear = (props as any).currentYear;
    const organisationId = (props as any).params?.organisationId;

    if (
      buttonClicked === "Save & New" ||
      buttonClicked === "Save & Duplicate" ||
      buttonClicked === "Save & Close"
    ) {
      console.log("date before adding", date);
      agent.JournalEntry.add(
        organisationId,
        date.date,
        entryArrayWithValue,
        narration,
        currentYear
      )
        .then((response: any) => {
          if (buttonClicked === "Save & New") {
            setNarration("");

            setArr(initialInput);
            setTotal({ debitTotal: 0, creditTotal: 0 });
            (props as any).onNotify(
              "Journal Entry Saved Successfully",
              "",
              "success"
            );
            // navigate(`/${organisationId}/journal-entry/add`);
            focusOnDate();
          }

          if (buttonClicked === "Save & Duplicate") {
            (props as any).onNotify(
              "Journal Entry Added and Copied",
              "Entry is already saved and copied. You can now edit and save again.",
              "success"
            );
            navigate(
              `/${organisationId}/${
                (props as any).currentYear
              }/journal-entry/duplicate/${response.entryId}`
            );
          }

          if (buttonClicked === "Save & Close") {
            setNarration("");
            setDate({ date: "", error: "" });
            setArr(initialInput);
            setTotal({ debitTotal: 0, creditTotal: 0 });
            (props as any).onNotify(
              "Journal Entry Saved Successfully",
              "",
              "success"
            );

            navigate(-pageCount);
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
    if (
      buttonClicked === "Update & New" ||
      buttonClicked === "Update & Duplicate" ||
      buttonClicked === "Update & Close"
    ) {
      agent.JournalEntry.edit(
        organisationId,
        (props as any).params?.id,
        date.date,
        entryArrayWithValue,
        narration,
        currentYear
      )
        .then((response: any) => {
          if (buttonClicked === "Update & New") {
            setNarration("");

            setArr(initialInput);
            setTotal({ debitTotal: 0, creditTotal: 0 });
            (props as any).onNotify(
              "Journal Entry Updated Successfully",
              "",
              "success"
            );
            navigate(`/${organisationId}/${currentYear}/journal-entry/add`);
            focusOnDate();
          }

          if (buttonClicked === "Update & Duplicate") {
            (props as any).onNotify(
              "Journal Entry Updated and Copied",
              "Entry is already updated and copied. You can now edit and save again.",
              "success"
            );
            navigate(
              `/${organisationId}/${
                (props as any).currentYear
              }/journal-entry/duplicate/${response.entryId}`
            );
            focusOnDate();
          }

          if (buttonClicked === "Update & Close") {
            setNarration("");
            setDate({ date: "", error: "" });
            setArr(initialInput);
            setTotal({ debitTotal: 0, creditTotal: 0 });
            (props as any).onNotify(
              "Journal Entry Updated Successfully",
              "",
              "success"
            );

            navigate(-pageCount);
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
  };

  const focusOnDate = () => {
    document.getElementById("date")?.focus();
  };

  const focusOnNarration = () => {
    document.getElementById("narration")?.focus();
  };
  console.log("arr", arr);
  return (
    <Dashboard>
      <div className="bg-white pl-14 pt-8">
        <div>
          <h3 className="text-xl  font-medium leading-6 text-gray-900">
            {pageType === "add" && "Journal Entry - Add"}
            {pageType === "edit" && "Journal Entry - Edit"}
            {pageType === "duplicate" && "Journal Entry - Duplicate"}
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
          </div>
        </div>

        <div className="space-y-1  divide-gray-200 sm:grid-cols-9 mr-96 mt-12">
          <table>
            <thead>
              <tr>
                <th className="sm:col-span-4  pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
                  Account
                </th>
                <th className="sm:col-span-2  pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
                  Debit{" "}
                </th>
                <th className="sm:col-span-2  pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
                  Credit
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {arr.map((row: any) => (
                <tr key={row.id}>
                  <td>
                    <AccountList
                      onSelection={onAccountSelection}
                      id={row.id}
                      newAccount={row.accountId !== "" ? row.accountId : ""}
                      filterByNature={["All"]}
                    />
                  </td>
                  <td>
                    <AmountBox
                      // defaultValue={0}
                      onChange={handleDebitChange}
                      id={row.id.toString()}
                      newValue={row.debitAmount}
                    />
                  </td>
                  <td>
                    <AmountBox
                      // defaultValue={0}
                      onChange={handleCreditChange}
                      id={row.id.toString()}
                      newValue={row.creditAmount}
                    />
                  </td>
                  <td>
                    <TrashIcon
                      id={row.id.toString()}
                      key={row.id.toString()}
                      className="h-4 w-4"
                      aria-hidden="true"
                      color="gray"
                      onClick={(e) => deleteRow(row.id)}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td className="text-left text-blue-700 pr-2 sm:text-sm mx-2">
                  <button onClick={addRow}>+Add row</button>
                </td>
                <td>
                  <p className="text-right pr-2 sm:text-sm">
                    {total.debitTotal}
                  </p>
                </td>
                <td>
                  <p className="text-right pr-2 sm:text-sm">
                    {total.creditTotal}
                  </p>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
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
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:justify-end py-12 pr-24">
            <div className="pr-4">
              <button
                type="button"
                className="inline-flex mx-4 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none"
                onClick={() => navigate(-pageCount)}
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
    </Dashboard>
  );
}

// export default AccountsList;

export default compose(
  connector,
  withRouter
)(JournalEntry) as React.ComponentType;
