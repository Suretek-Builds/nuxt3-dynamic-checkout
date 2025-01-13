<template>
    <!-- Discount -->
    <section id="discount-container" class="hidden lg:block py-3 px-2">
        <p class="text-center text-[10px] sm:text-xs py-2 text-[#67697ee6]">Sales tax will be settled upon checkout confirmation.</p>
        <!-- Discount section Start -->
        <div id="discount" class="pb-2">
            <div class="flex items-center justify-center px-10 w-full gap-5">
                <CustomInput v-model="formStore.formValues.discountCode" type="text" placeholder="Coupon Code" class=""
                    width="w-full" />
                <button type="button" @click="calculateDiscount"
                    class="bg-black h-[42px] mt-2 text-white px-5 rounded-md text-xs sm:text-sm">Apply</button>
            </div>
            <!-- Coupon Success Messages -->
            <div v-if="cartStore.couponSuccess.length">
                <p v-for="(coupon, index) in cartStore.couponSuccess" :key="'success-' + index"
                    class="flex items-center gap-1 mt-2 xl:text-sm text-xs">
                    <span class="text-green-700 font-semibold">{{ coupon.code }},</span>
                    <span>{{ coupon.msg }}</span>
                    <span v-if="coupon.code !== 'VIP10'" class="cursor-pointer"
                        @click="cartStore.removeCoupon(coupon.code)">
                        <svg class="inline" height="20" fill="red" xmlns="http://www.w3.org/2000/svg"
                            xml:space="preserve" viewBox="0 0 92 92" id="cross">
                            <path
                                d="M70.7 64.3c1.8 1.8 1.8 4.6 0 6.4-.9.9-2 1.3-3.2 1.3-1.2 0-2.3-.4-3.2-1.3L46 52.4 27.7 70.7c-.9.9-2 1.3-3.2 1.3s-2.3-.4-3.2-1.3c-1.8-1.8-1.8-4.6 0-6.4L39.6 46 21.3 27.7c-1.8-1.8-1.8-4.6 0-6.4 1.8-1.8 4.6-1.8 6.4 0L46 39.6l18.3-18.3c1.8-1.8 4.6-1.8 6.4 0 1.8 1.8 1.8 4.6 0 6.4L52.4 46l18.3 18.3z">
                            </path>
                        </svg>
                    </span>
                </p>
            </div>
            <!-- Coupon Error Message -->
            <div v-if="cartStore.couponError.msg">
                <p class="mt-2 xl:text-sm text-xs">
                    <span class="text-red-500 font-semibold">{{ cartStore.couponError.code }}, </span>
                    <span>{{ cartStore.couponError.msg }}</span>
                </p>
            </div>
        </div>
        <!-- Discount section End -->
         <NuxtImg src="/images/payments.webp" width="284" height="29" class="mx-auto" alt="payment-group" />
        <p class="text-center text-[10px] sm:text-xs py-2 text-[#67697ee6]">🔒 Secure 256-bit SSL encryption</p>
    </section>

</template>
<script lang="ts" setup>

import { useCartStore, useFormStore } from '~/stores';
import CustomButton from '../CustomButton.vue';

// cartStore
const cartStore = useCartStore();
// formStore
const formStore = useFormStore();
</script>