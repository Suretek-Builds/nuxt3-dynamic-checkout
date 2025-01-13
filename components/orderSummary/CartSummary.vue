<template>
  <div class="text-xs sm:text-sm w-[95%] mx-auto py-3 px-2 border-b">
    <div v-for="(label, index) in summaryItems" :key="index" class="flex items-center justify-end font-normal">
      <!-- Label Name -->
      <div :class="{'px-4 flex-1 text-nowrap text-right' : true, 'font-semibold' : label.name === 'Discount Savings'}">
        {{ label.name }}
      </div>
      <!-- Empty Space -->
      <!-- Value or Loading Spinner -->
      <div class="text-right w-[50px]">
        <template v-if="!loading">
          <template v-if="label.loading">
            <LoadingSpinner />
          </template>
          <template v-else>
            <template v-if="label.name === 'Discount Savings'">
              <p class="text-nowrap text-red-600 font-semibold">
                ${{ label.value }}
              </p>
            </template>
            <template v-else>
              <template v-if="typeof (label.value) === 'string'">
                {{ label.value }}
              </template>
              <template v-else>
                ${{ label.value }}
              </template>
            </template>
          </template>
        </template>
        <template v-else>
          <LoadingSpinner />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  summaryItems: Array<{
    name: string;
    value: number; // Optional to handle cases where value might not be present
    loading?: boolean; // Optional to handle cases where loading status might be present
  }>;
  loading: boolean;
}>();
</script>
