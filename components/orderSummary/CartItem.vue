<template>
  <div class="flex items-center justify-between text-xs sm:text-sm py-3 px-2 w-[90%] mx-auto border-b">
    <p :class="{ 'text-[#ef476f] font-semibold': item.product_id == '1' }">{{ item.title }}</p>
    <span>${{ item.price.toFixed(2) }}</span>
  </div>
</template>

<script setup lang="ts">
// Define the props for the component
const props = defineProps<{
  item: {
    product_id: string;
    image: string;
    product_qty: number;
    title: string;
    variant_title: string;
    price: number;
  };
}>();

// Create a computed property to handle the optimized image URL
const optimizedImageUrl = computed(() => {
  // Access the item through props
  if (props.item.product_id == '1') return props.item.image;
  return `${props.item.image}?quality=50&format=webp`;
});
</script>

<style scoped></style>
