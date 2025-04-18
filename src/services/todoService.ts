import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { auth } from "../firebase";
import { Todo, TodoList } from "../types/types";
const db = getFirestore();

export const createTodoList = async (name: string) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("No user authenticated");
    throw new Error("User not authenticated");
  }

  try {
    const docRef = await addDoc(collection(db, "todoLists"), {
      name,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    });

    console.log("New To-Do List created with ID:", docRef.id);

    return {
      id: docRef.id,
      name,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    };
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getTodoLists = async () => {
  try {
    const q = query(
      collection(db, "todoLists"),
      where("userId", "==", auth.currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    const todoLists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("To-Do Lists:", todoLists);
    return todoLists;
  } catch (error: any) {
    throw new Error("Error getting To-Do Lists: " + error.message);
  }
};

export const editTodoList = async (id: string, newName: string) => {
  try {
    const todoListRef = doc(db, "todoLists", id);
    await updateDoc(todoListRef, { name: newName });
    return "To-Do List updated!";
  } catch (error: any) {
    throw new Error("Error updating To-Do List: " + error.message);
  }
};

export const deleteTodoList = async (id: string) => {
  try {
    const todoListRef = doc(db, "todoLists", id);
    await deleteDoc(todoListRef);
    return "To-Do List deleted!";
  } catch (error: any) {
    throw new Error("Error deleting To-Do List: " + error.message);
  }
};

export const getTodo = async (todoListId: string): Promise<Todo[]> => {
  try {
    const todoRef = collection(db, "todoLists", todoListId, "todos");
    const querySnapshot = await getDocs(todoRef);
    const todos: Todo[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name, // add this property
      completed: doc.data().completed, // add this property
      todoListId: todoListId, // add this property
      createdAt: doc.data().createdAt.toDate().toISOString(), // 🔁 convert timestamp
      ...doc.data(),
    }));

    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

export const addTodo = async (
  todoListId: string,
  newTodoTitle: string
): Promise<void> => {
  try {
    const todoRef = doc(db, "todos", todoListId);
    const todoDoc = await getDoc(todoRef);
    const todos = todoDoc.exists() ? todoDoc.data()?.todos : [];
    const updatedTodos = [
      ...todos,
      { id: Date.now().toString(), title: newTodoTitle },
    ];
    await updateDoc(todoRef, { todos: updatedTodos });
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

export const updateTodo = async (
  todoListId: string,
  todoId: string,
  newTitle: string
): Promise<void> => {
  try {
    const todoRef = doc(db, "todos", todoListId);
    const todoDoc = await getDoc(todoRef);
    const todos = todoDoc.exists() ? todoDoc.data()?.todos : [];
    const updatedTodos = todos.map((todo: Todo) =>
      todo.id === todoId ? { ...todo, title: newTitle } : todo
    );
    await updateDoc(todoRef, { todos: updatedTodos });
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

export const deleteTodo = async (
  todoListId: string,
  todoId: string
): Promise<void> => {
  try {
    const todoRef = doc(db, "todos", todoListId);
    const todoDoc = await getDoc(todoRef);
    const todos = todoDoc.exists() ? todoDoc.data()?.todos : [];
    const updatedTodos = todos.filter((todo: Todo) => todo.id !== todoId);
    await updateDoc(todoRef, { todos: updatedTodos });
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};
