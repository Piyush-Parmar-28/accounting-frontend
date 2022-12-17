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

function selectedEntryUrl(selectedEntry: any) {
  let selectedEntryUrl = "";
  for (var i = 0; i < selectedEntry.length; i++) {
    selectedEntryUrl += "&entryIds[]=" + selectedEntry[i];
  }
  return selectedEntryUrl;
}

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

const JournalEntry = {
  add: (
    organisationId: string,
    date: string,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/journalentry/add", {
      organisationId,
      date,
      entries,
      narration,
      year,
    }),
  edit: (
    organisationId: string,
    entryId: string,
    date: string,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/journalentry/edit", {
      organisationId,
      entryId,
      date,
      entries,
      narration,
      year,
    }),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/journalentry/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  journalentrylist: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/journalentry/journalentrylist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`
        )
      : requests.getBlob(
          `/journalentry/journalentrylist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/journalentry/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
};

const Account = {
  getAccountList: (
    organisationId: string,
    active: boolean,
    searchText: string,
    nature: string,
    type: string,
    year: string
  ) =>
    requests.get(
      `/account/accountslist?organisationId=${organisationId}&active=${active}&searchText=${searchText}&nature=${nature}&type=${type}&year=${year}`
    ),
  getAccountLog: (organisationId: string, accountId: string) =>
    requests.get(
      `/account/accountslog?organisationId=${organisationId}&accountId=${accountId}`
    ),
  accountnameavailablecheck: (organisationId: string, name: string) =>
    requests.get(
      `/account/accountnameavailablecheck?organisationId=${organisationId}&name=${name}`
    ),
  gstinalreadypresent: (organisationId: string, gstin: string) =>
    requests.get(
      `/account/gstinalreadypresent?organisationId=${organisationId}&gstin=${gstin}`
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
  editAccount: (
    accountId: string,
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
    requests.put("/account/edit", {
      accountId,
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
  makeAccountInactive: (organisationId: string, accountId: string) =>
    requests.put("/account/inactive", { organisationId, accountId }),
  makeAccountActive: (organisationId: string, accountId: string) =>
    requests.put("/account/active", { organisationId, accountId }),
  accountTaskList: (organisationId: string) =>
    requests.get(
      `/account/listoftaskforstatus?organisationId=${organisationId}`
    ),
  delete: (accountId: string, organisationId: string) =>
    requests.delete("/account/delete", { accountId, organisationId }),
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

const Gst = {
  addGst: (gstin: string) => requests.post("/gsts", { gstin }),
  getAll: () => requests.get("/gsts"),
  getGst: (gstin: string) => requests.get(`/gst/?gstin=${gstin}`),
  changeName: (body: { id: string; name: string }) =>
    requests.put("/gsts/changeName", body),
};

let agent = {
  setToken: (_token: string | undefined) => (token = _token),
  Agency,
  Auth,
  Organisation,
  Account,
  User,
  Gst,
  JournalEntry,
};

export default agent;
