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
  onLoad?: (forSearch: boolean) => void;
  activeModalSetOpen?: (open: boolean) => void;
  state?: any;
  type?: any;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class ActiveModal extends React.Component<Props, PropsFromRedux> {
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
      this.activeRow();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  makeTagActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const tagId = this.props.state.selectedRow._id;
    if (tagId !== undefined) {
      this.setState({ logging: true });
      agent.Tag.makeTagActive(tagId, organisationId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "Tag is Activated",
            "Successfully Activated a tag.",
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
    }
  };

  makeStatusActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const statusId = this.props.state.selectedRow._id;
    if (statusId !== undefined) {
      this.setState({ logging: true });
      agent.Status.makeStatusActive(statusId, organisationId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "Status is Activated",
            "Successfully Activated a status.",
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
    }
  };

  makeCustomFieldActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const customFieldId = this.props.state.selectedRow._id;
    if (customFieldId !== undefined) {
      this.setState({ logging: true });
      agent.CustomField.makeCustomFieldActive(customFieldId, organisationId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "Field Active",
            "Successfully Activated a field.",
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
    }
  };

  makePersonActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const contactPersonId = this.props.state.selectedRow._id;
    if (contactPersonId !== undefined) {
      this.setState({ logging: true });
      agent.ContactPerson.makePersonActive(contactPersonId, organisationId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "Person Active",
            "Successfully Activated a person.",
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
    }
  };

  makeGroupActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const groupId = this.props.state.selectedRow._id;
    if (groupId !== undefined) {
      this.setState({ logging: true });
      agent.ClientGroups.makeClientGroupActive(organisationId, groupId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "Group Active",
            "Successfully Activated a group.",
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
    }
  };

  makeOrganisationActive = () => {
    const organisationId = this.props.state.selectedRow._id;
    if (organisationId !== undefined) {
      this.setState({ logging: true });
      agent.Organisation.makeOrganisationActive(organisationId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "Organisation Active",
            "Successfully Activated a organisation.",
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
    }
  };

  makeClientActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const clientId = this.props.state.selectedRow._id;
    if (clientId !== undefined) {
      this.setState({ logging: true });
      agent.Clients.makeClientActive(organisationId, clientId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "Client Active",
            "Successfully Activated a client.",
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
    }
  };

  makeUserActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const userId = this.props.state.selectedRow._id;
    if (userId !== undefined) {
      this.setState({ logging: true });
      agent.User.makeUserActive(organisationId, userId)
        .then((response: any) => {
          (this.props as any).addNotification(
            "User Active",
            "Successfully Activated a user.",
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
    }
  };

  makeAccountActive = () => {
    const organisationId = (this.props as any)?.currentOrganisation._id;
    const accountId = this.props.state.selectedRow._id;
    if (accountId !== undefined) {
      this.setState({ logging: true });
      agent.Account.makeAccountActive(organisationId, accountId)
        .then((response: any) => {
          (this.props as any).updateCommon({ updateAccounts: true });
          (this.props as any).addNotification(
            "Account Active",
            "Successfully Activated an Account.",
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
    }
  };

  activeRow = () => {
    switch (this.props.type) {
      case "tag":
        return this.makeTagActive();
      case "status":
        return this.makeStatusActive();
      case "field":
        return this.makeCustomFieldActive();
      case "person":
        return this.makePersonActive();
      case "group":
        return this.makeGroupActive();
      case "organisation":
        return this.makeOrganisationActive();
      case "client":
        return this.makeClientActive();
      case "user":
        return this.makeUserActive();
      case "account":
        return this.makeAccountActive();
      default:
        return;
    }
  };

  setOpen = (open: boolean) => {
    (this.props as any).activeModalSetOpen(open);
  };

  onLoad = () => {
    (this.props as any).onLoad();
  };

  render() {
    return (
      <>
        <Transition.Root
          show={(this.props as any).state.showActiveModal}
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
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Mark Active
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to mark {this.props.type} '
                            {this.props.state.selectedRow.name}' as active?
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
                        className={
                          "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-40 sm:text-sm"
                        }
                        onClick={this.activeRow}
                      >
                        <span className="w-full flex justify-end">
                          {this.state.logging ? (
                            <Icon name="loading" className="mr-2" />
                          ) : null}
                        </span>
                        <span className="whitespace-nowrap">Mark Active</span>
                        <span className="w-full"></span>
                      </button>
                    </div>

                    {/* <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:w-auto sm:text-sm"
                        onClick={this.activeRow}
                      >
                        {this.state.logging ? <Icon name="loading" /> : null}
                        Mark Active
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

export default connector(ActiveModal);
