<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "primevue/usetoast";

import TaskItem from './task-item.vue';
import { useTasksStore } from '@/stores/tasks';

const props = defineProps({
  columnId: {
    type: Number,
    required: true
  },
  isAddingNewTask: {
    type: Boolean,
    required: true
  }
})

const config = useRuntimeConfig();
const tasksStore = useTasksStore();
const toast = useToast();

const { setSelectedTask, getTasksByColumnId } = tasksStore;

const onDragItemToOtherColumn = async (e: any, columnId: number) => {
  const draggedItemId = e.item._underlying_vm_.id;
  const destinationColumn = +e.to.dataset.columnId;
  if (destinationColumn === columnId) {
    return;
  }
  useFetch<TResponse<ITaskOverview>>(`/tasks/${draggedItemId}`, {
    baseURL: config.public.apiUrl,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    },
    body: JSON.stringify({
      column: destinationColumn
    }),
    onResponse: (response) => {
      if (response.response._data.success) {
        toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Đã dịch chuyển task qua cột khác.', life: 3000 });
      }
    },
  })
}

const tasks = computed(() => getTasksByColumnId(props.columnId)?.tasks);
</script>

<template>
  <ol
    class="task-list py-0.5 flex z-[1] flex-auto flex-col overflow-x-hidden overflow-y-auto gap-y-2 mx-1 my-0 px-1 py-0">
    <!-- <quick-create-task-form v-if="isAddingNewTask" @cancel="onCancelAddingNewTask" @submit="createQuickTask" /> -->
    <draggable class="flex flex-col gap-y-2 mt-2" :data-column-id="columnId" :list="tasks" group="tasks"
      @end="onDragItemToOtherColumn($event, columnId)" :item-key="columnId.toString()">
      <li v-for="task of tasks" :key="task.id" @click="setSelectedTask(task)" class="flex flex-col gap-y-2 scroll-m-20">
        <task-item
          :key="task.assignees.map(user => user.id).join('-')"
          :id="task.id" :column-id="columnId" :title="task.title" :slug="task.slug"
          :users="task.assignees"
          @select="setSelectedTask(task)"
        />
      </li>
    </draggable>
  </ol>
</template>