import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTodo } from "../../app/slices/todoSlice";

const TodoList = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { todos, loading, error } = useAppSelector((state) => state.todos);
  // const [editedTaskId, setEditedTaskId] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTodo(id)); // Assuming this fetches tasks for a list
    }
  }, [dispatch, id]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Todos for List {id}</h2>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
