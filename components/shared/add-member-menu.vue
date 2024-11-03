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
        <li v-for="user of currentAssignees" :key="user.id">
          <button
            type="button"
            @click="onRemoveUserFromTask(user.id)"
            class="flex flex-row items-center justify-between w-full h-10 bg-transparent m-0 pl-1 pr-2 py-1 hover:bg-[#091e420f]"
          >
            <div class="flex items-center">
              <Avatar :image="user.avatar" size="normal" class="mr-2" />
              <div class="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap mr-2">
                <span>
                  {{ user.username }}
                </span>
              </div>
            </div>
            <Button icon="pi pi-times" text rounded aria-label="Filter" />
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
const { updateTaskDetail, setSelectedTask } = tasksStore;
const { selectedTask } = storeToRefs(tasksStore);
const { closeMenuTask } = useModalsStore();

defineProps({
  styles: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['remove', 'add']);
const config = useRuntimeConfig();

const currentAssignees = ref<ITaskOverview["assignees"]>(selectedTask.value?.assignees ?? []);

watch(() => selectedTask.value?.assignees, (newValue) => {
  currentAssignees.value = newValue ?? [];
});

const onAssignUser = async (userId: number) => {
  const user = users.value.find(user => user.id === userId);
  if (user) {
    const assignees = currentAssignees.value.concat(user);
    const assignees_id = assignees?.map(assignee => assignee.id) ?? [];
    await useFetch<TResponse<ITaskOverview>>(`/tasks/${(selectedTask).value?.id}`, {
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
            ...selectedTask.value,
            assignees
          });
          currentAssignees.value = assignees;
          emits('add', userId);
          setSelectedTask({
            ...selectedTask.value,
            assignees
          });
          closeMenuTask();
        }
      },
    })
  }
}

const onRemoveUserFromTask = async (userId: number) => {
  await useFetch<TResponse<ITaskOverview>>(`/tasks/${selectedTask.value?.id}/remove-assignee/${userId}`, {
    baseURL: config.public.apiUrl,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.public.token}`,
    },
    onResponse: (response) => {
      if (response.response._data.success) {
        const assignees = selectedTask.value?.assignees.filter(assignee => assignee.id !== userId);
        updateTaskDetail({
          ...selectedTask.value,
          assignees
        });
        if (assignees) {
          currentAssignees.value = assignees;
          setSelectedTask({
            ...selectedTask.value,
            assignees
          });
        }
        emits('remove', userId);
        closeMenuTask();
      }
    },
  })
}

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const usersNotAssigned = computed(() => {
  return users.value.filter(user => !currentAssignees.value.some(assignee => assignee.id === user.id));
});
</script>

<style scoped>
.p-card {
  padding: 0;
}
</style>