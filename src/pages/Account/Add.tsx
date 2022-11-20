import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import agent from "../../agent";
import Icon from "../../components/Icon";
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";
import ComboBox from "../../components/ComboBox";
import AmountBox from "../../components/AmountBox";
import convertNumberToWords from "../../helpers/convertNumberToWords";
import TextBox from "../../components/TextBox";
import GSTINBox from "../../components/GSTINBox";
import GstRateBox from "../../components/GstRateBox";
import { accounts } from "../../constants/accountnature";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
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
  console.log("selectedRow", (props as any).selectedRow);

  const [name, setName] = useState("");
  const [accountNature, setAccountNature] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [openingBalanceInWords, setOpeningBalanceInWords] = useState("");
  const [openingBalanceType, setOpeningBalanceType] = useState("dr");
  const [gstin, setGstin] = useState("");
  const [gstRate, setGstRate] = useState(0);
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [tan, setTan] = useState("");
  const [logging, setLogging] = useState(false);

  const [defaultDrOrCr, setDefaultDrOrCr] = useState("");

  useEffect(() => {
    if (
      (props as any).selectedRow &&
      (props as any).selectedRow !== null &&
      (props as any).selectedRow !== undefined &&
      (props as any).selectedRow.name
    ) {
      setName((props as any).selectedRow.name);
      setAccountNature((props as any).selectedRow.accountNature);
      setOpeningBalance((props as any).selectedRow.openingBalance);
      setOpeningBalanceInWords(
        (props as any).selectedRow.openingBalanceInWords
      );
      setOpeningBalanceType((props as any).selectedRow.openingBalanceType);
      setGstin((props as any).selectedRow.gstin);
      setGstRate((props as any).selectedRow.gstRate);
      setBillingAddress((props as any).selectedRow.billingAddress);
      setShippingAddress((props as any).selectedRow.shippingAddress);
      setMobileNo((props as any).selectedRow.mobileNo);
      setEmail((props as any).selectedRow.email);
      setPan((props as any).selectedRow.pan);
      setTan((props as any).selectedRow.tan);
      (props as any).updateCommon({
        selectedRow: {},
      });
    }
  }, [(props as any).selectedRow]);

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
    const organisationId = (props as any).currentOrganisation._id;

    // const name = state.name;

    if (name !== "" && accountNature !== "") {
      setLogging(true);

      agent.Account.addAccount(
        name,
        accountNature,
        openingBalance,
        openingBalanceType,
        organisationId,
        gstin,
        gstRate,
        billingAddress,
        shippingAddress,
        mobileNo,
        email,
        pan,
        tan
      )
        .then((response: any) => {
          setLogging(false);
          (props as any).addNotification(
            "Account Added",
            "Successfully added a new account.",
            "success"
          );
          closeAccountModal(true);
        })
        .catch((err: any) => {
          console.log({ err });
          setLogging(false);

          (props as any).addNotification(
            "Could not add the account",
            err?.message || err,
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
      } else if (!accountNature) {
        (props as any).addNotification(
          "Empty Nature of Account Field",
          "Nature of Account is Required!.",
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
  };

  const openingBalanceTypeHandler = (e: any) => {
    setOpeningBalanceType(e.target.id);
  };

  const natureSelectHandler = (account: any) => {
    setAccountNature(account);

    // reset state for debtors/creditors field if first debtor/creditor is selected and then otehr nature is selected. Otherwise error like wrong pan will be shown
    if (account !== "Debtors" && account !== "Creditors") {
      setGstin("");
      setGstRate(0);
      setBillingAddress("");
      setShippingAddress("");
      setMobileNo("");
      setEmail("");
      setPan("");
      setTan("");
    }
    if (account !== "Direct Expense" && account !== "Indirect Expense") {
      setGstRate(0);
    }
    let accountDetails = accounts.find((acc: any) => acc.id === account.id);
    if (accountDetails) {
      let defaultSide = accountDetails.default;
      setDefaultDrOrCr(defaultSide);
    }
  };

  const nameSelectHandler = (name: any) => {
    setName(name);
  };

  const gstinSelectHandler = (gstin: string) => {
    setGstin(gstin);
  };

  const gstinDetails = (gstinDetails: any) => {
    console.log("gstindetails", gstinDetails);
    if (!name) {
      setName(gstinDetails.gstinname);
    }
  };

  const gstRateSelectHandler = (gstRate: any) => {
    setGstRate(gstRate);
  };
  const billingAddressHandler = (billingAddress: any) => {
    setBillingAddress(billingAddress);
  };
  const shippingAddressHandler = (shippingAddress: any) => {
    setShippingAddress(shippingAddress);
  };
  const mobileNoHandler = (mobileNo: any) => {
    setMobileNo(mobileNo);
  };
  const emailHandler = (email: any) => {
    setEmail(email);
  };
  const panHandler = (pan: any) => {
    setPan(pan);
  };
  const tanHandler = (tan: any) => {
    setTan(tan);
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
                              value={name}
                              maximumCharacters={50}
                              case="title"
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
                            <AmountBox
                              defaultValue={openingBalance}
                              onChange={openingBalanceHandler}
                            />
                          </div>
                        </div>

                        {/* opening Balance in words */}
                        {openingBalance > 0 ? (
                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:border-gray-200">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 sm:mt-px"
                            ></label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0 text-gray-400 text-sm px-2 text-left">
                              {openingBalanceInWords &&
                                `${openingBalanceInWords} `}
                            </div>
                          </div>
                        ) : null}

                        {/* opening Balance type */}
                        {openingBalance > 0 ? (
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
                        {accountNature === "Debtors" ||
                        accountNature === "Creditors" ? (
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
                                  value={gstin}
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
                                  value={billingAddress}
                                  maximumCharacters={100}
                                  case="title"
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
                                  value={mobileNo}
                                  maximumCharacters={10}
                                  case="same"
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
                                  value={email}
                                  maximumCharacters={50}
                                  case="same"
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
                                  value={pan}
                                  maximumCharacters={10}
                                  case="capital"
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
                                  value={tan}
                                  maximumCharacters={11}
                                  case="capital"
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* if account is direct/indirect expense */}

                        {accountNature === "Direct Expense" ||
                        accountNature === "Indirect Expense" ? (
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
                        onClick={() => closeAccountModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={logging}
                        className={
                          "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                        }
                        onClick={addAccount}
                      >
                        <span className="w-full flex justify-end">
                          {logging ? (
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

export default connector(AddAccount);
