import React from "react";
//Redux
import { connect, ConnectedProps } from "react-redux";
import { compose } from "redux";
// Routing

import agent from "../../agent";
import Icon from "../../components/Icon";
import routes from "../../constants/routes";
import { withRouter } from "../../helpers/withRouter";
import { ADD_NOTIFICATION } from "../../store/types";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
});

const mapDispatchToProps = (dispatch: any) => ({
  onVerify: (title: string, message: string, type: string) =>
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
class SignupOTP extends React.Component<any, PropsFromRedux> {
  state: { otp: string; logging: boolean };

  constructor(props: any) {
    super(props);

    this.state = {
      otp: "",
      logging: false,
    };
  }

  updateState = (field: string) => (ev: any) => {
    this.setState({
      [field]: ev.target.value,
    });
  };

  verify = () => {
    this.setState({ logging: true });
    const otp = parseInt(this.state.otp as string, 10);
    const { id } = this.props.params as { id: string };
    agent.Auth.verifySignupOTP(id, otp)
      .then((response: any) => {
        this.setState({ logging: false });
        this.props.history.push(routes.AgencyClients);
        (this.props as any).onVerify(
          "Successful",
          "Successfully signed up. Please Login to continue.",
          "success"
        );
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).onVerify(
          "Failed!",
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
            Verify your account using OTP
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="otp"
                    value={this.state.otp}
                    onChange={this.updateState("otp")}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={this.verify}
                  disabled={
                    this.state.logging === true
                      ? this.state.otp?.length > 6
                        ? false
                        : true
                      : false
                  }
                  className={
                    !this.state.logging
                      ? "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      : "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 cursor-not-allowed"
                  }
                >
                  {this.state.logging ? <Icon name="loading" /> : null}
                  Verify using OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(connector, withRouter)(SignupOTP) as React.ComponentType;
