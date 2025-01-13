<template>
  <div>
    <h1 class="hidden lg:block text-sm sm:text-base font-bold px-2">Your Cart</h1>
    <section>
      <div class="border border-gray-300 w-full mt-2">
        <div class="w-[95%] mx-auto flex items-center gap-2 border-b-[1px] py-3 px-2">
          <svg width="20" height="19" xmlns="http://www.w3.org/2000/svg" href="" srcset=""
            class="order-summary-toggle__icon">
            <path fill="#000"
              d="M17.178 13.088H5.453c-.454 0-.91-.364-.91-.818L3.727 1.818H0V0h4.544c.455 0 .91.364.91.818l.09 1.272h13.45c.274 0 .547.09.73.364.18.182.27.454.18.727l-1.817 9.18c-.09.455-.455.728-.91.728zM6.27 11.27h10.09l1.454-7.362H5.634l.637 7.362zm.092 7.715c1.004 0 1.818-.813 1.818-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817zm9.18 0c1.004 0 1.817-.813 1.817-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817z"
              href="" srcset="">
            </path>
          </svg>
          <span class="text-xs sm:text-sm font-semibold">Show Order Summary</span>
        </div>
        <CartItemSkeleton v-if="cartLoading" />
        <CartItem v-else v-for="item in productCart" :key="item.product_id" :item="item" />
        <CartSummary :loading="cartLoading" :summaryItems="summaryItems" />
        <div id="order-total" class="w-[95%] mx-auto py-3 px-2 text-sm sm:text-base font-medium flex items-center justify-between">
          <p>Order Total</p>
          <p>${{ +cartStore.cartTotal.toFixed(2) }}</p>
        </div>
        <p class="lg:hidden text-left text-[10px] sm:text-xs py-2 text-[#67697ee6] w-[95%] mx-auto px-2 pb-3">Sales tax will be settled upon checkout confirmation.</p>
      </div>
      <Discount />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import CartItem from "./CartItem.vue";
import CartSummary from "./CartSummary.vue";
import { computed } from "vue";
import CartItemSkeleton from "./CartItemSkeleton.vue";
import { useCheckoutStore } from "~/stores/checkoutStore";
import Discount from "./Discount.vue";

// formStore
const checkoutStore = useCheckoutStore();

const cartStore = useCartStore();

const productCart = computed(() => cartStore.productCart);
const subTotal = computed(() => cartStore.subTotal.toFixed(2));
const salesTax = computed(() => cartStore.salesTax.toFixed(2));
const shipping = computed(() => cartStore.shipping.toFixed(2));
const cartLoading = computed(() => cartStore.cartLoading);
const discountLoading = computed(() => cartStore.discountLoading);
const shippingLoading = computed(() => cartStore.shippingLoading);
const cartTotalLoading = computed(() => cartStore.cartTotalLoading);
const vipOptIn = computed(() => checkoutStore.vipOptIn);
const shippingThreshold = computed(() => checkoutStore.shippingThreshold);
// const { cartLoading, cartEmpty } = cartStore;

// Prepare summary items
const summaryItems = computed(() => [
  { name: "Discount Savings", value: cartStore.discountSavings.toFixed(2), loading: discountLoading.value },
  { name: "Sub Total", value: subTotal, loading: false },
  { name: "Shipping", value: vipOptIn.value ? 'FREE' : shippingThreshold.value ? 'FREE' : shipping, loading: shippingLoading.value }, // Example static value
]);
</script>
