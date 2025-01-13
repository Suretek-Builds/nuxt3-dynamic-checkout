<template>
  <h4 class="text-gray-800 font-semibold font-poppins text-base">{{ label }}</h4>
</template>
<script setup>
const props = defineProps({
    label: String
})
</script>