<template>
  <button :disabled="disabled" :class="computedClasses">
    <slot>{{ placeholder }}</slot>
  </button>
</template>

<script setup>

const props = defineProps({
  placeholder: {
    type: String,
    default: "Click Me",
  },
  color: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: "medium",
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const computedClasses = computed(() => {
  const baseClasses = "text-black rounded-md";
  const sizeClasses =
    props.size === "large" ? "py-[15px] px-[10px] w-full md:text-lg font-bold tracking-widest border-[#cca100] border-[2px]" : "py-2 px-20 h-[42px]";
  const primaryClasses = props.color ? "bg-[#FFD431]" : "bg-gray-500";

  return `${baseClasses} ${sizeClasses} ${primaryClasses}`;
});

const handleClick = () => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>
