<script setup lang="ts">
import Column from '~/components/column/index.vue'; 

import type { TResponse, IColumn } from '@/stores/types';

const config = useRuntimeConfig();

const columns = ref<IColumn[]>([]);

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
    columns.value = data.value.data;
  }
}
</script>

<template>
  <div class="board-canvas grow relative h-screen bg-[#374865]">
    <ol class="board-content flex mt-3 overflow-x-auto overflow-y-hidden absolute select-none whitespace-nowrap mb-2 pt-0.5 pb-2 -top-0.5 bottom-0 inset-x-0">
      <Column
        v-for="column of columns" 
        :key="column.id"
        :id="column.id"
        :title="column.title"
      />
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