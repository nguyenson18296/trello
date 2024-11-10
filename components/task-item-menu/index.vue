<script setup lang="ts">
import type { CSSProperties } from 'vue';

import AddMemberMenu from '@/components/shared/add-member-menu.vue';
import EditLabelMenu from '@/components/shared/edit-label-menu.vue';
import AddBannerMenu from '@/components/shared/add-banner-menu.vue';

const { taskId, labels, columnId } = defineProps({
  taskId: {
    type: String,
    required: true
  },
  columnId: {
    type: Number,
    required: true
  },
  labels: {
    type: Array as PropType<TLabelColor[]>,
    default: [],
  },
});

const { openMenuTask } = useModalsStore();
const { quickUpdatedTask } = useTasksStore();

const menu = ref(false);
const memberMenu = ref(false);
const labelMenu = ref(false);
const bannerMenu = ref(false);

const items = ref([
  {
    label: 'Thao tác',
    items: [
      {
        label: 'Mở thẻ',
        icon: 'pi pi-desktop',
        command: () => {
          // emits('select')
          // toggleTaskModal();
        }
      },
      {
        label: 'Chỉnh sửa nhãn',
        icon: 'pi pi-tag',
        command: (event: any) => {
          openLabelMenu(event.originalEvent);
        }
      },
      {
        label: 'Thêm thành viên',
        icon: 'pi pi-user-plus',
        command: (event: any) => {
          openMemberMenu(event.originalEvent);
        }
      },
      {
        label: 'Thay đổi bìa',
        icon: 'pi pi-image',
        command: (event: any) => {
          openBannerMenu(event.originalEvent);
        }
      },
      {
        label: 'Chỉnh sửa ngày',
        icon: 'pi pi-calendar'
      }
    ]
  }
]);

const menuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
});
const memberMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
});
const labelMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
});
const bannerMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
});

const toggle = (event: MouseEvent) => {
  event.stopPropagation();
  const buttonRect = (event.target as HTMLButtonElement)?.getBoundingClientRect();

  const top = buttonRect.top + buttonRect.height + window.scrollY;
  const left = buttonRect.left + window.scrollX;
  menu.value = !menu.value;
  menuStyle.value = {
    ...menuStyle.value,
    display: menu.value ? 'block' : 'none',
    top: `${top}px`,
    left: `${left}px`
  }
  openMenuTask();
  if (menu.value) {
    quickUpdatedTask(columnId, taskId);
  }
};

const openMemberMenu = (event: MouseEvent) => {
  const buttonRect = (event.target as HTMLButtonElement)?.getBoundingClientRect();

  memberMenu.value = !memberMenu.value;
  memberMenuStyle.value = {
    ...memberMenuStyle.value,
    display: memberMenu.value ? 'block' : 'none',
    top: `${buttonRect.top + buttonRect.height + window.scrollY}px`,
    left: `${buttonRect.left + window.scrollX}px`
  }
};

const openLabelMenu = (event: MouseEvent) => {
  const buttonRect = (event.target as HTMLButtonElement)?.getBoundingClientRect();

  labelMenu.value = !labelMenu.value;
  labelMenuStyle.value = {
    ...labelMenuStyle.value,
    display: labelMenuStyle.value ? 'block' : 'none',
    top: `${buttonRect.top + buttonRect.height + window.scrollY - 110}px`,
    left: `${buttonRect.left + window.scrollX}px`
  }
};

const openBannerMenu = (event: MouseEvent) => {
  const buttonRect = (event.target as HTMLButtonElement)?.getBoundingClientRect();

  bannerMenu.value = !bannerMenu.value;
  bannerMenuStyle.value = {
    ...bannerMenuStyle.value,
    display: bannerMenuStyle.value ? 'block' : 'none',
    top: `${buttonRect.top + buttonRect.height + window.scrollY - 110}px`,
    left: `${buttonRect.left + window.scrollX}px`
  }
};
</script>

<template>
  <Button @click="toggle" icon="pi pi-pencil" severity="contrast" text size="small" aria-label="Edit Task"
    v-tooltip="'Chỉnh sửa thẻ'" />
  <Teleport to="body">
    <Menu :dismissable="false" ref="menu" v-if="menu" id="edit_task" :model="items" :style="menuStyle" />
  </Teleport>
  <Teleport to="body">
    <AddMemberMenu :styles="memberMenuStyle" v-if="memberMenu" />
  </Teleport>
  <Teleport to="body">
    <EditLabelMenu @close="labelMenu = false" :styles="labelMenuStyle" :task-id="taskId" :selected-labels="labels"
      v-if="labelMenu" />
  </Teleport>
  <Teleport to="body">
    <AddBannerMenu @close="bannerMenu = false" :styles="bannerMenuStyle" :task-id="taskId"
      v-if="bannerMenu" />
  </Teleport>
</template>
