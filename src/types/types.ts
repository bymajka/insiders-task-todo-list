export type TodoList = {
  id: string;
  name: string;
  createdAt: string;
  todos: Todo[];
  userId: string;
};

export type Todo = {
  id: string;
  name: string;
  completed: boolean;
  description: string;
  createdAt: Date;
  todoListId: string;
  collaborators: string[];
};

export type TodoListOrUndefined = TodoList | undefined;
export type TodoFormData = {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
};
export interface TodosState {
  lists: TodoList[];
  loading: boolean;
  createdAt: string;
  error: string | null;
  userId: string;
}
export interface TodoState {
  name: string;
  todos: Todo[] | null;
  loading: boolean;
  error: string | null;
}
export interface TodoCardProps {
  todo: Todo;
  onEdit: () => void;
}
export interface TodoListCardProps {
  list: TodoList;
  onEdit: () => void;
}
export type TodoListFormData = {
  name: string;
};
export interface TodoListFormProps {
  listToEdit: TodoList | null; // Allow for both new and edit cases
}
