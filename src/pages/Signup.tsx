import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import { connect, ConnectedProps } from "react-redux";
import { compose } from "redux";
import agent from "../agent";
import Icon from "../components/Icon";
import baseConfig from "../config";
import {
  validEmail,
  validNumbers,
  validPassword,
  validSymbols,
} from "../helpers/regex";
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
function SignUp(props: PropsFromRedux) {
  // Type declaration for each State inside class
  interface state {
    name: string;
    email: string;
    password: string;
    mobile: number;
    logging: boolean;
    isVerified: boolean;
    mobileErr: boolean;
    emailErr: boolean;
    passwordErr: boolean;
    validLength: boolean;
    hasNumber: boolean;
    upperCase: boolean;
    lowerCase: boolean;
    specialChar: boolean;
    iconType: string;
    inputType: string;
  }

  // Initializing State
  const initialState: state = {
    name: "",
    email: "",
    password: "",
    mobile: 0,
    logging: false,
    isVerified: false,
    emailErr: false,
    mobileErr: false,
    passwordErr: false,
    validLength: true,
    hasNumber: true,
    upperCase: true,
    lowerCase: true,
    specialChar: true,
    iconType: "eye-open",
    inputType: "password",
  };

  // Setting State
  const [state, setState] = useState(initialState);

  // componentDidMount() {
  //   const script = document.createElement("script");
  //   const url = "https://www.google.com/recaptcha/api.js?render=";
  //   script.src = url + process.env.REACT_APP_RECAPTCHA_KEY;
  //   script.async = true;

  //   document.body.appendChild(script);
  // }

  // On Every chnage update state
  const updateState = (field: string) => (ev: any) => {
    if (field === "mobile") {
      setState((prevState) => ({
        ...prevState,
        mobile: ev.target.value.slice(0, 10),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [field]: ev.target.value,
      }));
    }

    //Testing if values of Entries are valid
    if (field === "mobile") {
      if (ev.target.value.length < 10) {
        setState((prevState) => ({
          ...prevState,
          mobileErr: true,
        }));
      } else if (validNumbers.test(ev.target.value)) {
        setState((prevState) => ({
          ...prevState,
          mobileErr: false,
        }));
      }
    } else if (field === "email") {
      if (validEmail.test(ev.target.value)) {
        setState((prevState) => ({
          ...prevState,
          emailErr: false,
        }));
      }
    } else if (field === "password") {
      if (validPassword.test(ev.target.value)) {
        setState((prevState) => ({
          ...prevState,
          passwordErr: false,
        }));
      }
      // Checking each password conditions to show when not satisfied
      ev.target.value.length >= 8
        ? setState((prevState) => ({
            ...prevState,
            validLength: true,
          }))
        : setState((prevState) => ({
            ...prevState,
            validLength: false,
          }));

      ev.target.value.toLowerCase() !== ev.target.value
        ? setState((prevState) => ({
            ...prevState,
            upperCase: true,
          }))
        : setState((prevState) => ({
            ...prevState,
            upperCase: false,
          }));

      ev.target.value.toUpperCase() !== ev.target.value
        ? setState((prevState) => ({
            ...prevState,
            lowerCase: true,
          }))
        : setState((prevState) => ({
            ...prevState,
            lowerCase: false,
          }));

      validSymbols.test(ev.target.value)
        ? setState((prevState) => ({
            ...prevState,
            specialChar: true,
          }))
        : setState((prevState) => ({
            ...prevState,
            specialChar: false,
          }));

      validNumbers.test(ev.target.value)
        ? setState((prevState) => ({
            ...prevState,
            hasNumber: true,
          }))
        : setState((prevState) => ({
            ...prevState,
            hasNumber: false,
          }));
    }
  };

  // Testing if values entered are invaid onBlur
  const onBlurEmail = (e: any) => {
    if (!validEmail.test(e.target.value)) {
      setState((prevState) => ({
        ...prevState,
        emailErr: true,
      }));
    }
  };

  const onBlurPassword = (e: any) => {
    if (e.target.value && !validPassword.test(e.target.value)) {
      setState((prevState) => ({
        ...prevState,
        passwordErr: true,
      }));
    }
  };

  const onViewPassword = () => {
    if (state.inputType === "password") {
      setState((prevState) => ({
        ...prevState,
        inputType: "text",
        iconType: "eye-close",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        inputType: "password",
        iconType: "eye-open",
      }));
    }
  };

  // Recaptcha Functions
  const onVerify = (token: any) => {
    token
      ? setState((prevState) => ({
          ...prevState,
          isVerified: true,
        }))
      : (props as any)
          .onNotify(
            "Recaptcha Not Verified...",
            "Your Recaptcha is not verified. Please verify again to proceed.",
            "danger"
          )
          .then(
            setState((prevState) => ({
              ...prevState,
              isVerified: false,
            }))
          );
  };

  //Enable signup button ony when all conditions satisfy
  const isSignUpEnabled = () => {
    return (
      state.mobile &&
      !state.mobileErr &&
      state.email &&
      !state.emailErr &&
      state.password &&
      !state.passwordErr
      // &&
      // state.isVerified
    );
  };

  // On Signup button click
  const signup = () => {
    setState((prevState) => ({
      ...prevState,
      logging: true,
    }));

    agent.Auth.signup(state.name, state.email, state.password, state.mobile)
      .then((response: any) => {
        setState((prevState) => ({
          ...prevState,
          logging: false,
        }));

        (props as any).navigate(`/verify/signup/otp/${response.userId}`);
      })
      .catch((err: any) => {
        console.log({ err });
        setState((prevState) => ({
          ...prevState,
          logging: false,
        }));

        (props as any).onNotify(
          "Incorrect Details",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  // Main Component render

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={state.name}
                  onChange={updateState("name")}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={state.email}
                  onBlur={onBlurEmail}
                  onChange={updateState("email")}
                  onKeyPress={(e: any) => {
                    if (isSignUpEnabled() && e.charCode === 13) {
                      signup();
                    }
                  }}
                  autoComplete="email"
                  required
                  className={
                    state.emailErr
                      ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-500 sm:text-sm rounded-md"
                      : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                  }
                />
                {
                  // On Error gives red warning
                  state.emailErr && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )
                }
              </div>
              {state.emailErr ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  Please enter a valid email.
                </p>
              ) : null}
            </div>
            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile
              </label>
              <div className="mt-1">
                <input
                  id="mobile"
                  name="mobile"
                  type="number"
                  value={state.mobile || ""}
                  onChange={updateState("mobile")}
                  className={
                    state.emailErr
                      ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-500 sm:text-sm rounded-md"
                      : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                  }
                />
                {
                  // On Error gives red warning
                  state.mobileErr && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )
                }
              </div>
              {state.mobileErr ? (
                <p className="mt-2 text-sm text-red-600" id="mobile-error">
                  Please enter a valid mobile number of 10 digits.
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
              <div className="mt-1 relative">
                <div className="flex">
                  <input
                    id="password"
                    name="password"
                    onBlur={onBlurPassword}
                    type={state.inputType}
                    onChange={updateState("password")}
                    required
                    onKeyPress={(e: any) => {
                      if (isSignUpEnabled() && e.charCode === 13) {
                        signup();
                      }
                    }}
                    className={
                      state.passwordErr
                        ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-500 sm:text-sm rounded-md"
                        : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                    }
                  />
                  <button onClick={onViewPassword}>
                    <Icon
                      name={state.iconType}
                      className="h-6 w-6 text-gray-500 absolute top-2 right-3"
                    />
                  </button>
                </div>
                {state.passwordErr && (
                  <div className="absolute inset-y-0 right-6 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              {state.passwordErr ? (
                <div className=" mt-5 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-sm text-red-800">
                        Your password must satisfy all the conditions
                      </h3>
                      <div className="mt-2 text-xs text-red-700">
                        <ul className="list-disc pl-3 space-y-1">
                          {state.validLength ? null : (
                            <li>Must be at least 8 characters in length</li>
                          )}
                          {state.lowerCase ? null : (
                            <li>should contain at least one lower case</li>
                          )}
                          {state.upperCase ? null : (
                            <li>should contain at least one upper case</li>
                          )}
                          {state.hasNumber ? null : (
                            <li>should contain at least one digit</li>
                          )}
                          {state.specialChar ? null : (
                            <li>
                              should contain at least one special character
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            {/* Recaptcha v3 */}
            <GoogleReCaptchaProvider
              useRecaptchaNet
              reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY!}
              scriptProps={{ async: true, defer: true, appendTo: "body" }}
            >
              <GoogleReCaptcha onVerify={onVerify} />
            </GoogleReCaptchaProvider>
            {/* SignUp */}
            <div>
              <button
                onClick={signup}
                onKeyPress={(e: any) => {
                  if (e.charCode === 13) {
                    signup();
                  }
                }}
                disabled={!isSignUpEnabled() as boolean}
                className={
                  isSignUpEnabled()
                    ? "g-recaptcha w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none "
                    : "g-recaptcha w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 cursor-not-allowed"
                }
              >
                {state.logging ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Sign up
              </button>
            </div>
          </div>
          {/* Signup With Google */}
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
                  className="inline-flex w-full justify-center items-center py-2.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none "
                >
                  <span className="sr-only text-gray-500">
                    Sign up with Google
                  </span>
                  <Icon name="solid/google" className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-500 text-sm">
                    &nbsp; Sign up with Google
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

export default compose(connector, withRouter)(SignUp) as React.ComponentType;
