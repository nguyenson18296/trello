<template>
  <Card :pt="{
    body: () => ({
      class: ['!p-4 w-[305px]']
    })
  }" :style="styles">
 <template #title>
      <header :class="twMerge(
    'flex items-center justify-between',
    'text-center px-2 py-1'
  )">
        <div />
        <h2
          class="block relative col-[1_/_span_3] row-[1] h-10 overflow-hidden text-[#44546f] text-sm font-semibold tracking-[-0.003em] leading-10 text-ellipsis whitespace-nowrap m-0 px-8 py-0">
          Nhãn
        </h2>
        <Button @click="close" icon="pi pi-times" text rounded size="small" aria-label="Close" />
      </header>
    </template>
    <template #content>
      <div class="card flex justify-center">
        <DatePicker v-model="dates as Date[]" :minDate="minDate" selectionMode="range" :manualInput="false" showTime class="w-full" />
      </div>
      <div class='mt-4 flex flex-col justify-between gap-y-2'>
        <Button label="Lưu" @click="onUpdateTaskDate" />
        <Button label="Gỡ bỏ" severity="secondary" />
      </div>
    </template>
</Card>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from "vue";
import { twMerge } from 'tailwind-merge';

const props = defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: false
  },
  taskId: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: false
  },
  dueDate: {
    type: Date,
    required: false
  }
})
const emits = defineEmits(['close']);
const config = useRuntimeConfig();
const tasksStore = useTasksStore();
const { setSelectedTask } = tasksStore;

const dates = ref([props.startDate, props.dueDate]);
const minDate = new Date();

const close = () => {
  emits('close');
}

const onUpdateTaskDate = async () => {
  const body = {
    start_date: dates.value[0],
    due_date: dates.value[1]
  }
  await $fetch<TResponse<ITaskOverview>>(`/tasks/${props.taskId}`, {
    baseURL: config.public.apiUrl,
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.public.token}`
    },
    body: JSON.stringify(body),
    onResponse: (response) => {
      if (response.response._data.success) {
        setSelectedTask({
          start_date: body.start_date?.toString(),
          due_date: body.due_date?.toString()
        });
      }
    }
  });
}
</script>