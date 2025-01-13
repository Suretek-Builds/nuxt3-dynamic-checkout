<template>
  <div class="lg:w-6/12 sm:w-full w-full">
    <div class=" b-shadow">
      <p class="text-md font-poppins font-regular text-center  mb-2">Your Product Receipt</p>
      <div class="bg-white rounded-lg">
        <table class="table-auto w-full">
          <thead>
            <tr class="">
              <th class="text-md border-b border-gray-300 px-4 py-2 text-left">Item</th>
              <th class="border-b border-gray-300 px-4 py-2 text-left">Quantity</th>
              <th class="border-b border-gray-300 px-4 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productCart">
              <td class="text-md border-b border-gray-300 px-4 py-2 text-left w-b"> {{ product.title }}</td>
              <td class="text-md border-b border-gray-300 px-4 py-2 text-left w-b"> {{ product.product_qty }}</td>
              <td class="text-md border-b border-gray-300 px-4 py-2 text-left w-b"> {{ product.price }}</td>
            </tr>

          </tbody>
        </table>
        <div class="flex w-full">
          <p class="border-gray-300 px-4 py-2 text-left"><img src="/images/offers/gau.png" class="w-68"></p>
          <p class="text-sm border-gray-300 px-4 py-2 text-left"><b>90 DAYS GURANTEE</b><br>Every order comes with our
            90 day guarantee on all unused purchases. Simply send the item(s) back to us in the original unopened
            packaging for a full refund or replacement, less S&H.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { productCart } = await getOrderDetails();

</script>