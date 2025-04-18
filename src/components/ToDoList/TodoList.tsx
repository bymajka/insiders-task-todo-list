import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTodo } from "../../app/slices/todoSlice";
import TodoCard from "../ToDo/TodoCard";
import TodoForm from "../ToDo/TodoForm";
import { Todo } from "../../types/types";

const TodoList = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { todos, loading, error } = useAppSelector((state) => state.todos);

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTodo(id));
    }
  }, [id, dispatch]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 m-6">
      <div className="lg:w-1/3 w-full p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingTodo ? "Edit Todo" : "Create New Todo"}
        </h2>
        <TodoForm editingTodo={editingTodo} setEditingTodo={setEditingTodo} />
      </div>

      <div className="lg:w-2/3 w-full">
        <h2 className="text-2xl font-bold mb-4">Todo List</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {todos?.length === 0 ? (
          <p>No todos found.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
            {todos?.map((todo) => (
              <TodoCard
                key={`${todo.id}-${todo.name}`}
                todo={todo}
                onEdit={() => setEditingTodo(todo)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
