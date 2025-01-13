<!-- ErrorMessage.vue -->
<template>
  <div class="text-red-500 text-right mt-1 mr-1">
    {{ errorMessage[0] }}
  </div>
</template>

<script setup>

const props = defineProps({
  errorMessage: {
    type: [Array, String],
    default: [""],
  },
  errorClear: {
    type: Boolean,
    default: false,
  },
});
</script>
