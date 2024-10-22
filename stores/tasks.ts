import { defineStore } from "pinia";
import type { ITaskOverview, ITasksColumn } from "./types";

interface State {
  selectedTask: ITaskOverview | null;
  editedTask: ITaskOverview | null;
  tasks: ITasksColumn[];
}

export const useTasksStore = defineStore("tasks", {
  state: (): State => ({
    selectedTask: null,
    editedTask: null,
    tasks: [],
  }),
  actions: {
    addMultiTasks(columnId: number, tasks: ITaskOverview[]) {
      this.tasks = this.tasks.concat({
        column_id: columnId,
        tasks,
      });
    },
    setSelectedTask(task: ITaskOverview) {
      this.selectedTask = task;
    },
    quickUpdatedTask(columnId: number, taskId: string) {
      const editedTask = this.tasks
        .find((column) => column.column_id === columnId)
        ?.tasks.find((task) => task.id === taskId);
      this.editedTask = editedTask ?? null;
    },
    updateTaskDetail(task: Partial<ITaskOverview>) {
      this.tasks = this.tasks.map((column) => ({
        ...column,
        tasks: column.tasks.map((t) => {
          if (t.id === task.id) {
            return {
              ...t,
              title: task.title ?? t.title,
              slug: task.slug ?? t.slug,
              assignees: task.assignees ?? t.assignees,
            };
          }
          return t;
        }),
      }));
    },
  },
  getters: {
    getTasksByColumnId: (state) => (columnId: number) => {
      return state.tasks.find((column) => column.column_id === columnId);
    },
  },
});
