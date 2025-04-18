import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTodo,
  addTodo,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from "../../services/todoService";

import { Todo, TodoState } from "../../types/types";

const initialState: TodoState = {
  name: "",
  todos: [],
  loading: false,
  error: null,
};

export const fetchTodo = createAsyncThunk(
  "todo/fetchTasks",
  async (todoListId: string, { rejectWithValue }) => {
    try {
      const tasks = await getTodo(todoListId);
      return tasks as Todo[];
    } catch (error) {
      return rejectWithValue("Failed to load tasks");
    }
  }
);

export const createTodo = createAsyncThunk(
  "todo/createTask",
  async (todo: Todo, { rejectWithValue }) => {
    try {
      await addTodo(todo.todoListId, todo);
      return todo;
    } catch (error) {
      return rejectWithValue("Failed to create task");
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todo/updateTask",
  async (todo: Todo, { rejectWithValue }) => {
    try {
      await updateTodoService(todo.todoListId, todo);
      return todo;
    } catch (error) {
      return rejectWithValue("Failed to update task");
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/deleteTask",
  async (
    { todoListId, todoId }: { todoListId: string; todoId: string },
    { rejectWithValue }
  ) => {
    try {
      await deleteTodoService(todoListId, todoId);
      return todoId;
    } catch (error) {
      return rejectWithValue("Failed to delete task");
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodoList: (state, action) => {
      state.todos = action.payload;
    },
    clearTodoList: (state) => {
      state.todos = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        if (state.todos) {
          state.todos.push(action.payload);
        }
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        if (state.todos) {
          const index = state.todos.findIndex(
            (todo) => todo.id === action.payload.id
          );
          if (index !== -1) {
            state.todos[index] = { ...state.todos[index], ...action.payload };
          } else {
            console.error("Todo not found for update:", action.payload.id);
          }
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        if (state.todos) {
          state.todos = state.todos.filter(
            (todo) => todo.id !== action.payload
          );
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setTodoList, clearTodoList } = todosSlice.actions;

export default todosSlice.reducer;
