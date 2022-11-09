import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import agent from "../agent";
import { connect, ConnectedProps } from "react-redux";
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../store/types";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Icon from "./Icon";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
  addNotification: (title: string, message: string, type: string) =>
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        title,
        message,
        type,
      },
    }),
});

type Props = {
  heading: string;
  onLoad?: () => void;
  invitationModalSetOpen?: (open: boolean) => void;
  state?: any;
  type?: any;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class InvitationModal extends React.Component<Props, PropsFromRedux> {
  state: {
    logging: boolean;
  };

  constructor(props: any) {
    super(props);
    this.onKeyUpFunction = this.onKeyUpFunction.bind(this);
    this.state = {
      logging: false,
    };
  }

  onKeyUpFunction(event: any) {
    if (event.keyCode === 27) {
      this.setOpen(false);
    }

    if (event.keyCode === 13) {
      this.invitationRow();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  revokeInvitation = () => {
    const organisationId = this.props.state.selectedRow.organisationId._id;
    const invitationId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Organisation.revokeInvitation(organisationId, invitationId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Initation revoked",
          "Successfully revoked an invitation.",
          "success"
        );
        this.setState({ logging: false });
        this.setOpen(false);
        this.onLoad();
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  rejectInvitation = () => {
    const organisationId = this.props.state.selectedRow.organisationId._id;
    const invitationId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Organisation.rejectInvitation(organisationId, invitationId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Initation Rejected",
          "Successfully rejected an invitation.",
          "success"
        );
        this.setState({ logging: false });
        this.setOpen(false);
        this.onLoad();
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  acceptInvitation = () => {
    const organisationId = this.props.state.selectedRow.organisationId._id;
    const invitationId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Organisation.acceptInvitation(organisationId, invitationId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Initation Accepted",
          "Successfully accepted an invitation.",
          "success"
        );
        this.setState({ logging: false });
        this.setOpen(false);
        this.onLoad();
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  leaveOrganisation = () => {
    const organisationId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Organisation.leaveOrganisation(organisationId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Leave Organisation",
          "Successfully left a organisation.",
          "success"
        );
        this.setState({ logging: false });
        const currentSelectedOrganisation = (this.props as any)
          .currentOrganisation;
        if (currentSelectedOrganisation._id === organisationId) {
          const organisations = (this.props as any).organisations;
          const filterOrganisation = organisations.filter(
            (item: any) => item._id !== organisationId
          );
          (this.props as any).updateCommon({
            currentOrganisation: filterOrganisation[0],
          });
        }
        this.setOpen(false);
        this.onLoad();
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  invitationRow = () => {
    switch (this.props.type) {
      case "Revoke":
        return this.revokeInvitation();
      case "Reject":
        return this.rejectInvitation();
      case "Accept":
        return this.acceptInvitation();
      case "Leave":
        return this.leaveOrganisation();
      default:
        return;
    }
  };

  setOpen = (open: boolean) => {
    (this.props as any).invitationModalSetOpen(open);
  };

  onLoad = () => {
    (this.props as any).onLoad();
  };

  render() {
    return (
      <>
        <Transition.Root
          show={(this.props as any).state.showInvitationModal}
          as={Fragment}
        >
          <Dialog as="div" className="relative z-10" onClose={() => null}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                    <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                      <button
                        type="button"
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => this.setOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="sm:flex sm:items-start">
                      {this.props.type === "Revoke" && (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      {this.props.type === "Reject" && (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <Icon
                            name="x-circle"
                            className="h-6 w-6 text-red-600"
                          />
                        </div>
                      )}
                      {this.props.type === "Accept" && (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                          <Icon
                            name="signin"
                            className="h-6 w-6 text-indigo-600"
                          />
                        </div>
                      )}
                      {this.props.type === "Leave" && (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <Icon
                            name="outline/logout"
                            className="h-6 w-6 text-red-600"
                          />
                        </div>
                      )}
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          {this.props.heading}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to{" "}
                            {this.props.type.toLowerCase()} '
                            {this.props.type === "Leave"
                              ? this.props.state.selectedRow.name
                              : this.props.state.selectedRow.organisationId
                                  .name}
                            '?
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                        onClick={() => this.setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={this.state.logging}
                        className={`mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm py-2 text-base font-medium text-white focus:outline-none sm:mt-0 sm:w-32 sm:text-sm ${
                          this.props.type === "Accept"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                        onClick={this.invitationRow}
                      >
                        <span className="w-full flex justify-end">
                          {this.state.logging ? (
                            <Icon name="loading" className="mr-2" />
                          ) : null}
                        </span>
                        <span>{this.props.type}</span>
                        <span className="w-full"></span>
                      </button>
                    </div>

                    {/* <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                      <button
                        type="button"
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:w-auto sm:text-sm ${
                          this.props.type === "Accept"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                        onClick={this.invitationRow}
                      >
                        {this.state.logging ? <Icon name="loading" /> : null}
                        {this.props.type}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base sm:ml-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => this.setOpen(false)}
                      >
                        Cancel
                      </button>
                    </div> */}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    );
  }
}

export default connector(InvitationModal);
