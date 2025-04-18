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
  createdAt: Date;
  todoListId: string;
};

export type TodoListOrUndefined = TodoList | undefined;
