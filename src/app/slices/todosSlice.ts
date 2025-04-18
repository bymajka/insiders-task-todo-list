import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createTodoList,
  getTodoLists,
  deleteTodoList as deleteTodoListService,
  editTodoList as updateTodoListService,
} from "../../services/todoService";
import { TodoList } from "../../types/types";

interface TodosState {
  lists: TodoList[];
  loading: boolean;
  createdAt: string;
  error: string | null;
  userId: string;
}

const initialState: TodosState = {
  lists: [],
  loading: false,
  createdAt: new Date().toISOString(),
  error: null,
  userId: "",
};

export const fetchTodoLists = createAsyncThunk(
  "todos/fetchTodoLists",
  async (_, thunkAPI) => {
    try {
      const data = await getTodoLists();
      return data as TodoList[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createNewTodoList = createAsyncThunk(
  "todos/createTodoList",
  async (name: string, thunkAPI) => {
    try {
      const data = await createTodoList(name);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteTodoList = createAsyncThunk(
  "todos/deleteTodoList",
  async (id: string, thunkAPI) => {
    try {
      await deleteTodoListService(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateTodoList = createAsyncThunk(
  "todos/updateTodoList",
  async ({ id, name }: { id: string; name: string }, thunkAPI) => {
    try {
      await updateTodoListService(id, name);
      return { id, name };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchTodoLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        createNewTodoList.fulfilled,
        (state, action: PayloadAction<TodoList>) => {
          state.lists.push(action.payload);
        }
      )
      .addCase(createNewTodoList.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTodoList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((list) => list.id !== action.payload);
      })
      .addCase(deleteTodoList.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateTodoList.fulfilled, (state, action) => {
        const updatedList = action.payload;
        const index = state.lists.findIndex(
          (list) => list.id === updatedList.id
        );
        if (index !== -1) {
          state.lists[index] = {
            ...state.lists[index],
            name: updatedList.name,
          };
        }
      })
      .addCase(updateTodoList.rejected, (state, action) => {
        state.error = action.payload as string | null;
      });
  },
});

export const {} = todosSlice.actions;

export default todosSlice.reducer;
