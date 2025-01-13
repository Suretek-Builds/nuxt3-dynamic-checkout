<template>
  <section class="bg-black mt-8">
    <div class="container lg:w-2/3 sm:w-full mx-auto py-8 text-center">
      <img src="/images/offers/logo-w.png" class="w-40 mx-auto">
      <p class="text-red-600 text-lg font-bold  text-center mt-2">{{ phone }}</p>
      <div class="flex items-center justify-center mt-4">
        <ul class="flex flex-wrap items-center justify-center space-x-2 lg:mx-auto">
          <li class="text-white text-1xl text-nowrap">User Manual</li>
          <li class="text-white text-1xl text-nowrap">| Privacy Policy</li>
          <li class="text-white text-1xl text-nowrap">| Refund Policy</li>
          <li class="text-white text-1xl text-nowrap">| Terms</li>
          <li class="text-white text-1xl text-nowrap">| Wholesale</li>
          <li class="text-white text-1xl text-nowrap">| Support</li>
        </ul>
      </div>
      <p class="text-1xl text-white  font-regular">© 2024 Copyright - Airmoto - All Rights Reserved.</p>
      <img src="/images/offers/cards.png" class="w-60 mx-auto mt-4">
    </div>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
  phone: String,
})
const { phone } = (props);
</script>