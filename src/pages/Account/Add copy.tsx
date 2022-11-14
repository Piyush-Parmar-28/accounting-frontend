import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import agent from "../../agent";
import Icon from "../../components/Icon";
import MultiSelect from "../../components/MultiSelect";
import MultiSelectCheckbox from "../../components/MultiSelectCheckbox";
import { colorsList } from "../../constants/colors";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import ComboBox from "../../components/ComboBox";
import { ADD_NOTIFICATION } from "../../store/types";
import AmountBox from "../../components/AmountBox";
import convertNumberToWords from "../../helpers/convertNumberToWords";
import TextBox from "../../components/TextBox";
import GSTINBox from "../../components/GSTINBox";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const accounts = [
  { id: 1, name: "Bank" },
  { id: 2, name: "Bank OD/CC A/c" },
  { id: 3, name: "Capital" },
  { id: 4, name: "Cash" },
  { id: 5, name: "Creditors" },
  { id: 6, name: "Current Assets" },
  { id: 7, name: "Current Liabilities" },
  { id: 8, name: "Debtors" },
  { id: 9, name: "Deposits - Assets" },
  { id: 10, name: "Direct Expenses" },
  { id: 11, name: "Direct Income" },
  { id: 12, name: "Duties & Taxes" },
  { id: 13, name: "Fixed Asset" },
  { id: 14, name: "Indirect Expense" },
  { id: 15, name: "Indirect Income" },
  { id: 16, name: "Investments" },
  { id: 17, name: "Loans and Advances - Asset" },
  { id: 18, name: "Miscellaneous Assets" },
  { id: 19, name: "Miscellaneous Liabilities" },
  { id: 20, name: "Provisions" },
  { id: 21, name: "Purchases" },
  { id: 22, name: "Reservers" },
  { id: 23, name: "Sales" },
  { id: 24, name: "Secured Loan" },
  { id: 25, name: "Stock" },
  { id: 26, name: "Suspense" },
  { id: 27, name: "Unsecured Loan" },
];

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
  closeModal: (fetchAgain: boolean) => void;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function AddAccount(props: Props & PropsFromRedux) {
  interface state {
    logging: boolean;
    name: string;
    description: string;
    color: { name: string; value: string };
  }

  // onKeyUpFunction = onKeyUpFunction.bind(this);
  const initialState = {
    logging: false,
    name: "",
    description: "",
    color: { name: "", value: "" },
  };

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [openingBalanceInWords, setOpeningBalanceInWords] = useState("");

  const [state, setState] = useState<state>(initialState);
  const [name, setName] = useState("");
  const [gstin, setGstin] = useState("");

  // const onKeyUpFunction(event: any)
  // if (event.keyCode === 27) {
  //   closeAccountModal(false);
  // }

  // if (event.keyCode === 13) {
  //   addAccount();
  // }

  // componentDidMount() {
  //   getAccountTaskList();
  //   // document.addEventListener("keydown", onKeyUpFunction, false);
  // }

  // componentWillUnmount() {
  //   // document.removeEventListener("keydown", onKeyUpFunction, false);
  // }

  const addAccount = () => {
    console.log("name from add account function", name);
    const organisationId = (props as any).currentOrganisation._id;

    // const name = state.name;
    const description = state.description;
    const color = state.color.name;

    if (name !== "" && color !== "") {
      setState({ ...state, logging: true });

      agent.Account.addAccount(name, color, description, organisationId, [])
        .then((response: any) => {
          setState((prevState) => ({
            ...prevState,
            logging: false,
          }));

          (props as any).addNotification(
            "Account Added",
            "Successfully added a new account.",
            "success"
          );
          closeAccountModal(true);
        })
        .catch((err: any) => {
          console.log({ err });
          setState((prevState) => ({
            ...prevState,
            logging: false,
          }));

          (props as any).addNotification(
            "Could not add the account",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    } else {
      if (!name) {
        (props as any).addNotification(
          "Empty Account Name Field",
          "Account Name Field is Required!.",
          "danger"
        );
      } else if (!color) {
        (props as any).addNotification(
          "Empty Account Color Field",
          "Account Color Field is Required!.",
          "danger"
        );
      }
    }
  };

  const closeAccountModal = (fetchAgain: boolean) => {
    props.closeModal(fetchAgain);
  };

  const openingBalanceHandler = (value: any) => {
    setOpeningBalance(value);
    if (value > 0) {
      const words = convertNumberToWords(value);
      setOpeningBalanceInWords(words);
    }
    if ((value = 0 || value === "")) {
      setOpeningBalanceInWords("");
    }
    console.log(value);
  };

  const accountSelectHandler = (account: any) => {
    console.log(account);
  };

  const nameSelectHandler = (name: any) => {
    console.log(name);
    setName(name);
  };

  const gstinSelectHandler = (gstin: string) => {
    setGstin(gstin);
  };

  const gstinDetails = (gstinDetails: any) => {
    console.log("gstindetails", gstinDetails);
    setName(gstinDetails.gstinname);
  };
  const [gstinMessageShow, setGstinMessageShow] = useState(false);
  const gstinFocusHandler = (value: boolean) => {
    setGstinMessageShow(value);
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
                    Add Account
                  </h3>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4  sm:pt-5 align-baseline">
                    <div className="mt-1 sm:col-span-1 sm:mt-0">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700 sm:mt-px "
                      >
                        Name*
                      </label>
                    </div>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <TextBox onTyping={nameSelectHandler} value={name} />
                    </div>
                    <div className="mt-1 sm:col-span-1 sm:mt-0"></div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Nature of Account*
                    </label>
                  </div>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <ComboBox
                      values={accounts}
                      onSelection={accountSelectHandler}
                    />
                  </div>
                  <div className="mt-1 sm:col-span-1 sm:mt-0">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Opening Balance*
                    </label>
                  </div>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <AmountBox onChange={openingBalanceHandler} />
                    <div className="px-2 py-2 text-left text-gray-400 text-xs">
                      {openingBalanceInWords && `${openingBalanceInWords} `}
                    </div>
                  </div>
                  {openingBalance ? (
                    <div>
                      <div className="mt-1 sm:col-span-1 sm:mt-0">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          First name
                        </label>
                      </div>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-1 sm:col-span-1 sm:mt-0">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      GSTIN
                    </label>
                  </div>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <GSTINBox
                      onTyping={gstinSelectHandler}
                      value={gstin}
                      gstinDetails={gstinDetails}
                      onFocus={gstinFocusHandler}
                    />
                    {gstinMessageShow && (
                      <p>
                        {" "}
                        Enter GSTIN and all GST details will be filled
                        automatically.
                      </p>
                    )}
                  </div>
                </form>

                <div className="mt-5 sm:mt-4 sm:flex sm:justify-end py-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                    onClick={() => closeAccountModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={state.logging}
                    className={
                      "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                    }
                    onClick={addAccount}
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
                {/* </div> */}
              </div>
              {
                /* <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Add Account
                      </h3>
                    </div>
                    <div>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-4">
                          <div className="mb-4">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name <span className="text-red-600">*</span>
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="company_website"
                                value={state.name}
                                onChange={updateState("name")}
                                id="company_website"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Name"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Color <span className="text-red-600">*</span>
                            </label>
                            <MultiSelect
                              items={colorsList?.map((color: any) => {
                                return {
                                  ...color,
                                  _id: color.name,
                                  name: color.name,
                                };
                              })}
                              selected={{
                                name: state.color.name,
                              }}
                              type="colors"
                              onChange={onColorChange}
                              placeholder="Select Color"
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Tasks
                            </label>
                            <MultiSelectCheckbox
                              items={state.tasks?.map((task: any) => {
                                return {
                                  _id: task,
                                  name: task,
                                };
                              })}
                              selected={state.selectedTasks}
                              type="Tasks"
                              onChange={onTaskChange}
                              placeholder="Select Tasks"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="comment"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                rows={4}
                                name="comment"
                                id="comment"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={state.description}
                                onChange={updateState("description")}
                                placeholder="Add Description..."
                              />
                            </div>
                          </div>
                        </div>
                              */
                // <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                //   <button
                //     type="button"
                //     className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                //     onClick={() => closeAccountModal(false)}
                //   >
                //     Cancel
                //   </button>
                //   <button
                //     type="button"
                //     disabled={state.logging}
                //     className={
                //       "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                //     }
                //     onClick={addAccount}
                //   >
                //     <span className="w-full flex justify-end">
                //       {state.logging ? (
                //         <Icon name="loading" className="mr-2" />
                //       ) : null}
                //     </span>
                //     <span>Save</span>
                //     <span className="w-full"></span>
                //   </button>
                // </div>
                /*
                      </form>
                    </div>
                  </div>
                </div> */
              }
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default connector(AddAccount);
