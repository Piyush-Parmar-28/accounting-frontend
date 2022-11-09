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
  onLoad?: (forSearch: boolean) => void;
  editModalSetOpen?: (open: boolean) => void;
  state?: any;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class EditCustomField extends React.Component<Props, PropsFromRedux> {
  state: {
    logging: boolean;
    name: string;
    type: string;
    applicableFor: string;
    description: string;
  };

  constructor(props: any) {
    super(props);
    this.onKeyUpFunction = this.onKeyUpFunction.bind(this);
    this.state = {
      logging: false,
      name: this.props.state.selectedRow.name,
      type: this.props.state.selectedRow.type,
      applicableFor: this.props.state.selectedRow.applicableFor,
      description: this.props.state.selectedRow.description,
    };
  }

  onKeyUpFunction(event: any) {
    if (event.keyCode === 27) {
      this.setOpen(false);
    }

    if (event.keyCode === 13) {
      this.editCustomField();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  editCustomField = () => {
    const customFieldId = this.props.state.selectedRow._id;
    const organisationId = (this.props as any).currentOrganisation._id;
    const name = this.state.name;
    const applicableFor = this.state.applicableFor;
    const type = this.state.type;
    const description = this.state.description;
    if (name !== "" && type !== "") {
      this.setState({ logging: true });
      agent.CustomField.editCustomField(
        customFieldId,
        name,
        description,
        type,
        applicableFor,
        organisationId
      )
        .then((response: any) => {
          this.setState({ logging: false });
          (this.props as any).addNotification(
            "Custom Field Edited",
            "Successfully edited a field.",
            "success"
          );

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
    } else {
      if (!name) {
        (this.props as any).addNotification(
          "Empty Name Field",
          "Name Field is Required!.",
          "danger"
        );
      } else if (!type) {
        (this.props as any).addNotification(
          "Type not Selected",
          "Type is Required!.",
          "danger"
        );
      }
    }
  };

  setOpen = (open: boolean) => {
    (this.props as any).editModalSetOpen(open);
  };

  onLoad = () => {
    (this.props as any).onLoad();
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
          show={(this.props as any).state.showEditModal}
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
                <div className="w-80 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Edit Custom Field
                      </h3>
                    </div>
                    <div>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Name <span className="text-red-600">*</span>
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="field_name"
                                value={this.state.name}
                                onChange={this.updateState("name")}
                                id="field_name"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Name"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Applicable For{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <fieldset className="mt-2">
                              <legend className="sr-only">
                                Applicable For
                              </legend>
                              <div className="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                <div className="flex items-center">
                                  <input
                                    id={"client"}
                                    name="applicableFor"
                                    type="radio"
                                    value={"client"}
                                    checked={
                                      this.state.applicableFor === "client"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState("applicableFor")}
                                  />
                                  <label
                                    htmlFor={"client"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Clients
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id={"contactperson"}
                                    name="applicableFor"
                                    type="radio"
                                    value={"contactperson"}
                                    checked={
                                      this.state.applicableFor ===
                                      "contactperson"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState("applicableFor")}
                                  />
                                  <label
                                    htmlFor={"contactperson"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Contact Person
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id={"task"}
                                    name="applicableFor"
                                    type="radio"
                                    value={"task"}
                                    checked={
                                      this.state.applicableFor === "task"
                                    }
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                                    onChange={this.updateState("applicableFor")}
                                  />
                                  <label
                                    htmlFor={"task"}
                                    className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Task
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                          {/* <div className="mt-4">
                            <label
                              htmlFor="heading"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Heading
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="date"
                                name="heading"
                                id="heading"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                placeholder="Anniversary Date"
                              />
                            </div>
                          </div> */}
                          <div className="mt-4">
                            <label
                              htmlFor="type"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Type <span className="text-red-600">*</span>
                            </label>
                            <select
                              id="type"
                              name="type"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              value={this.state.type}
                              onChange={this.updateState("type")}
                            >
                              <option value={""}>Select Type</option>
                              <option value={"boolean"}>Yes/No</option>
                              <option value={"date"}>Date</option>
                              <option value={"shorttext"}>Short Text</option>
                              <option value={"longtext"}>Long Text</option>
                            </select>
                          </div>
                          <div className="mt-4">
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
                            onClick={() => this.setOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={this.state.logging}
                            className={
                              "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                            }
                            onClick={this.editCustomField}
                          >
                            <span className="w-full flex justify-end">
                              {this.state.logging ? (
                                <Icon name="loading" className="mr-2" />
                              ) : null}
                            </span>
                            <span>Update</span>
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

export default connector(EditCustomField);
