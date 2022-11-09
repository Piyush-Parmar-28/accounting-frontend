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
      Authorization: `Bearer ${token}`
    }
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
      .then(responseBody)

  // delete: (url: string) =>
  // axios.delete(url, getHeader()).then(responseBody)
};

const Agency = {
  Client: {
    list: () => requests.get("/gsts")
  }
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
    requests.post("/auth/verify/reset/token", { token, password })
};

const Firm = {
  getFirms: () => requests.get("/workspace/list"),
  addFirm: (name: string) => requests.post("/workspace/add", { name }),
  editFirm: (workSpaceId: string, name: string) => requests.patch("/workspace/updatename", { workSpaceId, name }),
  makeFirmInactive: (workSpaceId: string) => requests.patch("/workspace/inactive", { workSpaceId }),
  makeFirmActive: (workSpaceId: string) => requests.patch("/workspace/active", { workSpaceId }),
  listofInvitationSent: (workSpaceId: string) => requests.get(`/workspace/listofinvitationsent?workSpaceId=${workSpaceId}`, { workSpaceId }),
  listofInvitationReceived: (workSpaceId: string) => requests.get(`/workspace/listofinvitationreceived?workSpaceId=${workSpaceId}`, { workSpaceId }),
  leaveFirm: (workSpaceId: string) => requests.post("/workspace/leaveworkspace", { workSpaceId }),
  revokeInvitation: (workSpaceId: string, invitationId: string) => requests.post("/workspace/revokeinvitation", { workSpaceId, invitationId }),
  rejectInvitation: (workSpaceId: string, invitationId: string) => requests.post("/workspace/rejecttinvitation", { workSpaceId, invitationId }),
  acceptInvitation: (workSpaceId: string, invitationId: string) => requests.post("/workspace/acceptinvitation", { workSpaceId, invitationId }),
  addUser: (workSpaceId: string, userEmail: string) => requests.post("/workspace/adduser", { workSpaceId, userEmail }),
  deleteFirm: (workSpaceId: string) => requests.delete(`/workspace/delete?workSpaceId=${workSpaceId}`, {}),
};

const Tag = {
  getTagList: (workSpaceId: string, active: boolean, searchText: string) =>
    requests.get(
      `/tag/list?workSpaceId=${workSpaceId}&active=${active}&searchText=${searchText}`
    ),
  addTag: (name: string, description: string, workSpaceId: string) =>
    requests.post("/tag/add", { name, description, workSpaceId }),
  editTag: (
    name: string,
    description: string,
    tagId: string,
    workSpaceId: string
  ) => requests.put("/tag/edittag", { name, description, tagId, workSpaceId }),
  makeTagInactive: (id: string, workSpaceId: string) =>
    requests.put("/tag/inactive", { id, workSpaceId }),
  makeTagActive: (id: string, workSpaceId: string) =>
    requests.put("/tag/active", { id, workSpaceId }),
  deleteTag: (id: string, workSpaceId: string) =>
    requests.delete("/tag/delete", { id, workSpaceId })
};

const Status = {
  getStatusList: (workSpaceId: string, active: boolean, searchText: string) =>
    requests.get(
      `/status/list?workSpaceId=${workSpaceId}&active=${active}&skip=0&limit=10&searchText=${searchText}`
    ),
  addStatus: (
    name: string,
    color: string,
    description: string,
    workSpaceId: string,
    tasks: string[]
  ) =>
    requests.post("/status/add", {
      name,
      color,
      description,
      workSpaceId,
      tasks
    }),
  editStatus: (
    statusId: string,
    name: string,
    color: string,
    description: string,
    workSpaceId: string,
    tasks: string[]
  ) =>
    requests.put("/status/edit", {
      statusId,
      name,
      color,
      description,
      workSpaceId,
      tasks
    }),
  makeStatusInactive: (id: string, workSpaceId: string) =>
    requests.put("/status/inactive", { id, workSpaceId }),
  makeStatusActive: (id: string, workSpaceId: string) =>
    requests.put("/status/active", { id, workSpaceId }),
  statusTaskList: (workSpaceId: string) =>
    requests.get(`/status/listoftaskforstatus?workSpaceId=${workSpaceId}`),
  deleteStatus: (id: string, workSpaceId: string) =>
    requests.delete("/status/delete", { id, workSpaceId })
};

const User = {
  getUserList: (workSpaceId: string, active: boolean, searchText: string) =>
    requests.get(`/user/list?workSpaceId=${workSpaceId}&active=${active}&searchText=${searchText}`),
  addUser: (
    workSpaceId: string,
    email: string,
    role: string,
    userRightsList: any
  ) =>
    requests.post("workspace/adduser", {
      workSpaceId,
      email,
      role,
      userRightsList
    }),
    
  editUser: (
    workSpaceId: string,
    email: string,
    role: string,
    userRightsList: any
  ) =>
    requests.post("workspace/edituser", {
      workSpaceId,
      email,
      role,
      userRightsList
    }),
  getUserRights: (workSpaceId: string, userId?: string) => requests.get(`/user/rights?workSpaceId=${workSpaceId}${userId ? `&userId=${userId}`: "" }`),
  makeUserInactive: (workSpaceId: string, userId: string) => requests.patch("/user/inactive", { workSpaceId, userId }),
  makeUserActive: (workSpaceId: string, userId: string) => requests.patch("/user/active", { workSpaceId, userId }),
  removeUser: (workSpaceId: string, userId: string) => requests.post("/workspace/removeuser", { workSpaceId, userId }),
};

const ContactPerson = {
  getPersonList: (workSpaceId: string, active: boolean, searchText: string) =>
    requests.get(
      `/contactperson/list?workSpaceId=${workSpaceId}&active=${active}&skip=0&limit=10&searchText=${searchText}`
    ),
  addPerson: (
    workSpaceId: string,
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
    }),
  editPerson: (
    contactPersonId: string,
    workSpaceId: string,
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
      dateOfAnniversary
    }),
  makePersonActive: (contactPersonId: string, workSpaceId: string) =>
    requests.put("/contactperson/active", { contactPersonId, workSpaceId }),
  makePersonInactive: (contactPersonId: string, workSpaceId: string) =>
    requests.put("/contactperson/inactive", { contactPersonId, workSpaceId }),
  deletePersonField: (contactPersonId: string, workSpaceId: string) =>
    requests.delete(
      `/contactperson/delete?contactPersonId=${contactPersonId}&workSpaceId=${workSpaceId}`,
      {}
    ),
  getPinCodeData: (pincode: string) => requests.get(`/pincode/${pincode}`)
};

const CustomField = {
  getCustomFieldList: (workSpaceId: string, active: boolean, searchText: string, limit: number, skip: number) =>
    requests.get(
      `customfields/list?workSpaceId=${workSpaceId}&active=${active}&limit=${limit}&skip=${skip}&searchText=${searchText}`
    ),
  addCustomField: (
    name: string,
    description: string,
    type: string,
    applicableFor: string,
    workSpaceId: string
  ) =>
    requests.post("/customfields/add", {
      name,
      description,
      type,
      applicableFor,
      workSpaceId
    }),
  editCustomField: (
    customFieldId: string,
    name: string,
    description: string,
    type: string,
    applicableFor: string,
    workSpaceId: string
  ) =>
    requests.put("/customfields/edit", {
      customFieldId,
      name,
      description,
      type,
      applicableFor,
      workSpaceId
    }),
  makeCustomFieldInactive: (customFieldId: string, workSpaceId: string) =>
    requests.put("/customfields/inactive", { customFieldId, workSpaceId }),
  makeCustomFieldActive: (customFieldId: string, workSpaceId: string) =>
    requests.put("/customfields/active", { customFieldId, workSpaceId }),
  deleteCustomField: (customFieldId: string, workSpaceId: string) =>
    requests.delete("/customfields/delete", { customFieldId, workSpaceId })
};

const ClientGroups = {
  getClientGroupList: (workSpaceId: string, active: boolean, searchText: string) =>
    requests.get(`/group/list?workSpaceId=${workSpaceId}&active=${active}&searchText=${searchText}`),
  addClientGroup: (name: string, description: string, workSpaceId: string) =>
    requests.post("/group/add", { name, description, workSpaceId }),
  editClientGroup: (
    name: string,
    description: string,
    id: string,
    workSpaceId: string
  ) => requests.post("/group/edit", { id, name, description, workSpaceId }),
  makeClientGroupInactive: (workSpaceId: string, groupId: string) =>
    requests.post("/group/inactive", { workSpaceId, groupId }),
  makeClientGroupActive: (workSpaceId: string, groupId: string) =>
    requests.post("/group/active", { workSpaceId, groupId }),
  deleteClientGroup: (workSpaceId: string, groupId: string) =>
    requests.delete("/group/delete", { workSpaceId, groupId }),
  getParticularGroup: (groupId: string) => requests.get(`/group/${groupId}`)
};

const Clients = {
  getClientList: (
    workSpaceId: string,
    skip: number,
    limit: number,
    searchText: string,
    active: boolean
  ) => requests.post(`/client/list`, { workSpaceId, skip, limit, searchText, active }),
  getQRMPDetails: (workSpaceId: string, gstin: string) => requests.post("/qrmp/qrmp", { workSpaceId, gstin }),
  addClient: (workSpaceId:string, data:any) => requests.post("/client/add", {workSpaceId, ...data}),
  editClient: (workSpaceId:string, data:any, clientId: string) => requests.post("/client/edit", {workSpaceId, clientId, ...data}),
  makeClientInactive: (workSpaceId: string, clientId: string) => requests.post("/client/inactive", { workSpaceId, clientId }),
  makeClientActive: (workSpaceId: string, clientId: string) => requests.post("/client/active", { workSpaceId, clientId }),
  deleteClient: (workSpaceId: string, clientId: string) => requests.post("/client/delete", { workSpaceId, clientId }),
};

const Gst = {
  addGst: (gstin: string) => requests.post("/gsts", { gstin }),
  getAll: () => requests.get("/gsts"),
  getGst: (gstin: string) => requests.get(`/gsts/${gstin}`),
  changeName: (body: { id: string; name: string }) =>
    requests.put("/gsts/changeName", body)
};

const Sales = {
  import: (file: any) => requests.post("/sales/import", file),
  startImport: (importRequest: string) =>
    requests.post("/sales/import/start", { importRequest }),
  getImportRequests: (gstId: string, year: string, month: string) =>
    requests.get(
      `/sales/import/requests?gstId=${gstId}&year=${year}&month=${month}`
    ),
  deleteImportData: (importRequest: string) =>
    requests.delete(`/sales/import/deleteFile?importRequest=${importRequest}`),
  getSummary: (month: string, year: string, gstId: string) =>
    requests.get(`/sales/summary?month=${month}&year=${year}&gstId=${gstId}`),
  deleteTransaction: (id: string) => requests.delete(`/sales/${id}`),
  getTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string
  ) =>
    requests.get(
      `/sales/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${encodeURI(
        "Sales"
      )}`
    ),
  getSpecificTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    platform: string
  ) =>
    requests.get(
      `/sales/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&platform=${platform}&transactionType=${encodeURI(
        "Sales"
      )}`
    ),
  getReturnTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string
  ) =>
    requests.get(
      `/sales/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${encodeURI(
        "Sales Return"
      )}`
    ),
  getSpecificReturnTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    platform: string
  ) =>
    requests.get(
      `/sales/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&platform=${platform}&transactionType=${encodeURI(
        "Sales Return"
      )}`
    ),
  exportSalesTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    transactionType: string
  ) =>
    requests.getBlob(
      `/sales/gst/downloadTransaction?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${transactionType}
      `,
      {
        responseType: "blob"
      }
    ),
  exportSpecificSalesTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    platform: string,
    transactionType: string
  ) =>
    requests.getBlob(
      `/sales/gst/downloadTransaction?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${transactionType}&platform=${platform}
    `,
      {
        responseType: "blob"
      }
    )
};

const Purchase = {
  import: (file: any) => requests.post("/purchase/import", file),
  startImport: (importRequest: string) =>
    requests.post("/purchase/import/start", { importRequest }),
  getImportRequests: (gstId: string, year: string, month: string) =>
    requests.get(
      `/purchase/import/requests?gstId=${gstId}&year=${year}&month=${month}`
    ),
  deleteImportData: (importRequest: string) =>
    requests.delete(
      `/purchase/import/deleteFile?importRequest=${importRequest}`
    ),
  getSummary: (month: string, year: string, gstId: string) =>
    requests.get(
      `/purchase/summary?month=${month}&year=${year}&gstId=${gstId}`
    ),
  getTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string
  ) =>
    requests.get(
      `/purchase/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=Purchase`
    ),
  getSpecificTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    platform: string
  ) =>
    requests.get(
      `/purchase/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=Purchase&platform=${platform}`
    ),
  deleteTransaction: (id: string) => requests.delete(`/purchase/${id}`),
  getReturnTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string
  ) =>
    requests.get(
      `/purchase/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${encodeURI(
        "Purchase Return"
      )}`
    ),
  getSpecificReturnTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    platform: string
  ) =>
    requests.get(
      `/purchase/gst?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${encodeURI(
        "Purchase Return"
      )}&platform=${platform}`
    ),
  exportPurchaseTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    transactionType: string
  ) =>
    requests.getBlob(
      `/purchase/gst/downloadTransaction?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${transactionType}
    `,
      {
        responseType: "blob"
      }
    ),
  exportSpecificPurchaseTransactions: (
    month: string,
    year: string,
    skip: string,
    limit: string,
    gstId: string,
    platform: string,
    transactionType: string
  ) =>
    requests.getBlob(
      `/purchase/gst/downloadTransaction?month=${month}&year=${year}&skip=${skip}&limit=${limit}&gstId=${gstId}&transactionType=${transactionType}&platform=${platform}
  `,
      {
        responseType: "blob"
      }
    )
};

const Returns = {
  iffData: (month: string, year: string, gstId: string) =>
    requests.get(`/sales/iff?month=${month}&year=${year}&gstId=${gstId}`),
  iffJson: (month: string, year: string, gstId: string) =>
    requests.get(`/sales/iffJson?month=${month}&year=${year}&gstId=${gstId}`),
  gstr1Data: (month: string, year: string, gstId: string) =>
    requests.get(`/sales/gstr1?month=${month}&year=${year}&gstId=${gstId}`),
  gstr1Json: (month: string, year: string, gstId: string) =>
    requests.get(`/sales/gstr1Json?month=${month}&year=${year}&gstId=${gstId}`),
  gstr3bData: (month: string, year: string, gstId: string) =>
    requests.get(`/sales/gstr3b?month=${month}&year=${year}&gstId=${gstId}`),
  gstr3bJson: (month: string, year: string, gstId: string) =>
    requests.get(
      `/sales/gstr3bjson?month=${month}&year=${year}&gstId=${gstId}`
    ),
  gstr2import: (file: any) => requests.post("/gstr2/import", file),
  startGstr2Import: (importRequest: string) =>
    requests.post("/gstr2/import/start", { importRequest }),
  getGstr2ImportRequests: (gstId: string, year: string, month: string) =>
    requests.get(
      `gstr2/import/requests?gstId=${gstId}&year=${year}&month=${month}`
    ),
  gstr2distinctTypes: (month: string, year: string, gstId: string) =>
    requests.get(
      `gstr2/distinctTypes?month=${month}&year=${year}&gstId=${gstId}`
    ),
  gstr2Data: (
    month: string,
    year: string,
    gstId: string,
    skip: string,
    limit: string,
    platform: string,
    type: string
  ) =>
    requests.get(
      `gstr2/transactions?month=${month}&year=${year}&gstId=${gstId}&skip=${skip}&limit=${limit}&platform=${platform}&type=${type}`
    ),
  getGstr2Summary: (month: string, year: string, gstId: string) =>
    requests.get(`/gstr2/summary?month=${month}&year=${year}&gstId=${gstId}`),
  bulkCopy: (
    month: string,
    year: string,
    gstId: string,
    platforms: [],
    types: []
  ) =>
    requests.put(
      `/gstr2/bulkCopyTransaction?gstId=${gstId}&month=${month}&year=${year}`,
      { gstId, month, year, platforms, types }
    ),
  copyToPurchase: (id: string, copied: boolean) =>
    requests.put(`gstr2/${id}/copied`, { copied }),
  itcClaimCount: (gstId: string, month: string, year: string) =>
    requests.get(
      `/purchase/getNoOfTransactions?gstId=${gstId}&month=${month}&year=${year}`
    ),
  get2APurchases: (
    gstId: string,
    month: string,
    year: string,
    transactionType: string,
    skip?: string,
    limit?: string
  ) =>
    requests.get(
      `/purchase/2aTransaction?gstId=${gstId}&month=${month}&year=${year}&transactionType=${transactionType}&skip=${skip}&limit=${limit}`
    ),
  get2BPurchases: (
    gstId: string,
    month: string,
    year: string,
    transactionType: string,
    skip?: string,
    limit?: string
  ) =>
    requests.get(
      `/purchase/2bTransaction?gstId=${gstId}&month=${month}&year=${year}&transactionType=${transactionType}&skip=${skip}&limit=${limit}`
    ),
  getUnclaimedPurchases: (
    gstId: string,
    month: string,
    year: string,
    transactionType: string,
    skip?: string,
    limit?: string
  ) =>
    requests.get(
      `/purchase/normalTransactions?gstId=${gstId}&month=${month}&year=${year}&transactionType=${transactionType}&skip=${skip}&limit=${limit}`
    ),
  claimItc: (
    purchaseId: string,
    claim: boolean,
    month: string,
    year: string,
    removeItcFields: boolean
  ) =>
    requests.put(`/purchase/${purchaseId}/claimItc`, {
      claim,
      month,
      year,
      removeItcFields
    })
};

// Requests for todos

const Todo = {
  addList: (list: any) => requests.post("/todo/addtodolist", list),
  getAllTodoOfList: (workSpaceId: string, toDoListId: string, todoStatus: string, searchText:string) =>
    requests.get(`/todo/todo?workSpaceId=${workSpaceId}&toDoListId=${toDoListId}&status=${todoStatus}&searchText=${searchText}`),
  todoSpecificCases: (workSpaceId: string, type: string, todoStatus: string, searchText:string) =>
    requests.get(`/todo/todospecificcases?workSpaceId=${workSpaceId}&status=${todoStatus}&type=${type}&searchText=${searchText}`),
  count: (workSpaceId: string) => requests.get(`/todo/counttodospecificcases?workSpaceId=${workSpaceId}`),
  getAllTodoListOfUser: (workSpaceId: string) => requests.get(`/todo/todolist?workSpaceId=${workSpaceId}`),
  create: (todo: any) => requests.post("/todo/addtodo", todo),
  markAsComplete: (todo: any) =>
    requests.post(`/todo/marktodocompleted`, todo),
  markPending: (todo: any) =>
    requests.post(`/todo/marktodopending`, todo),
  edit:(todo: any) => requests.post("/todo/edittodo", todo),
  delete: (todo: any) => requests.post(`/todo/deletetodo`, todo),
  addUserToTodoList: (user:any) => requests.post(`/todo/addusertodolist`,user),
  todoListRename: (list:any) => requests.post(`/todo/todolistchangename`,list),
  deleteList: (workSpaceId: string, toDoListId: string) => requests.post(`/todo/deletetodolist`,{workSpaceId, toDoListId}),
  reorder: (workSpaceId:string,toDoId: string,
  order: number) => requests.post(`/todo/reordertodo`, {
  workSpaceId,toDoId,order}),
};

let agent = {
  setToken: (_token: string | undefined) => (token = _token),
  Agency,
  Auth,
  Firm,
  Tag,
  Status,
  User,
  ContactPerson,
  CustomField,
  ClientGroups,
  Clients,
  Gst,
  Sales,
  Purchase,
  Returns,
  Todo
};

export default agent;
