import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toggleTodo, deleteTodo } from "../store/todoSlice";
import type { SortableTodoProps } from "../types";

const SortableTodo: React.FC<SortableTodoProps> = ({
  todo,
  isOverlay = false,
  editingId,
  onEditStart,
  onEditFinish,
  inputRef,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      dispatch(toggleTodo(todo.id));
    },
    [dispatch, todo.id],
  );

  const deleteHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      dispatch(deleteTodo(todo.id));
    },
    [dispatch, todo.id],
  );

  const handleTextDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      onEditStart(todo.id, todo.text);
    },
    [onEditStart, todo.id, todo.text],
  );

  const isEditing = editingId === todo.id;

  const todoItemClasses = `todo-item ${isDragging ? "todo-item-dragging" : ""} ${isOverlay ? "todo-item-overlay" : ""}`;
  const todoTextClasses = `todo-text ${todo.completed ? "completed" : ""}`;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={todoItemClasses}
      {...attributes}
    >
      <div
        className="drag-handle"
        {...listeners}
        title="Перетащите для сортировки"
      >
        ≡
      </div>

      <div className="todo-content">
        {isEditing ? (
          <input
            ref={inputRef}
            className="todo-edit-input"
            defaultValue={todo.text}
            autoFocus
            onBlur={(e) => onEditFinish(todo.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEditFinish(todo.id, (e.target as HTMLInputElement).value);
              }
              if (e.key === "Escape") {
                onEditFinish(todo.id, todo.text);
              }
            }}
          />
        ) : (
          <>
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={toggleHandler}
            />
            <span
              className={todoTextClasses}
              onDoubleClick={handleTextDoubleClick}
              title="Двойной клик для редактирования"
            >
              {todo.text}
            </span>
          </>
        )}
      </div>

      {!isEditing && (
        <button
          onClick={deleteHandler}
          className="delete-todo-btn"
          title="Удалить задачу"
        >
          🗑️
        </button>
      )}
    </li>
  );
};

export default SortableTodo;
