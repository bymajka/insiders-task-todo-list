import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTodoLists } from "../app/slices/todosSlice";
import TodoListForm from "../components/ToDoList/TodoListForm";
import TodoListCard from "../components/ToDoList/TodoListCard";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { lists, loading, error } = useAppSelector((state) => state.todoLists);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingList, setEditingList] = useState(null);

  useEffect(() => {
    dispatch(fetchTodoLists());
  }, [dispatch, lists.length]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleEdit = (list: any) => {
    setEditingList(list);
    setShowCreateForm(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">📋 Your To-Do Lists</h1>

      <button
        onClick={() => {
          setShowCreateForm((prev) => !prev);
          setEditingList(null);
        }}
        className="bg-blue-500 text-white px-6 py-3 rounded mb-6 cursor-pointer"
      >
        {showCreateForm ? "Cancel" : "Add Todo List"}
      </button>

      {showCreateForm && <TodoListForm listToEdit={editingList} />}

      <ul className="list-none p-0 grid gap-4">
        {lists && lists.length > 0 ? (
          lists.map((list) => (
            <TodoListCard
              key={list.id}
              list={list}
              onEdit={() => handleEdit(list)}
            />
          ))
        ) : (
          <p>No to-do lists found.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
