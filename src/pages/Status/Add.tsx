import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import agent from "../../agent";
import Icon from "../../components/Icon";
import MultiSelect from "../../components/MultiSelect";
import MultiSelectCheckbox from "../../components/MultiSelectCheckbox";
import { colorsList } from "../../constants/colors";
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class AddStatus extends React.Component<Props, PropsFromRedux> {
  state: {
    logging: boolean;
    name: string;
    description: string;
    color: { name: string; value: string };
    tasks: any;
    selectedTasks: any;
  };

  constructor(props: any) {
    super(props);
    this.onKeyUpFunction = this.onKeyUpFunction.bind(this);
    this.state = {
      logging: false,
      name: "",
      description: "",
      color: { name: "", value: "" },
      tasks: [],
      selectedTasks: [],
    };
  }

  onKeyUpFunction(event: any) {
    if (event.keyCode === 27) {
      this.closeStatusModal(false);
    }

    if (event.keyCode === 13) {
      this.addStatus();
    }
  }

  componentDidMount() {
    this.getStatusTaskList();
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  addStatus = () => {
    const workSpaceId = (this.props as any).currentFirm._id;
    const name = this.state.name;
    const description = this.state.description;
    const color = this.state.color.name;
    const index = this.state.selectedTasks.findIndex(
      (item: any) => item.name === "ALL"
    );
    const tasks =
      index === -1
        ? this.state.selectedTasks.map((item: any) => item.name)
        : [];
    if (name !== "" && color !== "") {
      this.setState({ logging: true });
      agent.Status.addStatus(name, color, description, workSpaceId, tasks)
        .then((response: any) => {
          this.setState({ logging: false });
          (this.props as any).addNotification(
            "Status Added",
            "Successfully added a new status.",
            "success"
          );
          this.closeStatusModal(true);
        })
        .catch((err: any) => {
          console.log({ err });
          this.setState({ logging: false });
          (this.props as any).addNotification(
            "Could not add the status",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    } else {
      if (!name) {
        (this.props as any).addNotification(
          "Empty Status Name Field",
          "Status Name Field is Required!.",
          "danger"
        );
      } else if (!color) {
        (this.props as any).addNotification(
          "Empty Status Color Field",
          "Status Color Field is Required!.",
          "danger"
        );
      }
    }
  };

  getStatusTaskList = () => {
    const workSpaceId = (this.props as any)?.currentFirm?._id;
    if (workSpaceId) {
      agent.Status.statusTaskList(workSpaceId)
        .then((response: any) => {
          const tasks = response.filter((item: any) => item !== "ALL");
          tasks.unshift("ALL");
          this.setState({
            tasks,
          });
        })
        .catch((err: any) => {
          (this.props as any).onNotify(
            "Could not load status task list",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
    }
  };

  closeStatusModal = (fetchAgain: boolean) => {
    this.props.closeModal(fetchAgain);
  };

  onColorChange = (item: any) => {
    this.setState({ color: item });
  };

  onTaskChange = (task: any) => {
    const { selectedTasks, tasks } = this.state;
    const index = selectedTasks.findIndex(
      (item: any) => item.name === task.name
    );

    if (index === -1) {
      if (task.name === "ALL") {
        const allTasks = tasks.map((item: any) => ({ name: item, _id: item }));
        this.setState({ selectedTasks: allTasks });
      } else {
        const taskExcludingAll = selectedTasks.filter(
          (item: any) => item.name !== "ALL"
        );
        this.setState({ selectedTasks: [...taskExcludingAll, task] });
      }
    } else {
      if (task.name === "ALL") {
        this.setState({ selectedTasks: [] });
      } else {
        const removeTask = selectedTasks
          .filter((item: any) => item.name !== task.name)
          .filter((item: any) => item.name !== "ALL");
        this.setState({ selectedTasks: removeTask });
      }
    }
  };

  updateState = (field: string) => (ev: any) => {
    this.setState({
      [field]: ev.target.value,
    });
  };

  render() {
    return (
      <>
        <Transition.Root
          show={
            (this.props as any)?.currentModal?.modalName === "ADD_STATUS_MODAL"
          }
          as={Fragment}
          appear
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

              {/* This element is to trick the browser into centering the modal contents. */}
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
                        Add Status
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
                          <div className="mb-4">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Color <span className="text-red-600">*</span>
                            </label>
                            <MultiSelect
                              items={colorsList?.map((color: any) => {
                                return {
                                  ...color,
                                  _id: color.name,
                                  name: color.name,
                                };
                              })}
                              selected={{
                                name: this.state.color.name,
                              }}
                              type="colors"
                              onChange={this.onColorChange}
                              placeholder="Select Color"
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Tasks
                            </label>
                            <MultiSelectCheckbox
                              items={this.state.tasks?.map((task: any) => {
                                return {
                                  _id: task,
                                  name: task,
                                };
                              })}
                              selected={this.state.selectedTasks}
                              type="Tasks"
                              onChange={this.onTaskChange}
                              placeholder="Select Tasks"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="comment"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
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
                            onClick={() => this.closeStatusModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={this.state.logging}
                            className={
                              "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                            }
                            onClick={this.addStatus}
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

export default connector(AddStatus);
