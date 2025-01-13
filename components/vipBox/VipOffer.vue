<template>
  <table class="bg-[#FFD439] text-xs">
    <tbody>
      <tr class="flex gap-2 p-2">
        <td>
          <NuxtImg id="pulse1" alt="left-arrow" src="/images/right.webp" width="22" height="13"
            class="min-w-[30px] h-auto" />
        </td>
        <td>
          <input v-model="vipOptIn" @click="updateVipOptIn" id="checkbox" type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer" />
        </td>
        <td>
          <p class="font-semibold cursor-pointer" @click="updateVipOptIn">
            Claim Free S&H (Save $6.95) TODAY + VIP. This offer expires once you leave the page! I am 18 years or older
            and agree to the <a href="https://getairmoto.com/policies/terms-of-service" target="_blank"
              class="link">terms and
              conditions</a> and <a href="https://getairmoto.com/policies/privacy-policy" target="_blank"
              class="link">privacy
              policy</a>.
          </p>
        </td>
        <td>
          <NuxtImg id="pulse1" alt="left-arrow" src="/images/left.webp" width="22" height="13"
            class="min-w-[30px] h-auto" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { useCheckoutStore } from "~/stores/checkoutStore";

const checkoutStore = useCheckoutStore();
const { updateVipOptIn } = checkoutStore;
// Access vipOptIn directly from the store
const vipOptIn = computed(() => checkoutStore.vipOptIn);
</script>
<style scoped>
.link {
  color: #0008ff;
}

.link:hover {
  text-decoration: underline;
}
</style>
