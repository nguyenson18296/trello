<template>
  <div class="col-start-[sidebar] pr-4 pb-6">
    <ul class="flex flex-col gap-y-2 m-0 p-0">
      <li>
        <Button label="Rời đi" severity="secondary" icon="pi pi-user" variant="text" size="small" />
      </li>
      <li>
        <Button @click="openMemberMenu" label="Thên thành viên" severity="secondary" icon="pi pi-user" variant="text" size="small" />
      </li>
      <li class="relative">
        <Button label="Thên Nhãn" severity="secondary" icon="pi pi-user" variant="text" size="small" />
        <AddMemberMenu
          v-if="memberMenu"
          :styles="memberMenuStyle"
        />
      </li>
      <li>
        <Button label="Ngày" severity="secondary" icon="pi pi-user" variant="text" size="small" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { type CSSProperties } from 'vue';

import AddMemberMenu from '@/components/shared/add-member-menu.vue';
import type { ITaskOverview } from '@/stores/types';

defineProps({
  assignees: {
    type: Array as PropType<ITaskOverview["assignees"]>,
    required: true
  }
})

const memberMenu = ref(false);
const memberMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
  display: 'none',
  width: '350px',
});

const openMemberMenu = (event: MouseEvent) => {
  memberMenu.value = !memberMenu.value;
  memberMenuStyle.value = {
    ...memberMenuStyle.value,
    display: memberMenu.value ? 'block' : 'none',
    top: 0,
    left: 0,
  }
};
</script>