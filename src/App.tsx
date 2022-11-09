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

// Tag Import
import Tags from "./pages/Tags/Index";
import AddTag from "./pages/Tags/Add";

//  Status Import
import Status from "./pages/Status/Index";
import AddStatus from "./pages/Status/Add";

//  Person Import
import ContactPerson from "./pages/ContactPerson/Index";
import AddPerson from "./pages/ContactPerson/Add";

// User Import
import Users from "./pages/Users/Index";
import AddUser from "./pages/Users/Add";
import EditUser from "./pages/Users/Edit";

// Custom Field Import
import CustomField from "./pages/CustomField/Index";
import AddCustomField from "./pages/CustomField/Add";

// Client Group Import
import ClientGroups from "./pages/Groups/Index";
import AddClientGroups from "./pages/Groups/Add";

// Clients Import
import Clients from "./pages/Clients/Index";
import AddClient from "./pages/Clients/Add";
import EditClient from "./pages/Clients/Edit";

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
// Connect to redux
import { TOKEN_PRESENT, UPDATE_COMMON } from "./store/types";
import { connect, ConnectedProps } from "react-redux";

// Todo Imports
import Todos, { getTodoList } from "./pages/Todo/Index";
import AddEditList from "./pages/Todo/AddEditList";

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
        {(this.props as any)?.currentModal?.modalName === "ADD_TAG_MODAL" && (
          <AddTag closeModal={this.closeModal} />
        )}
        {(this.props as any)?.currentModal?.modalName ===
          "ADD_STATUS_MODAL" && <AddStatus closeModal={this.closeModal} />}

        {(this.props as any)?.currentModal?.modalName ===
          "ADD_PERSON_MODAL" && <AddPerson closeModal={this.closeModal} />}

        {(this.props as any)?.currentModal?.modalName ===
          "ADD_CUSTOM_FIELD_MODAL" && (
          <AddCustomField closeModal={this.closeModal} />
        )}

        {(this.props as any)?.currentModal?.modalName === "ADD_GROUP_MODAL" && (
          <AddClientGroups closeModal={this.closeModal} />
        )}

        {(this.props as any)?.currentModal?.modalName === "ADD_TODO_MODAL" && (
          <AddEditList closeModal={this.closeModal} props={this.props} />
        )}

        {!this.state.loading ? (
          <Router>
            <Routes>
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
              {/* Tag Page */}
              <Route
                path="/:organisationId/tags/list"
                element={
                  <this.PrivateRoute>
                    <Tags />
                  </this.PrivateRoute>
                }
              />
              {/* Status Page */}
              <Route
                path="/:organisationId/status/list"
                element={
                  <this.PrivateRoute>
                    <Status />
                  </this.PrivateRoute>
                }
              />
              {/* Custom Field Page */}
              <Route
                path="/:organisationId/custom-field/list"
                element={
                  <this.PrivateRoute>
                    <CustomField />
                  </this.PrivateRoute>
                }
              />
              {/* Contact Perosn Page */}
              <Route
                path="/:organisationId/contact-person/list"
                element={
                  <this.PrivateRoute>
                    <ContactPerson />
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
              {/* Group */}
              <Route
                path="/:organisationId/groups/list"
                element={
                  <this.PrivateRoute>
                    <ClientGroups />
                  </this.PrivateRoute>
                }
              />

              {/* Clients */}
              <Route
                path="/:organisationId/clients/list"
                element={
                  <this.PrivateRoute>
                    <Clients />
                  </this.PrivateRoute>
                }
              />

              <Route
                path="/:organisationId/clients/add"
                element={
                  <this.PrivateRoute>
                    <AddClient />
                  </this.PrivateRoute>
                }
              />

              <Route
                path="/:organisationId/clients/edit"
                element={
                  <this.PrivateRoute>
                    <EditClient />
                  </this.PrivateRoute>
                }
              />
              {/* Insights and settings */}
              {/* <this.PrivateRoute exact path="/insights" component={Settings} /> */}
              {/* <this.PrivateRoute
                exact
                path="/:userInfo/settings"
                component={Settings}
              /> */}

              {/* Todo Page */}
              <Route
                path="/:organisationId/todo/list/:list"
                element={
                  <this.PrivateRoute>
                    <Todos />
                  </this.PrivateRoute>
                }
              />
              <Route
                path="/:organisationId/todo/:toDoListId"
                element={
                  <this.PrivateRoute>
                    <Todos />
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
