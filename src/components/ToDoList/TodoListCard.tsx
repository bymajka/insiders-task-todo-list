import { Link } from "react-router-dom";
import { TodoListCardProps } from "../../types/types";
import { useAppDispatch } from "../../app/hooks";
import { deleteTodoList } from "../../app/slices/todosSlice";

const ToDoListCard = ({ list, onEdit }: TodoListCardProps) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(deleteTodoList(list.id)).unwrap();
    } catch (error) {
      console.error("Error deleting To-Do List:", error);
    }
  };

  return (
    <li
      key={list.id}
      className="border border-gray-300 rounded-lg p-4 bg-gray-100 flex flex-row justify-between"
    >
      <div>
        <Link
          to={`/dashboard/${list.id}`}
          className="text-gray-800 text-xl font-semibold hover:text-blue-600"
        >
          {list.name}
        </Link>
        <p className="text-sm text-gray-500 mt-2">
          Created: {new Date(list.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <button
          className="bg-blue-500 text-white px-14 py-2 rounded cursor-pointer"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-14 py-2 rounded cursor-pointer"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default ToDoListCard;
