<template>
  <Card :pt="{
    body: () => ({
      class: ['!py-2']
    })
  }" :style="styles">
    <template #title>Thay đổi thành viên</template>
    <template #content>
      <ul>
        <li>
          Thành viên trong thẻ
        </li>
        <li v-for="user of editedTask?.assignees" :key="user.id">
          <button class="flex flex-row items-center justify-start w-full h-10 bg-transparent m-0 pl-1 pr-2 py-1">
            <Avatar :image="user.avatar" size="normal" class="mr-2" />
            <div class="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap mr-2">
              {{ user.username }}
            </div>
          </button>
        </li>
        <li>
          Thành viên trong không gian làm việc
        </li>
        <li v-for="user of usersNotAssigned" :key="user.id">
          <button type="button"
            class="flex flex-row items-center justify-start w-full h-10 bg-transparent m-0 pl-1 pr-2 py-1"
            @click="onAssignUser(user.id)">
            <Avatar :image="user.avatar" size="normal" class="mr-2" />
            <div class="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap mr-2">
              {{ user.username }}
            </div>
          </button>
        </li>
      </ul>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const tasksStore = useTasksStore();
const { updateTaskDetail } = tasksStore;
const { editedTask } = storeToRefs(tasksStore);
const { closeMenuTask } = useModalsStore();

defineProps({
  styles: {
    type: Object,
    required: true
  }
})
const config = useRuntimeConfig();

const onAssignUser = async (userId: number) => {
  const user = users.value.find(user => user.id === userId);
  if (user) {
    const assignees = editedTask.value?.assignees.concat(user);
    const assignees_id = assignees?.map(assignee => assignee.id) ?? [];
    await useFetch<TResponse<ITaskOverview>>(`/tasks/${editedTask.value?.id}`, {
      baseURL: config.public.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.public.token}`,
      },
      body: JSON.stringify({
        assignees_id: assignees_id
      }),
      method: "PUT",
      onResponse: (response) => {
        if (response.response._data.success) {
          updateTaskDetail({
            ...editedTask.value,
            assignees
          });
        }
      },
    })
    updateTaskDetail({
      ...editedTask.value,
      assignees
    });
    closeMenuTask();
  }
}

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const usersNotAssigned = computed(() => {
  return users.value.filter(user => !editedTask.value?.assignees.some(assignee => assignee.id === user.id));
});
</script>

<style scoped>
.p-card {
  padding: 0;
}
</style>