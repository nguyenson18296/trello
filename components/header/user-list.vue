<script setup lang="ts">
import type { IUser, TResponse } from '@/stores/types';
import UserAvatar from '@/components/user-avatar/index.vue';

const config = useRuntimeConfig();
const users = ref<IUser[]>([]);

onMounted(async () => {
  fetchUsers();
});

async function fetchUsers() {
  const { data, execute } = useFetch<TResponse<IUser[]>>(`/users`, {
    baseURL: config.public.apiUrl,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.apiKey}`,
    }
  })

  // Execute the fetch and await its completion
  await execute();

  console.log(data.value);

  if (data.value?.success) {
    users.value = data.value.data;
  }
}

</script>

<template>
  <div class="flex relative items-baseline max-h-8 overflow-visible leading-8 mr-1 pl-0.5 pr-0 py-0 top-0.5">
    <UserAvatar
      v-for="user of users" 
      :key="user.id"
      :image="user.avatar"
      :username="user.username"
      :email="user.email"
    />
  </div>
</template>