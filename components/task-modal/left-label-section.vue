<template>
  <section class="flex flex-col justify-end max-w-full">
    <h3
      class="text-[#44546f] text-xs leading-4 font-semibold overflow-hidden text-ellipsis whitespace-nowrap leading-5 mt-0 mb-1">
      Nhãn
    </h3>
    <div class="flex flex-wrap gap-1 relative">
      <span v-for="label of labels" :key="label.id"
        class="cursor-pointer inline-block relative box-border min-w-[48px] max-w-full h-8 overflow-hidden text-[#172b4d] text-sm font-medium leading-8 text-left text-ellipsis whitespace-nowrap mb-0 px-3 py-0 rounded-[3px]"
        v-text="label.title" :style="{ backgroundColor: label.color }" />
      <Button @click="event => openLabelMenu(event)" icon="pi pi-plus" severity="secondary" rounded
        aria-label="Add Label" size="small" />
      <EditLabelMenu @close="labelMenu = false" :styles="labelMenuStyle" :task-id="selectedTask?.id ?? ''"
        :selected-labels="labels" v-if="labelMenu" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { type CSSProperties } from 'vue';

import EditLabelMenu from '@/components/shared/edit-label-menu.vue';

const tasksStore = useTasksStore();
const { selectedTask } = storeToRefs(tasksStore);

const labels = ref<ITaskOverview["labels"]>(selectedTask.value?.labels ?? []);
const labelMenu = ref(false);
const labelMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
  display: 'none',
  width: '350px',
});

watch(() => selectedTask.value?.labels, (newValue) => {
  labels.value = newValue ?? [];
});

const openLabelMenu = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  labelMenu.value = true;
  labelMenuStyle.value.display = 'block';
}
</script>
