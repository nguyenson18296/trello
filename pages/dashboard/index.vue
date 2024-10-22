<script setup lang="ts">
import { storeToRefs } from 'pinia';

const modalsStore = useModalsStore();
const { isMenuTaskOpen } = storeToRefs(modalsStore);
</script>

<template>
  <NuxtLayout name="page-wrapper">
    <div :class="isMenuTaskOpen ? 'overlay' : ''" />
    <Board />
  </NuxtLayout>
</template>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  z-index: 1000; /* High z-index to be on top of other content, adjust as needed */
}
</style>
