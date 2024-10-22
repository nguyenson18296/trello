<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia';

import Column from '~/components/column/index.vue';
import type { TResponse, IColumn } from '@/stores/types';

const tasksStore = useTasksStore();
const modalsStore = useModalsStore();
const config = useRuntimeConfig();
const toast = useToast();

const { selectedTask } = storeToRefs(tasksStore);
const { toggleTaskModal } = modalsStore;
const { isTaskModalOpen } = storeToRefs(modalsStore);

const columns = ref<IColumn[]>([]);
const isAddingColumn = ref<boolean>(false);
const columnName = ref<string>('');

onMounted(async () => {
  await fetchColumns();
});

async function fetchColumns() {
  const { data, execute } = useFetch<TResponse<IColumn[]>>('/columns', {
    baseURL: config.public.apiUrl,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    }
  })

  // Execute the fetch and await its completion
  await execute();

  if (data.value?.success) {
    columns.value = data.value.data.sort((a, b) => a.order - b.order);
  }
}

async function createColumn() {
  const body = {
    title: columnName.value,
    order: columns.value.length + 1
  }
  await useFetch<TResponse<any>>('/columns', {
    baseURL: config.public.apiUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    },
    body: JSON.stringify(body),
    onResponse: (response) => {
      if (response.response._data.success) {
        const data = response.response._data.data;
        columns.value.push(data);
        isAddingColumn.value = false;
        toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Tạo danh sách mới thành công.', life: 3000 });
    }},
    onResponseError: () => {
      toast.add({ severity: 'error', summary: 'Có lỗi xảy ra!', detail: 'Vui lòng thử lại!', life: 3000 });
    }
  })
}

const onOpenAddingColumnForm = (e: MouseEvent) => {
  e.stopPropagation();
  isAddingColumn.value = true;
}

const onCancel = () => {
  isAddingColumn.value = false;
}
useOnKeyStroke('Escape', onCancel);

// const router = useRouter();
const route = useRoute();
const visible = ref(false)
// const isInitOpenModal = ref<boolean>(route.name === 'dashboard-slug');

const openDialog = () => {
  visible.value = true;
}

const onClose = () => {
  window.history.pushState(null, '', `/dashboard`);
  visible.value = false;
}

onBeforeRouteLeave((to, from, next) => {
  if (from.fullPath.includes('/dashboard') && to.fullPath !== '') {
    toggleTaskModal();
    window.history.pushState(null, '', `${to.fullPath}`);
  }
  // next()
})
</script>

<template>
  <div class="board-canvas grow relative h-screen bg-[#374865]">
    <Teleport to="body">
      <task-modal
        :key="selectedTask?.slug"
        :visible="isTaskModalOpen"
        :slug="selectedTask?.slug ?? ''"
      />
    </Teleport>
    <ol
      class="board-content flex mt-3 overflow-x-auto overflow-y-hidden absolute select-none whitespace-nowrap mb-2 pt-0.5 pb-2 -top-0.5 bottom-0 inset-x-0 pr-[100px]">
      <Column v-for="column of columns" :key="column.id" :id="column.id" :title="column.title" />
      <div
        v-on-click-outside="onCancel"
        v-if="isAddingColumn" 
        class="block shrink-0 self-start px-1.5 py-0">
        <form
          @submit.prevent="createColumn"
          class="box-border w-[272px] bg-[#f1f2f4] shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f] p-2 rounded-xl"
        >
          <Textarea v-model="columnName" cols="30" class="w-full min-h-[36px] max-h-40" />
          <div class="flex items-center justify-start gap-1 mt-2">
            <Button label="Thêm danh sách mới" size="small" type="submit" />
            <Button @click="onCancel" icon="pi pi-times" text rounded aria-label="Cancel" />
          </div>
        </form>
      </div>
      <div v-else class="block shrink-0 self-start grow h-full px-1.5 py-0">
        <Button @click="onOpenAddingColumnForm" type="button" label="Thêm danh sách khác" icon="pi pi-plus" />
      </div>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.board-content {
  scrollbar-color: #fff6 #00000026;
  scrollbar-width: auto;
  -webkit-user-select: none;
}
</style>