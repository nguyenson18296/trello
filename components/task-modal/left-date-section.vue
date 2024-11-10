<template>
  <section v-if="dateRange" class="flex flex-col justify-end max-w-full">
    <h3
      class="text-[#44546f] text-xs leading-4 font-semibold overflow-hidden text-ellipsis whitespace-nowrap mt-0 mb-1">
      Ngày
    </h3>
    <div class="flex relative">
      <Button @click="openDateMenu" :label="dateRange" severity="secondary" />
      <EditDateMenu
        v-if="dateMenu"
        :styles="dateMenuStyle"
        :task-id="selectedTask?.id ?? ''"
        :start-date="startDateFormat"
        :due-date="dueDateFormat"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { format } from 'date-fns';

import EditDateMenu from '@/components/shared/edit-date-menu.vue';

const tasksStore = useTasksStore();
const { selectedTask } = storeToRefs(tasksStore);

const startDate = ref<string>(selectedTask.value?.start_date ?? '')
const dueDate = ref<string>(selectedTask.value?.due_date ?? '')
const dateMenu = ref(false);
const dateMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
  display: 'none',
  width: '300px',
});

const dateRange = computed(() => {
  const startDateFormatted = startDate.value ? format(startDate.value, "dd/MM/yyyy") : '';
  const dueDateFormatted = dueDate.value ? format(dueDate.value, "dd/MM/yyyy") : '';
  if (startDateFormatted && dueDateFormatted) {
    return `${startDateFormatted} - ${dueDateFormatted}`
  }
  return null;
})

watch(selectedTask, (value) => {
  startDate.value = value?.start_date ?? '';
  dueDate.value = value?.due_date ?? '';
}, { deep: true })

const startDateFormat = computed(() => {
  return new Date(startDate.value);
})

const dueDateFormat = computed(() => {
  return new Date(dueDate.value);
})

const openDateMenu = (event: MouseEvent) => {
  dateMenu.value = !dateMenu.value;
  dateMenuStyle.value = {
    ...dateMenuStyle.value,
    display: dateMenu.value ? 'block' : 'none',
    top: '30px',
    left: 0,
  }
};
</script>