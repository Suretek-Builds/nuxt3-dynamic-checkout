<template>
    <div :class="`mt-${mt}`"></div>
</template>

<script lang="ts" setup>
const props = defineProps({
    mt: {
        type: Number,
        default: 7
    }
})
</script>