import { defineStore } from "pinia";
import type { ITaskOverview, ITasksColumn } from "./types";

interface State {
  selectedTask: ITaskOverview | null;
  tasks: ITasksColumn[];
}

export const useTasksStore = defineStore("tasks", {
  state: (): State => ({
    selectedTask: null,
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
    updateTaskDetail(task: Partial<ITaskOverview>) {
      this.tasks = this.tasks.map((column) => {
        column.tasks = column.tasks.map((t) => {
          if (t.id === task.id) {
            const updated = {
              ...t,
              title: task.title ?? "",
              slug: task.slug ?? "",
            };
            console.log("updated", updated);
            return updated;
          }
          return t;
        });
        return column;
      });
    },
  },
});
