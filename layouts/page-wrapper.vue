<template>
  <div>
    <NuxtLoadingIndicator :duration="10000" />
    <Header />
      <slot />
  </div>
</template>
