import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TodoList from "../TodoList";
import todoReducer from "../../store/todoSlice";

jest.mock("../SortableTodo", () => () => (
  <li data-testid="mock-todo">Mock Todo</li>
));
jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: any) => <div>{children}</div>,
  closestCenter: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  PointerSensor: jest.fn(),
  DragOverlay: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => <div>{children}</div>,
  verticalListSortingStrategy: jest.fn(),
}));

describe("TodoList Component", () => {
  test("renders basic elements", () => {
    const store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: { todos: [] },
    });

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>,
    );

    expect(screen.getByText("🧾 Todo List Pro")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("💡 Что нужно сделать?"),
    ).toBeInTheDocument();
  });
});
