import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/hooks";
import { createTodo, updateTodo } from "../../app/slices/todoSlice";
import { TodoFormData, Todo } from "../../types/types";
import { useParams } from "react-router-dom";

const TodoForm = ({
  editingTodo,
  setEditingTodo,
}: {
  editingTodo: Todo | null;
  setEditingTodo: (todo: Todo | null) => void;
}) => {
  const dispatch = useAppDispatch();
  const { id: todoListId } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TodoFormData>();

  useEffect(() => {
    if (editingTodo) {
      setValue("name", editingTodo.name);
      setValue("description", editingTodo.description);
      setValue("completed", editingTodo.completed);
    } else {
      reset();
    }
  }, [editingTodo, reset, setValue]);

  const onSubmit = (data: TodoFormData) => {
    if (editingTodo) {
      dispatch(updateTodo({ ...editingTodo, ...data }));
      setEditingTodo(null);
    } else {
      dispatch(createTodo({ ...data, todoListId } as Todo));
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Todo name"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <input
          {...register("description", { required: "Description is required" })}
          placeholder="Todo description"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("completed")} />
        <label>Completed</label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {editingTodo ? "Update" : "Create"}
        </button>
        {editingTodo && (
          <button
            type="button"
            onClick={() => {
              setEditingTodo(null);
              reset();
            }}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
