import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import agent from "../../agent";
import Icon from "../../components/Icon";
import { phoneCode } from "../../constants/countryPhoneCodes";
import { validEmail, validPAN } from "../../helpers/regex";
import { ADD_NOTIFICATION } from "../../store/types";
import AddCustomField from "../CustomField/Add";

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
  showPersonModal?: boolean;
  contactPersonData?: (newPerson: any) => void;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class AddPerson extends React.Component<Props, PropsFromRedux> {
  state: {
    logging: boolean;
    name: string;
    email: any;
    mobile: any;
    pan: string;
    din: string;
    dscExpiryDate: string;
    dscPassword: string;
    dateOfBirth: string;
    dateOfAnniversary: string;
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
    inputType: string;
    iconType: string;
    showFieldModal: boolean;
    customFields: any;
    typingTimeout: number;
  };

  constructor(props: any) {
    super(props);
    this.onKeyUpFunction = this.onKeyUpFunction.bind(this);
    this.state = {
      logging: false,
      name: "",
      email: [{ emailId: "", isPrimary: false }],
      mobile: [
        {
          mobileNumber: "",
          isPrimary: false,
          isWhatsapp: false,
          countryCode: "+91",
        },
      ],
      pan: "",
      din: "",
      dscExpiryDate: "",
      dscPassword: "",
      dateOfBirth: "",
      dateOfAnniversary: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      city: "",
      state: "",
      inputType: "password",
      iconType: "eye-open",
      showFieldModal: false,
      customFields: [],
      typingTimeout: 0,
    };
  }

  onKeyUpFunction(event: any) {
    if (event.keyCode === 27) {
      this.closePersonModal(false);
    }

    if (event.keyCode === 13) {
      this.addPerson();
    }
  }

  componentDidMount() {
    this.getCustomFieldList();
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  addPerson = () => {
    const workSpaceId = (this.props as any).currentFirm._id;
    const name = this.state.name;
    const email = this.state.email.filter((item: any) => item.emailId !== "");
    const isEmailValid = this.checkEmail(email);
    const mobile = this.state.mobile.filter(
      (item: any) => item.mobileNumber !== ""
    );
    const dscPassword = this.state.dscPassword;
    const addressLine1 = this.state.addressLine1;
    const addressLine2 = this.state.addressLine2;
    const pincode = this.state.pincode;
    const city = this.state.city;
    const state = this.state.state;
    const dscExpiryDate = this.convertDate(this.state.dscExpiryDate);
    const dateOfBirth = this.convertDate(this.state.dateOfBirth);
    const dateOfAnniversary = this.convertDate(this.state.dateOfAnniversary);
    const customFields = this.state.customFields.map((item: any) => ({
      customFieldId: item.customFieldId,
      stringValue: item.stringValue,
    }));
    const pan = this.state.pan;
    const checkPAN = pan === "" ? true : validPAN.test(pan);

    if (
      name !== "" &&
      email.length > 0 &&
      isEmailValid &&
      mobile.length > 0 &&
      checkPAN
    ) {
      this.setState({ logging: true });
      agent.ContactPerson.addPerson(
        workSpaceId,
        name,
        email,
        mobile,
        dscPassword,
        addressLine1,
        addressLine2,
        pincode,
        city,
        state,
        customFields,
        dscExpiryDate,
        dateOfBirth,
        dateOfAnniversary,
        pan
      )
        .then((response: any) => {
          this.setState({ logging: false });
          if (this.props.showPersonModal) {
            const newPerson = { _id: response.statusid, name, email, mobile };
            this.sendPerson(newPerson);
          }
          (this.props as any).addNotification(
            "Person Added",
            "Successfully contacted a new person.",
            "success"
          );
          this.closePersonModal(true);
        })
        .catch((err: any) => {
          console.log({ err });
          this.setState({ logging: false });
          (this.props as any).addNotification(
            "Could not add the person",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    } else {
      if (!name) {
        (this.props as any).addNotification(
          "Empty Name Field",
          "Name Field is Required!.",
          "danger"
        );
      } else if (email.length === 0) {
        (this.props as any).addNotification(
          "Empty Email Field",
          "Email Field is Required!.",
          "danger"
        );
      } else if (!isEmailValid) {
        (this.props as any).addNotification(
          "Invalid Email",
          "Email is Invalid!.",
          "danger"
        );
      } else if (mobile.length === 0) {
        (this.props as any).addNotification(
          "Empty Mobile Field",
          "Mobile Field is Required!.",
          "danger"
        );
      } else if (!checkPAN) {
        (this.props as any).addNotification(
          "Invalid PAN",
          "PAN is Invalid!.",
          "danger"
        );
      }
    }
  };

  getCustomFieldList = () => {
    const workSpaceId = (this.props as any).currentFirm?._id;
    const active = true;
    const searchText = "";
    const skip = 0;
    const limit = 20;
    this.setState({ loading: true });
    agent.CustomField.getCustomFieldList(
      workSpaceId,
      active,
      searchText,
      limit,
      skip
    )
      .then((response: any) => {
        console.log({ response });
        const filterCustomField = response.customFields.filter(
          (item: any) => item.applicableFor === "contactperson"
        );
        const formatCustomField = filterCustomField.map((item: any) => {
          return {
            customFieldId: item._id,
            customFieldName: item.name,
            customFieldType: item.type,
            stringValue: "",
          };
        });

        this.setState({ customFields: formatCustomField });
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).addNotification(
          "Could not load Custom Field Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  checkEmail = (email: any) => {
    let isValid = true;
    email.forEach((item: any) => {
      const isEmailValid = validEmail.test(item.emailId);
      if (!isEmailValid) {
        (this.props as any).addNotification(
          "Invalid email",
          `${item.emailId} is Invalid email!`,
          "danger"
        );
        isValid = false;
      }
    });

    return isValid;
  };

  convertDate = (date: string) => {
    return date ? new Date(date).toISOString() : "";
  };

  closePersonModal = (fetchAgain: boolean) => {
    this.props.closeModal(fetchAgain);
  };

  updateState = (field: string) => (ev: any) => {
    if (field === "pan") {
      this.setState({ pan: ev.target.value.slice(0, 10).toUpperCase() });
    } else if (field === "din") {
      this.setState({ din: ev.target.value.slice(0, 8) });
    } else {
      this.setState({
        [field]: ev.target.value,
      });
    }
  };

  addMore = (field: string) => {
    if (field === "email") {
      this.setState({
        email: [...this.state.email, { emailId: "", isPrimary: false }],
      });
    } else if (field === "mobile") {
      this.setState({
        mobile: [
          ...this.state.mobile,
          {
            mobileNumber: "",
            isPrimary: false,
            isWhatsapp: false,
            countryCode: "+91",
          },
        ],
      });
    }
  };

  updateEmail = (index: number) => (ev: any) => {
    const updatedEmail = this.state.email.map((item: any, i: number) =>
      i === index ? { ...item, emailId: ev.target.value } : item
    );
    this.setState({ email: updatedEmail });
  };

  isPrimary = (field: "email" | "mobile", index: number) => {
    const updatedPrimary = this.state[field].map((item: any, i: number) =>
      i === index
        ? { ...item, isPrimary: !item.isPrimary }
        : { ...item, isPrimary: false }
    );

    this.setState({ [field]: updatedPrimary });
  };

  isWhatsapp = (index: number) => {
    const updatedWhatsapp = this.state.mobile.map((item: any, i: number) =>
      i === index
        ? { ...item, isWhatsapp: !item.isWhatsapp }
        : { ...item, isWhatsapp: false }
    );

    this.setState({ mobile: updatedWhatsapp });
  };

  updateMobile = (field: string, index: number) => (ev: any) => {
    const updatedMobile = this.state.mobile.map((item: any, i: number) =>
      i === index ? { ...item, [field]: ev.target.value.slice(0, 10) } : item
    );
    this.setState({ mobile: updatedMobile });
  };

  updateCustomField = (customFieldId: string) => (ev: any) => {
    const updatedField = this.state.customFields.map((item: any, i: number) =>
      item.customFieldId === customFieldId
        ? { ...item, stringValue: ev.target.value }
        : item
    );
    this.setState({ customFields: updatedField });
  };

  onViewPassword = () => {
    if (this.state.inputType === "password") {
      this.setState({ inputType: "text", iconType: "eye-close" });
    } else {
      this.setState({ inputType: "password", iconType: "eye-open" });
    }
  };

  closeModal = () => {
    this.setState({ showFieldModal: false });
  };

  openCustomFieldModal = () => {
    this.setState({ showFieldModal: true });
  };

  customFieldData = (newField: any) => {
    this.setState({ customFields: [...this.state.customFields, newField] });
  };

  handlePinCodeChange = (ev: any) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      pincode: ev.target.value,
      typingTimeout: setTimeout(() => {
        this.getPinCodeData();
      }, 700),
    });
  };

  getPinCodeData = () => {
    const pincode = this.state.pincode;
    agent.ContactPerson.getPinCodeData(pincode)
      .then((response: any) => {
        const state = response.data.state;
        const city = response.data.city;
        this.setState({ state, city });
        console.log({ response });
      })
      .catch((err: any) => {
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  sendPerson = (newPerson: any) => {
    this.props.contactPersonData!(newPerson);
  };

  render() {
    return (
      <>
        {this.state.showFieldModal && (
          <AddCustomField
            showFieldModal={this.state.showFieldModal}
            closeModal={this.closeModal}
            customFieldData={this.customFieldData}
            from="contactperson"
          />
        )}
        <Transition.Root
          show={
            (this.props as any)?.currentModal?.modalName ===
              "ADD_PERSON_MODAL" || this.props.showPersonModal
          }
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
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Add Contact Person
                      </h3>
                    </div>
                    <div>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Name <span className="text-red-600">*</span>
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="person_name"
                                value={this.state.name}
                                onChange={this.updateState("name")}
                                id="person_name"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Name"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Email <span className="text-red-600">*</span>
                            </label>
                            {this.state.email.map(
                              (item: any, index: number) => {
                                return (
                                  <div key={index} className="mb-4">
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                      <input
                                        type="email"
                                        name="person_email"
                                        value={item.emailId}
                                        onChange={this.updateEmail(index)}
                                        id="person_email"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                        placeholder="Email"
                                        autoComplete="off"
                                      />
                                    </div>
                                    <div className="mt-2 ml-1 relative flex items-start">
                                      <div className="flex h-5 items-center">
                                        <input
                                          id="primary-email"
                                          aria-describedby="primary-email"
                                          name="primary-email"
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-400 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                                          checked={item.isPrimary}
                                          onChange={() =>
                                            this.isPrimary("email", index)
                                          }
                                        />
                                      </div>
                                      <div className="ml-3 text-sm">
                                        <label className="text-gray-500">
                                          Primary Email
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                            <button
                              type="button"
                              className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                              onClick={() => this.addMore("email")}
                            >
                              <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                              Add More
                            </button>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Mobile <span className="text-red-600">*</span>
                            </label>
                            {this.state.mobile.map(
                              (item: any, index: number) => {
                                return (
                                  <div key={index} className="mb-4">
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                      <div className="absolute inset-y-0 left-0 flex items-center">
                                        <label className="sr-only">
                                          Country
                                        </label>
                                        <select
                                          id="country"
                                          name="country"
                                          autoComplete="country"
                                          className="h-full rounded-md border-transparent bg-transparent py-0 pl-2.5 pr-7 text-gray-500 sm:text-sm"
                                          value={item.countryCode}
                                          onChange={this.updateMobile(
                                            "countryCode",
                                            index
                                          )}
                                        >
                                          {phoneCode.map((phone: any) => (
                                            <option
                                              key={phone.iso}
                                              value={phone.code}
                                            >
                                              {phone.iso + " " + phone.code}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <input
                                        type="text"
                                        name="person_phone"
                                        id="person_phone"
                                        className="block w-full rounded-md border-gray-300 pl-24 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Mobile Number"
                                        autoComplete="off"
                                        value={item.mobileNumber}
                                        onChange={this.updateMobile(
                                          "mobileNumber",
                                          index
                                        )}
                                      />
                                    </div>
                                    <div className="mt-2 ml-1 relative flex items-start">
                                      <div className="flex h-5 items-center">
                                        <input
                                          id="primary-phone"
                                          aria-describedby="primary-phone"
                                          name="primary-phone"
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-400 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                                          checked={item.isPrimary}
                                          onChange={() =>
                                            this.isPrimary("mobile", index)
                                          }
                                        />
                                      </div>
                                      <div className="ml-3 text-sm">
                                        <label className="text-gray-500">
                                          Primary Mobile
                                        </label>
                                      </div>
                                    </div>
                                    <div className="mt-2 ml-1 relative flex items-start">
                                      <div className="flex h-5 items-center">
                                        <input
                                          id="primary-whatsapp"
                                          aria-describedby="primary-whatsapp"
                                          name="primary-whatsapp"
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-400 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                                          checked={item.isWhatsapp}
                                          onChange={() =>
                                            this.isWhatsapp(index)
                                          }
                                        />
                                      </div>
                                      <div className="ml-3 text-sm">
                                        <label className="text-gray-500">
                                          Primary WhatsApp
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                            <button
                              type="button"
                              className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                              onClick={() => this.addMore("mobile")}
                            >
                              <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                              Add More
                            </button>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              PAN
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="person-pan"
                                value={this.state.pan}
                                onChange={this.updateState("pan")}
                                id="person_pan"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="PAN"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              DIN
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="person_din"
                                value={this.state.din}
                                onChange={this.updateState("din")}
                                id="person_din"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="DIN"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              DSC Expiry Date
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="date"
                                name="person_DSC"
                                value={this.state.dscExpiryDate}
                                onChange={this.updateState("dscExpiryDate")}
                                id="peson_dsc"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Expiry Date"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              DSC Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="flex">
                                <input
                                  name="person_password"
                                  type={this.state.inputType}
                                  value={this.state.dscPassword}
                                  onChange={this.updateState("dscPassword")}
                                  id="person_password"
                                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                  placeholder="DSC Password"
                                  autoComplete={"new-password"}
                                />
                                <button
                                  type="button"
                                  onClick={this.onViewPassword}
                                >
                                  <Icon
                                    name={this.state.iconType}
                                    className="h-6 w-6 text-gray-500 absolute top-2 right-3"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Date of Birth
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="date"
                                name="person_birth"
                                value={this.state.dateOfBirth}
                                onChange={this.updateState("dateOfBirth")}
                                id="person_birth"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Birth Date"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Date of Anniversary
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="date"
                                name="person_anniversary"
                                value={this.state.dateOfAnniversary}
                                onChange={this.updateState("dateOfAnniversary")}
                                id="person_anniversary"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Anniversary Date"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Address
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="person_address"
                                value={this.state.addressLine1}
                                onChange={this.updateState("addressLine1")}
                                id="address_addressLine1"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="House No. / Street / Area"
                              />
                            </div>
                            <div className="mt-3 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="person_address"
                                value={this.state.addressLine2}
                                onChange={this.updateState("addressLine2")}
                                id="address_addressLine2"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Locality / Town"
                              />
                            </div>
                            <div className="mt-3 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="person_address"
                                value={this.state.pincode}
                                onChange={this.handlePinCodeChange}
                                id="address_pincode"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Pin Code"
                              />
                            </div>
                            <div className="sm:flex sm:items-center space-y-3 sm:space-y-0 sm:space-x-2.5 mt-3 rounded-md shadow-sm">
                              <input
                                type="text"
                                name="person_address"
                                value={this.state.city}
                                onChange={this.updateState("city")}
                                id="address_city"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="City"
                              />
                              <input
                                type="text"
                                name="person_address"
                                value={this.state.state}
                                onChange={this.updateState("state")}
                                id="address_state"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="State"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="block text-sm font-medium text-gray-700">
                              Custom Fields
                            </p>
                            <button
                              type="button"
                              className="mt-3 inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                              onClick={this.openCustomFieldModal}
                            >
                              <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                              Add Custom Field
                            </button>
                            {this.state.customFields.map(
                              (field: any, index: number) => {
                                return (
                                  <div
                                    key={field.customFieldId}
                                    className="mt-3"
                                  >
                                    <label className="block text-xs font-medium text-gray-700">
                                      {field.customFieldName.toUpperCase()}
                                    </label>
                                    {field.customFieldType === "date" && (
                                      <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                          type="date"
                                          value={field.stringValue}
                                          onChange={this.updateCustomField(
                                            field.customFieldId
                                          )}
                                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                          placeholder={field.customFieldName}
                                        />
                                      </div>
                                    )}
                                    {field.customFieldType === "shorttext" && (
                                      <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                          type="text"
                                          value={field.stringValue}
                                          onChange={this.updateCustomField(
                                            field.customFieldId
                                          )}
                                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                        />
                                      </div>
                                    )}
                                    {field.customFieldType === "longtext" && (
                                      <div className="mt-1">
                                        <textarea
                                          rows={4}
                                          name="comment"
                                          id="comment"
                                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                          value={field.stringValue}
                                          onChange={this.updateCustomField(
                                            field.customFieldId
                                          )}
                                        />
                                      </div>
                                    )}
                                    {field.customFieldType === "boolean" && (
                                      <div className="mt-2 flex items-center space-y-0 space-x-10">
                                        <div className="flex items-center">
                                          <input
                                            id={`yes-${index}`}
                                            name="boolean"
                                            type="radio"
                                            value={"Yes"}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                            checked={
                                              field.stringValue === "Yes"
                                            }
                                            onChange={this.updateCustomField(
                                              field.customFieldId
                                            )}
                                          />
                                          <label
                                            htmlFor={`yes-${index}`}
                                            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                          >
                                            Yes
                                          </label>
                                        </div>
                                        <div className="flex items-center">
                                          <input
                                            id={`no-${index}`}
                                            name="boolean"
                                            type="radio"
                                            value={"No"}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                            checked={field.stringValue === "No"}
                                            onChange={this.updateCustomField(
                                              field.customFieldId
                                            )}
                                          />
                                          <label
                                            htmlFor={`no-${index}`}
                                            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                          >
                                            No
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                            onClick={() => this.closePersonModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={this.state.logging}
                            className={
                              "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                            }
                            onClick={this.addPerson}
                          >
                            <span className="w-full flex justify-end">
                              {this.state.logging ? (
                                <Icon name="loading" className="mr-2" />
                              ) : null}
                            </span>
                            <span>Save</span>
                            <span className="w-full"></span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    );
  }
}

export default connector(AddPerson);
