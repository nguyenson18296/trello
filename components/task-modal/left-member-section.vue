<template>
  <section class="flex flex-col justify-end max-w-full">
    <h3 class="text-[#44546f] text-xs leading-4 font-semibold overflow-hidden text-ellipsis whitespace-nowrap leading-5 mt-0 mb-1">
      Thành viên
    </h3>
    <div class="flex flex-wrap gap-x-1 gap-y-1 relative">
      <AvatarGroup v-if="assignees.length > 0">
        <UserAvatar 
          v-for="assignee of assignees" 
          :key="assignee.id"
          :username="assignee.username"
          :email="assignee.email"
          :image="assignee.avatar"
        />
      </AvatarGroup>
      <Button @click="event => openMemberMenu(event)" icon="pi pi-plus" severity="secondary" rounded aria-label="Add Assignee" size="small" />
      <AddMemberMenu
        :styles="memberMenuStyle"
        @remove="id => onRemoveAssignee(id)"
        @add="(id: number) => onAddAssignee(id)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { type CSSProperties } from 'vue';

import AddMemberMenu from '@/components/shared/add-member-menu.vue';

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
const tasksStore = useTasksStore();
const { selectedTask } = storeToRefs(tasksStore);

const assignees = ref<ITaskOverview["assignees"]>(selectedTask.value?.assignees ?? []);

watch(() => selectedTask.value?.assignees, (newValue) => {
  assignees.value = newValue ?? [];
});

const memberMenu = ref(false);
const memberMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
  display: 'none',
  width: '350px',
});

const onRemoveAssignee = (assigneeId: number) => {
  assignees.value = assignees.value.filter(assignee => assignee.id !== assigneeId);
}

const onAddAssignee = (userId: number) => {
  const addedUser = users.value.find(user => user.id === userId);
  if (addedUser) {
    assignees.value = assignees.value.concat(addedUser);
  }
}


const openMemberMenu = (event: MouseEvent) => {
  memberMenu.value = !memberMenu.value;
  memberMenuStyle.value = {
    ...memberMenuStyle.value,
    display: memberMenu.value ? 'block' : 'none',
    top: `40px`,
    left: `100px`
  }
};

watch(() => selectedTask.value?.assignees, (newValue) => {
  assignees.value = newValue ?? [];
});
</script>