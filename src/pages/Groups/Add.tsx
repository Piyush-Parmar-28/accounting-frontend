import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import agent from "../../agent";
import Icon from "../../components/Icon";
import { ADD_NOTIFICATION } from "../../store/types";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
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
  closeModal: (fetchAgain: boolean) => void;
  showGroupModal?: boolean;
  clientGroupData?: (newGroup: any) => void;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class AddGroup extends React.Component<Props, PropsFromRedux> {
  state: {
    logging: boolean;
    name: string;
    description: string;
  };

  constructor(props: any) {
    super(props);
    this.onKeyUpFunction = this.onKeyUpFunction.bind(this);
    this.state = {
      logging: false,
      name: "",
      description: "",
    };
  }

  onKeyUpFunction(event: any) {
    if (event.keyCode === 27) {
      this.closeGroupModal(false);
    }

    if (event.keyCode === 13) {
      this.addGroup();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  addGroup = () => {
    const workSpaceId = (this.props as any).currentFirm._id;
    const name = this.state.name;
    const description = this.state.description;
    if (name !== "" && description !== "") {
      this.setState({ logging: true });
      agent.ClientGroups.addClientGroup(name, description, workSpaceId)
        .then((response: any) => {
          this.setState({ logging: false });
          if (this.props.showGroupModal) {
            const newGroup = { ...response.group };
            this.sendGroup(newGroup);
          }
          (this.props as any).addNotification(
            "Group Added",
            "Successfully added a group.",
            "success"
          );
          this.closeGroupModal(true);
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
    } else {
      if (!name) {
        (this.props as any).addNotification(
          "Empty Group Name Field",
          "Group Name Field is Required!.",
          "danger"
        );
      } else if (!description) {
        (this.props as any).addNotification(
          "Empty Group Description Field",
          "Group Description Field is Required!.",
          "danger"
        );
      }
    }
  };

  closeGroupModal = (fetchAgain: boolean) => {
    this.props.closeModal(fetchAgain);
  };

  updateState = (field: string) => (ev: any) => {
    this.setState({
      [field]: ev.target.value,
    });
  };

  sendGroup = (newGroup: any) => {
    this.props.clientGroupData!(newGroup);
  };

  render() {
    return (
      <>
        <Transition.Root
          show={
            (this.props as any)?.currentModal?.modalName ===
              "ADD_GROUP_MODAL" || this.props.showGroupModal
          }
          as={Fragment}
        >
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            onClose={() => null}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Add Group
                      </h3>
                    </div>
                    <div>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-4">
                          <div className="mb-4">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name <span className="text-red-600">*</span>
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="company_website"
                                value={this.state.name}
                                onChange={this.updateState("name")}
                                id="company_website"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Name"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="comment"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <div className="mt-1">
                              <textarea
                                rows={4}
                                name="comment"
                                id="comment"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                value={this.state.description}
                                onChange={this.updateState("description")}
                                placeholder="Add Description..."
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                            onClick={() => this.closeGroupModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={this.state.logging}
                            className={
                              "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                            }
                            onClick={this.addGroup}
                          >
                            <span className="w-full flex justify-end">
                              {this.state.logging ? (
                                <Icon name="loading" className="mr-2" />
                              ) : null}
                            </span>
                            <span>Save</span>
                            <span className="w-full"></span>
                          </button>
                        </div>

                        {/* <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                          <button
                            type="button"
                            disabled={this.state.logging}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:w-auto sm:text-sm"
                            onClick={this.addGroup}
                          >
                            {this.state.logging ? (
                              <Icon name="loading" />
                            ) : null}
                            Save
                          </button>
                          <button
                            type="button"
                            className="mt-3 sm:ml-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => this.closeGroupModal(false)}
                          >
                            Cancel
                          </button>
                        </div> */}
                      </form>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    );
  }
}

export default connector(AddGroup);
