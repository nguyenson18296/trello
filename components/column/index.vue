<script setup lang="ts">
import draggable from 'vuedraggable'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import TaskItem from './task-item.vue';
import MenuComponent from './menu.vue'

import type { TResponse, ITaskOverview } from '@/stores/types';
import useOnKeyStroke from '@/composables/useOnKeyStroke';

const config = useRuntimeConfig();
const tasks = ref<ITaskOverview[]>([]);

const { id, title } = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
const drag = ref(false)

const columnTitle = ref<string>(title);
const toggleEditColumnName = ref<boolean>(false);
const isInputChange = ref<boolean>(false);

onMounted(async () => {
  if (id) {
    await fetchTasksOfColumn();
  }
});

async function fetchTasksOfColumn() {
  const { data, execute } = useFetch<TResponse<ITaskOverview[]>>(`/tasks/column/${id}`, {
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
  }
}

async function updateColumnTitle() {
  const { data, execute } = useFetch<TResponse<any>>(`/columns/${id}`, {
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

const handle = (e: any) => {
  console.log('e', e);
}

const log = (e: any) => {
  console.log('e', e);
}

const onToggleColumnTitleName = (e: MouseEvent) => {
  // e.stopPropagation();
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

useOnKeyStroke('Escape', handleCancelEditColumnName);

const menu = ref();
const items = ref([
  {
    label: 'Thao tác',
    items: [
      {
        label: 'Thêm thẻ',
        icon: 'pi pi-file-plus'
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
      <ol
        class="task-list py-0.5 flex z-[1] flex-auto flex-col overflow-x-hidden overflow-y-auto gap-y-2 mx-1 my-0 px-1 py-0">
        <draggable v-if="tasks.length > 0" class="flex flex-col gap-y-2 mt-2" :list="tasks" group="people"
          @start="drag = true" @end="drag = false" @handle="handle" @change="log" item-key="id">
          <template #item="{ element }">
            <li class="flex flex-col gap-y-2 scroll-m-20">
              <task-item :id="element.id" :title="element.title" />
            </li>
          </template>
        </draggable>
      </ol>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.task-list {
  list-style: none;
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translate3d(0, 0, 0);
  scrollbar-color: var(--ds-background-neutral-hovered, #091e4224) var(--ds-background-neutral, #091e420f);
  scrollbar-width: thin;
}
</style>