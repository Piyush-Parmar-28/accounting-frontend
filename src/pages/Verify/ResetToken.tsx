import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { compose } from "redux";

import agent from "../../agent";
import Icon from "../../components/Icon";
//Valid Password Check
import { validNumbers, validPassword, validSymbols } from "../../helpers/regex";
import { withRouter } from "../../helpers/withRouter";
//Redux Notifications
import { ADD_NOTIFICATION } from "../../store/types";

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

class ResetToken extends React.Component<any, PropsFromRedux> {
  state: {
    logging: boolean;
    newPassword: string;
    passwordErr: boolean;
    confirmPassword: string;
    isMatch: boolean;
    validLength: boolean;
    hasNumber: boolean;
    upperCase: boolean;
    lowerCase: boolean;
    specialChar: boolean;
  };

  constructor(props: any) {
    super(props);

    // Initializing State
    this.state = {
      logging: false,
      newPassword: "",
      confirmPassword: "",
      passwordErr: false,
      isMatch: false,
      validLength: true,
      hasNumber: true,
      upperCase: true,
      lowerCase: true,
      specialChar: true,
    };
  }

  // On Every chnage update state
  updateState = (field: string) => (ev: any) => {
    this.setState({
      [field]: ev.target.value,
    });

    if (field === "newPassword") {
      if (validPassword.test(ev.target.value)) {
        this.setState({ passwordErr: false });
      }
      // Checking each password conditions to show when not satisfied
      ev.target.value.length >= 8
        ? this.setState({ validLength: true })
        : this.setState({ validLength: false });
      ev.target.value.toLowerCase() !== ev.target.value
        ? this.setState({ upperCase: true })
        : this.setState({ upperCase: false });
      ev.target.value.toUpperCase() !== ev.target.value
        ? this.setState({ lowerCase: true })
        : this.setState({ lowerCase: false });
      validSymbols.test(ev.target.value)
        ? this.setState({ specialChar: true })
        : this.setState({ specialChar: false });
      validNumbers.test(ev.target.value)
        ? this.setState({ hasNumber: true })
        : this.setState({ hasNumber: false });
    }

    if (field === "confirmPassword") {
      if (ev.target.value === this.state.newPassword) {
        this.setState({
          isMatch: true,
        });
      } else {
        this.setState({
          isMatch: false,
        });
      }
    }
    if (field === "newPassword") {
      if (ev.target.value === this.state.confirmPassword) {
        this.setState({
          isMatch: true,
        });
      } else {
        this.setState({
          isMatch: false,
        });
      }
    }
  };

  onBlurPassword = (e: any) => {
    if (e.target.value && !validPassword.test(e.target.value)) {
      this.setState({ passwordErr: true });
    }
  };

  isResetEnabled = () => {
    return (
      this.state.newPassword &&
      this.state.confirmPassword &&
      !this.state.passwordErr &&
      this.state.isMatch
    );
  };

  verify = () => {
    this.setState({ logging: true });
    const { token } = this.props.params as { token: string };
    agent.Auth.verifyResetToken(token, this.state.newPassword)
      .then((response: any) => {
        this.setState({ logging: false });
        this.props.history.push("/");
        (this.props as any).onNotify(
          "Successful!",
          "Password has been reset Successfully!",
          "success"
        );
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).onNotify(
          "Invalid Entry",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

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
            Reset Password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Enter password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  onBlur={this.onBlurPassword}
                  type="password"
                  value={this.state.newPassword}
                  onChange={this.updateState("newPassword")}
                  required
                  className={
                    this.state.passwordErr
                      ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-500 sm:text-sm rounded-md"
                      : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                  }
                />
                {this.state.passwordErr && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              {this.state.passwordErr ? (
                <div className=" mt-5 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-sm text-red-800">
                        Your password must satisfy all the conditions
                      </h3>
                      <div className="mt-2 text-xs text-red-700">
                        <ul className="list-disc pl-3 space-y-1">
                          {this.state.validLength ? null : (
                            <li>Must be at least 8 characters in length</li>
                          )}
                          {this.state.lowerCase ? null : (
                            <li>should contain at least one lower case</li>
                          )}
                          {this.state.upperCase ? null : (
                            <li>should contain at least one upper case</li>
                          )}
                          {this.state.hasNumber ? null : (
                            <li>should contain at least one digit</li>
                          )}
                          {this.state.specialChar ? null : (
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

            <div className="mt-5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={this.updateState("confirmPassword")}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={this.verify}
                disabled={!this.isResetEnabled() as boolean}
                className={
                  this.isResetEnabled()
                    ? "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    : "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 cursor-not-allowed"
                }
              >
                {this.state.logging ? <Icon name="loading" /> : null}
                Reset Password
              </button>
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
)(ResetToken) as React.ComponentType;
