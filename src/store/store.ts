import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";
import type { Todo } from "../types";

export const loadState = (): { todos: Todo[] } | undefined => {
  try {
    const serialized = localStorage.getItem("todos");
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized);
    if (Array.isArray(parsed.todos)) return { todos: parsed.todos };
  } catch (e) {
    console.warn(e);
  }
  return undefined;
};

export const saveState = (state: { todos: Todo[] }) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem("todos", serialized);
  } catch (e) {
    console.warn(e);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
