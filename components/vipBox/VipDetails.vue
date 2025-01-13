<template>
  <div id="one_time" class="mt-5 w-full p-[5px]">
    <VipTimer />
    <VipOffer />
  </div>
  <VipDescription />
</template>
<script setup>
import VipDescription from "./VipDescription.vue";
import VipOffer from "./VipOffer.vue";
import VipTimer from "./VipTimer.vue";
</script>
