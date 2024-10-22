export type TResponse<T> = {
  success: boolean;
  status: number;
  data: T;
  [key: PropertyKey]: any;
}

export interface IColumn {
  id: number;
  title: string;
  order: number;
}

export interface ITaskOverview {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  assignees: IUser[];
}

export interface ITasksColumn {
  column_id: number;
  tasks: ITaskOverview[];
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  avatar: string;
}
