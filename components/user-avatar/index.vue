<script setup lang="ts">
defineProps({
  image: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

const op = ref();
const toggle = (event: MouseEvent) => {
  op.value.toggle(event);
}
</script>

<template>
  <Avatar @click="toggle" :image="image" class="mr-2 cursor-pointer" shape="circle" />
  <Popover ref="op" class="w-[300px] p-0">
    <div
      class="flex relative box-content h-[80px] items-start bg-[linear-gradient(to_bottom,#0c66e4_0%,#0c66e4_100%)] bg-no-repeat bg-[100%_-30px] -mx-3 pl-3.5 pr-3 pt-6 pb-2">
      <Avatar :image="image" class="mr-2 !w-[80px] !h-[80px]" shape="circle" />
      <div class="flex-1 min-w-0 ml-2 mt-2">
        <h2 class="overflow-hidden text-white text-base font-medium text-ellipsis whitespace-nowrap">
          {{ username }}
        </h2>
        <p class="overflow-hidden text-white text-sm text-ellipsis whitespace-nowrap">
          {{ email }}
        </p>
      </div>
    </div>
    <ul>
      <li
        class="text-[#172b4d] text-sm font-normal leading-5 list-none cursor-pointer -mx-3 px-3 py-1.5 hover:bg-[#091e420f]">
        Sửa thông tin cá nhân
      </li>
      <slot name="action" />
    </ul>
  </Popover>
</template>

<style lang="scss" scoped>
.p-popover-content {
  padding: 0;
}
</style>