<template>
    <button @click="handleClick" id="size" :class="[
        selectedSize ? 'bg-black text-white' : 'bg-[#e3e3e3]',
        'rounded',
        'transition-all duration-100', // Smooth transition
        'hover:shadow-lg hover:outline hover:outline-2 hover:outline-black', // Glow effect on hover
        'focus:shadow-lg focus:outline focus:outline-2 focus:outline-black' // Glow effect on focus
    ]">{{ value }}</button>
</template>
<script setup>
const props = defineProps({
    selectedSize: {
        type: Boolean,
        default: false,
    },
    value: String,
})
const emit = defineEmits();
const handleClick = () => {
    emit('update-size', props.value); // Emit the value to the parent
};
</script>
<style scoped>
#size {
    width: 48px;
    height: 48px;
    font-weight: 500;
    cursor: pointer;
}
</style>