import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
// Pagination
import ReactPaginate from "react-paginate";
import { connect, ConnectedProps } from "react-redux";
// Link backend
import agent from "../../agent";
// Dashboard import
import Dashboard from "../../components/Dashboard";
// Redux Notify
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";
import { compose } from "redux";
import { withRouter } from "../../helpers/withRouter";
import Icon from "../../components/Icon";
// TOdo
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import AddEditList from "./AddEditList";
import DeleteModal from "../../components/DeleteModal";
import { Navigate } from "react-router";

//Redux mapping
const mapStateToProps = (state: any) => ({
  ...state.notification,
  ...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
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

export let todoList: any[] = [];

export const getTodoList = (organisationId: any) => {
  agent.Todo.getAllTodoListOfUser(organisationId)
    .then((response: any) => {
      todoList = response.toDoList;
    })
    .catch((error: any) => {
      return error;
    });
};

class Todos extends React.Component<any, PropsFromRedux> {
  state: {
    loading: boolean;
    rotate: boolean;
    showBackDrop: boolean;
    searchText: string;
    totalRecords: number;
    displayTodosDetails: any;
    typingTimeout: number;
    modalOpen: boolean;
    showDeleteModal: boolean;
    toDoListId: string;
    organisationId: string;
    list: string;
    todos: any;
    status: boolean;
    todoTemp: any;
    itemStatus: boolean;
    todoAdded: boolean;
    todoEdited: boolean;
    todoDeleted: boolean;
    listAdded: boolean;
    todoListNameChanged: boolean;
    active: boolean;
    users: any;
    showShareModal: boolean;
    listDeleted: boolean;
    selectedRow: any;
    reorder: false;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      rotate: false,
      showBackDrop: false,
      searchText: "",
      totalRecords: 0,
      displayTodosDetails: [],
      typingTimeout: 0,
      modalOpen: false,
      showDeleteModal: false,
      status: false,
      todos: [],
      toDoListId: (this.props as any).params?.toDoListId,
      organisationId: (this.props as any).params?.organisationId,
      list: "",
      todoTemp: {
        toDo: "",
        description: "",
        date: new Date(),
        star: false,
        reminderDate: new Date(),
        recurring: false,
        recurringPeriodCount: 1,
      },
      itemStatus: false,
      todoAdded: false,
      todoEdited: false,
      todoDeleted: false,
      listAdded: false,
      todoListNameChanged: false,
      active: true,
      users: [],
      showShareModal: false,
      listDeleted: false,
      selectedRow: {},
      reorder: false,
    };
  }

  setReorder = (reorder: any) => {
    this.setState({ reorder: reorder });
  };

  openAddListModal = () => {
    (this.props as any).updateCommon({
      currentModal: { modalName: "ADD_LIST_MODAL", fetchAgain: false },
    });
  };

  openEditListModal = (list: any) => {
    (this.props as any).updateCommon({
      currentModal: {
        modalName: "EDIT_LIST_MODAL",
        fetchAgain: false,
        data: list,
      },
    });
  };

  closeModal = (fetchAgain: boolean) => {
    (this.props as any).updateCommon({
      currentModal: { modalName: "", fetchAgain },
    });
  };

  setLoading = (loading: boolean) => {
    this.setState({ loading: loading });
  };

  onActionClick = (e: any) => {
    this.setState({
      showBackDrop: true,
      rotate: true,
    });
  };

  onDropdownClick = () => {
    this.setState({
      rotate: false,
      showBackDrop: false,
      showShareModal: false,
    });
  };

  openDeleteModal = (todolist: any) => {
    console.log(todolist, todolist._id);
    this.setState({ selectedRow: todolist, showBackDrop: false });
    this.deleteModalSetOpen(true);
  };
  deleteModalSetOpen = (open: boolean) => {
    this.setState({
      showDeleteModal: open,
    });
  };

  setTodoData = (data: any) => {
    this.setState({
      todoTemp: {
        organisationId: this.state.organisationId,
        toDoListId: this.state.toDoListId,
        ...data,
      },
    });
  };

  getTodos = (forSearch: boolean, status: boolean, toDoListId: string) => {
    const searchText = forSearch ? this.state.searchText : "";
    this.setState({ loading: true });
    agent.Todo.getAllTodoOfList(
      this.state.organisationId,
      toDoListId,
      status ? "completed" : "pending",
      searchText
    )
      .then((response: any) => {
        this.setState({
          todos: response.todos,
          loading: false,
        });
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not load Todos",
          err?.response?.data?.error || err?.message || err,
          "danger"
        );
      });
  };

  getCompletedTodos = () => {
    if (this.state.status) {
      this.setState({ status: false });
    } else {
      this.setState({ status: true });
    }
  };

  handleSearchTextChange = (ev: any) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      searchText: ev.target.value,
      typingTimeout: setTimeout(() => {
        this.getTodos(true, this.state.status, this.state.toDoListId);
      }, 700),
    });
  };

  addTodo = (todo: any) => {
    this.setState({ loading: true });
    agent.Todo.create(todo)
      .then((res: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(res.message, "", "success");
        this.getTodos(false, this.state.status, this.state.toDoListId);
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not create Todo",
          err?.response?.data?.error || err?.message || err,
          "danger"
        );
      });
  };

  editTodo = (todo: any, message?: string) => {
    this.setState({ loading: true });
    agent.Todo.edit(todo)
      .then((res: any) => {
        this.setState({ loading: false, todoEdited: true });
        (this.props as any).onNotify(
          message === "star"
            ? "Todo Stared Successfully"
            : message === "unstar"
            ? "Todo Unstared Successfully"
            : res.message,
          "",
          "success"
        );
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not edit Todo",
          err?.response?.data?.error || err?.message || err,
          "danger"
        );
      });
  };

  getTodoSpecificCases = (type: string, status: string) => {
    this.setState({ loading: true });
    agent.Todo.todoSpecificCases(
      this.state.organisationId,
      type,
      status,
      this.state.searchText
    )
      .then((res: any) => {
        this.setState({ loading: false, todos: res.todos });
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not get Todos",
          err?.response?.data?.error || err?.message || err,
          "danger"
        );
      });
  };

  getUsersList = () => {
    this.setState({ loading: true });
    agent.User.getUserList(this.state.organisationId, this.state.active, "")
      .then((response: any) => {
        this.setState({
          users: response.users,
          loading: false,
        });
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not load Organisation Details",
          err?.response?.data?.error || err?.message || err,
          "danger"
        );
      });
  };

  addUserToTodoList = (userId: string) => {
    this.setState({ loading: true });
    agent.Todo.addUserToTodoList({
      toDoListId: this.state.toDoListId,
      users: [userId],
      organisationId: this.state.organisationId,
    })
      .then((res: any) => {
        this.setState({
          loading: false,
          showBackDrop: false,
          showShareModal: false,
        });
        (this.props as any).onNotify(res.message, "", "success");
      })
      .catch((err: any) => {
        this.setState({ loading: false });
        (this.props as any).onNotify(
          "Could not add user to Todo List",
          err?.response?.data?.error || err?.message || err,
          "danger"
        );
      });
  };

  componentDidMount() {
    this.setState({
      toDoListId: (this.props as any).params.toDoListId,
    });
    getTodoList(this.state.organisationId);
    if (this.props.params.list === "starred") {
      this.setState({ list: "starred" });
      this.getTodoSpecificCases(
        "starred",
        this.state.status ? "completed" : "pending"
      );
    } else {
      this.setState({ toDoListId: this.props.params.toDoListId, list: "" });
      this.getTodos(
        false,
        this.props.params.status,
        this.props.params.toDoListId
      );
    }

    this.getUsersList();
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.params.toDoListId !== this.props.params.toDoListId) {
      this.setState({ toDoListId: this.props.params.toDoListId, list: "" });
      this.getTodos(
        false,
        this.props.params.status,
        this.props.params.toDoListId
      );
      console.log(
        "component did update",
        prevProps.params.toDoListId,
        this.props.params.toDoListId
      );
    }

    if (prevState.status !== this.state.status) {
      this.getTodos(false, this.state.status, this.props.params.toDoListId);
    }

    // "today", "overdue", "next7Days", "starred"
    if (
      prevProps.params.list !== this.props.params.list &&
      this.props.params.list === "today"
    ) {
      this.setState({ list: "today" });
      this.getTodoSpecificCases(
        "today",
        this.state.status ? "completed" : "pending"
      );
    } else if (
      prevProps.params.list !== this.props.params.list &&
      this.props.params.list === "overdue"
    ) {
      this.setState({ list: "overdue" });
      this.getTodoSpecificCases(
        "overdue",
        this.state.status ? "completed" : "pending"
      );
    } else if (
      prevProps.params.list !== this.props.params.list &&
      this.props.params.list === "week"
    ) {
      this.setState({ list: "week" });
      this.getTodoSpecificCases(
        "next7Days",
        this.state.status ? "completed" : "pending"
      );
    } else if (
      prevProps.params.list !== this.props.params.list &&
      this.props.params.list === "starred"
    ) {
      this.setState({ list: "starred" });
      this.getTodoSpecificCases(
        "starred",
        this.state.status ? "completed" : "pending"
      );
    }
  }

  render() {
    return (
      <Dashboard>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              {this.state?.list?.toLowerCase().slice(0, 1).toUpperCase() +
                this.state?.list?.slice(1) ||
                todoList?.filter(
                  (list) => list?._id === this.state?.toDoListId
                )[0]?.name}
            </h1>
          </div>
          <div className="flex justify-between mt-6 relative">
            {((this.props as any)?.currentModal?.modalName ===
              "ADD_LIST_MODAL" ||
              (this.props as any)?.currentModal?.modalName ===
                "EDIT_LIST_MODAL") && (
              <AddEditList props={this.props} closeModal={this.closeModal} />
            )}
            <Menu as="div" className="inline-block relative">
              <Menu.Button
                onClick={this.onActionClick}
                className="relative w-28 inline-flex gap-x-2 items-center justify-between px-2 py-2 sm:pl-4 sm:pr-2 sm:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <span>Options</span>
                <Icon
                  name="dropdown-arrow"
                  className={`h-5 w-5 ${this.state.rotate ? "rotate-90" : ""}`}
                  aria-hidden="true"
                />
              </Menu.Button>
              {this.state.showBackDrop && (
                <div
                  className="fixed top-0 left-0 z-10 w-full h-screen"
                  onClick={this.onDropdownClick}
                ></div>
              )}

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className="absolute z-[100]">
                  <Menu.Items className="overscroll-none mt-2 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        <button
                          className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                          onClick={() =>
                            this.openEditListModal(
                              todoList.filter(
                                (list) => list._id === this.state.toDoListId
                              )
                            )
                          }
                        >
                          <Icon name="edit" className="h-5 w-5 mr-2" />
                          <span>Edit Name</span>
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                          onClick={() => {
                            this.setState({
                              showShareModal: true,
                              showBackDrop: true,
                            });
                          }}
                        >
                          <Icon name="share" className="h-5 w-5 mr-2" />
                          <span>Share List</span>
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          className="flex items-center w-full p-1 px-4 py-2 text-sm hover:bg-gray-100 text-gray-900"
                          onClick={() =>
                            this.openDeleteModal(
                              todoList?.filter(
                                (list) => list?._id === this.state?.toDoListId
                              )[0]
                            )
                          }
                        >
                          <Icon name="delete" className="h-5 w-5 mr-2" />
                          <span>Delete List</span>
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </div>
              </Transition>
            </Menu>
            {this.state.showShareModal && (
              <div className="absolute z-[100] top-12 py-2 px-3 max-w-max overscroll-none rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <optgroup label="Select User" className="text-sm">
                  {this.state.users.map((user: any) => (
                    <option
                      key={user._id}
                      value={user._id}
                      onClick={() => this.addUserToTodoList(user._id)}
                      className="pt-2 pl-2 text-sm hover:bg-gray-100 text-gray-900 cursor-pointer"
                    >
                      {user.name}
                    </option>
                  ))}
                </optgroup>
              </div>
            )}
            {this.state.showDeleteModal && (
              <DeleteModal
                type={"todo list"}
                state={this.state}
                onLoad={() => {
                  getTodoList(this.state.organisationId);
                  this.setState({ list: "today" });
                  this.getTodoSpecificCases(
                    "today",
                    this.state.status ? "completed" : "pending"
                  );
                }}
                deleteModalSetOpen={this.deleteModalSetOpen}
              />
            )}
            <div className="w-64 sm:w-80">
              <input
                id="name"
                name="name"
                type="text"
                value={this.state.searchText}
                onChange={this.handleSearchTextChange}
                placeholder="Search by ToDo Name or Description"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              className="relative inline-flex items-center px-2 sm:px-4 sm:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              onClick={this.openAddListModal}
            >
              <Icon name="add" className="h-3.5 w-3.5 mr-2" />
              Add List
            </button>
          </div>
          {this.state.list === "" && (
            <>
              <div className="relative flex items-start max-w-7xl mx-auto mt-6">
                <div className="flex h-5 items-center">
                  <input
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={this.state.status}
                    onChange={this.getCompletedTodos}
                    className="h-4 w-4 rounded border-gray-400 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="status"
                    className="font-medium cursor-pointer text-gray-700"
                  >
                    Show Completed Todos
                  </label>
                </div>
              </div>
              <TodoForm
                todoTemp={this.state.todoTemp}
                setTodoData={this.setTodoData}
                addTodo={this.addTodo}
              />
            </>
          )}
          {this.state.todos.length > 0 ? (
            <TodoList
              todos={this.state.todos}
              setTodoData={this.setTodoData}
              getTodos={() =>
                this.getTodos(
                  false,
                  this.state.status,
                  this.props.params.toDoListId
                )
              }
              editTodo={this.editTodo}
              setLoading={this.setLoading}
              onNotify={this.props.onNotify}
              organisationId={this.state.organisationId}
              toDoListId={this.state.toDoListId}
            />
          ) : (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <p className="text-gray-400 text-xl mt-4">No Todo Found</p>
              </div>
            </div>
          )}
        </div>
      </Dashboard>
    );
  }
}

export default compose(connector, withRouter)(Todos) as React.ComponentType;
