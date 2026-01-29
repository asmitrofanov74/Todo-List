import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SortableTodo from "../SortableTodo";
import todoReducer from "../../store/todoSlice";
import type { Todo } from "../../types";

// Моки для DnD
jest.mock("@dnd-kit/sortable", () => ({
  useSortable: jest.fn().mockReturnValue({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: jest.fn().mockReturnValue(""),
    },
  },
}));

describe("SortableTodo Component", () => {
  const mockTodo: Todo = {
    id: 1,
    text: "Test todo item",
    completed: false,
  };

  const defaultProps = {
    todo: mockTodo,
    editingId: null,
    onEditStart: jest.fn(),
    onEditFinish: jest.fn(),
    isOverlay: false,
    inputRef: { current: null },
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        todos: todoReducer,
      },
      preloadedState: {
        todos: [mockTodo],
      },
    });
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <SortableTodo {...defaultProps} {...props} />
      </Provider>,
    );
  };

  test("renders todo item correctly", () => {
    renderComponent();

    expect(screen.getByText("Test todo item")).toBeInTheDocument();
    expect(screen.getByText("≡")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("shows completed todo with strikethrough", () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };
    renderComponent({ todo: completedTodo });

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    const textElement = screen.getByText("Test todo item");
    expect(textElement).toHaveClass("completed");
  });

  test("calls onEditStart when text is double-clicked", () => {
    const mockOnEditStart = jest.fn();
    renderComponent({ onEditStart: mockOnEditStart });

    const textElement = screen.getByText("Test todo item");
    fireEvent.doubleClick(textElement);

    expect(mockOnEditStart).toHaveBeenCalledWith(1, "Test todo item");
  });

  test("shows edit input when editing", () => {
    renderComponent({ editingId: 1 });

    expect(screen.getByDisplayValue("Test todo item")).toBeInTheDocument();
    expect(screen.queryByText("Test todo item")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("calls onEditFinish on blur", () => {
    const mockOnEditFinish = jest.fn();
    renderComponent({ editingId: 1, onEditFinish: mockOnEditFinish });

    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "Updated text" } });
    fireEvent.blur(input);

    expect(mockOnEditFinish).toHaveBeenCalledWith(1, "Updated text");
  });

  test("calls onEditFinish with Enter key", () => {
    const mockOnEditFinish = jest.fn();
    renderComponent({ editingId: 1, onEditFinish: mockOnEditFinish });

    const input = screen.getByDisplayValue("Test todo item");
    fireEvent.change(input, { target: { value: "Updated text" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnEditFinish).toHaveBeenCalledWith(1, "Updated text");
  });

  test("applies dragging styles when isDragging is true", () => {
    // Мокаем isDragging: true
    const mockUseSortable = require("@dnd-kit/sortable").useSortable;
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      transition: null,
      isDragging: true,
    });

    renderComponent();

    const todoItem = screen.getByRole("listitem");
    // Проверяем класс вместо inline-стиля
    expect(todoItem).toHaveClass("todo-item-dragging");
  });

  test("has drag handle for sorting", () => {
    renderComponent();

    const dragHandle = screen.getByText("≡");
    expect(dragHandle).toBeInTheDocument();
    expect(dragHandle).toHaveClass("drag-handle");
  });
});
