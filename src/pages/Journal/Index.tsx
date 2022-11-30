import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Import to Display skeleton while loading data
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TrashIcon } from "@heroicons/react/20/solid";
// Pagination
import ReactPaginate from "react-paginate";
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
import { Menu, Transition } from "@headlessui/react";
import InActiveModal from "../../components/InActiveModal";
import ActiveModal from "../../components/ActiveModal";
import DeleteModal from "../../components/DeleteModal";
import LogModal from "../../components/LogModal";
import TextBox from "../../components/TextBox";
import SaveButton from "../../components/SaveButton";
import DateBox from "../../components/DateBox";
import { withRouter } from "../../helpers/withRouter";
import { compose } from "redux";
import AddAccount from "../Account/Add";
import useEffectAfterInitialRender from "../../helpers/useEffectAfterInitialRender";
import { string } from "prop-types";
import AmountBox from "../../components/AmountBox";

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
    [
      {
        value: "",
        id: `b${id}`,
      },
      {
        value: "",
        id: `c${id}`,
      },
    ],
  ];

  const initialInput = [
    [
      {
        value: "",
        id: `b${0}`,
      },
      {
        value: "",
        id: `c${0}`,
      },
    ],
    [
      {
        value: "",
        id: `b${1}`,
      },
      {
        value: "",
        id: `c${1}`,
      },
    ],
    [
      {
        value: "",
        id: `b${2}`,
      },
      {
        value: "",
        id: `c${2}`,
      },
    ],
  ];

  const [arr, setArr] = useState(initialInput);
  const [accountArray, setAccountArray] = useState([]);
  const [total, setTotal] = useState({ b: 0, c: 0 });

  useEffect(() => {
    if (id > 2) {
      setArr((s: any) => {
        return [...s, inputArray[0]];
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

  // value should NOT be both side debit and credit in same rwo

  const checkBothSide = (id: any) => {
    setArr((s: any) => {
      let newArray = arr.slice();
      const filteredArray = newArray.filter((item: any) => {
        for (const array of item) {
          if (array.id === id) {
            return true;
          }
        }

        return false;
      });

      let shouldReset = false;

      // shouldReset other column only if that side has value, otherwise on click of tab it will reset other column which has value
      for (let object of filteredArray[0]) {
        if (object.id === id && object.value !== "") {
          shouldReset = true;
        }
      }

      if (shouldReset) {
        for (let object of filteredArray[0]) {
          if (object.id !== id) {
            if (object.value && object.value !== "") {
              object.value = "";
            }
          }
        }
      }

      return newArray;
    });
  };

  // get balancing figure in last row on selecting account
  // only if value is not entered already

  const balancingFigure = (id: any) => {
    console.log("balancing figure", id);
    // get all rows with value
    let newArr = [];
    for (let object of arr) {
      if (object[0].value !== "" || object[1].value !== "") {
        newArr.push(object);
      }
    }
    // total of all rows for both sides
    let total = { b: 0, c: 0 };
    for (let array of newArr) {
      for (const object of array) {
        if (object.id) {
          if (object.id.includes("b")) {
            total.b += Number(object.value);
          } else if (object.id.includes("c")) {
            total.c += Number(object.value);
          }
        }
      }
    }
    console.log("total", total);
    const difference = total.b - total.c;
    console.log(id.replace("a", "c"), difference);
    if (difference > 0) {
      changeValue(
        id.replace("a", "c"),
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
        }).format(difference)
      );
    }
    if (difference < 0) {
      changeValue(
        id.replace("a", "b"),
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
        }).format(difference * -1)
      );
    }
    if (total.b === total.c) {
      return;
    }
  };

  const changeValue = (id: string, newValue: any, totalChange = true) => {
    // set value in state

    const index = id;

    checkBothSide(index);

    setArr((s: any) => {
      const newArr = s.slice();
      for (const array of newArr) {
        const result = array.find((item: any) => item.id === index);

        if (result) {
          result.value = newValue;
          const indexOfResult = array.indexOf(result);
          const indexOfArray = newArr.indexOf(array);
          newArr[indexOfArray][indexOfResult] = result;
        }
      }
      if (totalChange) {
        changeTotal();
      }
      return newArr;
    });
  };

  const handleChange = (e: any) => {
    changeValue(e.id, e.newValue);
  };

  const changeTotal = () => {
    let bTotal: any = 0;
    let cTotal: any = 0;
    console.log("arry", arr);
    for (const array of arr) {
      for (const item of array) {
        if (item.id) {
          if (item.id.includes("b")) {
            if (item.value && item.value !== "") {
              bTotal += Number(item.value.replace(/,/g, ""));
            }
          }
          if (item.id.includes("c")) {
            if (item.value && item.value !== "") {
              cTotal += Number(item.value.replace(/,/g, ""));
            }
          }
        }
      }
    }
    bTotal = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
    }).format(bTotal);

    cTotal = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
    }).format(cTotal);

    setTotal((s: any) => {
      return { ...s, b: bTotal, c: cTotal };
    });
  };

  const onAccountSelection = (e: any) => {
    // balacingFigure to enter balancing figure in row when account selected
    balancingFigure(e.account.id);
    setArr((s: any) => {
      const newArr = arr.slice();
      for (let array of newArr) {
        const result = array.find(
          (item: any) => item.id === e.account.id.replace("a", "b")
        );

        const result2: any = array.find(
          (item: any) => item.id.charAt(0) === "a"
        );

        if (result) {
          // to remove account which is deselected and another account is selected
          let index = array.indexOf(result2);
          if (index !== -1) {
            array.splice(index, 1);
          }
          array.push(e.account);
        }
      }
      return newArr;
    });
  };

  const deleteRow = (e: any, id: any) => {
    const index = id.replace("z", "");

    setArr((s: any) => {
      let newArr = s.slice();

      newArr = newArr.filter((item: any) => {
        if (item[0].id.replace("b", "") === index) {
          return false;
        }
        return true;
      });

      changeTotal();
      return newArr;
    });
  };

  // set pagetype on basis of url

  const [pageType, setPageType] = useState("");

  const pageURL = (props as any).location.pathname.split("/");
  useEffect(() => {
    if (pageURL[3] === "list") {
      setPageType("list");
    }
    if (pageURL[3] === "list-with-opening-balances") {
      setPageType("opening-balances");
    }
  }, [pageURL]);

  const currentYear = (props as any).currentYear;
  const [date, setDate] = useState({ date: new Date(), error: "" });
  interface state {
    loading: boolean;
    posX: any;
    posY: any;
    hoverX: any;
    hoverY: any;
    showBackDrop: boolean;
    searchText: string;
    accounts: any;
    totalRecords: number;
    displayAccountDetails: any;
    selectedGstId: string;
    modalOpen: boolean;
    typingTimeout: any;
    selectedRow: any;
    showDeleteModal: boolean;
    showActiveModal: boolean;
    showInActiveModal: boolean;
    showEditModal: boolean;
    showLogModal: boolean;
    active: boolean;
    debitTotal: string;
    creditTotal: string;
    debitCreditDiff: string;
    hideZeroBalance: boolean;
  }

  let inititalState = {
    loading: false,
    posX: null,
    posY: null,
    hoverX: null,
    hoverY: null,
    showBackDrop: false,
    searchText: "",
    accounts: [],
    totalRecords: 0,
    displayAccountDetails: [],
    selectedGstId: "",
    modalOpen: false,
    typingTimeout: 0,
    selectedRow: undefined,
    showDeleteModal: false,
    showActiveModal: false,
    showInActiveModal: false,
    showEditModal: false,
    showLogModal: false,
    active: true,
    hideZeroBalance: false,
    debitTotal: "",
    creditTotal: "",
    debitCreditDiff: "",
  };

  const [state, setState] = React.useState<state>(inititalState);

  //Get Organisation Data

  const getAccountList = (forSearch: boolean) => {
    const organisationId = (props as any).params?.organisationId;
    const searchText = forSearch ? state.searchText : "";
    const active = state.active;
    // setState((prevState) => ({
    //   ...prevState,
    //   loading: true,
    // }));
    if (!organisationId) {
      (props as any).onNotify(
        "Could not load Organisation Details",
        "",
        "danger"
      );
      return;
    }

    agent.Account.getAccountList(organisationId, active, searchText)
      .then((response: any) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          displayAccountDetails: response.accounts,
          totalRecords: response.count,
          accounts: response.accounts,
        }));
      })
      .catch((err: any) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));

        (props as any).onNotify(
          "Could not load Organisation Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  useEffectAfterInitialRender(
    () => {
      getAccountList(false);
    },
    [],
    0
  );

  useEffectAfterInitialRender(
    () => {
      getAccountList(false);
    },
    [(props as any).currentModal],
    1
  );

  useEffectAfterInitialRender(
    () => {
      setState((prevState) => ({
        ...prevState,
        searchText: "",
      }));

      getAccountList(false);
    },
    [(props as any).params?.organisationId],
    1
  );

  const dateFunction = (data: any) => {
    setDate(data);
  };

  const onButtonClick = (option: any) => {
    if (total.b !== total.c) {
      (props as any).onNotify(
        "Debit and Credit total should be equal",
        "",
        "danger"
      );
      return;
    }
    console.log("button type", option);
  };

  return (
    <Dashboard>
      <form className="divide-y divide-gray-200">
        <div>
          <div>
            <div>
              <h3 className="text-xl font-medium leading-6 text-gray-900">
                Journal Entry
                <br />
                <br />
              </h3>
            </div>
            <div>
              {/* Date */}

              <div className="sm:grid sm:grid-cols-11 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 sm:col-span-2"
                >
                  Date*
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <DateBox
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
            <div className="sm:col-span-4   pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
              Accounts
            </div>
            <div className="sm:col-span-2  pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
              Debit Amount
            </div>
            <div className="sm:col-span-2  pr-2 sm:text-sm border border-gray-300 bg-gray-200 rounded py-1">
              Credit Amount
            </div>
          </div>
          {arr.map((item: any, i: any) => {
            return (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-9 -my-2 ">
                <div className="sm:col-span-4">
                  <div className="mt-1">
                    <AccountList
                      onSelection={onAccountSelection}
                      id={item[0].id.replace("b", "a")}
                      // this will update account when a row is deleted
                      newAccount={item[2] ? item[2] : ""}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-1">
                    <AmountBox
                      defaultValue={0}
                      onChange={handleChange}
                      id={item[0].id}
                      newValue={item[0].value}
                    />
                    {/* <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      value={item[0].value}
                      id={item[0].id}
                      type={item[0].type}
                      key={item[0].id}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-right"
                    /> */}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-1">
                    <AmountBox
                      defaultValue={0}
                      onChange={handleChange}
                      id={item[1].id}
                      newValue={item[1].value}
                    />
                    {/* <input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      value={item[1].value}
                      id={item[1].id}
                      type={item[1].type}
                      key={item[1].id}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-right"
                    /> */}
                  </div>
                </div>
                <div className="sm:col-span-1 my-4 mx-1">
                  <TrashIcon
                    id={item[0].id.replace("b", "z")}
                    key={item[0].id.replace("b", "z")}
                    className="h-4 w-4"
                    aria-hidden="true"
                    color="gray"
                    onClick={(e) => deleteRow(e, item[0].id.replace("b", "z"))}
                  />
                  <div />
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-1 sm:grid-cols-9 my-2">
            <div className="sm:col-span-2 text-left text-blue-700 pr-2 sm:text-sm mx-2">
              <button onClick={addInput}>+Add Row</button>
            </div>
            <div className="sm:col-span-2 text-right pr-2 sm:text-sm">
              Total
            </div>
            <div className="sm:col-span-2 text-right pr-2 sm:text-sm">
              {total.b}
            </div>
            <div className="sm:col-span-2 text-right pr-2 sm:text-sm">
              {total.c}
            </div>
          </div>
          <br />
          <br />

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
