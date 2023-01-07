import React from "react";
import {
    Navigate,
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import agent from "./agent";
import Notification from "./components/Notification";

// Page Imports
import GSTs from "./pages/GSTs/Index";
import AddOrganisation from "./pages/GSTs/AddNew";

// Journal Entry Page
import ListJournalEntry from "./pages/Journal/List";
import AddJournalEntry from "./pages/Journal/Add";

//  Account Import
import AccountList from "./pages/Account/Index";

import AddAccount from "./pages/Account/Add";

// User Import
import Users from "./pages/Users/Index";
import AddUser from "./pages/Users/Add";
import EditUser from "./pages/Users/Edit";


import BalanceSheet from './pages/Reports/BalanceSheet';
// Login Import
import Login from "./pages/Login";
// import Settings from "./pages/Settings/Index";
// Sign Up Imports
import Signup from "./pages/Signup";
import SignupOTP from "./pages/Verify/SignupOTP";
import SignupToken from "./pages/Verify/SignupToken";
// Forgot Password Imports
import ForgetPassword from "./pages/ForgetPassword";
import ResetOTP from "./pages/Verify/ResetOTP";
import ResetToken from "./pages/Verify/ResetToken";

// Receipts Import
import AddReceipt from "./pages/Receipts/Add";
import ListReceipt from './pages/Receipts/List'
import Ledger from "./pages/Receipts/Ledger";

// Connect to redux
import { TOKEN_PRESENT, UPDATE_COMMON } from "./store/types";
import { connect, ConnectedProps } from "react-redux";

const mapStateToProps = (state: any) => ({
    ...state.user,
    ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
    updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
    onTokenPresent: (token: string) =>
        dispatch({ type: TOKEN_PRESENT, payload: { token } }),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class App extends React.Component<PropsFromRedux> {
    // Getting Cookies and Set Token from Cookies

    state: {
        loading: boolean;
    };
    constructor(props: any) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    getCookie = (cname: string) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    async componentWillMount() {
        this.setState({ loading: true });
        if (this.getCookie("token")) {
            agent.setToken(this.getCookie("token"));
            await (this.props as any).onTokenPresent("PRESENT");
            this.setState({ loading: false });
        }
        this.setState({ loading: false });
    }

    PrivateRoute = ({ children }: { children: JSX.Element }) => {
        return (this.props as any).isAuthenticated ? children : <Navigate to="/" />;
    };

    PublicRoute = ({ children }: { children: JSX.Element }) => {
        return !(this.props as any).isAuthenticated ? (
            children
        ) : (
            <Navigate to="/organisations" />
        );
    };

    closeModal = (fetchAgain: boolean) => {
        (this.props as any).updateCommon({
            currentModal: { modalName: "", fetchAgain },
        });
    };

    render() {
        return (
            <div>
                <Notification />
                {/* {(this.props as any)?.currentModal?.modalName === "ADD_TAG_MODAL" && (
          <AddTag closeModal={this.closeModal} />
        )} */}
                {(this.props as any)?.currentModal?.modalName ===
                    "ADD_ACCOUNT_MODAL" && (
                        <AddAccount
                            closeModal={this.closeModal}
                            type={(this.props as any)?.currentModal?.type}
                            data={(this.props as any)?.currentModal?.data}
                        />
                    )}

                {!this.state.loading ? (
                    <Router>
                        <Routes>
                            {/* Receipts Add Receipt Page */}
                            <Route
                                path="/:organisationId/:year/receipts/add"
                                element={
                                    <this.PrivateRoute>
                                        <AddReceipt />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* Receipts list showing Page */}
                            <Route
                                path="/:organisationId/:year/receipts/list"
                                element={
                                    <this.PrivateRoute>
                                        <ListReceipt />
                                    </this.PrivateRoute>
                                }
                            />

                            {/* Ledger showing Page */}
                            <Route
                                path="/:organisationId/:year/ledger/:id"
                                element={
                                    <this.PrivateRoute>
                                        <Ledger />
                                    </this.PrivateRoute>
                                }
                            />

                            {/* Edit Receipt Entry */}
                            <Route
                                path="/:organisationId/:year/receipts/edit/:id"
                                element={
                                    <this.PrivateRoute>
                                        <AddReceipt />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* Duplicate Receipt Entry */}
                            <Route
                                path="/:organisationId/:year/receipts/duplicate/:id"
                                element={
                                    <this.PrivateRoute>
                                        <AddReceipt />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* SignUp */}
                            <Route
                                path="/signup"
                                element={
                                    <this.PublicRoute>
                                        <Signup />
                                    </this.PublicRoute>
                                }
                            />
                            <Route
                                path="/verify/signup/otp/:id"
                                element={
                                    <this.PublicRoute>
                                        <SignupOTP />
                                    </this.PublicRoute>
                                }
                            />
                            <Route
                                path="/verify/signup/token/:token"
                                element={
                                    <this.PublicRoute>
                                        <SignupToken />
                                    </this.PublicRoute>
                                }
                            />
                            {/* Forgot Password */}
                            <Route
                                path="/forgetPassword"
                                element={
                                    <this.PublicRoute>
                                        <ForgetPassword />
                                    </this.PublicRoute>
                                }
                            />
                            <Route
                                path="/verify/reset/otp/:id"
                                element={
                                    <this.PublicRoute>
                                        <ResetOTP />
                                    </this.PublicRoute>
                                }
                            />
                            <Route
                                path="/verify/reset/token/:token"
                                element={
                                    <this.PublicRoute>
                                        <ResetToken />
                                    </this.PublicRoute>
                                }
                            />
                            {/* Organisation Page */}
                            <Route
                                path="/organisations"
                                element={
                                    <this.PrivateRoute>
                                        <GSTs />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* Add Organisation Page */}
                            <Route
                                path="/add-organisation"
                                element={
                                    <this.PrivateRoute>
                                        <AddOrganisation />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* Account list with opening balance Page */}
                            <Route
                                path="/:organisationId/:year/account/list-with-opening-balances"
                                element={
                                    <this.PrivateRoute>
                                        <AccountList />
                                    </this.PrivateRoute>
                                }
                            />

                            {/* Account list with current year balance Page */}
                            <Route
                                path="/:organisationId/:year/account/list"
                                element={
                                    <this.PrivateRoute>
                                        <AccountList />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* Add Journal Entry */}
                            <Route
                                path="/:organisationId/:year/journal-entry/add"
                                element={
                                    <this.PrivateRoute>
                                        <AddJournalEntry />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* Copy Journal Entry */}
                            <Route
                                path="/:organisationId/:year/journal-entry/duplicate/:id"
                                element={
                                    <this.PrivateRoute>
                                        <AddJournalEntry />
                                    </this.PrivateRoute>
                                }
                            />
                            {/* Edit Journal Entry */}
                            <Route
                                path="/:organisationId/:year/journal-entry/edit/:id"
                                element={
                                    <this.PrivateRoute>
                                        <AddJournalEntry />
                                    </this.PrivateRoute>
                                }
                            />


                            {/* List Journal Entry */}
                            <Route
                                path="/:organisationId/:year/journal-entry/list/"
                                element={
                                    <this.PrivateRoute>
                                        <ListJournalEntry />
                                    </this.PrivateRoute>
                                }
                            />

                            {/* List Journal Entry */}
                            <Route
                                path="/:organisationId/:year/reports/list/"
                                element={
                                    <this.PrivateRoute>
                                        <BalanceSheet />
                                    </this.PrivateRoute>
                                }
                            />

                            {/* User Page */}
                            <Route
                                path="/:organisationId/user/list"
                                element={
                                    <this.PrivateRoute>
                                        <Users />
                                    </this.PrivateRoute>
                                }
                            />
                            <Route
                                path="/:organisationId/user/add"
                                element={
                                    <this.PrivateRoute>
                                        <AddUser />
                                    </this.PrivateRoute>
                                }
                            />

                            <Route
                                path="/:organisationId/user/edit"
                                element={
                                    <this.PrivateRoute>
                                        <EditUser />
                                    </this.PrivateRoute>
                                }
                            />

                            {/* Login */}
                            <Route
                                path="/"
                                element={
                                    <this.PublicRoute>
                                        <Login />
                                    </this.PublicRoute>
                                }
                            />
                            {/* No Match */}
                            <Route path="*" element={<p>404 Page Not Found</p>} />
                        </Routes>
                    </Router>
                ) : null}
            </div>
        );
    }
}

export default connector(App);
