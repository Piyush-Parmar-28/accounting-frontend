import { Dialog, Transition } from "@headlessui/react";
import React, { useState, Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ADD_NOTIFICATION } from "../../store/types";
import Icon from "../../components/Icon";
import agent from "../../agent";
import AmountBox from "../../components/AmountBox";
import convertNumberToWords from "../../helpers/convertNumberToWords";
import ComboBox from "../../components/ComboBox";
import TextBox from "../../components/TextBox";
import GSTINBox from "../../components/GSTINBox";
import GstRateBox from "../../components/GstRateBox";
import { accounts } from "../../constants/accountnature";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (title: string, message: string, type: string) =>
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        title,
        message,
        type,
      },
    }),
});

type Props = {
  onLoad?: (forSearch: boolean) => void;
  editModalSetOpen?: (open: boolean) => void;
  state?: any;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function EditStatusModal(props: Props & PropsFromRedux) {
  interface state {
    logging: boolean;
    name: string;
    accountNature: string;
    openingBalance: number;
    openingBalanceType: string;
    openingBalanceInWords: string;
    gstin: string;
    gstRate: number;
    billingAddress: string;
    shippingAddress: string;
    mobileNo: string;
    email: string;
    pan: string;
    tan: string;
  }

  // onKeyUpFunction = onKeyUpFunction.bind(this);
  const selectedRow = props.state.selectedRow;

  const intitialState = {
    logging: false,
    name: selectedRow.name,
    accountNature: selectedRow.accountNature,
    openingBalance: selectedRow.openingBalance,
    openingBalanceType: selectedRow.openingBalanceType,
    gstin: selectedRow.gstin,
    gstRate: selectedRow.gstin,
    billingAddress: selectedRow.billingAddress,
    shippingAddress: selectedRow.shippingAddress,
    mobileNo: selectedRow.mobileNo,
    email: selectedRow.email,
    pan: selectedRow.pan,
    tan: selectedRow.tan,
    openingBalanceInWords: "",
  };
  const [state, setState] = useState<state>(intitialState);

  // onKeyUpFunction(event: any) {
  //   if (event.keyCode === 27) {
  //     setOpen(false);
  //   }

  //   if (event.keyCode === 13) {
  //     editStatus();
  //   }
  // }

  // componentDidMount() {
  //   getStatusTaskList();
  //   document.addEventListener("keydown", onKeyUpFunction, false);
  // }

  // componentWillUnmount() {
  //   document.removeEventListener("keydown", onKeyUpFunction, false);
  // }

  const getStatusTaskList = () => {
    const organisationId = (props as any)?.currentOrganisation._id;
    agent.Status.statusTaskList(organisationId)
      .then((response: any) => {
        const tasks = response.filter((item: any) => item !== "ALL");
        tasks.unshift("ALL");
        const taskLenght = props.state.selectedRow.tasks.length;
        if (taskLenght === 0) {
          setState((prevState) => ({
            ...prevState,
            tasks,
            selectedTasks: ["ALL"],
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            tasks,
          }));
        }
      })
      .catch((err: any) => {
        (props as any).addNotification(
          "Could not load status task list",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  const editStatus = () => {
    // const organisationId = (props as any).currentOrganisation._id;
    // const statusId = props.state.selectedRow._id;
    // const name = state.name;
    // if (name !== "") {
    //   setState((prevState) => ({
    //     ...prevState,
    //     logging: true,
    //   }));
    //   agent.Status.editStatus(
    //     statusId,
    //     name,
    //     color,
    //     description,
    //     organisationId,
    //     tasks
    //   )
    //     .then((response: any) => {
    //       setState((prevState) => ({
    //         ...prevState,
    //         logging: false,
    //       }));
    //       (props as any).addNotification(
    //         "Staus Edited",
    //         "Successfully updated a status.",
    //         "success"
    //       );
    //       setOpen(false);
    //       onLoad();
    //     })
    //     .catch((err: any) => {
    //       setState((prevState) => ({
    //         ...prevState,
    //         logging: false,
    //       }));
    //       (props as any).addNotification(
    //         "Error",
    //         err?.response?.data?.message || err?.message || err,
    //         "danger"
    //       );
    //     });
    // } else {
    //   if (!name) {
    //     (props as any).addNotification(
    //       "Empty Tag Name Field",
    //       "Tag Name Field is Required!.",
    //       "danger"
    //     );
    //   }
    // }
  };

  const setOpen = (open: boolean) => {
    (props as any).editModalSetOpen(open);
  };

  const onLoad = () => {
    (props as any).onLoad();
  };

  const updateState = (field: string) => (ev: any) => {
    setState((prevState) => ({
      ...prevState,
      [field]: ev.target.value,
    }));
  };

  const onColorChange = (item: any) => {
    setState((prevState) => ({
      ...prevState,
      color: item,
    }));
  };

  const openingBalanceHandler = (value: any) => {
    setState((prevState) => ({
      ...prevState,
      openingBalance: value,
    }));

    if (value > 0) {
      const words = convertNumberToWords(value);
      setState((prevState) => ({
        ...prevState,
        openingBalanceInWords: words,
      }));
    }
    if ((value = 0 || value === "")) {
      setState((prevState) => ({
        ...prevState,
        openingBalanceInWords: "",
      }));
    }
  };

  const editAccount = () => {
    console.log("editAccount");
  };

  const openingBalanceTypeHandler = (e: any) => {
    setState((prevState) => ({
      ...prevState,
      openingBalanceType: e.target.id,
    }));
  };

  const natureSelectHandler = (account: any) => {
    setState((prevState) => ({
      ...prevState,
      nature: account,
    }));

    let accountDetails = accounts.find((acc: any) => acc.id === account.id);
    if (accountDetails) {
      let defaultSide = accountDetails.default;
      setState((prevState) => ({
        ...prevState,
        defaultDrOrCr: defaultSide,
      }));
    }
  };

  const nameSelectHandler = (name: any) => {
    setState((prevState) => ({
      ...prevState,
      name: name,
    }));
  };

  const gstinSelectHandler = (gstin: string) => {
    setState((prevState) => ({
      ...prevState,
      gstin: gstin,
    }));
  };

  const gstinDetails = (gstinDetails: any) => {
    console.log("gstindetails", gstinDetails);
    setState((prevState) => ({
      ...prevState,
      name: gstinDetails.name,
    }));
  };

  const gstRateSelectHandler = (gstRate: any) => {
    setState((prevState) => ({
      ...prevState,
      gstRate: gstRate,
    }));
  };
  const billingAddressHandler = (billingAddress: any) => {
    setState((prevState) => ({
      ...prevState,
      billingAddress: billingAddress,
    }));
  };
  const shippingAddressHandler = (shippingAddress: any) => {
    setState((prevState) => ({
      ...prevState,
      shippingAddress: shippingAddress,
    }));
  };
  const mobileNoHandler = (mobileNo: any) => {
    setState((prevState) => ({
      ...prevState,
      mobileNo: mobileNo,
    }));
  };
  const emailHandler = (email: any) => {
    setState((prevState) => ({
      ...prevState,
      email: email,
    }));
  };
  const panHandler = (pan: any) => {
    setState((prevState) => ({
      ...prevState,
      pan: pan,
    }));
  };
  const tanHandler = (tan: any) => {
    setState((prevState) => ({
      ...prevState,
      tan: tan,
    }));
  };

  return (
    <>
      <Transition.Root
        show={(props as any)?.currentModal?.modalName === "ADD_ACCOUNT_MODAL"}
        as={Fragment}
        appear
      >
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => null}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-12 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 space-y-8 divide-y divide-gray-200 sm:space-y-5">
                {/* <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5"> */}
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit Account
                  </h3>
                </div>
                <form className="space-y-8 divide-y">
                  <div className="space-y-8 divide-y sm:space-y-5">
                    <div className=" sm:space-y-5">
                      <div className="space-y-6 sm:space-y-5">
                        {/* name */}

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Name*
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <TextBox
                              onTyping={nameSelectHandler}
                              value={state.name}
                              maximumCharacters={50}
                            />
                          </div>
                        </div>

                        {/* nature of account */}

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Nature of Account*
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <ComboBox
                              values={accounts}
                              onSelection={natureSelectHandler}
                            />
                          </div>
                        </div>

                        {/* opening Balance */}

                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Opening Balance
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <AmountBox onChange={openingBalanceHandler} />
                          </div>
                        </div>

                        {/* opening Balance in words */}
                        {state.openingBalance > 0 ? (
                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:border-gray-200">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 sm:mt-px"
                            ></label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0 text-gray-400 text-sm px-2 text-left">
                              {state.openingBalanceInWords &&
                                `${state.openingBalanceInWords} `}
                            </div>
                          </div>
                        ) : null}

                        {/* opening Balance type */}
                        {state.openingBalance > 0 ? (
                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:border-gray-200">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 sm:mt-px"
                            >
                              Opening Balance Type
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0 text-gray-400 text-xs px-2 text-left">
                              <div className="sm:grid sm:items-start sm:gap-4 sm:border-gray-200">
                                <div
                                  role="group"
                                  aria-labelledby="label-notifications"
                                >
                                  <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                                    <div className="sm:col-span-2">
                                      <div className="max-w-lg">
                                        <div className="space-y-4">
                                          <div className="flex items-center">
                                            <input
                                              id="debit"
                                              name="push-notifications"
                                              type="radio"
                                              // checked={
                                              //   defaultDrOrCr === "dr"
                                              //     ? true
                                              //     : false
                                              // }
                                              onChange={
                                                openingBalanceTypeHandler
                                              }
                                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label
                                              htmlFor="push-everything"
                                              className="ml-3 block text-sm font-medium text-gray-700 pr-8"
                                            >
                                              Debit
                                            </label>
                                            <input
                                              id="credit"
                                              name="push-notifications"
                                              type="radio"
                                              // checked={
                                              //   defaultDrOrCr === "cr"
                                              //     ? true
                                              //     : false
                                              // }
                                              onChange={
                                                openingBalanceTypeHandler
                                              }
                                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label
                                              htmlFor="push-email"
                                              className="ml-3 block text-sm font-medium text-gray-700"
                                            >
                                              Credit
                                            </label>
                                          </div>
                                          <div className="flex items-center"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* if accountnature is debtors or creditors */}
                        {state.accountNature === "Debtors" ||
                        state.accountNature === "Creditors" ? (
                          <div>
                            {/* gstin box */}
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                              <label
                                htmlFor="last-name"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                              >
                                GSTIN
                              </label>
                              <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <GSTINBox
                                  onTyping={gstinSelectHandler}
                                  value={state.gstin}
                                  gstinDetails={gstinDetails}
                                />
                                <div className="text-sm px-1">
                                  <p>
                                    {" "}
                                    Enter GSTIN and all GST details will be
                                    filled automatically.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* gstin box */}

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                              >
                                Billing Address
                              </label>
                              <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <TextBox
                                  onTyping={billingAddressHandler}
                                  value={state.billingAddress}
                                  maximumCharacters={100}
                                />
                              </div>
                            </div>

                            {/* contact number  */}

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                              >
                                Mobile Number
                              </label>
                              <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <TextBox
                                  onTyping={mobileNoHandler}
                                  value={state.mobileNo}
                                  maximumCharacters={10}
                                />
                              </div>
                            </div>

                            {/* email */}

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                              >
                                Email
                              </label>
                              <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <TextBox
                                  onTyping={emailHandler}
                                  value={state.email}
                                  maximumCharacters={50}
                                />
                              </div>
                            </div>

                            {/* PAN */}

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                              >
                                PAN
                              </label>
                              <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <TextBox
                                  onTyping={panHandler}
                                  value={state.pan}
                                  maximumCharacters={10}
                                />
                              </div>
                            </div>

                            {/* TAN */}

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5">
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                              >
                                TAN
                              </label>
                              <div className="mt-1 sm:col-span-2 sm:mt-0">
                                <TextBox
                                  onTyping={tanHandler}
                                  value={state.tan}
                                  maximumCharacters={11}
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* if account is direct/indirect expense */}

                        {state.accountNature === "Direct Expense" ||
                        state.accountNature === "Indirect Expense" ? (
                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200 pb-32">
                            <label
                              htmlFor="first-name"
                              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              GST Rate
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                              <GstRateBox onSelection={gstRateSelectHandler} />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:justify-end py-4">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={state.logging}
                        className={
                          "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                        }
                        onClick={editAccount}
                      >
                        <span className="w-full flex justify-end">
                          {state.logging ? (
                            <Icon name="loading" className="mr-2" />
                          ) : null}
                        </span>
                        <span>Save</span>
                        <span className="w-full"></span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* </div> */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default connector(EditStatusModal);
