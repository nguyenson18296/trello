<template>
  <Card :style="styles">
    <template #title>
      <header :class="twMerge(
    'flex items-center justify-between',
    'text-center px-2 py-1'
  )">
        <div />
        <h2
          class="block relative col-[1_/_span_3] row-[1] h-10 overflow-hidden text-[#44546f] text-sm font-semibold tracking-[-0.003em] leading-10 text-ellipsis whitespace-nowrap m-0 px-8 py-0">
          Ảnh bìa
        </h2>
        <Button @click="close" icon="pi pi-times" text rounded size="small" aria-label="Close" />
      </header>
    </template>
    <template #content>
      <div class="overflow-x-hidden overflow-y-auto px-3 pb-2">
        <h3 class="text-[#44546f] text-xs leading-4 font-semibold my-2">
          Ảnh từ Unsplash
        </h3>
        <div :class="twMerge(
          'grid grid-cols-[1fr_1fr] gap-2 grid-cols-[1fr_1fr_1fr]',
          'overflow-x-hidden -mx-1 my-0 p-1'
        )">
          <div class="relative" v-for="image of unsplashImages" :key="image.id">
            <button :style="{
              backgroundImage: `url(${image.urls.small})`
            }"
            class="bg-no-repeat bg-center bg-cover shadow-none w-[88px] h-12 m-0 rounded-[3px]"
            @click="() => onUpdateTaskBanner(image.urls.small)"
          >
              <div class="absolute z-[2] group inset-0">
                <NuxtLink
                  :href="image.links.html" target="_blank"
                  :class="twMerge(
                    'absolute left-0 bottom-0',
                    'z-[1] w-full h-5 overflow-hidden opacity-0 text-white text-xs leading-4 text-left underline text-ellipsis whitespace-nowrap cursor-pointer',
                    'box-border px-1 py-0.5 rounded-[0_0_2px_2px]',
                    'group-hover:text-[#fff] group-hover:opacity-100 group-hover:bg-[rgba(0,0,0,0.5)]'
                  )"
                >
                  {{ image.user.name }}
                </NuxtLink>
              </div>
            </button>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

const props = defineProps({
  labelMenu: Object,
  styles: {
    type: Object,
    required: true
  },
  taskId: {
    type: String,
    required: true
  }
})

const config = useRuntimeConfig();
const emits = defineEmits(['close', 'update']);
const tasksStore = useTasksStore();
const { updateTaskDetail } = tasksStore;

const unsplashImages = ref<IUnPlashImage[]>([]);

const close = () => {
  emits('close');
}

onMounted(async () => {
  await fetchImagesFromUnsplash();
});

const fetchImagesFromUnsplash = async () => {
  await $fetch(`https://api.unsplash.com/photos/`, {
    method: "GET",
    headers: {
      Authorization: `Client-ID ${config.public.unSplashAccessKey}`
    },
    onResponse: (response) => {
      unsplashImages.value = response.response._data;
    }
  })
}

const onUpdateTaskBanner = async (image: string) => {
  await $fetch(`/tasks/${props.taskId}`, {
    baseURL: config.public.apiUrl,
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    },
    body: {
      banner: image
    },
    onResponse: (response) => {
      if (response.response._data.success) {
        const task: Partial<ITaskOverview> = {
          id: props.taskId,
          banner: image
        }
        updateTaskDetail(task);
        emits('update', image);
      }
    }
  })
}
</script>