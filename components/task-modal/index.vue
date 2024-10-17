<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="isVisible" :modal="true" :dismissableMask="true" @hide="onHide" :header="task.title"
      :style="{ width: '60dvw', height: '100dvh' }" :pt="{
      header: () => ({
        class: ['!pb-0']
      })
    }">
      <template #container>
        <div class="pl-4 pr-[52px] pt-4 pb-0">
          <section class="grid gap-y-[revert] grid-cols-[[icon]_40px_[body]_minmax(0,1fr)] mb-6">
            <div>
              <i class="pi pi-desktop" style="font-size: 1rem"></i>
            </div>
            <hgroup class="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
              <textarea @blur="onChangeName" v-model.trim="task.title" style="height: 36px;"
                class="rounded w-full bg-transparent shadow-none text-xl font-semibold leading-6 resize-none -mx-2.5 -my-1.5 px-2.5 py-1.5">
            </textarea>
            </hgroup>
            <div class="col-start-[body]">
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
            <div class="col-start-[body]">
              <button
                class="block box-border w-full bg-[#091e420f] text-[#172b4d] font-medium text-left m-0 pt-2 pb-8 px-3 rounded-[3px] hover:bg-[#091e4224]">
                Thêm mô tả chi tiết hơn...
              </button>
            </div>
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
                <div>
                  <div>
                    <InputText type="text"
                      class="box-border text-[#172b4d] text-sm font-normal leading-5 transition-[background-color,border-color,box-shadow] duration-[85ms] ease-[ease] bg-white shadow-[inset_0_0_0_1px_#091e4224] w-full mb-0 px-3 py-2 rounded-[3px] border-[none]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="onClose"></Button>
          <Button type="button" label="Save" @click="onClose"></Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useTasksStore } from '@/stores/tasks';

const { updateTaskDetail } = useTasksStore();

const { slug, visible } = defineProps({
  visible: Boolean,
  slug: {
    type: String,
    required: true,
  }
});
const toast = useToast();

const emits = defineEmits(["update:visible"]);

watch(() => visible, (value) => {
  isVisible.value = value;
});

const isVisible = ref(visible);
const config = useRuntimeConfig();
const task = ref<ITaskOverview>({
  id: '',
  title: '',
  description: '',
  slug: '',
  start_date: '',
  due_date: '',
});

const onClose = () => {
  emits("update:visible");
};

const onHide = () => {
  emits("update:visible");
};

async function fetchTaskDetail() {
  const { data, execute } = useFetch<TResponse<ITaskOverview>>(`/tasks/${slug}`, {
    baseURL: config.public.apiUrl,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.public.apiKey}`,
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

</script>

<style scoped>
.p-dialog-header {
  padding: 0;
}
</style>
