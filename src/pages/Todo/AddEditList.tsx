import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import agent from "../../agent";
import { useDispatch } from "react-redux";
import { onNotify } from "../../store/reducers/notification";
import Icon from "../../components/Icon";
import { formatDate } from "../../helpers/formatDate";
import SelectMenu from "../../components/SelectMenu";

const AddList = ({
  props,
  closeModal,
}: {
  props?: any;
  closeModal: (fetchAgain: boolean) => void;
}) => {
  const [name, setName] = useState("");
  const [logging, setLogging] = useState(false);
  const dispatch = useDispatch();

  const nameHandleChange = (e: any) => {
    setName(e.target.value);
  };

  useEffect(() => {
    props?.currentModal?.modalName === "EDIT_LIST_MODAL" &&
      setName(props?.currentModal?.data[0]?.name);
  }, []);

  const [todoList, setTodoList] = useState<any>([]);

  const getTodoList = (organisationId: any) => {
    agent.Todo.getAllTodoListOfUser(organisationId)
      .then((response: any) => {
        setTodoList(response.toDoList);
      })
      .catch((error: any) => {
        return error;
      });
  };

  useEffect(() => {
    props?.currentModal?.modalName === "ADD_TODO_MODAL" &&
      getTodoList(props?.currentOrganisation?._id);
  }, []);

  const addList = (e: any) => {
    const organisationId = props.params?.organisationId;
    e.preventDefault();
    if (name !== "") {
      setLogging(true);
      agent.Todo.addList({ name, organisationId })
        .then((response: any) => {
          setLogging(false);
          getTodoList(props.params?.organisationId);
          dispatch(
            onNotify("List Added", "Successfully added a new list.", "success")
          );
          closeModal(true);
        })
        .catch((err: any) => {
          setLogging(false);
          dispatch(
            onNotify(
              "Could not add the list",
              err?.response?.data?.message || err?.message || err,
              "danger"
            )
          );
        });
    } else {
      dispatch(
        onNotify("Empty Name Field", "List Name Field is Required!.", "danger")
      );
    }
  };

  const editList = (e: any) => {
    const organisationId = props.params?.organisationId;
    e.preventDefault();
    if (name !== "") {
      setLogging(true);
      agent.Todo.todoListRename({
        name,
        organisationId,
        toDoListId: props?.currentModal?.data[0]?._id,
      })
        .then((response: any) => {
          setLogging(false);
          getTodoList(organisationId);
          dispatch(
            onNotify(
              "List Renamed",
              "Successfully renamed the list.",
              "success"
            )
          );
          closeModal(true);
        })
        .catch((err: any) => {
          setLogging(false);
          dispatch(
            onNotify(
              "Could not rename the list",
              err?.response?.data?.message || err?.message || err,
              "danger"
            )
          );
        });
    } else {
      dispatch(
        onNotify("Empty Name Field", "List Name Field is Required!.", "danger")
      );
    }
  };

  const todoTemp = {
    toDo: "",
    organisationId: props?.currentOrganisation?._id,
    toDoListId: "",
    description: "",
    date: new Date(),
    star: false,
    reminderDate: new Date(),
    recurring: false,
    recurringPeriodCount: 1,
  };
  const [todoData, setTodoData] = useState(todoTemp);

  const onChange = (e: any) => {
    setTodoData({
      ...todoData,
      [e.target.name]: e.target.value,
    });
    console.log(todoData);
  };

  const addTodo = (todo: any) => {
    setLogging(true);
    agent.Todo.create(todo)
      .then((res: any) => {
        setLogging(false);
        dispatch(onNotify(res.message, "", "success"));
        closeModal(true);
      })
      .catch((err: any) => {
        setLogging(false);
        dispatch(
          onNotify(
            "Could not create Todo",
            err?.response?.data?.error || err?.message || err,
            "danger"
          )
        );
      });
  };

  const handleSave = () => {
    setLogging(true);
    if (todoData.toDo === "") {
      dispatch(
        onNotify("Empty Todo Field", "Todo Field is Required!.", "danger")
      );
    } else if (todoData.toDoListId === "") {
      dispatch(
        onNotify("Empty List Field", "Todo List Field is Required!.", "danger")
      );
    } else if (todoData.description === "") {
      dispatch(
        onNotify(
          "Empty Description Field",
          "Description Field is Required!.",
          "danger"
        )
      );
    } else {
      addTodo(todoData);
      setTodoData(todoTemp);
      setLogging(false);
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Transition.Root
      show={
        props?.currentModal?.modalName === "ADD_LIST_MODAL" ||
        props?.currentModal?.modalName === "EDIT_LIST_MODAL" ||
        props?.currentModal?.modalName === "ADD_TODO_MODAL"
      }
      as={Fragment}
      afterLeave={() => {
        setName("");
      }}
      appear
    >
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => closeModal(false)}
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
                    {props?.currentModal?.modalName === "ADD_LIST_MODAL"
                      ? "Add List"
                      : props?.currentModal?.modalName === "EDIT_LIST_MODAL"
                      ? "Edit List"
                      : "Add Todo"}
                  </h3>
                </div>
                <div>
                  {props?.currentModal?.modalName === "ADD_LIST_MODAL" ||
                  props?.currentModal?.modalName === "EDIT_LIST_MODAL" ? (
                    <form
                      onSubmit={
                        props?.currentModal?.modalName === "ADD_LIST_MODAL"
                          ? addList
                          : editList
                      }
                    >
                      <div className="mt-4">
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="text"
                              name="name"
                              value={name}
                              onChange={nameHandleChange}
                              id="name"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                              placeholder="Name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                        <button
                          type="button"
                          disabled={logging}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:w-auto sm:text-sm"
                          onClick={
                            props?.currentModal?.modalName === "ADD_LIST_MODAL"
                              ? addList
                              : editList
                          }
                        >
                          {logging ? <Icon name="logging" /> : null}
                          Save
                        </button>
                        <button
                          type="button"
                          className="mt-3 sm:ml-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={() => closeModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form
                      className={`w-full mt-4 bg-white flex-col sm:items-center`}
                      onSubmit={onSubmit}
                    >
                      <div className="w-full relative">
                        <div className="flex gap-4">
                          <label
                            htmlFor={`addTodoModalToDo`}
                            className="sr-only"
                          >
                            Add New Todo
                          </label>
                          <input
                            type="text"
                            name="toDo"
                            id={`addTodoModalToDo`}
                            value={todoData?.toDo}
                            onChange={onChange}
                            placeholder="Add New Todo"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-600 pr-20"
                            onKeyPress={(e: any) => {
                              if (e.charCode === 13) {
                                handleSave();
                              }
                            }}
                          />
                          <div className={`flex absolute right-4`}>
                            <input
                              type="date"
                              name="reminderDate"
                              id={`addTodoModalReminderDate`}
                              value={formatDate(todoData?.reminderDate, true)}
                              onChange={onChange}
                              className={`placeholder-gray-600 sm:text-sm bg-transparent outline-none cursor-pointer text-gray-600 text-sm w-[4.18rem] transition-[width] duration-300 -mr-2 border-none focus:border-none focus:outline-none focus:shadow-none focus:bg-white`}
                              onClick={(e) =>
                                ((e.target as HTMLInputElement).style.width =
                                  "8.1rem")
                              }
                              onFocus={(e) =>
                                ((e.target as HTMLInputElement).style.width =
                                  "8.1rem")
                              }
                              onBlur={(e) =>
                                ((e.target as HTMLInputElement).style.width =
                                  "4.16rem")
                              }
                            />
                            <button
                              className={`relative isolate grid place-items-center rounded-md`}
                              tabIndex={-1}
                            >
                              <input
                                type="checkbox"
                                name="star"
                                id="addTodoModalStar"
                                checked={todoData?.star}
                                onChange={() =>
                                  setTodoData({
                                    ...todoData,
                                    star: !todoData?.star,
                                  })
                                }
                                className="row-span-full col-span-full rounded-md w-full h-full px-2 border-transparent z-10 bg-transparent focus:ring-0 opacity-0 cursor-pointer peer"
                              />
                              <Icon
                                name="outline/star"
                                className={`row-span-full col-span-full h-4 w-4 ${
                                  todoData?.star
                                    ? "fill-yellow-500 stroke-yellow-500"
                                    : "fill-none stroke-gray-500"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        <label
                          htmlFor={`addTodoModalDescription`}
                          className="sr-only"
                        >
                          Todo Description
                        </label>
                        <textarea
                          name="description"
                          id={`addTodoModalDescription`}
                          value={todoData?.description}
                          onChange={onChange}
                          placeholder={`Description 2000 char max.\n\n(Shift + Enter for new line.)`}
                          className={`block min-w-full min-h-[6rem] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mt-2 placeholder-gray-600`}
                          onKeyPress={(e: any) => {
                            if (e.charCode === 13 && !e.shiftKey) {
                              // Don't generate a new line
                              e.preventDefault();
                              handleSave();
                            }
                          }}
                        />
                        <div className="w-full mt-2">
                          <SelectMenu
                            items={todoList}
                            selected={
                              todoList.find(
                                (list: any) => list._id === todoData?.toDoListId
                              ) || { name: "Select List" }
                            }
                            onChange={(selected: any) => {
                              setTodoData({
                                ...todoData,
                                toDoListId: selected._id,
                              });
                            }}
                            className="appearance-none text-gray-600 py-1 cursor-pointer hover:bg-indigo-300 hover:text-white"
                          />
                        </div>
                        <div
                          className={`flex items-center justify-between mt-2 ml-3 relative`}
                        >
                          <p
                            className={`text-[15px] font-medium text-gray-600`}
                          >
                            Press Enter To Save Todo
                          </p>
                          <div className="mt-5 sm:mt-4 sm:flex sm:justify-end">
                            <button
                              type="button"
                              disabled={logging}
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:w-auto sm:text-sm"
                              onClick={handleSave}
                            >
                              {logging ? <Icon name="logging" /> : null}
                              Save
                            </button>
                            <button
                              type="button"
                              className="mt-3 sm:ml-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                              onClick={() => closeModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddList;
