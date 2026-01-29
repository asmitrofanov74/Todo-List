import todoReducer, {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  reorderTodos,
} from "../../store/todoSlice";
import type { Todo } from "../../types";

describe("todoSlice reducer", () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      text: "First todo",
      completed: false,
    },
    {
      id: 2,
      text: "Second todo",
      completed: true,
    },
  ];

  test("should return initial state (empty array)", () => {
    expect(todoReducer(undefined, { type: "unknown" })).toEqual([]);
  });

  test("should handle addTodo", () => {
    const action = addTodo("New todo");
    const state = todoReducer(mockTodos, action);

    expect(state).toHaveLength(3);
    expect(state[2].text).toBe("New todo");
    expect(state[2].completed).toBe(false);
    expect(typeof state[2].id).toBe("number");
  });

  test("should handle toggleTodo", () => {
    let state = todoReducer(mockTodos, toggleTodo(1));
    expect(state[0].completed).toBe(true);

    state = todoReducer(state, toggleTodo(1));
    expect(state[0].completed).toBe(false);
  });

  test("should handle deleteTodo", () => {
    const state = todoReducer(mockTodos, deleteTodo(1));
    expect(state).toHaveLength(1);
    expect(state[0].id).toBe(2);
  });

  test("should handle editTodo", () => {
    const action = editTodo({ id: 1, text: "Updated text" });
    const state = todoReducer(mockTodos, action);
    expect(state[0].text).toBe("Updated text");
  });

  test("should handle reorderTodos", () => {
    const action = reorderTodos({ from: 1, to: 2 });
    const state = todoReducer(mockTodos, action);
    expect(state[0].id).toBe(2);
    expect(state[1].id).toBe(1);
  });
});
