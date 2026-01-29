export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type Filter = "all" | "active" | "completed";

export interface SortableTodoProps {
  todo: Todo;
  isOverlay?: boolean;
  editingId: number | null;
  onEditStart: (id: number, text: string) => void;
  onEditFinish: (id: number, text: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}
