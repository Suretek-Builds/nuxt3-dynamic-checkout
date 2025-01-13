<script setup lang="ts">
import { UpsellFooter, UpsellHeader } from '~/components/export';

</script>

<template>
    <div>
        <UpsellHeader />
        <slot />
        <!-- <UpsellFooter /> -->
    </div>
</template>
