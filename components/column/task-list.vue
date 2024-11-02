<script setup lang="ts">
import draggable from 'vuedraggable';
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
    <draggable class="flex flex-col gap-y-2 mt-2" :data-column-id="columnId" :list="tasks" group="tasks"
      @end="onDragItemToOtherColumn($event, columnId)" :item-key="columnId.toString()">
      <template #item="{ element }">
        <li @click="setSelectedTask(element)" class="flex flex-col gap-y-2 scroll-m-20">
          <task-item
            :key="element.assignees.map((user: IUser) => user.id).join('-')"
            :id="element.id" :column-id="columnId" :title="element.title" :slug="element.slug"
            :users="element.assignees"
            :labels="element.labels"
            :banner="element.banner"
            @select="setSelectedTask(element)"
          />
        </li>
      </template>
    </draggable>
</template>