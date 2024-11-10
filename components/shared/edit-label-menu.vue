<template>
  <Card v-if="menuType === 'init'" :pt="{
    body: () => ({
      class: ['!p-0 w-[305px]']
    })
  }" :style="styles">
    <template #title>
      <header :class="twMerge(
    'flex items-center justify-between',
    'text-center px-2 py-1'
  )">
        <div />
        <h2
          class="block relative col-[1_/_span_3] row-[1] h-10 overflow-hidden text-[#44546f] text-sm font-semibold tracking-[-0.003em] leading-10 text-ellipsis whitespace-nowrap m-0 px-8 py-0">
          Nhãn
        </h2>
        <Button @click="close" icon="pi pi-times" text rounded size="small" aria-label="Close" />
      </header>
    </template>
    <template #content>
      <div class="overflow-x-hidden overflow-y-auto px-3 pb-2">
        <h3 class="text-[#44546f] text-xs leading-4 font-semibold my-2">
          Chọn nhãn
        </h3>
        <ul class="pt-1 pb-2 px-0">
          <li v-for="(color, index) of listColorsInit" :key="color.color">
            <label :class="twMerge(
    'box-border w-full cursor-pointer',
    'm-0 pl-1 pr-0 pt-0 pb-1',
    'inline-flex items-center'
  )">
              <Checkbox v-model="selectedLabels" :value="color" />
              <span class="grow min-w-0 ml-3">
                <div class="flex grow items-center min-w-0 gap-1 mb-0">
                  <span :style="{
    'background-color': color.color
  }" :class="twMerge(
    'inline-block overflow-hidden mb-0 px-3 py-0 rounded-[3px]',
    'relative box-border',
    'text-sm font-medium leading-8 text-left text-ellipsis whitespace-nowrap text-[#172b4d]',
    'h-8 min-w-[48px] max-w-full w-full'
  )">
                    {{ color.title }}
                  </span>
                  <Button type="button" @click="() => onSwitchToEditForm(color.color, index)" icon="pi pi-pencil" text
                    rounded aria-label="Edit label" />
                </div>
              </span>
            </label>
          </li>
        </ul>
        <Button type="button" @click="() => onSwitchForm('create')" label="Tạo nhãn mới" class="w-full"
          severity="secondary" />
      </div>
    </template>
  </Card>
  <Card v-else-if="menuType === 'edit'" :pt="{
    body: () => ({
      class: ['!p-0 w-[305px]']
    })
  }" :style="styles">
    <template #title>
      <header :class="twMerge(
    ' relative text-center px-2 py-1',
    'flex justify-between items-center',
  )">
        <Button icon="pi pi-angle-left" text rounded size="small" aria-label="Back"
          @click="() => onSwitchForm('init')" />
        <h2
          class="block relative h-10 overflow-hidden text-[#44546f] text-sm font-semibold tracking-[-0.003em] leading-10 text-ellipsis whitespace-nowrap m-0 px-8 py-0">
          Chỉnh sửa nhãn
        </h2>
        <Button @click="close" icon="pi pi-times" text rounded size="small" aria-label="Close" />
      </header>
    </template>
    <template #content>
      <div class="overflow-x-hidden overflow-y-auto px-3 pb-2">
        <div class="bg-[#f7f8f9] -mx-3 my-0 p-8">
          <span :style="{
    backgroundColor: editedColor.color
  }" class="inline-block w-full relative box-border min-w-[48px] max-w-full h-8 overflow-hidden text-[#172b4d] text-sm font-medium leading-8 text-left text-ellipsis whitespace-nowrap mb-0 px-3 py-0 rounded-[3px]">
            {{ labelTitle }}
          </span>
        </div>
        <h3 class="text-[#44546f] text-xs leading-4 font-semibold mb-2 mt-3">
          Tiêu đề
        </h3>
        <InputText v-model="labelTitle" type="text" class="w-full" />
        <h3 class="text-[#44546f] text-xs leading-4 font-semibold mb-2 mt-3">
          Chọn một màu
        </h3>
        <div>
          <div class="grid grid-cols-[repeat(5,1fr)] gap-1 mt-2 mb-4 -mx-1 my-0">
            <div v-for="color of LIST_MORE_COLORS" :key="color.color" :class="twMerge(
    'relative w-[50px] h-8 rounded-[3px]',
    editedColor.color === color.color ? 'border-2 border-[#0c66e4]' : 'border-2 border-transparent'
  )">
              <button @click="() => onSelectColor(color.color)"
                :style="{ '--button-color': color.color, '--hover-color': color.hoverColor }" class="color-button" />
            </div>
          </div>
        </div>
        <hr class='h-px w-full mx-0 my-4 p-0 border-0 bg-[#091e4224]' />
        <div class="flex justify-between items-center">
          <Button type="button" @click="onSaveEditColor" label="Lưu" size="small" raised />
          <Button type="button" @click="onDeleteLabel" label="Xoá" severity="danger" size="small" />
        </div>
      </div>
    </template>
  </Card>
  <Card v-else :pt="{
    body: () => ({
      class: ['!p-0 w-[305px]']
    })
  }" :style="styles">
    <template #title>
      <header :class="twMerge(
    ' relative text-center px-2 py-1',
    'flex justify-between items-center',
  )">
        <Button icon="pi pi-angle-left" text rounded size="small" aria-label="Back"
          @click="() => onSwitchForm('init')" />
        <h2
          class="block relative h-10 overflow-hidden text-[#44546f] text-sm font-semibold tracking-[-0.003em] leading-10 text-ellipsis whitespace-nowrap m-0 px-8 py-0">
          Tạo nhãn mới
        </h2>
        <Button icon="pi pi-times" text rounded size="small" aria-label="Close" />
      </header>
    </template>
    <template #content>
      <div class="overflow-x-hidden overflow-y-auto px-3 pb-2">
        <div class="bg-[#f7f8f9] -mx-3 my-0 p-8">
          <span :style="{
    backgroundColor: editedColor.color
  }" class="inline-block w-full relative box-border min-w-[48px] max-w-full h-8 overflow-hidden text-[#172b4d] text-sm font-medium leading-8 text-left text-ellipsis whitespace-nowrap mb-0 px-3 py-0 rounded-[3px]">
            {{ labelTitle }}
          </span>
        </div>
        <h3 class="text-[#44546f] text-xs leading-4 font-semibold mb-2 mt-3">
          Tiêu đề
        </h3>
        <InputText v-model="labelTitle" type="text" class="w-full" />
        <h3 class="text-[#44546f] text-xs leading-4 font-semibold mb-2 mt-3">
          Chọn một màu
        </h3>
        <div>
          <div class="grid grid-cols-[repeat(5,1fr)] gap-1 mt-2 mb-4 -mx-1 my-0">
            <div v-for="color of LIST_MORE_COLORS" :key="color.color" :class="twMerge(
    'relative w-[50px] h-8 rounded-[3px]',
    editedColor.color === color.color ? 'border-2 border-[#0c66e4]' : 'border-2 border-transparent'
  )">
              <button @click="() => onSelectColor(color.color)"
                :style="{ '--button-color': color.color, '--hover-color': color.hoverColor }" class="color-button" />
            </div>
          </div>
        </div>
        <hr class='h-px w-full mx-0 my-4 p-0 border-0 bg-[#091e4224]' />
        <Button type="button" @click="onSaveCreateColor" label="Tạo" size="small" raised />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { twMerge } from 'tailwind-merge';

import { LIST_MORE_COLORS } from '@/utils/constants';

type TEditLabelType = 'init' | 'edit' | 'create';

const props = defineProps({
  labelMenu: Object,
  styles: {
    type: Object,
    required: true
  },
  selectedLabels: {
    type: Array as PropType<TLabelColor[]>,
    required: false,
    default: [],
  },
  taskId: {
    type: String,
    required: true
  },
})

const emits = defineEmits(['close']);

const config = useRuntimeConfig();
const tasksStore = useTasksStore();
const { addTaskLabel, setSelectedTask } = tasksStore;

const listColorsInit = ref<TLabelColor[]>([]);
const menuType = ref<TEditLabelType>('init');
const labelTitle = ref<string>('');
const editedColor = ref<TLabelColor>({
  id: '',
  color: '',
  title: ''
});
const editedIndex = ref<number>(-1);
const selectedLabels = ref<TLabelColor[]>(props.selectedLabels);

watch(selectedLabels, () => {
  onUpdateTaskLabel();
})

onMounted(async () => {
  await fetchLabels();
});

async function fetchLabels() {
  await $fetch<TResponse<TLabelColor[]>>('/labels', {
    baseURL: config.public.apiUrl,
    method: "GET",
    onResponse: (response) => {
      if (response.response._data.success) {
        listColorsInit.value = response.response._data.data;
      }
    }
  });
}

const onSwitchToEditForm = (color: string, index: number) => {
  editedColor.value.color = color;
  editedColor.value.id = listColorsInit.value[index].id;
  labelTitle.value = listColorsInit.value[index].title;
  editedIndex.value = index;
  onSwitchForm('edit');
}

const onSwitchForm = (type: TEditLabelType) => {
  menuType.value = type;
}

const onSelectColor = (color: string) => {
  editedColor.value.color = color;
}

const close = () => {
  emits('close');
}

const onSaveEditColor = async () => {
  await useFetch<TResponse<unknown>>(`/labels/${editedColor.value.id}`, {
    baseURL: config.public.apiUrl,
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.public.token}`
    },
    body: JSON.stringify({
      title: labelTitle.value,
      color: editedColor.value.color
    }),
    onResponse: (response) => {
      if (response.response._data.success) {
        listColorsInit.value[editedIndex.value].title = labelTitle.value;
        listColorsInit.value[editedIndex.value].color = editedColor.value.color;
        onSwitchForm('init');
      }
    }
  });
}

const onSaveCreateColor = async () => {
  await useFetch<TResponse<unknown>>('/labels', {
    baseURL: config.public.apiUrl,
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.public.token}`
    },
    body: JSON.stringify({
      title: labelTitle.value,
      color: editedColor.value.color
    }),
    onResponse: (response) => {
      if (response.response._data.success) {
        listColorsInit.value.push({
          id: response.response._data.data.id,
          title: labelTitle.value,
          color: editedColor.value.color
        });
        onSwitchForm('init');
      }
    }
  });
}

const onDeleteLabel = async () => {
  await useFetch<TResponse<unknown>>(`/labels/${editedColor.value.id}`, {
    baseURL: config.public.apiUrl,
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.public.token}`
    },
    onResponse: (response) => {
      if (response.response._data.success) {
        listColorsInit.value.splice(editedIndex.value, 1);
        onSwitchForm('init');
      }
    }
  });
}

const onUpdateTaskLabel = async () => {
  await $fetch<TResponse<ITaskOverview>>(`/tasks/${props.taskId}`, {
    baseURL: config.public.apiUrl,
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.public.token}`
    },
    body: JSON.stringify({
      labels_id: selectedLabels.value.map((label) => label.id)
    }),
    onResponse: (response) => {
      if (response.response._data.success) {
        const labels = response.response._data.data.labels;
        addTaskLabel(labels, props.taskId);
        setSelectedTask({
          labels: labels
        });
      }
    }
  });
}

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * LIST_MORE_COLORS.length);
  return LIST_MORE_COLORS[randomIndex];
}

watch(menuType, (newValue) => {
  if (newValue === 'create') {
    editedColor.value = {
      id: '',
      color: getRandomColor().color,
      title: ''
    };
    labelTitle.value = '';
  }
})
</script>

<style scoped>
.color-button {
  width: 100%;
  height: 100%;
  border: none;
  background-color: var(--button-color);
  transition: background-color 0.3s;
}

.color-button:hover {
  background-color: var(--hover-color);
}
</style>