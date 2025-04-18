import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./slices/todosSlice";
import todoReducer from "./slices/todoSlice";

export const store = configureStore({
  reducer: {
    todoLists: todosReducer,
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
