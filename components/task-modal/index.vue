<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="isTaskModalOpen" :modal="true" :dismissableMask="true" :header="task.title"
      :style="{ width: '60dvw', height: '100dvh' }" :pt="{
      header: () => ({
        class: ['!pb-0']
      })
    }">
      <template #container>
        <div class="relative">
          <div :style="{
      backgroundImage: `url(${task.banner})`
    }"
            class="bg-[rgb(123,162,209)] bg-contain min-h-[116px] h-40 max-h-40 bg-no-repeat bg-center select-none rounded-t-xl">
          </div>
          <Button type="button" @click="openBannerMenu" class="!absolute z-[6] m-3 right-0 bottom-0" severity="secondary"
            label="Ảnh bìa" icon="pi pi-image" raised />
            <AddBannerMenu
              @close="bannerMenu = false" 
              :styles="bannerMenuStyle" 
              :task-id="task.id"
              v-if="bannerMenu"
              @update="task.banner = $event"
            />
        </div>
        <div class="pl-4 pr-[52px] pt-4 pb-0">
          <section class="grid gap-y-[revert] grid-cols-[[icon]_40px_[body]_minmax(0,1fr)] mb-6">
            <div>
              <i class="pi pi-desktop" style="font-size: 1rem"></i>
            </div>
            <hgroup class="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
              <textarea @blur="onChangeName" v-model.trim="task.title"
                class="rounded w-full bg-transparent shadow-none text-xl font-semibold leading-6 resize-none -mx-2.5 -my-1.5 px-2.5 py-1.5">
            </textarea>
            </hgroup>
            <div class="col-start-[body] mt-2">
              trong danh sách Cần làm
            </div>
          </section>
          <section class="grid gap-y-[revert] grid-cols-[[icon]_40px_[body]_minmax(0,1fr)] mb-6">
            <div>
              <i class="pi pi-list-check" style="font-size: 1rem"></i>
            </div>
            <hgroup class="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
              <div class="flex grow items-center gap-x-2">
                <h3 class="text-base font-semibold">
                  Mô tả
                </h3>
              </div>
            </hgroup>
            <DescriptionSection :task="task" />
          </section>
          <section class="grid gap-y-[revert] grid-cols-[[icon]_40px_[body]_minmax(0,1fr)] mb-6">
            <div>
              <i class="pi pi-list" style="font-size: 1rem"></i>
            </div>
            <hgroup class="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
              <div class="flex grow items-center gap-x-2">
                <h3 class="text-base font-semibold">
                  Hoạt động
                </h3>
              </div>
            </hgroup>
            <div class="grid col-span-full grid-cols-[subgrid]">
              <div class="grid col-span-full grid-cols-[subgrid] mb-2">
                <div class="relative overflow-visible leading-[10px] align-top whitespace-nowrap">
                  <Avatar image="https://res.cloudinary.com/dou7jklnk/image/upload/v1712035288/i0evalip90wyrpen8raa.jpg"
                    size="normal" shape="circle" />
                </div>
                <CommentSection />
              </div>
            </div>
          </section>
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="toggleTaskModal"></Button>
          <Button type="button" label="Save" @click="toggleTaskModal"></Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from "vue";
import { storeToRefs } from 'pinia';

import { useTasksStore } from '@/stores/tasks';

import CommentSection from './comment-section.vue';
import DescriptionSection from './description-section.vue';
import AddBannerMenu from '@/components/task-item-menu/add-banner-menu.vue';

const { updateTaskDetail } = useTasksStore();
const modalsStore = useModalsStore();
const { toggleTaskModal } = modalsStore;
const { isTaskModalOpen } = storeToRefs(modalsStore);

const bannerMenu = ref(false);
const bannerMenuStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '1000',
});

const { slug } = defineProps({
  slug: {
    type: String,
    required: true,
  }
});
const toast = useToast();

const config = useRuntimeConfig();
const task = ref<ITaskOverview>({
  id: '',
  title: '',
  description: '',
  slug: '',
  start_date: '',
  due_date: '',
  banner: '',
  assignees: [],
  labels: [],
});

async function fetchTaskDetail() {
  const { data, execute } = useFetch<TResponse<ITaskOverview>>(`/tasks/${slug}`, {
    baseURL: config.public.apiUrl,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    }
  })

  await execute();

  if (data.value?.success) {
    task.value = data.value.data;
  }
}

onMounted(() => {
  if (slug) {
    fetchTaskDetail();
  }
});

const onChangeName = async (e: Event) => {
  task.value.title = (e.target as HTMLTextAreaElement).value;
  const isValueChanged = task.value.title !== task.value.title;
  if (!isValueChanged) {
    return;
  }
  await useFetch<TResponse<ITaskOverview>>(`/tasks/${task.value.id}`, {
    baseURL: config.public.apiUrl,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.token}`,
    },
    body: JSON.stringify({
      title: task.value.title
    }),
    onResponse: (response) => {
      if (response.response._data.success) {
        updateTaskDetail({
          ...task,
          id: task.value.id,
          title: response.response._data.data.title,
          slug: response.response._data.data.slug,
        });
        toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Đã cập nhật tiêu đề task.', life: 3000 });
      }
    },
    onResponseError: () => {
      toast.add({ severity: 'error', summary: 'Có lỗi xảy ra!', detail: 'Vui lòng thử lại!', life: 3000 });
    }
  })
};

const openBannerMenu = (event: MouseEvent) => {
  const buttonRect = (event.target as HTMLButtonElement)?.getBoundingClientRect();

  bannerMenu.value = !bannerMenu.value;
  bannerMenuStyle.value = {
    ...bannerMenuStyle.value,
    display: bannerMenuStyle.value ? 'block' : 'none',
    top: `${buttonRect.top}px`,
    left: `${buttonRect.left - 300}px`
  }
};

</script>

<style scoped>
.p-dialog-header {
  padding: 0;
}
</style>
