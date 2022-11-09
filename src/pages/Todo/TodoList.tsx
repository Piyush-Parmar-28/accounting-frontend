// For Drag And Drop
import update from "immutability-helper";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import agent from "../../agent";
import TodoListItem from "../../components/TodoListItem";

const TodoList = (props: any) => {
  const {
    todos,
    setTodoData,
    getTodos,
    editTodo,
    setLoading,
    onNotify,
    organisationId,
    toDoListId,
  } = props;

  interface Item {
    id: number;
    toDo: string;
  }

  const [todoArray, setTodoArray] = useState(todos);

  useEffect(() => {
    setTodoArray(todos);
  }, [todos]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setTodoArray((prevArray: Item[]) =>
      update(prevArray, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevArray[dragIndex] as Item],
        ],
      })
    );
    const newOrder = (): number => {
      if (hoverIndex === 0) {
        return todos[hoverIndex].order + 512;
      } else if (hoverIndex === todos.length - 1) {
        return todos[hoverIndex].order - 512;
      } else if (dragIndex > hoverIndex) {
        return Math.floor(
          (todos[hoverIndex].order + todos[hoverIndex + 1].order) / 2
        );
      } else if (dragIndex < hoverIndex) {
        return Math.ceil(
          (todos[hoverIndex].order + todos[hoverIndex - 1].order) / 2
        );
      }
      return todos[dragIndex].order;
    };
    console.log(todos, todos);
    console.log(todos[dragIndex]?.toDo);
    console.log("dragIndex", dragIndex);
    console.log("hoverIndex", hoverIndex);
    console.log("hoverOrder", todos[hoverIndex].order);
    console.log("newOrder", newOrder());
    agent.Todo.reorder(organisationId, todos[dragIndex]?._id, newOrder());

    getTodos();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-3 shadow-sm ring-2 ring-black ring-opacity-5">
        <ul className="shadow-sm ring-2 ring-black ring-opacity-5">
          {todoArray.map((todo: any, index: number) => (
            <TodoListItem
              key={todo?._id}
              todo={todo}
              moveItem={moveItem}
              index={index}
              setTodoData={setTodoData}
              getTodos={getTodos}
              editTodo={editTodo}
              setLoading={setLoading}
              onNotify={onNotify}
              toDoListId={toDoListId}
            />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
};

export default TodoList;
