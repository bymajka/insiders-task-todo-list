import { TodoCardProps } from "../../types/types";
import { useAppDispatch } from "../../app/hooks";
import { deleteTodo } from "../../app/slices/todoSlice";

const TodoCard = ({ todo, onEdit }: TodoCardProps) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteTodo({ todoListId: todo.todoListId, todoId: todo.id })
      ).unwrap();
    } catch (error) {
      console.error("Error deleting Todo:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-all">
      <h3 className="text-lg font-semibold">{todo.name}</h3>
      <p className="text-gray-600">{todo.description}</p>
      <p
        className={`mt-1 font-medium ${
          todo.completed ? "text-green-600" : "text-yellow-600"
        }`}
      >
        {todo.completed ? "✅ Completed" : "⌛ Pending"}
      </p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onEdit}
          className="inline-block text-sm text-blue-600 hover:font-semibold cursor-pointer"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="inline-block text-sm text-red-600 hover:font-semibold cursor-pointer"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
