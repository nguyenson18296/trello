<template>
  <div class="col-start-[sidebar] pr-4 pb-6">
    <ul class="flex flex-col gap-y-2 m-0 p-0">
      <li>
        <Button label="Rời đi" severity="secondary" icon="pi pi-user" variant="text" size="small" />
      </li>
      <Button @click.stop="openMemberMenu" label="Thên thành viên" severity="secondary" icon="pi pi-user" variant="text" size="small" />
      <li class="relative" >
        <AddMemberMenu
          v-show="memberMenu"
          :styles="memberMenuStyle"
          v-on-click-outside="() => handleClickOutside('memberMenu')"
        />
      </li>
      <li class="relative">
        <Button @click.stop="openLabelMenu" label="Thên Nhãn" severity="secondary" icon="pi pi-tag" variant="text" size="small" />
        <EditLabelMenu
          v-if="labelMenu"
          :styles="labelMenuStyle"
          :task-id="selectedTask?.id ?? ''"
          :selected-labels="selectedTask?.labels ?? []"
          v-on-click-outside="() => handleClickOutside('labelMenu')"
        />
      </li>
      <li class="relative">
        <Button @click.stop="openDateMenu" class="min-w-max" label="Ngày" severity="secondary" icon="pi pi-calendar-times" variant="text" size="small" />
        <EditDateMenu
          v-if="dateMenu"
          :styles="dateMenuStyle"
          :task-id="selectedTask?.id ?? ''"
          :start-date="new Date(selectedTask?.start_date ?? '')"
          :due-date="new Date(selectedTask?.due_date ?? '')"
          v-on-click-outside="() => handleClickOutside('dateMenu')"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { type CSSProperties } from 'vue';

import AddMemberMenu from '@/components/shared/add-member-menu.vue';
import EditLabelMenu from '@/components/shared/edit-label-menu.vue';
import EditDateMenu from '@/components/shared/edit-date-menu.vue';
import type { ITaskOverview } from '@/stores/types';

type MenuType = 'memberMenu' | 'labelMenu' | 'dateMenu';

defineProps({
  assignees: {
    type: Array as PropType<ITaskOverview["assignees"]>,
    required: true
  }
})

const tasksStore = useTasksStore();
const { selectedTask } = storeToRefs(tasksStore);

const memberMenu = ref(false);
const memberMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
  display: 'none',
  width: '350px',
});

const labelMenu = ref(false);
const labelMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
  display: 'none',
  width: '350px',
});

const dateMenu = ref(false);
const dateMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
  display: 'none',
  width: '300px',
});

const handleClickOutside = (type: MenuType) => {
  switch (type) {
    case 'memberMenu':
      if (memberMenu.value) {
        memberMenu.value = false;
      }
      break;
    case 'labelMenu':
    if (labelMenu.value) {
        labelMenu.value = false;
      }
      labelMenu.value = false;
      break;
    case 'dateMenu':
    if (dateMenu.value) {
        dateMenu.value = false;
      }
      dateMenu.value = false;
      break;
  }
}

const openMemberMenu = (event: MouseEvent) => {
  memberMenu.value = !memberMenu.value;
  memberMenuStyle.value = {
    ...memberMenuStyle.value,
    display: memberMenu.value ? 'block' : 'none',
    top: 0,
    left: 0,
  }
};

const openLabelMenu = (event: MouseEvent) => {
  labelMenu.value = !labelMenu.value;
  labelMenuStyle.value = {
    ...labelMenuStyle.value,
    display: labelMenu.value ? 'block' : 'none',
    top: '30px',
    left: 0,
  }
};

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
