import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import { connect, ConnectedProps } from "react-redux";
import { compose } from "redux";
import agent from "../agent";
import Icon from "../components/Icon";
import { validEmail } from "../helpers/regex";
import { withRouter } from "../helpers/withRouter";
import { ADD_NOTIFICATION } from "../store/types";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state,
});

const mapDispatchToProps = (dispatch: any) => ({
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
class ForgetPassword extends React.Component<any, PropsFromRedux> {
  // Type declaration for each State inside class
  state: {
    email: string;
    logging: boolean;
    isVerified: boolean;
    emailErr: boolean;
  };

  constructor(props: any) {
    super(props);

    // Initializing State
    this.state = {
      email: "",
      logging: false,
      isVerified: false,
      emailErr: false,
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
    }
  };

  // Testing if values entered are invaid onBlur
  onBlurEmail = (e: any) => {
    if (!validEmail.test(e.target.value)) {
      this.setState({ emailErr: true });
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

  //Enable Forgot Password button ony when all conditions satisfy
  forgotPasswordEnabled = () => {
    return (
      this.state.email &&
      !this.state.emailErr &&
      this.state.isVerified &&
      !this.state.logging
    );
  };

  // Function called on forgot password button click
  forgotPassword = () => {
    this.setState({ logging: true });
    agent.Auth.forgotPassword(this.state.email)
      .then((response: any) => {
        this.setState({ logging: false });
        (this.props as any).navigate(`/verify/reset/otp/${response.userId}`);
        (this.props as any).onNotify(
          "Successful!",
          "Successfully sent mail to reset password!",
          "success"
        );
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).onNotify(
          "Invalid Email",
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
            Forgot Password
          </h2>
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
                <div className="relative mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onBlur={this.onBlurEmail}
                    value={this.state.email}
                    onChange={this.updateState("email")}
                    onKeyPress={(e: any) => {
                      if (this.forgotPasswordEnabled() && e.charCode === 13) {
                        this.forgotPassword();
                      }
                    }}
                    autoComplete="email"
                    required
                    className={
                      this.state.emailErr
                        ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-500 sm:text-sm rounded-md"
                        : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                    }
                  />
                  {this.state.emailErr && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {this.state.emailErr ? (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    Invalid Email
                  </p>
                ) : null}
              </div>
              {/* Recaptcha */}
              <GoogleReCaptchaProvider
                useRecaptchaNet
                reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY!}
                scriptProps={{ async: true, defer: true, appendTo: "body" }}
              >
                <GoogleReCaptcha onVerify={this.onVerify} />
              </GoogleReCaptchaProvider>
              {/* Forgot password Button */}
              <div>
                <button
                  onClick={this.forgotPassword}
                  disabled={!this.forgotPasswordEnabled()}
                  onKeyPress={(e: any) => {
                    if (e.charCode === 13) {
                      this.forgotPassword();
                    }
                  }}
                  className={
                    this.forgotPasswordEnabled()
                      ? "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      : "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 cursor-not-allowed"
                  }
                >
                  {/* Loading animation */}
                  {this.state.logging ? (
                    <Icon name="loading" className="mr-2" />
                  ) : null}
                  Forgot Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  connector,
  withRouter
)(ForgetPassword) as React.ComponentType;
