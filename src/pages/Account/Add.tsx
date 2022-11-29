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
import useEffectAfterInitialRender from "../../helpers/useEffectAfterInitialRender";

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
  type: string;
  data: any;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function AddAccount(props: Props & PropsFromRedux) {
  interface state {
    accountId: string;
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
    gstRegType: string;
    gstRegDate: string;
    gstCancelDate: string;
    gstRegStatus: string;
    gstinname: string;
    nameAvailable: boolean;
  }
  let intitialState: state;
  if (props.type === "edit") {
    intitialState = {
      accountId: props.data._id,
      logging: false,
      name: props.data.name,
      accountNature: props.data.nature,
      openingBalance: props.data.openingBalance,
      openingBalanceType: props.data.openingBalanceType,
      gstin: props.data.gstin,
      gstRate: props.data.gstRate,
      billingAddress: props.data.billingAddress,
      shippingAddress: props.data.shippingAddress,
      mobileNo: props.data.mobileNo,
      email: props.data.email,
      pan: props.data.pan,
      tan: props.data.tan,
      openingBalanceInWords: "",
      gstRegType: props.data.gstRegType,
      gstRegDate: props.data.gstRegDate,
      gstCancelDate: props.data.gstCancelDate,
      gstRegStatus: props.data.gstRegStatus,
      gstinname: props.data.gstinname,
      nameAvailable: true,
    };
  } else {
    intitialState = {
      accountId: "",
      logging: false,
      name: "",
      accountNature: "",
      openingBalance: 0,
      openingBalanceType: "",
      gstin: "",
      gstRate: 0,
      billingAddress: "",
      shippingAddress: "",
      mobileNo: "",
      email: "",
      pan: "",
      tan: "",
      openingBalanceInWords: "",
      gstRegType: "",
      gstRegDate: "",
      gstCancelDate: "",
      gstRegStatus: "",
      gstinname: "",
      nameAvailable: true,
    };
  }

  const [state, setState] = useState<state>(intitialState);

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

    if (state.name !== "" && state.accountNature !== "") {
      setState((prevState) => ({ ...prevState, logging: true }));

      agent.Account.addAccount(
        state.name,
        state.accountNature,
        state.openingBalance,
        state.openingBalanceType,
        organisationId,
        state.gstin,
        state.gstRate,
        state.billingAddress,
        state.shippingAddress,
        state.mobileNo,
        state.email,
        state.pan,
        state.tan
      )
        .then((response: any) => {
          setState((prevState) => ({ ...prevState, logging: false }));

          (props as any).addNotification(
            "Account Added",
            "Successfully added a new account.",
            "success"
          );
          closeAccountModal(true);
        })
        .catch((err: any) => {
          console.log({ err });
          setState((prevState) => ({ ...prevState, logging: false }));

          (props as any).addNotification(
            "Could not add the account",
            err?.response.data.message || err,
            "danger"
          );
        });
    } else {
      if (!state.name) {
        (props as any).addNotification(
          "Empty Account Name Field",
          "Account Name Field is Required!.",
          "danger"
        );
      } else if (!state.accountNature) {
        (props as any).addNotification(
          "Empty Nature of Account Field",
          "Nature of Account is Required!.",
          "danger"
        );
      }
    }
  };

  const editAccount = () => {
    const organisationId = (props as any).currentOrganisation._id;

    if (state.name !== "" && state.accountNature !== "") {
      setState((prevState) => ({ ...prevState, logging: true }));

      agent.Account.editAccount(
        state.accountId,
        state.name,
        state.accountNature,
        state.openingBalance,
        state.openingBalanceType,
        organisationId,
        state.gstin,
        state.gstRate,
        state.billingAddress,
        state.shippingAddress,
        state.mobileNo,
        state.email,
        state.pan,
        state.tan
      )
        .then((response: any) => {
          setState((prevState) => ({ ...prevState, logging: false }));

          (props as any).addNotification(
            "Account Edited",
            "Successfully edited account.",
            "success"
          );
          closeAccountModal(true);
        })
        .catch((err: any) => {
          console.log({ err });
          setState((prevState) => ({ ...prevState, logging: false }));

          (props as any).addNotification(
            "Could not edit the account",
            err?.response.data.message || err,
            "danger"
          );
        });
    } else {
      if (!state.name) {
        (props as any).addNotification(
          "Empty Account Name Field",
          "Account Name Field is Required!.",
          "danger"
        );
      } else if (!state.accountNature) {
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
    setState((prevState) => ({ ...prevState, openingBalance: value }));

    if (value > 0) {
      const words = convertNumberToWords(value);
      setState((prevState) => ({ ...prevState, openingBalanceInWords: words }));
    }

    if (value === 0 || value === "") {
      setState((prevState) => ({ ...prevState, openingBalanceInWords: "" }));
    }
  };

  const openingBalanceTypeHandler = (e: any) => {
    setState((prevState) => ({
      ...prevState,
      openingBalanceType: e.target.id,
    }));
  };

  const natureSelectHandler = (account: any) => {
    setState((prevState) => ({ ...prevState, accountNature: account }));

    // reset state for debtors/creditors field if first debtor/creditor is selected and then otehr nature is selected. Otherwise error like wrong pan will be shown
    if (account !== "Debtors" && account !== "Creditors") {
      setState((prevState) => ({
        ...prevState,
        pan: "",
        tan: "",
        gstin: "",
        gstRate: 0,
        billingAddress: "",
        shippingAddress: "",
        mobileNo: "",
        email: "",
      }));
    }
    if (account !== "Direct Expense" && account !== "Indirect Expense") {
      setState((prevState) => ({
        ...prevState,
        gstRate: 0,
      }));
    }

    // select default dr or cr for selected account nature
    let accountDetails = accounts.find((acc: any) => acc.name === account);

    if (accountDetails) {
      let defaultSide = accountDetails.default;
      setState((prevState) => ({
        ...prevState,
        openingBalanceType: defaultSide,
      }));
    }
  };

  const nameSelectHandler = (name: any) => {
    setState((prevState) => ({
      ...prevState,
      name: name,
      nameAvailable: true,
    }));
  };

  const gstinSelectHandler = (gstin: string) => {
    setState((prevState) => ({ ...prevState, gstin: gstin }));
  };

  const gstinDetails = (gstinDetails: any) => {
    // if user has already entered name then it is not reversed. "state.gstin" is used so this run only when gstin is there othewise on selecting debtors/creditors as nature this runs and app crashes
    if (state.gstin && state.name === "") {
      setState((prevState) => ({ ...prevState, name: gstinDetails.name }));
    }

    setState((prevState) => ({
      ...prevState,
      billingAddress: gstinDetails.address,
    }));

    setState((prevState) => ({
      ...prevState,
      gstinname: gstinDetails.gstinname,
      gstRegDate: gstinDetails.gstRegDate,
      gstRegType: gstinDetails.gstRegType,
      gstCancelDate: gstinDetails.gstCancelDate,
      gstRegStatus: gstinDetails.gstRegStatus,
    }));
  };

  const gstRateSelectHandler = (gstRate: any) => {
    setState((prevState) => ({ ...prevState, gstRate: gstRate }));
  };
  const billingAddressHandler = (billingAddress: any) => {
    setState((prevState) => ({ ...prevState, billingAddress: billingAddress }));
  };
  const shippingAddressHandler = (shippingAddress: any) => {
    setState((prevState) => ({
      ...prevState,
      shippingAddress: shippingAddress,
    }));
  };
  const mobileNoHandler = (mobileNo: any) => {
    setState((prevState) => ({ ...prevState, mobileNo: mobileNo }));
  };
  const emailHandler = (email: any) => {
    setState((prevState) => ({ ...prevState, email: email }));
  };
  const panHandler = (pan: any) => {
    setState((prevState) => ({ ...prevState, pan: pan }));
  };
  const tanHandler = (tan: any) => {
    setState((prevState) => ({ ...prevState, tan: tan }));
  };
  const nameOnBlur = (e: any) => {
    const organisationId = (props as any).currentOrganisation._id;
    if (e.target.value) {
      agent.Account.accountnameavailablecheck(organisationId, e.target.value)
        .then((response: any) => {
          if (response.available) {
            setState((prevState) => ({
              ...prevState,
              nameAvailable: true,
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              nameAvailable: false,
            }));
          }
        })
        .catch((err: any) => {
          console.log({ err });
        });
    }
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
                    {props.type === "add" ? "Add Account" : "Edit Account"}
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
                              case="title"
                              onBlur={nameOnBlur}
                            />
                            {state.nameAvailable === false ? (
                              <p
                                className="mt-2 text-sm text-red-600"
                                id="email-error"
                              >
                                An account with same name already exists.
                              </p>
                            ) : null}
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
                              selectedValue={state.accountNature}
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
                              defaultValue={state.openingBalance}
                              onChange={openingBalanceHandler}
                              id="openingBalance"
                              key="openingBalance"
                              newValue={state.openingBalance.toString()}
                            />
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
                                `${state.openingBalanceInWords}`}
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
                                              id="dr"
                                              name="dr"
                                              type="radio"
                                              checked={
                                                state.openingBalanceType ===
                                                "dr"
                                                  ? true
                                                  : false
                                              }
                                              onChange={
                                                openingBalanceTypeHandler
                                              }
                                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label
                                              htmlFor="dr"
                                              className="ml-3 block text-sm font-medium text-gray-700 pr-8"
                                            >
                                              Debit
                                            </label>
                                            <input
                                              id="cr"
                                              name="cr"
                                              type="radio"
                                              checked={
                                                state.openingBalanceType ===
                                                "cr"
                                                  ? true
                                                  : false
                                              }
                                              onChange={
                                                openingBalanceTypeHandler
                                              }
                                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label
                                              htmlFor="cr"
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
                                  organisationId={
                                    (props as any).currentOrganisation._id
                                  }
                                  duplicateGstinCheck={true}
                                />
                              </div>
                            </div>

                            {/* gstin  name */}

                            {state.gstinname && (
                              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  GSTIN Name
                                </label>
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  {state.gstinname}
                                </label>
                              </div>
                            )}

                            {/* gstin registration type */}

                            {state.gstRegType && (
                              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  GST Reg. Type
                                </label>
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  {state.gstRegType}
                                </label>
                              </div>
                            )}

                            {/* gstin reg date */}

                            {state.gstRegDate && (
                              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  GST Reg. Date
                                </label>
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  {state.gstRegDate}
                                </label>
                              </div>
                            )}
                            {/* gstin reg status */}

                            {state.gstRegStatus && (
                              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  GST Reg. Status
                                </label>
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  {state.gstRegStatus}
                                </label>
                              </div>
                            )}
                            {/* gstin cancellation date */}

                            {state.gstCancelDate && (
                              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-gray-200">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  GST Can. Date
                                </label>
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                  {state.gstCancelDate}
                                </label>
                              </div>
                            )}

                            {/* Billing address box */}

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
                                  case="title"
                                  onBlur={console.log("onblur")}
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
                                  case="same"
                                  onBlur={console.log("onblur")}
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
                                  case="same"
                                  onBlur={console.log("onblur")}
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
                                  case="capital"
                                  onBlur={console.log("onblur")}
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
                                  case="capital"
                                  onBlur={console.log("onblur")}
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
                              <GstRateBox
                                onSelection={gstRateSelectHandler}
                                selectedValue={state.gstRate}
                              />
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
                      {props.type === "add" && (
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
                      )}

                      {props.type === "edit" && (
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
                          <span>Update</span>
                          <span className="w-full"></span>
                        </button>
                      )}
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
