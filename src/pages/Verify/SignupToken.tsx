import React from "react";
//Redux
import { connect, ConnectedProps } from "react-redux";
import { compose } from "redux";

import agent from "../../agent";
// Routing
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
class SignupToken extends React.Component<any, PropsFromRedux> {
  state: { logging: boolean };

  constructor(props: any) {
    super(props);

    this.state = {
      logging: false,
    };
  }

  verify = () => {
    this.setState({ logging: true });
    const { token } = this.props.params as { token: string };
    agent.Auth.verifySignupToken(token)
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

  componentDidMount() {
    this.verify();
  }

  render() {
    return <div></div>;
  }
}

export default compose(
  connector,
  withRouter
)(SignupToken) as React.ComponentType;
