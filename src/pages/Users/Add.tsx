import React from "react";
import { connect, ConnectedProps } from "react-redux";
import agent from "../../agent";
import Dashboard from "../../components/Dashboard";
import Icon from "../../components/Icon";
import { ADD_GST, ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";
import TagManager from "react-gtm-module";
import { validEmail } from "../../helpers/regex";
import { compose } from "redux";
import {
  managerDefaultRights,
  employeeDefaultRights,
  userRights,
  adminRights,
} from "../../constants/defaultUserRights";
import { withRouter } from "../../helpers/withRouter";

const tagManagerArgs = {
  dataLayer: {
    userId: "001",
    userProject: "TaxAdda",
    page: "gstadd",
  },
  dataLayerName: "PageDataLayer",
};

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
  addGst: (gst: any) =>
    dispatch({
      type: ADD_GST,
      payload: { gst },
    }),
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

//Main Classs
class AddClient extends React.Component<any, PropsFromRedux> {
  state: {
    email: string;
    userRole: string;
    logging: boolean;
    managerRights: any;
    employeeRights: any;
  };

  constructor(props: any) {
    super(props);
    this.onKeyUpFunction = this.onKeyUpFunction.bind(this);
    this.state = {
      email: "",
      userRole: "admin",
      logging: false,
      managerRights: managerDefaultRights,
      employeeRights: employeeDefaultRights,
    };
  }

  onKeyUpFunction(event: any) {
    if (event.keyCode === 13) {
      this.addUser();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyUpFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyUpFunction, false);
  }

  addUser = () => {
    const { email, userRole, managerRights, employeeRights } = this.state;
    const isEmailValid = validEmail.test(email);
    const organisation = (this.props as any).currentOrganisation._id;
    const role = userRole;
    const userRightsList =
      role === "manager"
        ? managerRights
        : role === "employee"
        ? employeeRights
        : adminRights;
    if (email !== "" && isEmailValid) {
      this.setState({ logging: true });
      agent.User.addUser(organisation, email, role, userRightsList)
        .then((response: any) => {
          console.log({ response });
          this.setState({ logging: false });
          (this.props as any).onNotify(
            "Invitation sent",
            "Successfully sent an invitation.",
            "success"
          );
          this.props.navigate(`/${organisation}/user/list`);
        })
        .catch((err: any) => {
          this.setState({ logging: false });
          (this.props as any).onNotify(
            "Failed to add the user",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
          console.log("ADD USER ERROR", { err });
        });
    } else {
      if (email === "") {
        (this.props as any).onNotify(
          "Empty Email Field",
          "Email Field is Required!.",
          "danger"
        );
      } else if (!isEmailValid) {
        (this.props as any).onNotify(
          "Incorrect Email",
          "Please enter a valid Email to proceed.",
          "danger"
        );
      }
    }
  };

  cancelHandler = () => {
    const organisationId =
      (this.props as any).params.organisationId ||
      (this.props as any).currentOrganisation._id;
    this.props.navigate(`/${organisationId}/user/list`);
  };

  updateState = (field: string) => (ev: any) => {
    this.setState({
      [field]: ev.target.value,
    });
  };

  userRoleHandler = (userRole: string) => {
    this.setState({ userRole });
  };

  userRole = [
    { id: "admin", title: "Admin" },
    { id: "manager", title: "Manager" },
    { id: "employee", title: "Employee" },
  ];

  isRightChecked = (first: string, second: string) => {
    const role = this.state.userRole;
    if (role === "manager") {
      const rights = this.state.managerRights;
      if (second) {
        return rights[first][second];
      }
      return rights[first];
    } else if (role === "employee") {
      const rights = this.state.employeeRights;
      if (second) {
        return rights[first][second];
      }
      return rights[first];
    } else {
      return;
    }
  };

  onRightsChange = (right: string, type: string) => {
    const role = this.state.userRole;
    if (role === "manager") {
      if (type) {
        this.setState({
          managerRights: {
            ...this.state.managerRights,
            [right]: {
              ...this.state.managerRights[right],
              [type]: !this.state.managerRights[right][type],
            },
          },
        });
      } else {
        this.setState({
          managerRights: {
            ...this.state.managerRights,
            [right]: !this.state.managerRights[right],
          },
        });
      }
    } else if (role === "employee") {
      if (type) {
        this.setState({
          employeeRights: {
            ...this.state.employeeRights,
            [right]: {
              ...this.state.employeeRights[right],
              [type]: !this.state.employeeRights[right][type],
            },
          },
        });
      } else {
        this.setState({
          employeeRights: {
            ...this.state.employeeRights,
            [right]: !this.state.employeeRights[right],
          },
        });
      }
    }
  };

  onViewChange = (updatedView: string) => {
    this.setState({
      managerRights: {
        ...this.state.managerRights,
        taskRights: {
          ...this.state.managerRights.taskRights,
          view: updatedView,
        },
      },
    });
  };

  onMarkTaskChange = () => {
    const role = this.state.userRole;
    if (role === "manager") {
      this.setState({
        managerRights: {
          ...this.state.managerRights,
          taskRights: {
            ...this.state.managerRights.taskRights,
            markTasksAs: {
              ...this.state.managerRights.taskRights.markTasksAs,
              complete:
                !this.state.managerRights.taskRights.markTasksAs.complete,
              ignoreTracking:
                !this.state.managerRights.taskRights.markTasksAs.ignoreTracking,
              notRequired:
                !this.state.managerRights.taskRights.markTasksAs.notRequired,
            },
          },
        },
      });
    } else if (role === "employee") {
      this.setState({
        employeeRights: {
          ...this.state.employeeRights,
          taskRights: {
            ...this.state.employeeRights.taskRights,
            markTasksAs: {
              ...this.state.employeeRights.taskRights.markTasksAs,
              complete:
                !this.state.employeeRights.taskRights.markTasksAs.complete,
              ignoreTracking:
                !this.state.employeeRights.taskRights.markTasksAs
                  .ignoreTracking,
              notRequired:
                !this.state.employeeRights.taskRights.markTasksAs.notRequired,
            },
          },
        },
      });
    }
  };

  resetUserRights = () => {
    const role = this.state.userRole;
    if (role === "manager") {
      this.setState({ managerRights: managerDefaultRights });
    } else if (role === "employee") {
      this.setState({ employeeRights: employeeDefaultRights });
    }
  };

  render() {
    TagManager.dataLayer(tagManagerArgs);
    console.log("ADD USER STATE", this.state);
    return (
      <Dashboard>
        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 gstadd">
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Add User
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 lg:col-span-2">
                      <label
                        htmlFor="company_website"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="company_website"
                          value={this.state.email}
                          onChange={this.updateState("email")}
                          id="company_website"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User Role
                    </label>
                    <fieldset className="mt-2">
                      <legend className="sr-only">User Role</legend>
                      <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        {this.userRole.map((user) => (
                          <div key={user.id} className="flex items-center">
                            <input
                              id={user.id}
                              name="user-role"
                              type="radio"
                              checked={user.id === this.state.userRole}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer"
                              onChange={() => this.userRoleHandler(user.id)}
                            />
                            <label
                              htmlFor={user.id}
                              className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {user.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  <div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 lg:col-span-2 flex items-center justify-between">
                        <div className="text-sm leading-5 text-gray-500">
                          Know about user rights here.
                        </div>
                        {(this.state.userRole === "manager" ||
                          this.state.userRole === "employee") && (
                          <button
                            type="button"
                            className="text-sm text-indigo-700 underline"
                            onClick={this.resetUserRights}
                          >
                            Reset to default
                          </button>
                        )}
                      </div>
                    </div>

                    {this.state.userRole === "admin" && (
                      <div className="mt-4 text-sm leading-5 text-gray-500">
                        Admin has all the rights including change in settings,
                        change in plan and add another users.
                      </div>
                    )}
                    {(this.state.userRole === "manager" ||
                      this.state.userRole === "employee") && (
                      <div className="mt-4 grid grid-cols-3 gap-6">
                        {/* Task Rights */}
                        <div className="col-span-3 lg:col-span-2">
                          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                            <thead>
                              <tr className="divide-x divide-gray-300">
                                <th
                                  scope="col"
                                  className="py-3 pl-6 text-left text-sm font-medium text-gray-900"
                                >
                                  Tasks
                                </th>
                                <th
                                  scope="col"
                                  className="py-3 pl-6 pr-4 text-center text-sm font-medium text-gray-900"
                                >
                                  Rights
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="divide-x divide-gray-300">
                                <td className="w-10/12 pt-2 pl-6 pr-4 pb-3 text-sm text-gray-700">
                                  Create
                                </td>
                                <td className="w-2/12 ">
                                  <div className="flex justify-center">
                                    <input
                                      id={"create-task"}
                                      name={"create-task"}
                                      type="checkbox"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer rounded"
                                      checked={this.isRightChecked(
                                        "taskRights",
                                        "create"
                                      )}
                                      onChange={() =>
                                        this.onRightsChange(
                                          "taskRights",
                                          "create"
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="divide-x divide-gray-300">
                                <td className="w-10/12 pt-2 pl-6 pr-4 py-3 text-sm text-gray-700">
                                  Edit
                                </td>
                                <td className="w-2/12 ">
                                  <div className="flex justify-center">
                                    <input
                                      id={"edit-task"}
                                      name={"edit-task"}
                                      type="checkbox"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                      checked={this.isRightChecked(
                                        "taskRights",
                                        "edit"
                                      )}
                                      onChange={() =>
                                        this.onRightsChange(
                                          "taskRights",
                                          "edit"
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                              <tr className="divide-x divide-gray-300">
                                <td className="w-10/12 pt-2 pl-6 pr-4 py-3 text-sm text-gray-700">
                                  Delete
                                </td>
                                <td className="w-2/12 ">
                                  <div className="flex justify-center">
                                    <input
                                      id={"delete-task"}
                                      name={"delete-task"}
                                      type="checkbox"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                      checked={this.isRightChecked(
                                        "taskRights",
                                        "delete"
                                      )}
                                      onChange={() =>
                                        this.onRightsChange(
                                          "taskRights",
                                          "delete"
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>

                              <tr className="divide-x divide-gray-300">
                                <td className="w-10/12 pt-2 pl-6 pr-4 py-3 text-sm text-gray-700">
                                  View
                                </td>
                                <td className="w-2/12 "></td>
                              </tr>
                              <>
                                {this.state.userRole === "manager" && (
                                  <>
                                    <tr className="divide-x divide-gray-300">
                                      <td className="w-10/12 pb-4 pl-10 pr-4 text-sm text-gray-700">
                                        <ul className="list-disc list-inside">
                                          <li> All Task</li>
                                        </ul>
                                      </td>
                                      <td className="w-2/12 ">
                                        <div className="flex justify-center">
                                          <input
                                            id={"all-task"}
                                            name={"all-task"}
                                            type="checkbox"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                            checked={
                                              this.isRightChecked(
                                                "taskRights",
                                                "view"
                                              ) === "all tasks"
                                            }
                                            onChange={() =>
                                              this.onViewChange("all tasks")
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr className="divide-x divide-gray-300">
                                      <td className="w-10/12 pb-4 pl-10 pr-4 text-sm text-gray-700">
                                        <ul className="list-disc list-inside">
                                          <li>
                                            All tasks other than those alloted
                                            to admins only
                                          </li>
                                        </ul>
                                      </td>
                                      <td className="w-2/12 ">
                                        <div className="flex justify-center">
                                          <input
                                            id={"task"}
                                            name={"task"}
                                            type="checkbox"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                            checked={
                                              this.isRightChecked(
                                                "taskRights",
                                                "view"
                                              ) ===
                                              "all tasks other than those alloted to admins only"
                                            }
                                            onChange={() =>
                                              this.onViewChange(
                                                "all tasks other than those alloted to admins only"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                )}

                                {this.state.userRole === "employee" && (
                                  <tr className="divide-x divide-gray-300">
                                    <td className="w-10/12 pb-4 pl-10 pr-4 text-sm text-gray-700">
                                      <ul className="list-disc list-inside">
                                        <li>Alloted to him/her</li>
                                      </ul>
                                    </td>
                                    <td className="w-2/12 ">
                                      <div className="flex justify-center">
                                        <input
                                          id={"task"}
                                          name={"task"}
                                          type="checkbox"
                                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                          defaultChecked={
                                            this.isRightChecked(
                                              "taskRights",
                                              "view"
                                            ) === "him or her"
                                          }
                                          disabled
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>

                              <tr className="divide-x divide-gray-300">
                                <td className="w-10/12 pt-2 pl-6 pr-4 py-3 text-sm text-gray-700">
                                  Mark tasks as complete, ignore tracking or not
                                  required
                                </td>
                                <td className="w-2/12 ">
                                  <div className="flex justify-center">
                                    <input
                                      id={"mark-task"}
                                      name={"mark-task"}
                                      type="checkbox"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                      checked={
                                        Object.values(
                                          this.isRightChecked(
                                            "taskRights",
                                            "markTasksAs"
                                          )
                                        ).includes(false)
                                          ? false
                                          : true
                                      }
                                      onChange={this.onMarkTaskChange}
                                    />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Client, Tag, Status,  Users */}
                        {userRights.map((rights: any) => {
                          return (
                            <div
                              key={rights.id}
                              className="col-span-3 lg:col-span-2"
                            >
                              <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                                <thead>
                                  <tr className="divide-x divide-gray-300">
                                    <th
                                      scope="col"
                                      className="py-3 pl-6 text-left text-sm font-medium text-gray-900"
                                    >
                                      {rights.name}
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3 pl-6 pr-4 text-center text-sm font-medium text-gray-900"
                                    >
                                      Rights
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rights.options.map((option: any) => {
                                    return (
                                      <tr
                                        key={option.id}
                                        className="divide-x divide-gray-300"
                                      >
                                        <td className="w-10/12 pt-2 pl-6 pr-4 py-3 text-sm text-gray-700">
                                          {option.name}
                                        </td>
                                        <td className="w-2/12 ">
                                          <div className="flex justify-center">
                                            <input
                                              id={option.id}
                                              name={option.id}
                                              type="checkbox"
                                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 cursor-pointer rounded"
                                              checked={this.isRightChecked(
                                                rights.id,
                                                option.action
                                              )}
                                              onChange={() =>
                                                this.onRightsChange(
                                                  rights.id,
                                                  option.action
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}

                        {/* Receipts and payments */}
                        <div className="col-span-3 lg:col-span-2">
                          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                            <thead>
                              <tr className="divide-x divide-gray-300">
                                <th
                                  scope="col"
                                  className="py-3 pl-6 text-left text-sm font-medium text-gray-900"
                                >
                                  Receipts and Payments
                                </th>
                                <th
                                  scope="col"
                                  className="py-3 pl-6 pr-4 text-center text-sm font-medium text-gray-900"
                                >
                                  Rights
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="divide-x divide-gray-300">
                                <td className="w-10/12 pt-2 pl-6 pr-4 py-3 text-sm text-gray-700">
                                  Receipts and Payments
                                </td>
                                <td className="w-2/12 ">
                                  <div className="flex justify-center">
                                    <input
                                      id={"receipts-and-payments"}
                                      name={"receipts-and-payments"}
                                      type="checkbox"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                      checked={this.isRightChecked(
                                        "reciptsAndPayments",
                                        ""
                                      )}
                                      onChange={() =>
                                        this.onRightsChange(
                                          "reciptsAndPayments",
                                          ""
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* Register in and out  */}
                        <div className="col-span-3 lg:col-span-2">
                          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                            <thead>
                              <tr className="divide-x divide-gray-300">
                                <th
                                  scope="col"
                                  className="py-3 pl-6 text-left text-sm font-medium text-gray-900"
                                >
                                  Register In and Out
                                </th>
                                <th
                                  scope="col"
                                  className="py-3 pl-6 pr-4 text-center text-sm font-medium text-gray-900"
                                >
                                  Rights
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="divide-x divide-gray-300">
                                <td className="w-10/12 pt-2 pl-6 pr-4 py-3 text-sm text-gray-700">
                                  Register In and Out
                                </td>
                                <td className="w-2/12 ">
                                  <div className="flex justify-center">
                                    <input
                                      id={"register-in-and-out"}
                                      name={"register-in-and-out"}
                                      type="checkbox"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-400 rounded"
                                      checked={this.isRightChecked(
                                        "registerInAndOut",
                                        ""
                                      )}
                                      onChange={() =>
                                        this.onRightsChange(
                                          "registerInAndOut",
                                          ""
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:justify-end">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2  text-base bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-32 sm:text-sm"
                    onClick={this.cancelHandler}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={this.state.logging}
                    className={
                      "mt-3 sm:ml-4 w-full inline-flex items-center justify-center rounded-md border border-transparent border-gray-300 shadow-sm py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:mt-0 sm:w-32 sm:text-sm"
                    }
                    onClick={this.addUser}
                  >
                    <span className="w-full flex justify-end">
                      {this.state.logging ? (
                        <Icon name="loading" className="mr-2" />
                      ) : null}
                    </span>
                    <span>Invite</span>
                    <span className="w-full"></span>
                  </button>
                </div>
                {/* <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:justify-end">
                  <button
                    type="button"
                    onClick={this.addUser}
                    disabled={this.state.logging}
                    className={
                      !this.state.logging
                        ? "inline-flex disabled justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        : "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    }
                  >
                    {this.state.logging ? <Icon name="loading" /> : null}
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={this.cancelHandler}
                    className="inline-flex mx-4 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none "
                  >
                    Cancel
                  </button>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </Dashboard>
    );
  }
}

export default compose(connector, withRouter)(AddClient) as React.ComponentType;
