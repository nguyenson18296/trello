<script setup lang="ts">
import Drawer from '../drawer/index.vue';

</script>

<template>
  <header>
    <drawer />
    <div class="header-name">
      This is my personal project
    </div>
  </header>
</template>

<style lang="scss">
header {
  widows: 100vw;
  background-color: #505f79e6;
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