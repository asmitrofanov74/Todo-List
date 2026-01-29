import React, { useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { addTodo, editTodo, reorderTodos } from "../store/todoSlice";
import type { Filter } from "../types";
import SortableTodo from "./SortableTodo";

const TodoList: React.FC = () => {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const addHandler = () => {
    if (!text.trim()) return;
    dispatch(addTodo(text));
    setText("");
  };

  const handleEditStart = useCallback((id: number) => {
    setEditingId(id);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleEditFinish = useCallback(
    (id: number, newText: string) => {
      if (newText.trim()) {
        dispatch(editTodo({ id, text: newText }));
      }
      setEditingId(null);
    },
    [dispatch],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        dispatch(
          reorderTodos({
            from: active.id as number,
            to: over?.id as number,
          }),
        );
      }
      setActiveId(null);
    },
    [dispatch],
  );

  const activeTodo = todos.find((t) => t.id === activeId) || null;

  const filterButtons = [
    { value: "all" as Filter, label: "Все" },
    { value: "active" as Filter, label: "Активные" },
    { value: "completed" as Filter, label: "Выполненные" },
  ];

  return (
    <div className="todo-list-container">
      <h1 className="todo-list-title">🧾 Todo List Pro</h1>

      <div className="add-todo-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="💡 Что нужно сделать?"
          className="todo-input"
          onKeyDown={(e) => e.key === "Enter" && addHandler()}
        />
        <button
          onClick={addHandler}
          disabled={!text.trim()}
          className="add-todo-btn"
        >
          ➕ Добавить
        </button>
      </div>

      <div className="filter-container">
        <div className="filter-buttons">
          {filterButtons.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`filter-btn ${filter === value ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="todos-count">
          Всего: <span className="todos-count-number">{todos.length}</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={filteredTodos.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="todos-list">
            {filteredTodos.map((todo) => (
              <SortableTodo
                key={todo.id}
                todo={todo}
                editingId={editingId}
                onEditStart={handleEditStart}
                onEditFinish={handleEditFinish}
                inputRef={inputRef as React.RefObject<HTMLInputElement>}
              />
            ))}
          </ul>
        </SortableContext>

        <DragOverlay>
          {activeTodo ? (
            <SortableTodo
              todo={activeTodo}
              isOverlay={true}
              editingId={null}
              onEditStart={handleEditStart}
              onEditFinish={handleEditFinish}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TodoList;
