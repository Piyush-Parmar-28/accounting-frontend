import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import agent from "../agent";
import Icon from "../components/Icon";
import baseConfig from "../config";
import routes from "../constants/routes";
import { validEmail } from "../helpers/regex";
import { withRouter } from "../helpers/withRouter";
import { ADD_NOTIFICATION, LOGIN } from "../store/types";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLogin: (token: string) => dispatch({ type: LOGIN, payload: { token } }),
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

//Main Class
class Login extends React.Component<any, PropsFromRedux> {
  // Type declaration for each State inside class
  state: {
    email: string;
    password: string;
    logging: boolean;
    isVerified: boolean;
    emailErr: boolean;
    passwordErr: boolean;
    iconType: string;
    inputType: string;
  };

  constructor(props: any) {
    super(props);

    // Initializing State
    this.state = {
      email: "",
      password: "",
      logging: false,
      isVerified: false,
      emailErr: false,
      passwordErr: false,
      iconType: "eye-open",
      inputType: "password",
    };
  }

  componentDidMount() {
    const script = document.createElement("script");
    const url = "https://www.google.com/recaptcha/api.js?render=";
    script.src = url + process.env.REACT_APP_RECAPTCHA_KEY;
    script.async = true;

    document.body.appendChild(script);
  }

  // On Every chnage update state
  updateState = (field: string) => (ev: any) => {
    this.setState({
      [field]: ev.target.value,
    });

    //Testing if values of Entries are valid
    if (field === "email") {
      if (validEmail.test(ev.target.value)) {
        this.setState({ emailErr: false });
      }
    } else if (field === "password") {
      if (ev.target.value) {
        this.setState({ passwordErr: false });
      }
    }
  };

  // Testing if values entered are invaid onBlur
  onBlurEmail = (e: any) => {
    if (!validEmail.test(e.target.value)) {
      this.setState({ emailErr: true });
    }
  };

  onBlurPassword = (e: any) => {
    if (!e.target.value) {
      this.setState({ passwordErr: true });
    }
  };

  onViewPassword = () => {
    if (this.state.inputType === "password") {
      this.setState({ inputType: "text", iconType: "eye-close" });
    } else {
      this.setState({ inputType: "password", iconType: "eye-open" });
    }
  };

  // Recaptcha Functions
  onVerify = (token: any) => {
    token
      ? this.setState({
          isVerified: true,
        })
      : (this.props as any)
          .onNotify(
            "Recaptcha Not Verified...",
            "Your Recaptcha is not verified. Please verify again to proceed.",
            "danger"
          )
          .then(
            this.setState({
              isVerified: false,
            })
          );
  };

  //Enable signup button ony when all conditions satisfy
  isSignInEnabled = () => {
    return (
      this.state.email &&
      !this.state.emailErr &&
      this.state.password &&
      !this.state.passwordErr &&
      this.state.isVerified
    );
  };

  // On Login button click
  login = () => {
    this.setState({ logging: true });
    agent.Auth.login(this.state.email, this.state.password)
      .then((response: any) => {
        this.setState({ logging: false });
        (this.props as any).onLogin(response.token);
        (this.props as any).navigate(routes.AgencyClients);
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).onNotify(
          "Incorrect Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  // Main Component render
  render() {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or&nbsp;
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              start your 14-day free trial
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onBlur={this.onBlurEmail}
                    value={this.state.email}
                    onChange={this.updateState("email")}
                    autoComplete="email"
                    required
                    onKeyPress={(e: any) => {
                      if (this.isSignInEnabled() && e.charCode === 13) {
                        this.login();
                      }
                    }}
                    className={
                      this.state.emailErr
                        ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-500 sm:text-sm rounded-md"
                        : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                    }
                  />
                  {
                    // On Error gives red warning
                    this.state.emailErr && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                    )
                  }
                </div>
                {this.state.emailErr ? (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    Invalid Email
                  </p>
                ) : null}
              </div>
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="flex">
                    <input
                      id="password"
                      name="password"
                      type={this.state.inputType}
                      onBlur={this.onBlurPassword}
                      onChange={this.updateState("password")}
                      autoComplete="current-password"
                      onKeyPress={(e: any) => {
                        if (this.isSignInEnabled() && e.charCode === 13) {
                          this.login();
                        }
                      }}
                      required
                      className={
                        this.state.passwordErr
                          ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-500 sm:text-sm rounded-md"
                          : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                      }
                    />
                    <button onClick={this.onViewPassword}>
                      <Icon
                        name={this.state.iconType}
                        className="h-6 w-6 text-gray-500 absolute top-2 right-3"
                      />
                    </button>
                  </div>
                  {this.state.passwordErr && (
                    <div className="absolute inset-y-0 right-6 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {this.state.passwordErr ? (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    Please enter a password
                  </p>
                ) : null}
              </div>
              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center"></div>

                <div className="text-sm">
                  <Link
                    to="/forgetPassword"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              {/* Recaptcha v3 */}
              <GoogleReCaptchaProvider
                useRecaptchaNet
                reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY!}
                scriptProps={{
                  async: true,
                  defer: true,
                  appendTo: "body",
                }}
              >
                <GoogleReCaptcha onVerify={this.onVerify} />
              </GoogleReCaptchaProvider>
              {/* SignIn */}
              <div>
                <button
                  onClick={this.login}
                  onKeyPress={(e: any) => {
                    if (e.charCode === 13) {
                      this.login();
                    }
                  }}
                  disabled={!this.isSignInEnabled() as boolean}
                  className={
                    this.isSignInEnabled()
                      ? "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      : "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 cursor-not-allowed"
                  }
                >
                  {/* Loading animation */}
                  {this.state.logging ? (
                    <Icon name="loading" className="mr-2" />
                  ) : null}
                  Sign in
                </button>
              </div>
            </div>
            {/* Signin With Google */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 ">
                <a href={baseConfig.baseURL + "/auth/googleSignup"}>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center items-center py-2.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <span className="sr-only text-gray-500">
                      Sign in with Google
                    </span>
                    <Icon
                      name="solid/google"
                      className="w-5 h-5 text-gray-500"
                    />
                    <span className="text-gray-500 text-sm">
                      &nbsp; Sign in with Google
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(connector, withRouter)(Login) as React.ComponentType;
