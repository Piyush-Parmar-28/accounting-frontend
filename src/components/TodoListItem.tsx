/* This example requires Tailwind CSS v2.0+ */

import { useRef, useState } from "react";
import { formatDate } from "../helpers/formatDate";
import Icon from "./Icon";
import EditTodoForm from "../pages/Todo/Edit";
import agent from "../agent";
// For Drag And Drop
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import { todoList } from "../pages/Todo/Index";

type visibilityType = {
  form?: boolean;
  listItem?: boolean;
  desc?: boolean;
  deleteIcon?: boolean;
};

export interface CardProps {
  id: any;
  text: string;
  order: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  order: number;
  id: string;
  type: string;
}

interface collectedPropTypes {
  isOver: boolean;
  handlerId: Identifier | null;
}

export default function TodoListItem(props: any) {
  const {
    todo,
    getTodos,
    index,
    moveItem,
    todoTemp,
    setTodoData,
    editTodo,
    setLoading,
    onNotify,
    toDoListId,
  } = props;

  const [visibility, setVisibility] = useState<visibilityType>({
    form: false,
    listItem: true,
    desc: false,
    deleteIcon: false,
  });

  let ItemTypes = {
    TODO: "Todo",
    order: todo?.order,
  };

  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, handlerId }, drop] = useDrop<
    DragItem,
    void,
    collectedPropTypes
  >({
    accept: ItemTypes.TODO,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: !!monitor.isOver(),
      };
    },
    drop(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      let dragIndex = item.index;
      let hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // // Determine rectangle on screen
      // const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // // Get vertical middle
      // const hoverMiddleY =
      // 	(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // // Determine mouse position
      // const clientOffset = monitor.getClientOffset();

      // // Get pixels to the top
      // const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // // Only perform the move when the mouse has crossed half of the items height
      // // When dragging downwards, only move when the cursor is below 50%
      // // When dragging upwards, only move when the cursor is above 50%

      // // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      // 	console.log("dragIndex",dragIndex,"hoverIndex",hoverIndex)
      // 	return;
      // }

      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      // 	console.log("dragIndex",dragIndex,"hoverIndex",hoverIndex)
      // 	return;
      // }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: () => {
      return { index: index, id: todo?._id, order: todo?.order };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const temp = {
    toDoId: todo?._id,
    toDoListId: todo.toDoListId,
    organisationId: todo?.organisationId,
    todo: todo?.todo,
    toDo: todo?.toDo,
    description: todo?.description,
    date: todo?.date,
    order: todo?.order,
    reminderDate: todo?.reminderDate,
    recurring: todo?.recurring,
    recurringPeriodCount: todo?.recurringPeriodCount,
  };
  const onStarClick = () => {
    editTodo({ ...temp, star: !todo?.star }, todo?.star ? "unstar" : "star");
    todo.star = !todo?.star;
    getTodos();
  };

  const [status, setStatus] = useState(todo?.status);

  const onCheck = () => {
    if (status === "completed") {
      setStatus("pending");
      agent.Todo.markPending({
        toDoId: todo?._id,
        organisationId: todo?.organisationId,
      })
        .then((res: any) => {
          setLoading({ loading: false });
          onNotify(res.message, "", "success");
        })
        .catch((err: any) => {
          setLoading({ loading: false });
          onNotify(
            "Could not get Todos",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
      getTodos();
    } else if (status === "pending") {
      setStatus("completed");
      agent.Todo.markAsComplete({
        toDoId: todo?._id,
        organisationId: todo?.organisationId,
      })
        .then((res: any) => {
          setLoading({ loading: false });
          onNotify(res.message, "", "success");
        })
        .catch((err: any) => {
          setLoading({ loading: false });
          onNotify(
            "Could not get Todos",
            err?.response?.data?.message || err?.message || err,
            "danger"
          );
        });
      getTodos();
    }
  };

  return (
    <li>
      <div
        ref={ref}
        data-handler-id={handlerId}
        className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${
          isDragging ? "bg-gray-200 opacity-0" : "opacity-100"
        } ${
          isOver ? "border-2 border-dotted border-black" : ""
        } flex items-center justify-between`}
      >
        {visibility.form ? (
          <EditTodoForm
            visibility={visibility}
            setVisibility={setVisibility}
            todo={todo}
            todoTemp={todoTemp}
            setTodoData={setTodoData}
            editTodo={editTodo}
            getTodos={getTodos}
          />
        ) : (
          <div
            className={`relative w-full flex items-center justify-between px-3`}
          >
            <div className="flex-auto cursor-pointer">
              <div className="pr-4 py-2 flex gap-x-4 items-center">
                <input
                  id={`todo-${todo?._id}`}
                  name={`todo-${todo?._id}`}
                  type="checkbox"
                  checked={status === "completed"}
                  onChange={onCheck}
                  className="h-4 w-4 rounded border-gray-400 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                />
                <div
                  className="flex-1 flex flex-col gap-2"
                  onClick={() =>
                    setVisibility({
                      ...visibility,
                      form: !visibility.form,
                      listItem: !visibility.listItem,
                    })
                  }
                >
                  <div
                    className="py-2 pl-4 pr-3 text-sm text-gray-900 sm:pl-2"
                    tabIndex={0}
                  >
                    {todo?.toDo}
                  </div>
                  {visibility.desc && (
                    <div className="pl-4 pr-3 text-sm text-gray-600 sm:pl-2">
                      {todo?.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pl-4 flex-shrink-0 gap-x-3 flex">
              {!toDoListId && (
                <div>
                  <p className="text-sm font-medium cursor-pointer text-gray-700">
                    {todo?.toDoListName}
                  </p>
                </div>
              )}
              <div>{formatDate(todo?.createdAt, false)}</div>
              <div className="mr-4 h-5 flex gap-x-2 items-center">
                <button className="relative isolate grid place-items-center">
                  <input
                    type="checkbox"
                    name="star"
                    id="star"
                    checked={todo?.star}
                    onChange={onStarClick}
                    className="row-span-full col-span-full rounded-md border-transparent z-10 bg-transparent focus:ring-0 opacity-0 peer cursor-pointer"
                  />
                  <Icon
                    name="outline/star"
                    className={`row-span-full col-span-full h-4 w-4 ${
                      todo?.star
                        ? "fill-yellow-500 stroke-yellow-500"
                        : "fill-none stroke-gray-500"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
