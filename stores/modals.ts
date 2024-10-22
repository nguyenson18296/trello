import { defineStore } from 'pinia';

interface State {
  isTaskModalOpen: boolean;
  isMenuTaskOpen: boolean;
}

export const useModalsStore = defineStore('modals', {
  state: (): State => ({
    isTaskModalOpen: false,
    isMenuTaskOpen: false,
  }),
  actions: {
    toggleTaskModal() {
      this.isTaskModalOpen = !this.isTaskModalOpen;
    },
    openMenuTask() {
      this.isMenuTaskOpen = !this.isMenuTaskOpen;
    },
    closeMenuTask() {
      this.isMenuTaskOpen = false;
    }
  },
})
