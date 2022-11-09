import React, { Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import agent from "../../agent";
import Dashboard from "../../components/Dashboard";
import { ADD_GST, ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";
import TagManager from "react-gtm-module";
import Icon from "../../components/Icon";
import MultiSelectCheckbox from "../../components/MultiSelectCheckbox";
import { withRouter } from "../../helpers/withRouter";
import { compose } from "redux";
import AddCustomField from "../CustomField/Add";
import { Menu, Transition } from "@headlessui/react";
import MultiSelect from "../../components/MultiSelect";
import AddPerson from "../ContactPerson/Add";
import AddClientGroups from "../Groups/Add";
import { formatDateAndTime } from "../../helpers/formatDate";
import validGSTIN from "../../helpers/GSTValidationFunction";
import { validPAN } from "../../helpers/regex";

const tagManagerArgs = {
  dataLayer: {
    userId: "001",
    userProject: "TaxAdda",
    page: "gstadd",
  },
  dataLayerName: "PageDataLayer",
};

const returnFileList = [
  { name: "ITR - Unaudited", value: "ITR-Unaudited" },
  { name: "ITR - Stat Audit", value: " ITR-Stat_Audit" },
  { name: "ITR - Income Tax Audit", value: "ITR-Income_Tax_Audit" },
  { name: "TDS Return - Salary", value: "TDS_Return-Salary" },
  { name: "TDS Return - Non Salary", value: "TDS_Return-Non_Salary" },
  { name: "TDS Return - Non Resident", value: "TDS_Return-Non_Resident" },
  { name: "TCS Return", value: "TCS_Return" },
  { name: "Advance Tax", value: "Advance_Tax" },
  { name: "SFT", value: "SFT" },
];

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
  addGst: (gst: any) =>
    dispatch({
      type: ADD_GST,
      payload: { gst },
    }),
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

//Main Classs
class EditClient extends React.Component<any, PropsFromRedux> {
  state: {
    logging: boolean;
    taxesApplicable: any;
    tab: string;
    type: string;
    name: string;
    tradeName: string;
    users: any;
    defUsers: any;
    allTags: any;
    tags: any;
    notes: string;
    dob: string;
    companyCIN: string;
    LLP_RegNo: string;
    companyINC_Date: string;
    fileNo: string;
    status: string;
    gstin: string;
    typingTimeout: number;
    qrmpPreferance: any;
    gstUsername: string;
    gstPassword: string;
    inputGstType: string;
    iconType_gst: string;
    gstr9_compulsory: string;
    gstr9c_applicable: string;
    eWayBillUsername: string;
    eWayPassword: string;
    iconType_bill: string;
    inputBillType: string;
    gstinStatus: string;
    registrationType: string;
    regDate: string;
    canDate: string;
    registeredAddress: string;
    additionalPlaceOfBussiness: any;
    stateJurisdiction: string;
    centralJurisdiction: string;
    returnFileData: any;
    filedITreturns: any;
    pan: string;
    itPortalPassword: string;
    inputPortalType: string;
    iconType_portal: string;
    tracesUsername: string;
    inputTraceType: string;
    tracesPassword: string;
    iconType_trace: string;
    tan: string;
    customFields: any;
    showFieldModal: boolean;
    contactPerson: any;
    showBackDrop: boolean;
    posX: any;
    posY: any;
    showPersonForm: boolean;
    allPerson: any;
    selectedPerson: any;
    designation: string;
    primaryPerson: boolean;
    showPersonModal: boolean;
    allGroups: any;
    showGroupForm: boolean;
    selectedGroup: any;
    desc: string;
    showGroupModal: boolean;
    clientGroup: any;
  };

  constructor(props: any) {
    const editClient = (props as any)?.editClient;
    super(props);
    this.onKeyUpFunction = this.onKeyUpFunction.bind(this);
    this.state = {
      logging: false,
      taxesApplicable: ["other"],
      tab: "basic",
      type: editClient?.type ? editClient.type : "",
      name: editClient?.name ? editClient.name : "",
      tradeName: editClient?.tradeName ? editClient.tradeName : "",
      users: [],
      defUsers: editClient?.defUsers ? editClient.defUsers : [],
      allTags: [],
      tags: editClient?.tags ? editClient.tags : [],
      notes: "",
      dob: "",
      companyCIN: "",
      LLP_RegNo: "",
      companyINC_Date: "",
      fileNo: "",
      status: editClient?.status
        ? editClient.status
          ? "active"
          : "inactive"
        : "",
      gstin: "",
      typingTimeout: 0,
      qrmpPreferance: editClient?.qrmpPreferance
        ? editClient.qrmpPreferance
        : [],
      gstUsername: "",
      gstPassword: "",
      inputGstType: "password",
      iconType_gst: "eye-open",
      gstr9_compulsory: "",
      gstr9c_applicable: "",
      eWayBillUsername: "",
      eWayPassword: "",
      iconType_bill: "eye-open",
      inputBillType: "password",
      gstinStatus: "",
      registrationType: "",
      regDate: "",
      canDate: "",
      registeredAddress: "",
      additionalPlaceOfBussiness: editClient?.additionalPlaceOfBussiness
        ? editClient.additionalPlaceOfBussiness
        : [],
      stateJurisdiction: "",
      centralJurisdiction: "",
      returnFileData: returnFileList,
      filedITreturns: editClient?.filedITreturns
        ? editClient.filedITreturns
        : [],
      pan: "",
      itPortalPassword: "",
      inputPortalType: "password",
      iconType_portal: "eye-open",
      tracesUsername: "",
      inputTraceType: "password",
      tracesPassword: "",
      iconType_trace: "eye-open",
      tan: "",
      customFields: editClient?.customFields ? editClient.customFields : [],
      showFieldModal: false,
      contactPerson: editClient?.contactPerson ? editClient.contactPerson : [],
      showBackDrop: false,
      posX: null,
      posY: null,
      showPersonForm: false,
      allPerson: [],
      selectedPerson: null,
      designation: "",
      primaryPerson: false,
      showPersonModal: false,
      allGroups: [],
      showGroupForm: false,
      selectedGroup: null,
      desc: "",
      showGroupModal: false,
      clientGroup: [],
    };
  }

  onKeyUpFunction(event: any) {
    if (event.keyCode === 13) {
      this.editClient();
    }
  }

  getUsersList = () => {
    const workSpaceId = (this.props as any).params?.firmId;
    const searchText = "";
    const active = true;
    agent.User.getUserList(workSpaceId, active, searchText)
      .then((response: any) => {
        console.log({ response });
        this.setState({
          users: response.users,
        });
      })
      .catch((err: any) => {
        (this.props as any).onNotify(
          "Could not load Firm Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  getCustomField = () => {
    const workSpaceId = (this.props as any).params?.firmId;
    const active = true;
    const searchText = "";
    const skip = 0;
    const limit = 20;
    agent.CustomField.getCustomFieldList(
      workSpaceId,
      active,
      searchText,
      limit,
      skip
    )
      .then((response: any) => {
        const filterCustomField = response.customFields.filter(
          (item: any) => item.applicableFor === "client"
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
        (this.props as any).addNotification(
          "Could not load Custom Field Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  getPersonsList = () => {
    const workSpaceId = (this.props as any).params?.firmId;
    const searchText = "";
    const active = true;
    agent.ContactPerson.getPersonList(workSpaceId, active, searchText)
      .then((response: any) => {
        this.setState({ allPerson: response.contactPerson });
      })
      .catch((err: any) => {
        (this.props as any).onNotify(
          "Could not load Contact Person",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  getGroupList = () => {
    const workSpaceId = (this.props as any).params?.firmId;
    const active = true;
    const searchText = "";
    agent.ClientGroups.getClientGroupList(workSpaceId, active, searchText)
      .then((response: any) => {
        this.setState({
          allGroups: response.groups,
        });
      })
      .catch((err: any) => {
        (this.props as any).onNotify(
          "Could not load Firm Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  getTagsList = () => {
    const workSpaceId = (this.props as any).params?.firmId;
    const searchText = "";
    const active = true;
    agent.Tag.getTagList(workSpaceId, active, searchText)
      .then((response: any) => {
        this.setState({
          allTags: response.tags,
        });
      })
      .catch((err: any) => {
        (this.props as any).onNotify(
          "Could not load Tags Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  componentDidMount() {
    this.getUsersList();
    this.getCustomField();
    this.getPersonsList();
    this.getGroupList();
    this.getTagsList();
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const prevFirmId = prevProps.params.firmId;
    const currFirmId = (this.props as any).params.firmId;
    if (prevFirmId !== currFirmId) {
      this.getUsersList();
      this.getCustomField();
      this.getPersonsList();
      this.getGroupList();
    }
  }

  editClient = () => {
    const workSpaceId = (this.props as any).params?.firmId;
    const clientId = (this.props as any)?.editClient?._id;
    const {
      taxesApplicable,
      name,
      type,
      tradeName,
      defUsers,
      tags,
      notes,
      dob,
      companyCIN,
      LLP_RegNo,
      companyINC_Date,
      fileNo,
      status,
      gstin,
      pan,
      tan,
      itPortalPassword,
      tracesUsername,
      tracesPassword,
      eWayBillUsername,
      eWayPassword,
      gstUsername,
      gstPassword,
      gstinStatus,
      qrmpPreferance,
      registrationType,
      regDate,
      canDate,
      registeredAddress,
      additionalPlaceOfBussiness,
      stateJurisdiction,
      centralJurisdiction,
      filedITreturns,
      customFields,
      contactPerson,
      clientGroup,
    } = this.state;

    const checkGSTIN = !taxesApplicable.includes("gst")
      ? true
      : gstin === ""
      ? false
      : true;
    const isgstinValid = !taxesApplicable.includes("gst")
      ? true
      : validGSTIN(gstin);
    const checkPAN = pan === "" ? true : validPAN.test(pan);
    const checkFiledITreturns = this.verifyFiledITreturns();

    const data = {
      name,
      type,
      tradeName,
      defUsers: defUsers.map((user: any) => user._id),
      tags: tags.map((tag: any) => tag._id),
      notes,
      dob: dob ? new Date(dob).toISOString() : "",
      companyCIN,
      LLP_RegNo,
      companyINC_Date: companyINC_Date
        ? new Date(companyINC_Date).toISOString()
        : "",
      fileNo,
      status: status === "active",
      gstApplicable: taxesApplicable.includes("gst"),
      itApplicable: taxesApplicable.includes("income-tax"),
      othersApplicable: true,
      gstin,
      pan,
      tan,
      itPortalPassword,
      tracesUsername,
      tracesPassword,
      eWayBillUsername,
      eWayPassword,
      gstUsername,
      gstPassword,
      gstinStatus: gstinStatus === "active",
      qrmpPreferance,
      registrationType,
      regDate: regDate ? new Date(regDate).toISOString() : "",
      canDate: canDate ? new Date(canDate).toISOString() : "",
      registeredAddress,
      additionalPlaceOfBussiness,
      stateJurisdiction,
      centralJurisdiction,
      filedITreturns,
      customFields: customFields.map((item: any) => ({
        customFieldId: item._id,
        value: item.stringValue,
      })),
      contactPerson: contactPerson.map((person: any) => ({
        personId: person._id,
        designation: person.designation,
      })),
      groupId: clientGroup[0]?._id,
    };

    if (
      clientId &&
      name !== "" &&
      type !== "" &&
      tradeName !== "" &&
      defUsers.length > 0 &&
      tags.length > 0 &&
      checkGSTIN &&
      isgstinValid &&
      checkPAN &&
      checkFiledITreturns
    ) {
      agent.Clients.editClient(workSpaceId, data, clientId)
        .then((response: any) => {
          (this.props as any).onNotify(
            "Client Edited Successfully",
            "Client Edited Successfully",
            "success"
          );
          (this.props as any).navigate(`/${workSpaceId}/clients/list`);
        })
        .catch((err: any) => {
          (this.props as any).onNotify(
            "Could not edit Client",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    } else {
      if (!clientId) {
        (this.props as any).onNotify(
          "Client Id not found",
          "Client Id not found",
          "danger"
        );
      } else if (name === "") {
        (this.props as any).onNotify(
          "Name Field in Basic Details is required",
          "Name Field is Empty",
          "danger"
        );
      } else if (type === "") {
        (this.props as any).onNotify(
          "Client Type in Basic Details is required",
          "Client Type is Empty",
          "danger"
        );
      } else if (tradeName === "") {
        (this.props as any).onNotify(
          "Trade Name in Basic Details is required",
          "Trade Name is Empty",
          "danger"
        );
      } else if (defUsers.length === 0) {
        (this.props as any).onNotify(
          "Users in Basic Details is required",
          "Users is Empty",
          "danger"
        );
      } else if (tags.length === 0) {
        (this.props as any).onNotify(
          "Tags in Basic Details is required",
          "Tags is Empty",
          "danger"
        );
      } else if (!checkGSTIN) {
        (this.props as any).onNotify(
          "GSTIN in GST Details is required",
          "GSTIN is Empty",
          "danger"
        );
      } else if (!isgstinValid) {
        (this.props as any).onNotify(
          "GSTIN in GST Details is Invalid",
          "GSTIN is Invalid",
          "danger"
        );
      } else if (!checkPAN) {
        (this.props as any).onNotify(
          "PAN in Income Tax Details is Invalid",
          "PAN is Invalid",
          "danger"
        );
      } else if (!checkFiledITreturns) {
        (this.props as any).onNotify(
          "TDS in Income Tax Details IT Returns is required",
          "TDS is required",
          "danger"
        );
      }
    }
  };

  verifyFiledITreturns = () => {
    const { type, filedITreturns } = this.state;
    if (type !== "Hindu Undivided Family" && type !== "Individual") {
      if (
        filedITreturns.includes("TDS_Return-Salary") ||
        filedITreturns.includes("TDS_Return-Non_Salary") ||
        filedITreturns.includes("TDS_Return-Non_Resident")
      ) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  };

  returnFileHandler = (file: string) => {
    const { filedITreturns } = this.state;
    const index = filedITreturns.findIndex((item: any) => item === file);
    if (index === -1) {
      filedITreturns.push(file);
    } else {
      filedITreturns.splice(index, 1);
    }
    this.setState({ filedITreturns });
  };

  taxesApplicableHandler = (tax: string) => {
    const isTaxPresent = this.state.taxesApplicable.includes(tax);
    if (isTaxPresent) {
      const removeTax: any = this.state.taxesApplicable.filter(
        (name: string) => name !== tax
      );
      if (
        (this.state.tab === "gst" && tax === "gst") ||
        (this.state.tab === "income-tax" && tax === "income-tax")
      ) {
        this.setState({
          taxesApplicable: removeTax,
          tab: "basic",
        });
      } else {
        this.setState({ taxesApplicable: removeTax });
      }
    } else {
      const taxesApplicableList = this.state.taxesApplicable;
      this.setState({ taxesApplicable: [...taxesApplicableList, tax] });
    }
  };

  tabClickHandler = (tab: string) => {
    this.setState({ tab });
  };

  cancelHandler = () => {
    const firmId = (this.props as any).params?.firmId;
    (this.props as any).navigate(`/${firmId}/clients/list`);
  };

  updateState = (field: string) => (ev: any) => {
    if (field === "pan") {
      this.setState({ pan: ev.target.value.slice(0, 10).toUpperCase() });
    } else {
      this.setState({
        [field]: ev.target.value,
      });
    }
  };

  onViewPassword = (type: string) => {
    if (type === "gst") {
      if (this.state.inputGstType === "password") {
        this.setState({ inputGstType: "text", iconType_gst: "eye-close" });
      } else {
        this.setState({ inputGstType: "password", iconType_gst: "eye-open" });
      }
    } else if (type === "bill") {
      if (this.state.inputBillType === "password") {
        this.setState({ inputBillType: "text", iconType_bill: "eye-close" });
      } else {
        this.setState({ inputBillType: "password", iconType_bill: "eye-open" });
      }
    } else if (type === "portal") {
      if (this.state.inputPortalType === "password") {
        this.setState({
          inputPortalType: "text",
          iconType_portal: "eye-close",
        });
      } else {
        this.setState({
          inputPortalType: "password",
          iconType_portal: "eye-open",
        });
      }
    } else if (type === "trace") {
      if (this.state.inputTraceType === "password") {
        this.setState({
          inputTraceType: "text",
          iconType_trace: "eye-close",
        });
      } else {
        this.setState({
          inputTraceType: "password",
          iconType_trace: "eye-open",
        });
      }
    }
  };

  updateCustomField = (customFieldId: string) => (ev: any) => {
    const updatedField = this.state.customFields.map((item: any, i: number) =>
      item.customFieldId === customFieldId
        ? { ...item, stringValue: ev.target.value }
        : item
    );
    this.setState({ customFields: updatedField });
  };

  onUserChange = (user: any) => {
    console.log({ user });
    const { defUsers } = this.state;
    const index = defUsers.findIndex((item: any) => item._id === user._id);
    if (index === -1) {
      this.setState({ defUsers: [...defUsers, user] });
    } else {
      const updatedUsers = defUsers.filter(
        (item: any) => item._id !== user._id
      );
      this.setState({ defUsers: updatedUsers });
    }
  };

  onTagChange = (tag: any) => {
    const { tags } = this.state;
    const index = tags.findIndex((item: any) => item._id === tag._id);
    if (index === -1) {
      this.setState({ tags: [...tags, tag] });
    } else {
      const updatedTag = tags.filter((item: any) => item._id !== tag._id);
      this.setState({ tags: updatedTag });
    }
  };

  closeFieldModal = () => {
    this.setState({ showFieldModal: false });
  };

  closePersonModal = () => {
    this.setState({ showPersonModal: false });
  };

  closeGroupModal = () => {
    this.setState({ showGroupModal: false });
  };

  openModal = (modalType: string) => {
    if (modalType === "customField") {
      this.setState({ showFieldModal: true });
    } else if (modalType === "contactPerson") {
      this.setState({ showPersonModal: true });
    } else if (modalType === "clientGroup") {
      this.setState({ showGroupModal: true });
    }
  };

  customFieldData = (newField: any) => {
    this.setState({ customFields: [...this.state.customFields, newField] });
  };

  contactPersonData = (newPerson: any) => {
    this.setState({
      allPerson: [...this.state.allPerson, newPerson],
      selectedPerson: newPerson,
    });
  };

  clientGroupData = (newGroup: any) => {
    this.setState({
      allGroups: [...this.state.allGroups, newGroup],
      selectedGroup: newGroup,
    });
  };

  onActionClick = (e: any) => {
    const screenClosness = window.innerHeight - e.clientY;
    const positionY = screenClosness < 125 ? e.clientY - 125 : e.clientY;
    this.setState({
      posX: e.clientX,
      posY: positionY,
      showBackDrop: true,
    });
  };

  onDropdownClick = () => {
    this.setState({ showBackDrop: false });
  };

  showForm = (formType: string, show: boolean) => {
    if (formType === "person") {
      this.setState({ showPersonForm: show });
    } else if (formType === "group") {
      this.setState({ showGroupForm: show });
    }
  };

  onPersonChange = (person: any) => {
    this.setState({ selectedPerson: person });
  };

  onGroupChange = (group: any) => {
    this.setState({ selectedGroup: group });
  };

  primaryPersonHandler = () => {
    const { contactPerson, primaryPerson } = this.state;
    const isPrimaryPresent = contactPerson.findIndex(
      (person: any) => person.primaryPerson === true
    );
    if (isPrimaryPresent === -1) {
      this.setState({
        primaryPerson: !primaryPerson,
      });
    } else {
      const updatePerson = contactPerson.map((person: any) =>
        person.primaryPerson === true
          ? { ...person, primaryPerson: false }
          : person
      );

      this.setState({
        contactPerson: updatePerson,
        primaryPerson: !primaryPerson,
      });
    }
  };

  addPerson = () => {
    const { selectedPerson, designation, primaryPerson } = this.state;
    if (selectedPerson === null || designation === "") {
      if (selectedPerson === null) {
        (this.props as any).onNotify(
          "Person Not Selected",
          "Please select a person",
          "danger"
        );
      } else if (designation === "") {
        (this.props as any).onNotify(
          "Designation Not Selected",
          "Please select a designation",
          "danger"
        );
      }
    } else {
      const person = { ...selectedPerson, designation, primaryPerson };
      this.setState({
        contactPerson: [...this.state.contactPerson, person],
        showPersonForm: false,
        selectedPerson: null,
        designation: "",
        primaryPerson: false,
      });
    }
  };

  addGroup = () => {
    const { selectedGroup, desc } = this.state;
    console.log(selectedGroup, desc);
    if (selectedGroup === null) {
      (this.props as any).onNotify(
        "Group Not Selected",
        "Please select a group",
        "danger"
      );
    } else {
      const group = { ...selectedGroup, desc };
      this.setState({
        clientGroup: [...this.state.clientGroup, group],
        showGroupForm: false,
        selectedGroup: null,
        desc: "",
      });
    }
  };

  emailTableContent = (emails: any) => {
    const primaryEmail = emails.find((email: any) => email.isPrimary === true);
    const visibleEmail = primaryEmail
      ? primaryEmail.emailId
      : emails[0].emailId;
    const otherEmailLength =
      emails.length - 1 === 0 ? "" : `+ ${emails.length - 1}`;
    return `${visibleEmail} ${otherEmailLength}`;
  };

  mobileTableContent = (mobiles: any) => {
    const primaryMobile = mobiles.find(
      (mobile: any) => mobile.isPrimary === true
    );
    const visibleEmail = primaryMobile
      ? `${primaryMobile.mobileNumber}`
      : `${mobiles[0].mobileNumber}`;
    const otherEmailLength =
      mobiles.length - 1 === 0 ? "" : `+ ${mobiles.length - 1}`;
    return `${visibleEmail} ${otherEmailLength}`;
  };

  deleteContentFromTable = (tableType: string, index: number) => {
    if (tableType === "contactPerson") {
      const updatedPerson = this.state.contactPerson.filter(
        (person: any, i: number) => i !== index
      );

      this.setState({ contactPerson: updatedPerson, showBackDrop: false });
      (this.props as any).onNotify(
        "Person Deleted",
        "Sussessfully deleted person",
        "success"
      );
    } else if (tableType === "clientGroup") {
      const updatedGroup = this.state.clientGroup.filter(
        (group: any, i: number) => i !== index
      );
      this.setState({ clientGroup: updatedGroup, showBackDrop: false });
      (this.props as any).onNotify(
        "Group Deleted",
        "Sussessfully deleted group",
        "success"
      );
    }
  };

  clientTypeChange = (e: any) => {
    const type = e.target.value;
    if (
      type === "One Person Company" ||
      type === "private limited company" ||
      type === "Public Limited Company"
    ) {
      this.setState({
        type,
        returnFileData: [
          { name: "ITR - Stat Audit", value: " ITR-Stat_Audit" },
          { name: "ITR - Income Tax Audit", value: "ITR-Income_Tax_Audit" },
        ],
      });
    } else {
      this.setState({
        type,
        returnFileData: returnFileList,
      });
    }
  };

  handleGstinChange = (ev: any) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      gstin: ev.target.value,
      typingTimeout: setTimeout(() => {
        this.getQRMPData();
      }, 700),
    });
  };

  getQRMPData = () => {
    const workSpaceId = (this.props as any).params.firmId;
    const { gstin } = this.state;
    agent.Clients.getQRMPDetails(workSpaceId, gstin)
      .then((response: any) => {
        this.setState({ qrmpPreferance: response.reverse() });
      })
      .catch((err: any) => {
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  render() {
    TagManager.dataLayer(tagManagerArgs);
    console.log("ADD Clients STATE", this.state);
    return (
      <Dashboard>
        {this.state.showFieldModal && (
          <AddCustomField
            showFieldModal={this.state.showFieldModal}
            closeModal={this.closeFieldModal}
            customFieldData={this.customFieldData}
            from="client"
          />
        )}

        {this.state.showPersonModal && (
          <AddPerson
            showPersonModal={this.state.showPersonModal}
            closeModal={this.closePersonModal}
            contactPersonData={this.contactPersonData}
          />
        )}

        {this.state.showGroupModal && (
          <AddClientGroups
            showGroupModal={this.state.showGroupModal}
            closeModal={this.closeGroupModal}
            clientGroupData={this.clientGroupData}
          />
        )}
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 gstadd">
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit Client
                  </h3>
                  {/* Tax Applicable Checkbox */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 lg:col-span-2">
                      <label
                        htmlFor="company_website"
                        className="block font-medium text-gray-700"
                      >
                        Taxes Applicable <span className="text-red-600">*</span>
                      </label>
                      <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10 mt-2">
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="gst"
                              aria-describedby="gst-taxesApplicable"
                              name="gst"
                              type="checkbox"
                              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-400"
                              checked={this.state.taxesApplicable.includes(
                                "gst"
                              )}
                              onChange={() =>
                                this.taxesApplicableHandler("gst")
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="gst"
                              className="font-medium text-gray-700"
                            >
                              GST
                            </label>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="income-tax"
                              aria-describedby="income-tax-taxesApplicable"
                              name="income-tax"
                              type="checkbox"
                              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-400"
                              checked={this.state.taxesApplicable.includes(
                                "income-tax"
                              )}
                              onChange={() =>
                                this.taxesApplicableHandler("income-tax")
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="income-tax"
                              className="font-medium text-gray-700"
                            >
                              Income Tax
                            </label>
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              disabled
                              id="other"
                              aria-describedby="other-taxesApplicable"
                              name="other"
                              type="checkbox"
                              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-400"
                              defaultChecked={this.state.taxesApplicable.includes(
                                "other"
                              )}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="other"
                              className="font-medium text-gray-700"
                            >
                              Other
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* All Tabs */}
                  <div>
                    <div className="sm:hidden">
                      <label htmlFor="tabs" className="sr-only">
                        Select a tab
                      </label>
                      <select
                        id="tabs"
                        name="tabs"
                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        value={this.state.tab}
                        onChange={(e) => this.tabClickHandler(e.target.value)}
                      >
                        {this.state.taxesApplicable.includes("gst") && (
                          <option value={"gst"}>GST Details</option>
                        )}
                        {this.state.taxesApplicable.includes("income-tax") && (
                          <option value={"income-tax"}>
                            Income Tax Details
                          </option>
                        )}
                        <option value={"basic"}>Basic Details</option>
                        <option value={"contact"}>Contact Persons</option>
                        <option value={"group"}>Client Groups</option>
                        <option value={"custom"}>Custom Fields</option>

                        {/* ))} */}
                      </select>
                    </div>
                    <div className="hidden sm:block">
                      <div className="border-b border-gray-200">
                        <nav className="-mb-px flex" aria-label="Tabs">
                          <button
                            type="button"
                            onClick={() => this.tabClickHandler("basic")}
                            className={`inline-flex items-center justify-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                              this.state.tab === "basic"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }
                            `}
                          >
                            <Icon
                              name="outline/document-add"
                              className="h-4 w-4 mr-1"
                            />
                            Basic Details
                          </button>
                          {this.state.taxesApplicable.includes("gst") && (
                            <button
                              type="button"
                              onClick={() => this.tabClickHandler("gst")}
                              className={`inline-flex items-center justify-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                this.state.tab === "gst"
                                  ? "border-indigo-500 text-indigo-600"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }
                            `}
                            >
                              <Icon
                                name="outline/document-text"
                                className="h-4 w-4 mr-1"
                              />
                              GST Details
                            </button>
                          )}
                          {this.state.taxesApplicable.includes(
                            "income-tax"
                          ) && (
                            <button
                              type="button"
                              onClick={() => this.tabClickHandler("income-tax")}
                              className={`inline-flex items-center justify-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                this.state.tab === "income-tax"
                                  ? "border-indigo-500 text-indigo-600"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }
                            `}
                            >
                              <Icon
                                name="outline/document-report"
                                className="h-4 w-4 mr-1"
                              />
                              Income Tax Details
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => this.tabClickHandler("contact")}
                            className={`inline-flex items-center justify-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                              this.state.tab === "contact"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }
                            `}
                          >
                            <Icon
                              name="outline/user"
                              className="h-4 w-4 mr-1"
                            />
                            Contact Persons
                          </button>
                          <button
                            type="button"
                            onClick={() => this.tabClickHandler("group")}
                            className={`inline-flex items-center justify-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                              this.state.tab === "group"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }
                            `}
                          >
                            <Icon
                              name="outline/users"
                              className="h-4 w-4 mr-1"
                            />
                            Client Groups
                          </button>
                          <button
                            type="button"
                            onClick={() => this.tabClickHandler("custom")}
                            className={`inline-flex items-center justify-center w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                              this.state.tab === "custom"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }
                            `}
                          >
                            <Icon
                              name="outline/settings"
                              className="h-4 w-4 mr-1"
                            />
                            Custom Fields
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                  {/* Basic Details Form */}
                  {this.state.tab === "basic" && (
                    <>
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Basic Details
                        </h3>
                      </div>
                      <div className="space-y-6 sm:space-y-5">
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Type of Client{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <select
                              id="type"
                              name="type"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              value={this.state.type}
                              onChange={this.clientTypeChange}
                            >
                              <option value={""}>Select Type of Client</option>
                              <option value={"Individuals"}>Individuals</option>
                              <option value={"Hindu Undivided Family"}>
                                Hindu Undivided Family
                              </option>
                              <option value={"Private Limited Company"}>
                                Private Limited Company
                              </option>
                              <option value={"Public Limited Company"}>
                                Public Limited Company
                              </option>
                              <option value={"Trust"}>Trust</option>
                              <option value={"Local Authority"}>
                                Local Authority
                              </option>
                              <option value={"Artificial Juridical Person"}>
                                Artificial Juridical Person
                              </option>
                              <option value={"Firm"}>Firm</option>
                              <option value={"Limited Liability Partnership"}>
                                Limited Liability Partnership
                              </option>
                              <option value={"Association Of Persons"}>
                                Association Of Persons
                              </option>
                              <option value={"Political Party"}>
                                Political Party
                              </option>
                              <option value={"Government"}>Government</option>
                              <option value={"Body Of Individuals"}>
                                Body Of Individuals
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Name <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="first-name"
                              id="first-name"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="Name"
                              value={this.state.name}
                              onChange={this.updateState("name")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="trade-name"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Trade Name <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="trade-name"
                              id="trade-name"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="Trade Name"
                              value={this.state.tradeName}
                              onChange={this.updateState("tradeName")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="user"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            User Allocation{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                            <MultiSelectCheckbox
                              items={this.state.users?.map((user: any) => {
                                return {
                                  ...user,
                                  _id: user._id,
                                  name: user.name,
                                };
                              })}
                              selected={this.state.defUsers}
                              type="checkbox"
                              onChange={this.onUserChange}
                              placeholder="Select User"
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="tag"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Tag <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                            <MultiSelectCheckbox
                              items={this.state.allTags?.map((tag: any) => {
                                return {
                                  ...tag,
                                  _id: tag._id,
                                  name: tag.name,
                                };
                              })}
                              selected={this.state.tags}
                              type="checkbox"
                              onChange={this.onTagChange}
                              placeholder="Select Tags"
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="about"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Notes
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <textarea
                              id="about"
                              name="about"
                              rows={4}
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={this.state.notes}
                              onChange={this.updateState("notes")}
                              placeholder="Add Notes..."
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            DOB/DOI
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="date"
                              name="dob"
                              id="dob"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              value={this.state.dob}
                              onChange={this.updateState("dob")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="comapany"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Company inc date
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="date"
                              name="comapany"
                              id="comapany"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              value={this.state.companyINC_Date}
                              onChange={this.updateState("companyINC_Date")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="cin"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            CIN
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="cin"
                              id="cin"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="CIN"
                              value={this.state.companyCIN}
                              onChange={this.updateState("companyCIN")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="llp"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            LLP
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="llp"
                              id="llp"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="LLP"
                              value={this.state.LLP_RegNo}
                              onChange={this.updateState("LLP_RegNo")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="file"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            File No.
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="file"
                              id="file"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="File No."
                              value={this.state.fileNo}
                              onChange={this.updateState("fileNo")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Status
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <fieldset className="mt-2">
                              <legend className="sr-only">User Role</legend>
                              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                <div className="flex items-center">
                                  <input
                                    id={"active"}
                                    name="active"
                                    type="radio"
                                    value={"active"}
                                    checked={this.state.status === "active"}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState("status")}
                                  />
                                  <label
                                    htmlFor={"active"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Active
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id={"inactive"}
                                    name="inactive"
                                    type="radio"
                                    value={"inactive"}
                                    checked={this.state.status === "inactive"}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState("status")}
                                  />
                                  <label
                                    htmlFor={"inactive"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Inactive
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* GST Details Form  */}
                  {this.state.tab === "gst" && (
                    <>
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          GST Details
                        </h3>
                      </div>
                      <div className="space-y-6 sm:space-y-5">
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="gstin"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            GSTIN <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="gstin"
                              id="gstin"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="GSTIN"
                              value={this.state.gstin}
                              onChange={this.handleGstinChange}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="gst-username"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            GST Username
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="gst-username"
                              id="gst-username"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="GST Username"
                              value={this.state.gstUsername}
                              onChange={this.updateState("gstUsername")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="gst-password"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            GST Password
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <div className="relative w-full sm:max-w-xs mt-1 flex rounded-md shadow-sm">
                              <input
                                name="gst-password"
                                type={this.state.inputGstType}
                                value={this.state.gstPassword}
                                onChange={this.updateState("gstPassword")}
                                id="gst-password"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="GST Password"
                                autoComplete={"new-password"}
                              />
                              <button
                                type="button"
                                onClick={() => this.onViewPassword("gst")}
                              >
                                <Icon
                                  name={this.state.iconType_gst}
                                  className="h-6 w-6 text-gray-500 absolute top-2 right-3"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            GSTR-9 Compulsory
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <fieldset className="mt-2">
                              <legend className="sr-only">
                                GSTR-9 Compulsory
                              </legend>
                              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                <div className="flex items-center">
                                  <input
                                    id={"yes"}
                                    name="compulsory"
                                    type="radio"
                                    value={"yes"}
                                    checked={
                                      this.state.gstr9_compulsory === "yes"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState(
                                      "gstr9_compulsory"
                                    )}
                                  />
                                  <label
                                    htmlFor={"yes"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id={"no"}
                                    name="compulsory"
                                    type="radio"
                                    value={"no"}
                                    checked={
                                      this.state.gstr9_compulsory === "no"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState(
                                      "gstr9_compulsory"
                                    )}
                                  />
                                  <label
                                    htmlFor={"no"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    No
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            GSTR-9C Applicable
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <fieldset className="mt-2">
                              <legend className="sr-only">
                                GSTR-9C Applicable
                              </legend>
                              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                <div className="flex items-center">
                                  <input
                                    id={"yes-1"}
                                    name="applicable"
                                    type="radio"
                                    value={"yes"}
                                    checked={
                                      this.state.gstr9c_applicable === "yes"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState(
                                      "gstr9c_applicable"
                                    )}
                                  />
                                  <label
                                    htmlFor={"yes-1"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id={"no-1"}
                                    name="applicable"
                                    type="radio"
                                    value={"no"}
                                    checked={
                                      this.state.gstr9c_applicable === "no"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState(
                                      "gstr9c_applicable"
                                    )}
                                  />
                                  <label
                                    htmlFor={"no-1"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    No
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="bill-username"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            E-way Bill Username
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="bill-username"
                              id="bill-username"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="E-way Bill Username"
                              value={this.state.eWayBillUsername}
                              onChange={this.updateState("eWayBillUsername")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="bill-password"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            E-way Bill Password
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <div className="relative w-full sm:max-w-xs mt-1 flex rounded-md shadow-sm">
                              <input
                                name="bill-password"
                                type={this.state.inputBillType}
                                value={this.state.eWayPassword}
                                onChange={this.updateState("eWayPassword")}
                                id="bill-password"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="E-way Bill Password"
                                autoComplete={"new-password"}
                              />
                              <button
                                type="button"
                                onClick={() => this.onViewPassword("bill")}
                              >
                                <Icon
                                  name={this.state.iconType_bill}
                                  className="h-6 w-6 text-gray-500 absolute top-2 right-3"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            GSTIN Status
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <fieldset className="mt-2">
                              <legend className="sr-only">GSTIN Status</legend>
                              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                <div className="flex items-center">
                                  <input
                                    id={"active_gstin"}
                                    name="active_gstin"
                                    type="radio"
                                    value={"active"}
                                    checked={
                                      this.state.gstinStatus === "active"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState("gstinStatus")}
                                  />
                                  <label
                                    htmlFor={"active_gstin"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Active
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id={"inactive_gstin"}
                                    name="inactive_gstin"
                                    type="radio"
                                    value={"inactive"}
                                    checked={
                                      this.state.gstinStatus === "inactive"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState("gstinStatus")}
                                  />
                                  <label
                                    htmlFor={"inactive_gstin"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Inactive
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Registration Type
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <fieldset className="mt-2">
                              <legend className="sr-only">
                                {" "}
                                Registration Type
                              </legend>
                              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                <div className="flex items-center">
                                  <input
                                    id={"regular"}
                                    name="regular"
                                    type="radio"
                                    value={"regular"}
                                    checked={
                                      this.state.registrationType === "regular"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState(
                                      "registrationType"
                                    )}
                                  />
                                  <label
                                    htmlFor={"regular"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Regular
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id={"composition"}
                                    name="composition"
                                    type="radio"
                                    value={"composition"}
                                    checked={
                                      this.state.registrationType ===
                                      "composition"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState(
                                      "registrationType"
                                    )}
                                  />
                                  <label
                                    htmlFor={"composition"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Composition
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="registration"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Registration Date
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="date"
                              name="registration"
                              id="registration"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              value={this.state.regDate}
                              onChange={this.updateState("regDate")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="can-date"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Can Date
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="date"
                              name="can-date"
                              id="can-date"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              value={this.state.canDate}
                              onChange={this.updateState("canDate")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="registeredAddress"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Registered Address
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <textarea
                              id="registeredAddress"
                              name="registeredAddress"
                              rows={4}
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={this.state.registeredAddress}
                              onChange={this.updateState("registeredAddress")}
                              placeholder="Add Registered Address..."
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="additionalPlaceOfBussiness"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Additional Place of Business
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="additionalPlaceOfBussiness"
                              id="additionalPlaceOfBussiness"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="Additional Place of Business"
                              // value={this.state.additionalPlaceOfBussiness}
                              // onChange={this.updateState(
                              //   "additionalPlaceOfBussiness"
                              // )}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="stateJurisdiction"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            State Jurisdiction
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="stateJurisdiction"
                              id="stateJurisdiction"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="State Jurisdiction"
                              value={this.state.stateJurisdiction}
                              onChange={this.updateState("stateJurisdiction")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="centralJurisdiction"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Central Jurisdiction
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="centralJurisdiction"
                              id="centralJurisdiction"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="Central Jurisdiction"
                              value={this.state.centralJurisdiction}
                              onChange={this.updateState("centralJurisdiction")}
                            />
                          </div>
                        </div>
                        <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                          <p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            QRMP Preference
                          </p>
                          <div
                            className={
                              "mt-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-0"
                            }
                          >
                            <div className="mt-6 flex flex-col max-h-screen">
                              <div
                                id="table-scroll"
                                className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 overflow-auto"
                              >
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                  <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                                    <table
                                      className="min-w-full border-separate border shadow-sm"
                                      style={{ borderSpacing: 0 }}
                                    >
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th
                                            style={{ zIndex: 8 }}
                                            scope="col"
                                            className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                          >
                                            QUARTER
                                          </th>
                                          <th
                                            style={{ zIndex: 8 }}
                                            scope="col"
                                            className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                          >
                                            YEAR
                                          </th>

                                          <th
                                            style={{ zIndex: 8 }}
                                            scope="col"
                                            className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                          >
                                            PREFERENCE
                                          </th>

                                          <th
                                            style={{ zIndex: 8 }}
                                            scope="col"
                                            className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                          >
                                            LAST CHECKED
                                          </th>
                                        </tr>
                                      </thead>
                                      {this.state.qrmpPreferance.length ===
                                      0 ? (
                                        <tbody>
                                          <tr>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                              No QRMP Detail Found
                                            </td>
                                          </tr>
                                        </tbody>
                                      ) : (
                                        <tbody className="bg-white">
                                          {this.state.qrmpPreferance?.map(
                                            (item: any, index: any) => (
                                              <tr
                                                key={index}
                                                className={
                                                  index % 2 === 0
                                                    ? undefined
                                                    : "bg-gray-100"
                                                }
                                              >
                                                <td className="w-3/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                                                  {item.quarter}
                                                </td>
                                                <td className="w-3/12 px-6 py-3 text-sm text-gray-500 relative">
                                                  {item.year}
                                                </td>
                                                <td className="w-3/12 px-6 py-3 whitespace-nowrap font-bold text-sm text-gray-900">
                                                  {item.preference}
                                                </td>
                                                <td className="w-3/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                  {formatDateAndTime(
                                                    item.lastChecked
                                                  )}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      )}
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Income Tax Details Form */}
                  {this.state.tab === "income-tax" && (
                    <>
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Income Tax Details
                        </h3>
                      </div>
                      <div className="space-y-6 sm:space-y-5">
                        <div className="pt-2 sm:pt-5 sm:border-t sm:border-gray-200 ">
                          <div role="group" aria-labelledby="label-email">
                            <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                              <div
                                className="text-sm font-medium text-gray-700 sm:text-gray-700"
                                id="label-email"
                              >
                                Returns You File in IT
                              </div>

                              <div className="mt-4 sm:col-span-2 sm:mt-0">
                                <div className="max-w-lg space-y-4">
                                  {this.state.returnFileData.map(
                                    (item: any) => {
                                      return (
                                        <div
                                          key={item.value}
                                          className="relative flex items-start"
                                        >
                                          <div className="flex h-5 items-center">
                                            <input
                                              id={item.value}
                                              name={item.value}
                                              type="checkbox"
                                              className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                                              checked={this.state.filedITreturns.includes(
                                                item.value
                                              )}
                                              onChange={() =>
                                                this.returnFileHandler(
                                                  item.value
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="ml-3 text-sm">
                                            <label
                                              htmlFor={item.value}
                                              className="font-medium text-gray-700"
                                            >
                                              {item.name}
                                            </label>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="pan"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            PAN
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="pan"
                              id="pan"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="PAN"
                              value={this.state.pan}
                              onChange={this.updateState("pan")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="it-password"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            IT Portal Password
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <div className="relative w-full sm:max-w-xs mt-1 flex rounded-md shadow-sm">
                              <input
                                name="it-password"
                                type={this.state.inputPortalType}
                                value={this.state.itPortalPassword}
                                onChange={this.updateState("itPortalPassword")}
                                id="it-password"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="IT Portal Password"
                                autoComplete={"new-password"}
                              />
                              <button
                                type="button"
                                onClick={() => this.onViewPassword("portal")}
                              >
                                <Icon
                                  name={this.state.iconType_portal}
                                  className="h-6 w-6 text-gray-500 absolute top-2 right-3"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="trace-username"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Traces Username
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="trace-username"
                              id="trace-username"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="Traces Username"
                              value={this.state.tracesUsername}
                              onChange={this.updateState("tracesUsername")}
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="tracesPassword"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Traces Password
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <div className="relative w-full sm:max-w-xs mt-1 flex rounded-md shadow-sm">
                              <input
                                name="tracesPassword"
                                type={this.state.inputTraceType}
                                value={this.state.tracesPassword}
                                onChange={this.updateState("tracesPassword")}
                                id="tracesPassword"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Traces Password"
                                autoComplete={"new-password"}
                              />
                              <button
                                type="button"
                                onClick={() => this.onViewPassword("trace")}
                              >
                                <Icon
                                  name={this.state.iconType_trace}
                                  className="h-6 w-6 text-gray-500 absolute top-2 right-3"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                          <label
                            htmlFor="tan"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            TAN
                          </label>
                          <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <input
                              type="text"
                              name="tan"
                              id="tan"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                              placeholder="TAN"
                              value={this.state.tan}
                              onChange={this.updateState("tan")}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Contact Person Form*/}
                  {this.state.tab === "contact" && (
                    <>
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Contact Person Details
                        </h3>
                        <button
                          type="button"
                          className="mt-3 inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                          onClick={() => this.showForm("person", true)}
                        >
                          <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                          Add Contact Person
                        </button>
                      </div>
                      {this.state.showPersonForm && (
                        <div className="space-y-6 sm:space-y-5">
                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                              htmlFor="tag"
                              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Person
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                              <div>
                                <MultiSelect
                                  items={this.state.allPerson?.map(
                                    (person: any) => {
                                      return {
                                        ...person,
                                        _id: person._id,
                                        name: person.name,
                                      };
                                    }
                                  )}
                                  selected={{
                                    name: this.state.selectedPerson?.name,
                                  }}
                                  type="tasks"
                                  onChange={this.onPersonChange}
                                  placeholder="Select Person"
                                />
                              </div>
                              <button
                                type="button"
                                className="mt-3 inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                                onClick={() => this.openModal("contactPerson")}
                              >
                                <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                                New Contact Person
                              </button>
                            </div>
                          </div>
                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                              htmlFor="type"
                              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Designation
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                              <select
                                id="type"
                                name="type"
                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                value={this.state.designation}
                                onChange={this.updateState("designation")}
                              >
                                <option value={""}>Select Designation</option>
                                <option value={"Individual"}>Individual</option>
                                <option value={"Proprietor"}>Proprietor</option>
                                <option value={"Partner"}>Partner</option>
                                <option value={"Accountant"}>Accountant</option>
                                <option value={"Director"}>Director</option>
                                <option value={"Managing Director"}>
                                  Managing Director
                                </option>
                                <option value={"CFO"}>CFO</option>
                                <option value={"Karta"}>Karta</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-2 sm:pt-5 sm:border-t sm:border-gray-200 ">
                            <div role="group" aria-labelledby="label-email">
                              <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                                <div className="text-sm font-medium text-gray-700 sm:text-gray-700">
                                  Is Primary
                                </div>

                                <div className="mt-4 sm:col-span-2 sm:mt-0">
                                  <div className="max-w-lg space-y-4">
                                    <div className="relative flex items-start">
                                      <div className="flex h-5 items-center">
                                        <input
                                          id={"primary"}
                                          name={"primary"}
                                          type="checkbox"
                                          className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                                          checked={this.state.primaryPerson}
                                          onChange={this.primaryPersonHandler}
                                        />
                                      </div>
                                      <div className="ml-3 text-sm">
                                        <label
                                          htmlFor={"primary"}
                                          className="font-medium text-gray-700"
                                        >
                                          Select as Primary
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label className="hidden sm:block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                              Actions
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={this.addPerson}
                                  className={
                                    "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => this.showForm("person", false)}
                                  className="inline-flex mx-4 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none "
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Contact Person Table */}
                      <div
                        className={
                          "sm:border-t mt-2 sm:border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 md:px-0"
                        }
                      >
                        <div className="mt-6 flex flex-col max-h-screen">
                          <div
                            id="table-scroll"
                            className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 overflow-auto"
                          >
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                                <table
                                  className="min-w-full border-separate border shadow-sm"
                                  style={{ borderSpacing: 0 }}
                                >
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        NAME
                                      </th>
                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        EMAIL
                                      </th>

                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        MOBILE
                                      </th>

                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        DESIGNATION
                                      </th>

                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        IS PRIMARY
                                      </th>

                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        ACTIONS
                                      </th>
                                    </tr>
                                  </thead>
                                  {this.state.contactPerson.length === 0 ? (
                                    <tbody>
                                      <tr>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          No Contact Person Added
                                        </td>
                                      </tr>
                                    </tbody>
                                  ) : (
                                    <tbody className="bg-white">
                                      {this.state.contactPerson?.map(
                                        (person: any, index: any) => (
                                          <tr
                                            key={person._id}
                                            className={
                                              index % 2 === 0
                                                ? undefined
                                                : "bg-gray-100"
                                            }
                                          >
                                            <td className="w-2/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                                              {person.name}
                                            </td>
                                            <td className="w-3/12 px-6 py-3 text-sm text-gray-500 relative">
                                              <div className="hover:underline cursor-pointer">
                                                {this.emailTableContent(
                                                  person.email
                                                )}
                                              </div>
                                            </td>
                                            <td className="w-2/12 px-6 py-3 whitespace-nowrap font-bold text-sm text-gray-900">
                                              <div className="hover:underline cursor-pointer">
                                                {this.mobileTableContent(
                                                  person.mobile
                                                )}
                                              </div>
                                            </td>
                                            <td className="w-4/10 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                              {person.designation}
                                            </td>
                                            <td className="w-4/10 px-6 py-3 whitespace-nowrap font-bold text-sm text-gray-900">
                                              {person.primaryPerson
                                                ? "Yes"
                                                : "No"}
                                            </td>
                                            <td className="w-4/10 px-6 py-3 mx-4 text-center whitespace-nowrap text-sm text-gray-500">
                                              <Menu
                                                as="div"
                                                className="inline-block"
                                              >
                                                <Menu.Button
                                                  onClick={this.onActionClick}
                                                >
                                                  <span className="sr-only">
                                                    Open options
                                                  </span>
                                                  <Icon
                                                    name="horizontal-dots"
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </Menu.Button>
                                                {this.state.showBackDrop && (
                                                  <div
                                                    className="fixed top-0 left-0 z-10 w-full h-screen"
                                                    onClick={
                                                      this.onDropdownClick
                                                    }
                                                  ></div>
                                                )}

                                                <Transition
                                                  as={Fragment}
                                                  enter="transition ease-out duration-100"
                                                  enterFrom="transform opacity-0 scale-95"
                                                  enterTo="transform opacity-100 scale-100"
                                                  leave="transition ease-in duration-75"
                                                  leaveFrom="transform opacity-100 scale-100"
                                                  leaveTo="transform opacity-0 scale-95"
                                                >
                                                  <div
                                                    style={{
                                                      position: "fixed",
                                                      zIndex: 100,
                                                      top: `${this.state.posY}px`,
                                                      left: `${
                                                        this.state.posX - 230
                                                      }px`,
                                                      margin: "0.5rem",
                                                    }}
                                                  >
                                                    <Menu.Items className="overscroll-none mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                      <div className="py-1">
                                                        <Menu.Item>
                                                          <button
                                                            type="button"
                                                            className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                            onClick={() =>
                                                              this.deleteContentFromTable(
                                                                "contactPerson",
                                                                index
                                                              )
                                                            }
                                                          >
                                                            <Icon
                                                              name="delete"
                                                              className="h-5 w-5 mr-2"
                                                            />
                                                            <span>Delete</span>
                                                          </button>
                                                        </Menu.Item>
                                                      </div>
                                                    </Menu.Items>
                                                  </div>
                                                </Transition>
                                              </Menu>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  )}
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/*  Client Group  */}

                  {this.state.tab === "group" && (
                    <>
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Client Group Details
                        </h3>
                        <button
                          type="button"
                          className="mt-3 inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                          onClick={() => this.showForm("group", true)}
                        >
                          <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                          Add Client Group
                        </button>
                      </div>
                      {this.state.showGroupForm && (
                        <div className="space-y-6 sm:space-y-5">
                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                              htmlFor="tag"
                              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Group
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0 w-full sm:max-w-xs">
                              <div>
                                <MultiSelect
                                  items={this.state.allGroups?.map(
                                    (group: any) => {
                                      return {
                                        ...group,
                                        _id: group._id,
                                        name: group.name,
                                      };
                                    }
                                  )}
                                  selected={{
                                    name: this.state.selectedGroup?.name,
                                  }}
                                  type="tasks"
                                  onChange={this.onGroupChange}
                                  placeholder="Select Group"
                                />
                              </div>
                              <button
                                type="button"
                                className="mt-3 inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                                onClick={() => this.openModal("clientGroup")}
                              >
                                <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                                New Client Group
                              </button>
                            </div>
                          </div>

                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                              htmlFor="about"
                              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                              Description
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                              <textarea
                                id="about"
                                name="about"
                                rows={4}
                                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={this.state.desc}
                                onChange={this.updateState("desc")}
                                placeholder="Add Description..."
                              />
                            </div>
                          </div>

                          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                            <label className="hidden sm:block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                              Actions
                            </label>
                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={this.addGroup}
                                  className={
                                    "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => this.showForm("group", false)}
                                  className="inline-flex mx-4 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none "
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Client Group Table */}
                      <div
                        className={
                          "sm:border-t mt-2 sm:border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 md:px-0"
                        }
                      >
                        <div className="mt-6 flex flex-col max-h-screen">
                          <div
                            id="table-scroll"
                            className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 overflow-auto"
                          >
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                                <table
                                  className="min-w-full border-separate border shadow-sm"
                                  style={{ borderSpacing: 0 }}
                                >
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        NAME
                                      </th>
                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        DESCRIPTION
                                      </th>

                                      <th
                                        style={{ zIndex: 8 }}
                                        scope="col"
                                        className="sticky top-0 border-b border-gray-300 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                                      >
                                        ACTIONS
                                      </th>
                                    </tr>
                                  </thead>
                                  {this.state.clientGroup.length === 0 ? (
                                    <tbody>
                                      <tr>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          No Client Group Added
                                        </td>
                                      </tr>
                                    </tbody>
                                  ) : (
                                    <tbody className="bg-white">
                                      {this.state.clientGroup?.map(
                                        (group: any, index: any) => (
                                          <tr
                                            key={group._id}
                                            className={
                                              index % 2 === 0
                                                ? undefined
                                                : "bg-gray-100"
                                            }
                                          >
                                            <td className="w-4/12 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-6">
                                              {group.name}
                                            </td>
                                            <td
                                              id="description"
                                              className="w-6/12 px-6 py-3 text-sm text-gray-500 relative"
                                            >
                                              <div
                                                id="hover-description"
                                                title={group.desc}
                                              >
                                                <p className="truncate">
                                                  {group.desc
                                                    ? group.desc
                                                    : "-"}
                                                </p>
                                              </div>
                                            </td>

                                            <td className="w-4/10 px-6 py-3 mx-4 text-center whitespace-nowrap text-sm text-gray-900">
                                              <Menu
                                                as="div"
                                                className="inline-block"
                                              >
                                                <Menu.Button
                                                  onClick={this.onActionClick}
                                                >
                                                  <span className="sr-only">
                                                    Open options
                                                  </span>
                                                  <Icon
                                                    name="horizontal-dots"
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </Menu.Button>
                                                {this.state.showBackDrop && (
                                                  <div
                                                    className="fixed top-0 left-0 z-10 w-full h-screen"
                                                    onClick={
                                                      this.onDropdownClick
                                                    }
                                                  ></div>
                                                )}

                                                <Transition
                                                  as={Fragment}
                                                  enter="transition ease-out duration-100"
                                                  enterFrom="transform opacity-0 scale-95"
                                                  enterTo="transform opacity-100 scale-100"
                                                  leave="transition ease-in duration-75"
                                                  leaveFrom="transform opacity-100 scale-100"
                                                  leaveTo="transform opacity-0 scale-95"
                                                >
                                                  <div
                                                    style={{
                                                      position: "fixed",
                                                      zIndex: 100,
                                                      top: `${this.state.posY}px`,
                                                      left: `${
                                                        this.state.posX - 230
                                                      }px`,
                                                      margin: "0.5rem",
                                                    }}
                                                  >
                                                    <Menu.Items className="overscroll-none mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                      <div className="py-1">
                                                        <Menu.Item>
                                                          <button
                                                            type="button"
                                                            className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                                                            onClick={() =>
                                                              this.deleteContentFromTable(
                                                                "clientGroup",
                                                                index
                                                              )
                                                            }
                                                          >
                                                            <Icon
                                                              name="delete"
                                                              className="h-5 w-5 mr-2"
                                                            />
                                                            <span>Delete</span>
                                                          </button>
                                                        </Menu.Item>
                                                      </div>
                                                    </Menu.Items>
                                                  </div>
                                                </Transition>
                                              </Menu>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  )}
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Custom Fields Details */}

                  <div>
                    {this.state.tab === "custom" && (
                      <>
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Custom Fields Details
                          </h3>
                          <button
                            type="button"
                            className="my-3 inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                            onClick={() => this.openModal("customField")}
                          >
                            <Icon name="add" className="h-3.5 w-3.5 mr-1" />
                            Add Custom Field
                          </button>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                          {this.state.customFields.map(
                            (field: any, index: any) => {
                              return (
                                <div
                                  key={field.customFieldId}
                                  className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
                                >
                                  <label
                                    htmlFor={field.customFieldId}
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                  >
                                    {field.customFieldName}
                                  </label>
                                  {field.customFieldType === "date" && (
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                      <input
                                        type="date"
                                        name={field.customFieldId}
                                        id={field.customFieldName}
                                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                        value={field.stringValue}
                                        onChange={this.updateCustomField(
                                          field.customFieldId
                                        )}
                                      />
                                    </div>
                                  )}

                                  {field.customFieldType === "shorttext" && (
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                      <input
                                        type="text"
                                        name={field.customFieldId}
                                        id={field.customFieldName}
                                        autoComplete="given-name"
                                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                        value={field.stringValue}
                                        onChange={this.updateCustomField(
                                          field.customFieldId
                                        )}
                                      />
                                    </div>
                                  )}

                                  {field.customFieldType === "longtext" && (
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                      <textarea
                                        name={field.customFieldId}
                                        id={field.customFieldName}
                                        rows={4}
                                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={field.stringValue}
                                        onChange={this.updateCustomField(
                                          field.customFieldId
                                        )}
                                      />
                                    </div>
                                  )}

                                  {field.customFieldType === "boolean" && (
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                      <fieldset className="mt-2">
                                        <legend className="sr-only">
                                          {" "}
                                          Registration Type
                                        </legend>
                                        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
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
                                              checked={
                                                field.stringValue === "No"
                                              }
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
                                      </fieldset>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:justify-end">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                    onClick={this.cancelHandler}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={this.state.logging}
                    className={
                      "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                    }
                    onClick={this.editClient}
                  >
                    <span className="w-full flex justify-end">
                      {this.state.logging ? (
                        <Icon name="loading" className="mr-2" />
                      ) : null}
                    </span>
                    <span>Update</span>
                    <span className="w-full"></span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Dashboard>
    );
  }
}

export default compose(
  connector,
  withRouter
)(EditClient) as React.ComponentType;
