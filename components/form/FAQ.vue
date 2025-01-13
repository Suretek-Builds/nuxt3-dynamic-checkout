<template>
  <div v-for="item in items" class="border border-[#e5e5e5] py-2 px-5 my-3 rounded-md text-xs sm:text-sm">
    <h2 class="font-bold">{{ item.first }}</h2>
    <p class="my-2">{{ item.second }}</p>
    <h2 class="mt-7"><span class="font-bold">{{ item.third[0] }}</span> - {{ item.third[1] }}</h2>
  </div>
</template>

<script setup>
// Sample FAQ data
const items = [
  {
    first: '“Saved me on two emergencies!”',
    second: 'I bought these for all my grandkids for Christmas, they love it!',
    third: ['Sarah H.', 'Verified Purchaser']
  },
  {
    first: '“So convenient and easy to use!”',
    second: 'Never realized how handy this would be, it works great and easy to use.',
    third: ['Randal S.', 'Verified Purchaser']
  }
];
</script>
