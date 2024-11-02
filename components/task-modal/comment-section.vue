<template>
  <div>
    <div v-if="isCommenting">
      <TextEditor />
      <div class="flex justify-start mt-2 gap-2">
        <Button type="button" size="small" label="Save"></Button>
        <Button type="button" label="Cancel" severity="secondary" size="small" @click="onCancelComment"></Button>
      </div>
    </div>
    <InputText v-else @click="onToggleCommentEditor" type="text"
      class="box-border text-[#172b4d] text-sm font-normal leading-5 transition-[background-color,border-color,box-shadow] duration-[85ms] ease-[ease] bg-white shadow-[inset_0_0_0_1px_#091e4224] w-full mb-0 px-3 py-2 rounded-[3px] border-[none]" />
  </div>
</template>

<script setup lang="ts">
const isCommenting = ref(false);

const onToggleCommentEditor = () => {
  isCommenting.value = true;
}

const onCancelComment = () => {
  isCommenting.value = false;
}
</script>
