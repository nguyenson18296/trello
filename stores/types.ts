export type TResponse<T> = {
  success: boolean;
  status: number;
  data: T;
  [key: PropertyKey]: any;
};

export interface IColumn {
  id: number;
  title: string;
  order: number;
}

export interface ITaskOverview {
  id: string;
  banner?: string;
  title: string;
  slug: string;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  assignees: IUser[];
  labels: TLabelColor[];
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

export type TLabelColor = {
  id: string;
  color: string;
  title: string;
};

export interface IUnPlashImage {
  id: string;
  slug: string;
  description: string;
  alt_description: string;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    first_name: string;
    last_name: string;
    name: string;
  }
}
