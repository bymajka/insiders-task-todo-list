import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/hooks";
import { createNewTodoList, updateTodoList } from "../../app/slices/todosSlice";
import { TodoListFormData, TodoListFormProps } from "../../types/types";

const TodoListForm = ({ listToEdit }: TodoListFormProps) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoListFormData>();

  useEffect(() => {
    if (listToEdit) {
      reset({ name: listToEdit.name });
    } else {
      reset({ name: "" });
    }
  }, [listToEdit, reset]);

  const onSubmit = (data: TodoListFormData) => {
    if (listToEdit) {
      dispatch(updateTodoList({ ...listToEdit, name: data.name }));
    } else {
      dispatch(createNewTodoList(data.name));
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
      <label className="block mb-2">New List Name:</label>

      <input
        {...register("name", { required: "List name is required" })}
        placeholder="Enter todo list name..."
        className="p-2 border border-gray-300 rounded-lg w-full mb-2"
      />

      {errors.name && (
        <p className="text-red-500 mb-2">{errors.name.message}</p>
      )}

      <button
        type="submit"
        className="py-2 px-4 bg-green-500 text-white rounded-lg cursor-pointer"
      >
        {listToEdit ? "Update List" : "Create List"}
      </button>
    </form>
  );
};

export default TodoListForm;
