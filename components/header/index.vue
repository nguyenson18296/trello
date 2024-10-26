<script setup lang="ts">
import Drawer from '../drawer/index.vue';
import UserList from './user-list.vue';

</script>

<template>
  <nav class="flex justify-between items-center p-2 bg-[#495077]">
    <div class="left-nav flex items-center gap-2">
     
    </div>
    <div class="right-nav">
      <Button icon="pi pi-bell" class="!text-white" text size="large" v-tooltip.bottom="'Thông báo'" />
      <Button icon="pi pi-question-circle" class="!text-white" text size="large" v-tooltip.bottom="'Thông tin'" />
    </div>
  </nav>
  <header class="flex justify-between items-center p-2">
    <div class="left-header flex items-center gap-2">
      <drawer />
      <div class="header-name">
        This is my personal project
      </div>
    </div>
    <div class="right-header">
      <user-list />
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  widows: 100vw;
  background-color: #344257;
}

.header-name {
  height: 100%;
  margin-bottom: 12px;
  padding: 0 10px;
  overflow: hidden;
  background: transparent;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>