<template>
    <p :class="[classes, `text-${align}`]" :style="{ fontSize: fontSize + 'px' }">
        <slot>{{ placeholder }}</slot>
    </p>
</template>

<script lang="ts" setup>
const props = defineProps({
    fontWeight: {
        type: String,
    },
    align: {
        type: String,
        default: 'center'
    },
    fontSize: {
        type: Number,
        default: 16
    },
    placeholder: {
        type: String,
        required: true
    }
})

// Compute the font style based on the prop
const fontStyle = computed(() => {
    return props.fontWeight === 'bold' ? 'font-medium tracking-wider' : '';
})

// Combine the classes dynamically
const classes = computed(() => {
    return fontStyle.value // Use .value to access the computed property
})
</script>