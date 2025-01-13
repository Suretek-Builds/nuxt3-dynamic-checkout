<template>
  <div class="bg-[#222] flex items-center justify-between sm:justify-around py-1 px-3">
    <NuxtImg :src="data.headerLogo" width="140" height="27" class="w-[120px] sm:w-[140px] h-[23px] sm:h-[27px]"
      alt="logo.webp" />
    <div class="flex items-center justify-center gap-2 sm:gap-4">
      <NuxtImg :src="data.guaranteeBadge" width="60" height="60" class="w-[42px] sm:w-[60px] h-[42px] sm:h-[60px]"
        alt="gurantee-badge" />
      <div class="hidden sm:block text-white text-xs sm:text-sm">
        <p v-for="text in data.guaranteeText">{{ text }}</p>
      </div>
      <!-- verticle line -->
      <div class="border-l-[1px] border-white h-[35px] sm:h-[50px]"></div>
      <div class="text-white text-xs sm:text-sm">
        <p v-for="text in data.enquiryText">{{ text }}</p>
      </div>
    </div>
  </div>
  <!-- Below header paragraph -->
  <p class="text-center text-xs sm:text-sm font-semibold bg-[#e5e7eb] py-1">{{ data.title }}</p>
</template>
<script setup>
const data = checkoutHeaderContent;
</script>
