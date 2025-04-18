import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../../services/todoService";

import { Todo } from "../../types/types";

interface TodoState {
  name: string;
  todos: Todo[] | null;
  //   createdAt: Date;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  name: "",
  todos: [],
  //   createdAt: new Date(),
  loading: false,
  error: null,
};

export const fetchTodo = createAsyncThunk(
  "todo/fetchTasks",
  async (todoListId: string, { rejectWithValue }) => {
    try {
      const tasks = await getTodo(todoListId);
      return tasks;
    } catch (error) {
      return rejectWithValue("Failed to load tasks");
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // For future actions, like clearing the current Todo list, etc.
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
      });
  },
});

export const { setTodoList, clearTodoList } = todosSlice.actions;

export default todosSlice.reducer;
