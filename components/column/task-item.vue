<script setup lang="ts">
const { slug } = defineProps({
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
  }
})
</script>

<template>
  <div
    class="opacity-100 task-wrapper relative min-h-[36px] bg-white shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f] text-[#172b4d] cursor-pointer scroll-m-2 rounded-lg">
    <div class="flow-root relative z-10 min-h-[24px] py-2 px-3">
      <div class="absolute z-10 right-0.5 top-0.5">
        <Button
          icon="pi pi-pencil" 
          severity="contrast" 
          text 
          size="small"
          aria-label="Edit Task"
          v-tooltip="'Chỉnh sửa thẻ'"
        />
      </div>
      <div class="flex flex-wrap gap-1 mb-1">
        <div class="inline-flex max-w-[calc(100%_-_4px)]">
          <span class="min-w-[40px] max-w-[40px] h-2 text-transparent rounded my-0 px-0 bg-[#e2b203]" />
        </div>
      </div>
      <NuxtLink :to="`/dashboard/${slug}`" class="text-[#172b4d] block overflow-hidden break-words whitespace-normal mb-1">
        {{ title }}
      </NuxtLink>
      <div class="task-actions flex flex-wrap max-w-full float-left gap-x-1">
        <i class="pi pi-check" style="font-size: 1rem"></i>
        <i class="pi pi-times" style="font-size: 1rem"></i>
        <i class="pi pi-search" style="font-size: 1rem"></i>
        <i class="pi pi-user" style="font-size: 1rem"></i>
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
