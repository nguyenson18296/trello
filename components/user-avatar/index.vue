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
  <div>
    <Avatar @click="toggle" :image="image" class="mr-2 cursor-pointer" shape="circle" />
    <Popover ref="op" class="w-[300px] p-0">
        <div class="flex relative box-content h-[150px] items-start bg-[linear-gradient(to_bottom,#0c66e4_0%,#0c66e4_100%)] bg-no-repeat bg-[100%_-100px] -mx-3 pl-3.5 pr-3 pt-6 pb-2">
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
    </Popover>
  </div>
</template>

<style lang="scss" scoped>
.p-popover-content {
  padding: 0;
}
</style>