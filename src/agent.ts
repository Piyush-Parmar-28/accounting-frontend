import axios from "axios";
import config from "./config";

axios.defaults.baseURL = config.baseURL;

let token: string | undefined;

const responseBody = (res: any) => res.data;

const getHeader = () => {
  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const requests: any = {
  get: (url: string) => axios.get(url, getHeader()).then(responseBody),
  getBlob: (url: string, options: any) =>
    axios.get(url, { ...options, ...getHeader() }),
  post: (url: string, body: any) =>
    axios.post(url, body, getHeader()).then(responseBody),
  put: (url: string, body: any) =>
    axios.put(url, body, getHeader()).then(responseBody),
  patch: (url: string, body: any) =>
    axios.patch(url, body, getHeader()).then(responseBody),
  delete: (url: string, body: any) =>
    axios
      .delete(url, { headers: getHeader().headers, data: body })
      .then(responseBody),

  // delete: (url: string) =>
  // axios.delete(url, getHeader()).then(responseBody)
};

const Agency = {
  Client: {
    list: () => requests.get("/gsts"),
  },
};

const Auth = {
  //Login
  login: (username: string, password: string) =>
    requests.post("/auth/login", { username, password }),
  //Signup
  signup: (
    name: string,
    email: string,
    password: string,
    mobileNumber: number
  ) => requests.post("/auth/signup", { name, email, password, mobileNumber }),
  verifySignupOTP: (userId: string, otp: number) =>
    requests.post("/auth/verify/signup/otp", { userId, otp }),
  verifySignupToken: (token: string) =>
    requests.post("/auth/verify/signup/token", { token }),
  //Forgot Password
  forgotPassword: (email: string) =>
    requests.post("/auth/forgotPassword", { email }),
  verifyResetOtp: (userId: string, otp: number, password: string) =>
    requests.post("/auth/verify/reset/otp", { userId, otp, password }),
  verifyResetToken: (token: string, password: string) =>
    requests.post("/auth/verify/reset/token", { token, password }),
};

const Organisation = {
  getOrganisations: () => requests.get("/organisation/list"),
  addOrganisation: (
    name: string,
    gstin: string,
    gstRegistered: boolean,
    gstRegType: string,
    startingYear: string,
    gstRegistrationStatus: string,
    manageInventory: boolean,
    billingAddress: string,
    mainlyDealsIn: string
  ) =>
    requests.post("/organisation/add", {
      name,
      gstin,
      gstRegistered,
      gstRegType,
      startingYear,
      gstRegistrationStatus,
      manageInventory,
      billingAddress,
      mainlyDealsIn,
    }),
  editOrganisation: (organisationId: string, name: string) =>
    requests.patch("/organisation/updatename", { organisationId, name }),
  makeOrganisationInactive: (organisationId: string) =>
    requests.patch("/organisation/inactive", { organisationId }),
  makeOrganisationActive: (organisationId: string) =>
    requests.patch("/organisation/active", { organisationId }),
  listofInvitationSent: (organisationId: string) =>
    requests.get(
      `/organisation/listofinvitationsent?organisationId=${organisationId}`,
      {
        organisationId,
      }
    ),
  listofInvitationReceived: (organisationId: string) =>
    requests.get(
      `/organisation/listofinvitationreceived?organisationId=${organisationId}`,
      { organisationId }
    ),
  leaveOrganisation: (organisationId: string) =>
    requests.post("/organisation/leaveorganisation", { organisationId }),
  revokeInvitation: (organisationId: string, invitationId: string) =>
    requests.post("/organisation/revokeinvitation", {
      organisationId,
      invitationId,
    }),
  rejectInvitation: (organisationId: string, invitationId: string) =>
    requests.post("/organisation/rejecttinvitation", {
      organisationId,
      invitationId,
    }),
  acceptInvitation: (organisationId: string, invitationId: string) =>
    requests.post("/organisation/acceptinvitation", {
      organisationId,
      invitationId,
    }),
  addUser: (organisationId: string, userEmail: string) =>
    requests.post("/organisation/adduser", { organisationId, userEmail }),
  deleteOrganisation: (organisationId: string) =>
    requests.delete(
      `/organisation/delete?organisationId=${organisationId}`,
      {}
    ),
};

const Tag = {
  getTagList: (organisationId: string, active: boolean, searchText: string) =>
    requests.get(
      `/tag/list?organisationId=${organisationId}&active=${active}&searchText=${searchText}`
    ),
  addTag: (name: string, description: string, organisationId: string) =>
    requests.post("/tag/add", { name, description, organisationId }),
  editTag: (
    name: string,
    description: string,
    tagId: string,
    organisationId: string
  ) =>
    requests.put("/tag/edittag", { name, description, tagId, organisationId }),
  makeTagInactive: (id: string, organisationId: string) =>
    requests.put("/tag/inactive", { id, organisationId }),
  makeTagActive: (id: string, organisationId: string) =>
    requests.put("/tag/active", { id, organisationId }),
  deleteTag: (id: string, organisationId: string) =>
    requests.delete("/tag/delete", { id, organisationId }),
};

const Status = {
  getStatusList: (
    organisationId: string,
    active: boolean,
    searchText: string
  ) =>
    requests.get(
      `/status/list?organisationId=${organisationId}&active=${active}&skip=0&limit=10&searchText=${searchText}`
    ),
  addStatus: (
    name: string,
    color: string,
    description: string,
    organisationId: string,
    tasks: string[]
  ) =>
    requests.post("/status/add", {
      name,
      color,
      description,
      organisationId,
      tasks,
    }),
  editStatus: (
    statusId: string,
    name: string,
    color: string,
    description: string,
    organisationId: string,
    tasks: string[]
  ) =>
    requests.put("/status/edit", {
      statusId,
      name,
      color,
      description,
      organisationId,
      tasks,
    }),
  makeStatusInactive: (id: string, organisationId: string) =>
    requests.put("/status/inactive", { id, organisationId }),
  makeStatusActive: (id: string, organisationId: string) =>
    requests.put("/status/active", { id, organisationId }),
  statusTaskList: (organisationId: string) =>
    requests.get(
      `/status/listoftaskforstatus?organisationId=${organisationId}`
    ),
  deleteStatus: (id: string, organisationId: string) =>
    requests.delete("/status/delete", { id, organisationId }),
};

const Account = {
  getAccountList: (
    organisationId: string,
    active: boolean,
    searchText: string
  ) =>
    requests.get(
      `/account/accountslist?organisationId=${organisationId}&active=${active}&skip=0&limit=10&searchText=${searchText}`
    ),
  addAccount: (
    name: string,
    nature: string,
    openingBalance: number,
    openingBalanceType: string,
    organisationId: string,
    gstin: string,
    gstRate: number,
    billingAddress: string,
    shippingAddress: string,
    mobileNo: string,
    email: string,
    pan: string,
    tan: string
  ) =>
    requests.post("/account/add", {
      name,
      nature,
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
      tan,
    }),
  editStatus: (
    statusId: string,
    name: string,
    color: string,
    description: string,
    organisationId: string,
    tasks: string[]
  ) =>
    requests.put("/status/edit", {
      statusId,
      name,
      color,
      description,
      organisationId,
      tasks,
    }),
  makeStatusInactive: (id: string, organisationId: string) =>
    requests.put("/status/inactive", { id, organisationId }),
  makeStatusActive: (id: string, organisationId: string) =>
    requests.put("/status/active", { id, organisationId }),
  accountTaskList: (organisationId: string) =>
    requests.get(
      `/status/listoftaskforstatus?organisationId=${organisationId}`
    ),
  deleteStatus: (id: string, organisationId: string) =>
    requests.delete("/status/delete", { id, organisationId }),
};

const User = {
  getUserList: (organisationId: string, active: boolean, searchText: string) =>
    requests.get(
      `/user/list?organisationId=${organisationId}&active=${active}&searchText=${searchText}`
    ),
  addUser: (
    organisationId: string,
    email: string,
    role: string,
    userRightsList: any
  ) =>
    requests.post("organisation/adduser", {
      organisationId,
      email,
      role,
      userRightsList,
    }),

  editUser: (
    organisationId: string,
    email: string,
    role: string,
    userRightsList: any
  ) =>
    requests.post("organisation/edituser", {
      organisationId,
      email,
      role,
      userRightsList,
    }),
  getUserRights: (organisationId: string, userId?: string) =>
    requests.get(
      `/user/rights?organisationId=${organisationId}${
        userId ? `&userId=${userId}` : ""
      }`
    ),
  makeUserInactive: (organisationId: string, userId: string) =>
    requests.patch("/user/inactive", { organisationId, userId }),
  makeUserActive: (organisationId: string, userId: string) =>
    requests.patch("/user/active", { organisationId, userId }),
  removeUser: (organisationId: string, userId: string) =>
    requests.post("/organisation/removeuser", { organisationId, userId }),
};

const ContactPerson = {
  getPersonList: (
    organisationId: string,
    active: boolean,
    searchText: string
  ) =>
    requests.get(
      `/contactperson/list?organisationId=${organisationId}&active=${active}&skip=0&limit=10&searchText=${searchText}`
    ),
  addPerson: (
    organisationId: string,
    name: string,
    email: any,
    mobile: any,
    dscPassword: string,
    addressLine1: string,
    addressLine2: string,
    pincode: string,
    city: string,
    state: string,
    customFields: any,
    dscExpiryDate: string,
    dateOfBirth: string,
    dateOfAnniversary: string,
    pan: string
  ) =>
    requests.post("/contactperson/add", {
      organisationId,
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
      pan,
    }),
  editPerson: (
    contactPersonId: string,
    organisationId: string,
    name: string,
    email: any,
    mobile: any,
    dscPassword: string,
    addressLine1: string,
    addressLine2: string,
    pincode: string,
    city: string,
    state: string,
    customFields: any,
    dscExpiryDate: string,
    dateOfBirth: string,
    dateOfAnniversary: string
  ) =>
    requests.put("/contactperson/edit", {
      contactPersonId,
      organisationId,
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
    }),
  makePersonActive: (contactPersonId: string, organisationId: string) =>
    requests.put("/contactperson/active", { contactPersonId, organisationId }),
  makePersonInactive: (contactPersonId: string, organisationId: string) =>
    requests.put("/contactperson/inactive", {
      contactPersonId,
      organisationId,
    }),
  deletePersonField: (contactPersonId: string, organisationId: string) =>
    requests.delete(
      `/contactperson/delete?contactPersonId=${contactPersonId}&organisationId=${organisationId}`,
      {}
    ),
  getPinCodeData: (pincode: string) => requests.get(`/pincode/${pincode}`),
};

const CustomField = {
  getCustomFieldList: (
    organisationId: string,
    active: boolean,
    searchText: string,
    limit: number,
    skip: number
  ) =>
    requests.get(
      `customfields/list?organisationId=${organisationId}&active=${active}&limit=${limit}&skip=${skip}&searchText=${searchText}`
    ),
  addCustomField: (
    name: string,
    description: string,
    type: string,
    applicableFor: string,
    organisationId: string
  ) =>
    requests.post("/customfields/add", {
      name,
      description,
      type,
      applicableFor,
      organisationId,
    }),
  editCustomField: (
    customFieldId: string,
    name: string,
    description: string,
    type: string,
    applicableFor: string,
    organisationId: string
  ) =>
    requests.put("/customfields/edit", {
      customFieldId,
      name,
      description,
      type,
      applicableFor,
      organisationId,
    }),
  makeCustomFieldInactive: (customFieldId: string, organisationId: string) =>
    requests.put("/customfields/inactive", { customFieldId, organisationId }),
  makeCustomFieldActive: (customFieldId: string, organisationId: string) =>
    requests.put("/customfields/active", { customFieldId, organisationId }),
  deleteCustomField: (customFieldId: string, organisationId: string) =>
    requests.delete("/customfields/delete", { customFieldId, organisationId }),
};

const ClientGroups = {
  getClientGroupList: (
    organisationId: string,
    active: boolean,
    searchText: string
  ) =>
    requests.get(
      `/group/list?organisationId=${organisationId}&active=${active}&searchText=${searchText}`
    ),
  addClientGroup: (name: string, description: string, organisationId: string) =>
    requests.post("/group/add", { name, description, organisationId }),
  editClientGroup: (
    name: string,
    description: string,
    id: string,
    organisationId: string
  ) => requests.post("/group/edit", { id, name, description, organisationId }),
  makeClientGroupInactive: (organisationId: string, groupId: string) =>
    requests.post("/group/inactive", { organisationId, groupId }),
  makeClientGroupActive: (organisationId: string, groupId: string) =>
    requests.post("/group/active", { organisationId, groupId }),
  deleteClientGroup: (organisationId: string, groupId: string) =>
    requests.delete("/group/delete", { organisationId, groupId }),
  getParticularGroup: (groupId: string) => requests.get(`/group/${groupId}`),
};

const Clients = {
  getClientList: (
    organisationId: string,
    skip: number,
    limit: number,
    searchText: string,
    active: boolean
  ) =>
    requests.post(`/client/list`, {
      organisationId,
      skip,
      limit,
      searchText,
      active,
    }),
  getQRMPDetails: (organisationId: string, gstin: string) =>
    requests.post("/qrmp/qrmp", { organisationId, gstin }),
  addClient: (organisationId: string, data: any) =>
    requests.post("/client/add", { organisationId, ...data }),
  editClient: (organisationId: string, data: any, clientId: string) =>
    requests.post("/client/edit", { organisationId, clientId, ...data }),
  makeClientInactive: (organisationId: string, clientId: string) =>
    requests.post("/client/inactive", { organisationId, clientId }),
  makeClientActive: (organisationId: string, clientId: string) =>
    requests.post("/client/active", { organisationId, clientId }),
  deleteClient: (organisationId: string, clientId: string) =>
    requests.post("/client/delete", { organisationId, clientId }),
};

const Gst = {
  addGst: (gstin: string) => requests.post("/gsts", { gstin }),
  getAll: () => requests.get("/gsts"),
  getGst: (gstin: string) => requests.get(`/gst/?gstin=${gstin}`),
  changeName: (body: { id: string; name: string }) =>
    requests.put("/gsts/changeName", body),
};

// Requests for todos

const Todo = {
  addList: (list: any) => requests.post("/todo/addtodolist", list),
  getAllTodoOfList: (
    organisationId: string,
    toDoListId: string,
    todoStatus: string,
    searchText: string
  ) =>
    requests.get(
      `/todo/todo?organisationId=${organisationId}&toDoListId=${toDoListId}&status=${todoStatus}&searchText=${searchText}`
    ),
  todoSpecificCases: (
    organisationId: string,
    type: string,
    todoStatus: string,
    searchText: string
  ) =>
    requests.get(
      `/todo/todospecificcases?organisationId=${organisationId}&status=${todoStatus}&type=${type}&searchText=${searchText}`
    ),
  count: (organisationId: string) =>
    requests.get(
      `/todo/counttodospecificcases?organisationId=${organisationId}`
    ),
  getAllTodoListOfUser: (organisationId: string) =>
    requests.get(`/todo/todolist?organisationId=${organisationId}`),
  create: (todo: any) => requests.post("/todo/addtodo", todo),
  markAsComplete: (todo: any) => requests.post(`/todo/marktodocompleted`, todo),
  markPending: (todo: any) => requests.post(`/todo/marktodopending`, todo),
  edit: (todo: any) => requests.post("/todo/edittodo", todo),
  delete: (todo: any) => requests.post(`/todo/deletetodo`, todo),
  addUserToTodoList: (user: any) =>
    requests.post(`/todo/addusertodolist`, user),
  todoListRename: (list: any) =>
    requests.post(`/todo/todolistchangename`, list),
  deleteList: (organisationId: string, toDoListId: string) =>
    requests.post(`/todo/deletetodolist`, { organisationId, toDoListId }),
  reorder: (organisationId: string, toDoId: string, order: number) =>
    requests.post(`/todo/reordertodo`, {
      organisationId,
      toDoId,
      order,
    }),
};

let agent = {
  setToken: (_token: string | undefined) => (token = _token),
  Agency,
  Auth,
  Organisation,
  Tag,
  Status,
  Account,
  User,
  ContactPerson,
  CustomField,
  ClientGroups,
  Clients,
  Gst,
  Todo,
};

export default agent;
