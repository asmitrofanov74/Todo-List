import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../types";

export const initialState: Todo[] = [];

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now(),
        text: action.payload.trim(),
        completed: false,
      };
      if (newTodo.text) state.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return state.filter((t) => t.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo && action.payload.text.trim())
        todo.text = action.payload.text.trim();
    },

    reorderTodos: (
      state,
      action: PayloadAction<{ from: number; to: number }>,
    ) => {
      const { from, to } = action.payload;
      const fromIndex = state.findIndex((t) => t.id === from);
      const toIndex = state.findIndex((t) => t.id === to);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      const [movedTodo] = state.splice(fromIndex, 1);
      state.splice(toIndex, 0, movedTodo);
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      return action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  reorderTodos,
  setTodos,
} = todoSlice.actions;
export default todoSlice.reducer;
