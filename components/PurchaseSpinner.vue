<!-- <template>
    <section class="w-full grid place-content-center">
        <img src="/images/spinner.svg" alt="purchase spinner" class="w-32">
    </section>
</template> -->
<script setup lang="ts">
import { boolean } from 'zod';

const props=defineProps({
    fullPageloader:{
        type:Boolean,
        default:false
    }
})
</script>
<template>
  <section :class="props.fullPageloader ? 'fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75' : 'w-full grid place-content-center'">

      <img src="/images/spinner.svg" alt="Loading spinner" class="w-32 h-32">
    </section>
  </template>
