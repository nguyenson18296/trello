<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import { useToast } from "primevue/usetoast";

import type { IUser } from '@/stores/types';

const { users: usersProps, id: taskId, slug } = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  users: {
    type: Object as PropType<IUser[]>,
    default: [],
  },
  columnId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['select']);

const config = useRuntimeConfig();
const toast = useToast();
const users = ref<IUser[]>(usersProps);
// const modalsStore = useModalsStore();
// const { toggleTaskModal } = modalsStore;

// const menu = ref();

const usersAssign = computed(() => usersProps)
console.log('usersAssign', usersAssign);

const removeUserFromTask = async (userId: number) => {
  await useFetch<TResponse<ITaskOverview>>(`/tasks/${taskId}/remove-assignee/${userId}`, {
    baseURL: config.public.apiUrl,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.public.token}`,
    },
    onResponse: (response) => {
      if (response.response._data.success) {
        users.value = users.value.filter((user) => user.id !== userId);
        toast.add({ severity: "success", summary: "Thành công!", detail: "Đã gỡ bỏ người dùng khỏi thẻ.", life: 3000 });
      }
    },
  })
}

console.log('usersProps', usersProps);
</script>

<template>
  <div
    class="opacity-100 task-wrapper relative min-h-[36px] bg-white shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f] text-[#172b4d] cursor-pointer scroll-m-2 rounded-lg">
    <div class="flow-root relative z-10 min-h-[24px] py-2 px-3">
      <div class="absolute z-10 right-0.5 top-0.5">
        <task-item-menu :task-id="taskId" :column-id="columnId" />
      </div>
      <div class="flex flex-wrap gap-1 mb-1">
        <div class="inline-flex max-w-[calc(100%_-_4px)]">
          <span class="min-w-[40px] max-w-[40px] h-2 text-transparent rounded my-0 px-0 bg-[#e2b203]" />
        </div>
      </div>
      <NuxtLink :to="`/dashboard/${slug}`"
        class="text-[#172b4d] block overflow-hidden break-words whitespace-normal mb-1">
        {{ title }}
      </NuxtLink>
      <div class="flex justify-between items-center">
        <div :class="twMerge(
            'flex flex-wrap gap-x-1',
            'task-actions max-w-full float-left'
          )">
          <i class="pi pi-check" style="font-size: 1rem"></i>
          <i class="pi pi-times" style="font-size: 1rem"></i>
          <i class="pi pi-search" style="font-size: 1rem"></i>
          <i class="pi pi-user" style="font-size: 1rem"></i>
        </div>
        <AvatarGroup v-if="(users?.length ?? 0) > 0">
          <!-- <Avatar v-for="user of users" :image="user?.avatar" size="normal" shape="circle" /> -->
          <user-avatar v-for="user of users" :key="user.id" :image="user.avatar" :username="user.username"
            :email="user.email">
            <template #action>
              <li @click="() => removeUserFromTask(user.id)" class="text-[#172b4d] text-sm font-normal leading-5 list-none cursor-pointer -mx-3 px-3 py-1.5 hover:bg-[#091e420f]">
                Gỡ bỏ khỏi Thẻ
              </li>
            </template>
          </user-avatar>
        </AvatarGroup>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task-wrapper:hover {
  outline-color: -webkit-focus-ring-color;
  outline: #388bff auto 2px;
}
</style>
