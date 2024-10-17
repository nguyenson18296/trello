<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";

import TaskList from './task-list.vue';
import type { TResponse, ITaskOverview } from '@/stores/types';
import useOnKeyStroke from '@/composables/useOnKeyStroke';

const { addMultiTasks } = useTasksStore();
const config = useRuntimeConfig();
const tasks = ref<ITaskOverview[]>([]);
const toast = useToast();

const { id: columnId, title } = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const columnTitle = ref<string>(title);
const toggleEditColumnName = ref<boolean>(false);
const isInputChange = ref<boolean>(false);
const isAddingNewTask = ref<boolean>(false);
const isAddingNewTaskBottom = ref<boolean>(false);

onMounted(async () => {
  if (columnId) {
    await fetchTasksOfColumn();
  }
});

async function fetchTasksOfColumn() {
  const { data, execute } = useFetch<TResponse<ITaskOverview[]>>(`/tasks/column/${columnId}`, {
    baseURL: config.public.apiUrl,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.apiKey}`,
    }
  })

  // Execute the fetch and await its completion
  await execute();

  if (data.value?.success) {
    tasks.value = data.value.data;
    addMultiTasks(columnId, data.value.data);
  }
}

async function updateColumnTitle() {
  const { data, execute } = useFetch<TResponse<any>>(`/columns/${columnId}`, {
    baseURL: config.public.apiUrl,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    },
    body: JSON.stringify({
      title: columnTitle.value
    })
  })

  await execute();

  if (data.value?.success) {
    toggleEditColumnName.value = false;
    isInputChange.value = false;
  }
}

const onToggleColumnTitleName = (e: MouseEvent) => {
  e.stopPropagation();
  toggleEditColumnName.value = true
}

const onCancelEditColumnName = (event: PointerEvent) => {
  const titleElement = event.target as Element;
  if (toggleEditColumnName.value && !titleElement.hasAttribute('data-click-outside')) {
    toggleEditColumnName.value = false;
    if (isInputChange.value) {
      updateColumnTitle();
    }
  }
}

const onChangeTitle = (e: Event) => {
  columnTitle.value = (e.target as HTMLInputElement).value;
  if (!isInputChange.value) {
    isInputChange.value = true;
  }
}

const handleCancelEditColumnName = (event: KeyboardEvent) => {
  toggleEditColumnName.value = false;
}

const onAddingNewTask = () => {
  isAddingNewTask.value = true;
}

const onAddingNewTaskBottom = () => {
  isAddingNewTaskBottom.value = true;
}

const onCancelAddingNewTask = () => {
  isAddingNewTask.value = false;
}

const onCancelAddingNewTaskBottom = () => {
  isAddingNewTaskBottom.value = false;
}

async function createQuickTask(taskName: string) {
  const body = {
    title: taskName,
    column: columnId
  }
  await useFetch<TResponse<ITaskOverview>>(`/tasks`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    },
    body: JSON.stringify(body),
    onResponse: (response) => {
      if (response.response._data.success) {
        isAddingNewTask.value = false;
        isAddingNewTaskBottom.value = false;
        tasks.value.push(response.response._data.data);
        toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Tạo thẻ mới thành công', life: 3000 });
      }
    },
    onResponseError: () => {
      toast.add({ severity: 'error', summary: 'Có lỗi xảy ra!', detail: 'Vui lòng thử lại!', life: 3000 });
    }
  })
}

useOnKeyStroke('Escape', handleCancelEditColumnName);

const menu = ref();
const items = ref([
  {
    label: 'Thao tác',
    items: [
      {
        label: 'Thêm thẻ',
        icon: 'pi pi-file-plus',
        command: onAddingNewTask
      },
      {
        label: 'Sao chép danh sách',
        icon: 'pi pi-clone'
      },
      {
        label: 'Di chuyển danh sách',
        icon: 'pi pi-arrows-alt'
      },
      {
        label: 'Sắp xếp theo',
        icon: 'pi pi-sort-alt'
      }
    ]
  }
]);

const toggle = (event: MouseEvent) => {
  menu.value.toggle(event);
};
</script>

<template>
  <Toast />
  <li class="block shrink-0 self-start h-full whitespace-nowrap px-1.5 py-0">
    <div class="column bg-[#f1f2f4] pb-2 rounded-xl max-h-full w-[270px]">
      <div
        class="column-header flex relative grow-0 flex-wrap items-center items-start justify-between gap-y-0 pt-2 pb-0 px-2">
        <h2 data-click-outside="true" @click="onToggleColumnTitleName" v-if="!toggleEditColumnName"
          class="relative basis-[min-content] grow shrink min-h-[20px] text-[#172b4d] font-bold px-2 py-1">
          {{ columnTitle }}
        </h2>
        <input-text v-else v-on-click-outside="onCancelEditColumnName" v-on-focus="500" @input="onChangeTitle"
          v-model="columnTitle" class="text-[#172b4d] font-bold px-2 py-1" />

        <Button @click="toggle" icon="pi pi-ellipsis-h" severity="contrast" text size="small" aria-label="Actions"
          v-tooltip="'Thao tác'" />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
      <!-- <ol
        class="task-list py-0.5 flex z-[1] flex-auto flex-col overflow-x-hidden overflow-y-auto gap-y-2 mx-1 my-0 px-1 py-0">
        <quick-create-task-form v-if="isAddingNewTask" @cancel="onCancelAddingNewTask" @submit="createQuickTask" />
        <draggable v-if="tasks.length > 0" class="flex flex-col gap-y-2 mt-2" :data-column-id="columnId" :list="tasks"
          group="tasks" @end="onDragItemToOtherColumn($event, columnId)" :item-key="columnId.toString()">
          <template #item="{ element }">
            <li @click="setSelectedTask(element)" class="flex flex-col gap-y-2 scroll-m-20">
              <task-item :id="element.id" :title="element.title" :slug="element.slug" />
            </li>
          </template>
        </draggable>
      </ol> -->
      <task-list :column-id="columnId" :is-adding-new-task="isAddingNewTask" />
      <div v-if="!isAddingNewTaskBottom" class="flex items-center justify-between gap-x-1 pt-2 pb-0 px-2">
        <Button @click="onAddingNewTaskBottom" label="Thêm thẻ" icon="pi pi-plus" text aria-label="Add task" />
      </div>
      <div v-else class="mx-1 my-0 px-1 pt-2">
        <quick-create-task-form @cancel="onCancelAddingNewTaskBottom" @submit="createQuickTask" />
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.task-list {
  list-style: none;
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translate3d(0, 0, 0);
  scrollbar-color: #091e4224 #091e420f;
  scrollbar-width: thin;
}
</style>