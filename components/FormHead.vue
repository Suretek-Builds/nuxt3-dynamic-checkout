<template>
  <div class="flex items-center justify-center text-xs sm:text-sm py-4 gap-3 px-3">
    <p class="text-center">{{ data.step1 }}</p>
    <NuxtImg :src="data.img" width="57" heigth="18" alt="arrow" />
    <p>{{data.step2}}</p>
    <NuxtImg :src="data.img" width="57" heigth="18" alt="arrow" />
    <p>{{ data.step3 }}</p>
  </div>
</template>
<script setup>
const data = stepHeaderContent;
</script>
