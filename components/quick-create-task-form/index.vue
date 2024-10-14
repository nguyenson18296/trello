<script setup lang="ts">

const value = ref('');

const emit = defineEmits(['cancel', 'submit'])

const onCancel = () => {
  emit('cancel')
}

const onSubmit = () => {
  emit('submit', value.value.trim())
}

useOnKeyStroke('Escape', onCancel);
</script>

<template>
  <li class="scroll-m-2">
    <form  @submit.prevent="onSubmit">
      <Textarea v-model="value" cols="30" class="w-full min-h-[36px] max-h-40" />
      <div class="flex items-center justify-start gap-1 mt-2">
        <Button
          label="Thêm thẻ" 
          size="small"
          type="submit"
        />
        <Button
          @click="onCancel"
          icon="pi pi-times" 
          text rounded aria-label="Cancel" />
      </div>
    </form>
  </li>
</template>