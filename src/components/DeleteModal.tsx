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
  deleteModalSetOpen?: (open: boolean) => void;
  state?: any;
  type?: any;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class DeleteModal extends React.Component<Props, PropsFromRedux> {
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
      this.deleteIdRow();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  deleteTag = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const id = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Tag.deleteTag(id, workSpaceId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Success!",
          "Tag Deleted Successfully.",
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

  deleteStatus = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const id = this.props.state.selectedRow._id;

    this.setState({ logging: true });
    agent.Status.deleteStatus(id, workSpaceId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Success!",
          "Status Deleted Successfully.",
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

  deleteCustomField = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const customFieldId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.CustomField.deleteCustomField(customFieldId, workSpaceId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Success!",
          "Custom Field Deleted Successfully.",
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

  deletePerson = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const contactPersonId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.ContactPerson.deletePersonField(contactPersonId, workSpaceId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Success!",
          "Perosn Deleted Successfully.",
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

  deleteGroup = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const groupId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.ClientGroups.deleteClientGroup(workSpaceId, groupId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Success!",
          "Group Deleted Successfully.",
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

  deleteClient = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const clientId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Clients.deleteClient(workSpaceId, clientId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Success!",
          "Client Deleted Successfully.",
          "success"
        );
        this.setState({ logging: false });
        this.setOpen(false);
        this.onLoad();
      })
      .catch((err: any) => {
        console.log({ err });
        this.setState({ logging: false });
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  deleteFirm = () => {
    const workSpaceId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Firm.deleteFirm(workSpaceId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "Success!",
          "Firm Deleted Successfully.",
          "success"
        );
        const currentSelectedFirm = (this.props as any).currentFirm;
        if (currentSelectedFirm._id === workSpaceId) {
          const firms = (this.props as any).firms;
          const filterFirm = firms.filter(
            (item: any) => item._id !== workSpaceId
          );
          (this.props as any).updateCommon({
            currentFirm: filterFirm[0],
          });
        }
        this.setState({ logging: false });
        this.setOpen(false);
        this.onLoad();
      })
      .catch((err: any) => {
        this.setState({ logging: false });
        console.log({ err });
        (this.props as any).addNotification(
          "Error",
          err?.response?.data?.message || err?.message || err,
          "danger"
        );
      });
  };

  deleteUser = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const userId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.User.removeUser(workSpaceId, userId)
      .then((response: any) => {
        (this.props as any).addNotification(
          "User Deleted",
          "Successfully deleted a user.",
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

  deleteTodoList = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const toDoListId = this.props.state.selectedRow._id;
    this.setState({ logging: true });
    agent.Todo.deleteList(workSpaceId, toDoListId)
      .then(() => {
        (this.props as any).addNotification(
          "Success!",
          "Todo List Deleted Successfully.",
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

  deleteTodoItem = () => {
    const workSpaceId = (this.props as any)?.currentFirm._id;
    const toDoId = this.props.state.selectedRow._id;
    console.log(this.props.state);
    this.setState({ logging: true });
		agent.Todo.delete({ workSpaceId, toDoId })
      .then(() => {
			(this.props as any).addNotification(
          "Success!",
          "Todo List Deleted Successfully.",
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

  deleteIdRow = () => {
    switch (this.props.type) {
      case "tag":
        return this.deleteTag();
      case "status":
        return this.deleteStatus();
      case "field":
        return this.deleteCustomField();
      case "person":
        return this.deletePerson();
      case "group":
        return this.deleteGroup();
      case "client":
        return this.deleteClient();
      case "todo list":
        return this.deleteTodoList();
      case "todo item":
        return this.deleteTodoItem();
      case "firm":
        return this.deleteFirm();
      case "user":
        return this.deleteUser();
      default:
        return;
    }
  };

  setOpen = (open: boolean) => {
    (this.props as any).deleteModalSetOpen(open);
  };

  onLoad = () => {
    (this.props as any).onLoad();
  };

  render() {
    return (
      <>
        <Transition.Root
          show={(this.props as any).state.showDeleteModal}
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
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Confirm Delete
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete {this.props.type} '
                            {this.props.state.selectedRow.name}'?
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
                          "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                        }
                        onClick={this.deleteIdRow}
                      >
                        <span className="w-full flex justify-end">
                          {this.state.logging ? (
                            <Icon name="loading" className="mr-2" />
                          ) : null}
                        </span>
                        <span>Delete</span>
                        <span className="w-full"></span>
                      </button>
                    </div>

                    {/* <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white  focus:outline-none sm:w-auto sm:text-sm"
                        onClick={() => this.deleteIdRow()}
                      >
                        {this.state.logging ? <Icon name="loading" /> : null}
                        Delete
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

export default connector(DeleteModal);
