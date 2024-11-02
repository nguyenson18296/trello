<template>
    <div class="col-start-[body]" v-if="isDescriptionToggling">
      <TextEditor @update="update" :content="task.description ?? ''" />
      <div class="flex justify-start mt-2 gap-2">
        <Button type="button" size="small" @click="updateTaskDescription" label="Save"></Button>
        <Button type="button" label="Cancel" severity="secondary" size="small" @click="onCancelDescription"></Button>
      </div>
    </div>
    <div class="col-start-[body]" @click="onToggleDescriptionEditor" v-else>
      <button
        v-if="!task.description"
        class="block box-border w-full bg-[#091e420f] text-[#172b4d] font-medium text-left m-0 pt-2 pb-8 px-3 rounded-[3px] hover:bg-[#091e4224]">
        Thêm mô tả chi tiết hơn...
      </button>
      <div v-else class="cursor-pointer">
        <div class="text-base leading-6 text-[#172B4D] max-w-[1800px] break-words whitespace-pre-wrap mx-auto my-0">
          <div class="task-description text-sm" v-html="sanitizeHtmlString(task.description)" />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { sanitizeHtmlString } from '@/utils/';

const { task } = defineProps({
  task: {
    type: Object as PropType<ITaskOverview>,
    required: true
  }
});

const config = useRuntimeConfig();
const isDescriptionToggling = ref(false);
const taskDescription = ref(task.description);

const onToggleDescriptionEditor = () => {
  isDescriptionToggling.value = true;
}

const onCancelDescription = () => {
  isDescriptionToggling.value = false;
}

const update = (description: string) => {
  taskDescription.value = description;
}

const updateTaskDescription = async () => {
  await $fetch<TResponse<ITaskOverview>>(`/tasks/${task.id}`, {
    baseURL: config.public.apiUrl,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    },
    body: JSON.stringify({
      description: taskDescription.value
    }),
    onResponse: (response) => {
      if (response.response._data.success) {
        task.description = taskDescription.value;
        isDescriptionToggling.value = false;
      }
    }
  });
}
</script>

<style lang="scss">
.task-description {
  ul {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    list-style-type: disc;
    padding-left: 1.5em;
  }
  ol {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    list-style-type: decimal;
    padding-left: 1.5em;
  }
}
</style>