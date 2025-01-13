<template>
    <a target="_blank" :href="link"
        class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline break-words">{{ placeholder }}</a>
</template>
<script lang="ts" setup>
const props = defineProps({
    link: {
        type: String,
        default: "#",
    },
    placeholder: String,
})
</script>