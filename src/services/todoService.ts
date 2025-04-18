import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { auth } from "../firebase";
import { Todo } from "../types/types";
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

export const getTodo = async (todoListId: string) => {
  try {
    const todoRef = collection(db, "todoLists", todoListId, "todos");
    const querySnapshot = await getDocs(todoRef);
    const todos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

export const addTodo = async (todoListId: string, todo: Omit<Todo, "id">) => {
  try {
    const todosRef = collection(db, "todoLists", todoListId, "todos");
    const docRef = await addDoc(todosRef, todo);
    return { id: docRef.id, ...todo };
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};

export const updateTodo = async (todoListId: string, todo: Todo) => {
  try {
    if (typeof todoListId !== "string" || typeof todo.id !== "string") {
      console.error("Invalid todoListId or todo.id", {
        todoListId,
        todoId: todo.id,
      });
      return;
    }

    const todoRef = doc(db, "todoLists", todoListId, "todos", todo.id);
    await updateDoc(todoRef, {
      name: todo.name,
      description: todo.description,
      completed: todo.completed,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

export const deleteTodo = async (todoListId: string, todoId: string) => {
  try {
    const todoRef = doc(db, "todoLists", todoListId, "todos", todoId);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};
