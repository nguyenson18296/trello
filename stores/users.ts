import type { IUser } from './types';

interface State {
  users: IUser[];
}

export const useUsersStore = defineStore('users', {
  state: (): State => ({
    users: [],
  }),
  actions: {
    addUsers(users: IUser[]) {
      this.users = users;
    }
  }
});
