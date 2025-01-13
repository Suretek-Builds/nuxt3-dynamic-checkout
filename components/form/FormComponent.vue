<template>
  <form @submit.prevent="">
    <div class="flex flex-wrap mt-7 max-w-full">
      <div class="lg:w-7/12 w-full px-4">
        <!-- Discount Timer -->
        <div id="discount-timer"
          class="text-xs sm:text-sm flex items-center justify-center gap-1 bg-[#eef3c9] py-2 rounded-lg">
          <p class="font-semibold">{{ discountTimer[0] }}</p>
          <p>{{ discountTimer[1] }}</p>
          <p v-if="minutes == 0 && seconds == 0" class="">EXPIRED</p>
          <p v-else class="text-red-600 font-semibold">{{ minutes.toString().padStart(2, '0') }} : {{
            seconds.toString().padStart(2, "0") }}</p>
        </div>
        <div class="lg:hidden">
          <ProductBox />
          <p class="text-xs text-center border-b pb-2 text-[#67697ee6]">Inflate Anything In Minutes</p>
        </div>
        <!-- Express Checkout -->
        <div id="express-chck" class="flex flex-col items-center justify-center my-5 gap-2">
          <p class="text-xs sm:text-sm font-semibold">{{ expressChck.text }}</p>
          <!-- <div class="bg-[#ffc439] py-2 px-16 rounded-md cursor-pointer" @click="handleExpressChck()">
            <NuxtImg :src="expressChck.img" width="57" heigth="18" alt="paypal" />
          </div> -->
          <div id="paypal-button-container"></div>
          <PurchaseSpinner v-if="transactionStatus && formValues.paymentMethod == 'PAYPAL'" />
        </div>
        <!-- AirMoto Packages -->
        <div id="airmoto-package" class="text-base font-semibold">
          <label for="airmoto-package" class="flex items-center justify-between">
            <span>{{ airmotoPackage.packageLabel.left }}</span>
            <span class="uppercase text-red-600">{{ airmotoPackage.packageLabel.right }}</span>
          </label>
          <hr class="mb-3" />
          <div id="package-box" @click="() => selectPackage(data.id)"
            :class="[selectedPackage === data.id ? 'border-[3px] border-[#2BA4FF]' : data.id !== 1 ? 'border-[#bbbbbb]' : '', data.id === 3 ? 'bg-[#feffe8]' : '', 'border-[1px] flex items-center justify-between px-5 py-2 rounded-md hover:bg-[#eaebf3] active:border-[3px] active:border-[#2BA4FF] my-2 cursor-pointer']"
            v-for="data in allPackage">
            <!-- Left -->
            <div class="inline-flex items-center">
              <label class="relative flex items-center cursor-pointer" for="html">
                <input name="framework" type="radio" :checked="selectedPackage === data.id"
                  class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                  :id="'html' + data.id">
                <span
                  class="absolute bg-blue-700 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                </span>
              </label>
              <label class="ml-2 cursor-pointer" :for="'html' + data.id" v-html="data.leftText"></label>
            </div>
            <!-- right -->
            <div class="flex flex-col items-end justify-center">
              <!-- Condition Rating -->
              <p v-if="data.rating" class="text-xs font-normal">{{ data.rating }}</p>
              <span class="line-through font-normal text-slate-500 text-sm">{{ data.rightPrice.was }}</span>
              <span>{{ data.rightPrice.is }}</span>
            </div>
          </div>
          <!-- Need More Button -->
          <div id="need-more" v-if="!needMore" @click="() => needMore = !needMore"
            class="grid place-content-center my-5 cursor-pointer">
            <p
              class="text-xs sm:text-sm text-blue-600 font-normal border-[#787878] border-[1px] border-dashed w-fit py-1 px-6 rounded-md">
              Need More?</p>
          </div>
          <!-- Need More packages -->
          <div id="package-box" v-if="needMore" @click="() => selectPackage(data.id)"
            :class="[selectedPackage === data.id ? 'border-[3px] border-[#2BA4FF]' : 'border-[#bbbbbb] border-[1px]', data.id === 10 ? 'bg-[#feffe8] border-dashed' : '', 'flex items-center justify-between px-5 py-2 rounded-md hover:bg-[#eaebf3] active:border-[3px] active:border-[#2BA4FF] my-2 transition-all cursor-pointer']"
            v-for="data in needMorePackages">
            <!-- Left -->
            <div class="inline-flex items-center">
              <label class="relative flex items-center cursor-pointer" for="html">
                <input name="framework" type="radio" :checked="selectedPackage === data.id"
                  class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                  :id="'html' + data.id">
                <span
                  class="absolute bg-blue-700 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                </span>
              </label>
              <label class="ml-2 cursor-pointer" :for="'html' + data.id" v-html="data.leftText"></label>
            </div>
            <!-- right -->
            <div class="flex flex-col items-end justify-center">
              <!-- Condition Rating -->
              <p v-if="data.rating" class="text-xs font-normal">{{ data.rating }}</p>
              <span class="line-through font-normal text-slate-500 text-sm">{{ data.rightPrice.was }}</span>
              <span>{{ data.rightPrice.is }}</span>
            </div>
          </div>
        </div>
        <!-- OrderNowText -->
        <p class="text-xs sm:text-sm text-center my-5">Order now...only <span class="text-red-600 font-bold">58</span>
          left in
          stock</p>
        <div class="left-div">
          <Spacer />
          <ShippingInfo :formValues="formValues" :errors="errors" />
          <Spacer />
          <FormSectionHeader label="Shipping Method" />
          <CustomSelect v-if="formValues.country || formValues.billingCountry" v-model="formValues.shippingMethod"
            :errorMessage="errors.shippingMethod"
            :options="checkoutStore.vipOptIn ? shippingStore.freeShipping : checkoutStore.shippingThreshold ? shippingStore.freeShipping : shippingStore.shippingMethods"
            placeholder="Select Shipping Method" optionsValue="shipProfileId" displayName="profileName" />
          <div v-else class="bg-[#F5F5F5] border rounded-md border-gray-300 py-[6px] px-[12px]">
            <p class="xl:text-sm text-xs text-[#707070]">Enter your shipping country to view available shipping methods.
            </p>
          </div>
          <Spacer />
          <div class="flex align-middle gap-4 text-sm">
            <input type="checkbox" class="cursor-pointer" v-model="checkoutStore.shipGuardOptIn"
              @click="checkoutStore.updateShipGuranteeOptIn">
            <p class="cursor-pointer" @click="checkoutStore.updateShipGuranteeOptIn">Get peace of mind with ShipGuard
              Shipping Guarantee in the event your delivery is damaged, stolen, or lost during transit for $1.95</p>
          </div>
          <Spacer />
          <PaymentInfo :formValues="formValues" :errors="errors" />
          <!-- same Billing select -->
          <div class="flex items-center my-7">
            <input id="checkbox2" v-model="formValues.sameAddress" type="checkbox"
              class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
            <label @click="handleBillSame" for="checkbox2"
              class="cursor-pointer ml-2 text-sm font-medium text-gray-900">
              Billing and shipping are the same?
            </label>
          </div>
          <BillingInfo v-if="!formValues.sameAddress" :formValues="formValues" :errors="errors" />
          <Spacer />
          <VipDetails />
          <Spacer />
          <div class="lg:hidden">
            <Cart />
            <Spacer />
          </div>
          <CustomButton v-if="formValues.paymentMethod !== 'PAYPAL' && !transactionStatus"
            placeholder="COMPLETE YOUR PURCHASE" size="large" @click="handleSubmit" buttonType="submit" />
          <!-- <LoadingSpinner v-if="transactionStatus" /> -->
          <PurchaseSpinner v-if="transactionStatus" :fullPageloader="fullPageloader" />
        </div>
        <Spacer />
        <div class="gurantee-images w-full flex flex-col items-center justify-center mb-7">
          <NuxtImg src="/images/badge_secure_guarantee.webp" width="353" height="60" alt="badge_secure_guarantee" />
          <NuxtImg src="/images/badge_credit_cards.webp" width="364" height="40" alt="badge_credit_cards" />
        </div>
      </div>
      <div class="lg:w-5/12 w-full px-4">
        <div class="hidden lg:block bg-[#f9f9f9]">
          <ProductBox />
          <Cart />
        </div>
        <div class="hidden lg:block">
          <!-- moneyBack -->
          <div class="flex items-center py-5 gap-5">
            <NuxtImg src="/images/badge_guarantee_2.webp" width="85" height="70" alt="money-back-badge" />
            <p class="text-[10px] sm:text-xs"><b>90 Day Money-Back Guarantee:</b> Feel safe knowing you are protected
              with a 90 day guarantee. Simply send the item(s) back in the original packagingto receive a refund or
              replacement, less S&H.</p>
          </div>
          <FAQ />
        </div>
      </div>

    </div>
  </form>
</template>

<script setup>
import { useFormStore, useCartStore, useCheckoutStore, useShippingStore } from "~/stores";
import BillingInfo from "./BillingInfo.vue";
import FAQ from "./FAQ.vue";
import PaymentInfo from "./PaymentInfo.vue";
import ShippingInfo from "./ShippingInfo.vue";
import Spacer from "../Spacer.vue";
import CustomButton from "../CustomButton.vue";
import Cart from "../orderSummary/Cart.vue";
import VipDetails from "../vipBox/VipDetails.vue";
import { formContent } from "~/utils/helper";
import ProductBox from "../orderSummary/ProductBox.vue";
const { minutes, seconds, startCountdown } = useCountdown(10, 0);
// Content
const { discountTimer, expressChck, airmotoPackage } = formContent;
const allPackage = airmotoPackage.packages;
const needMorePackages = airmotoPackage.needMorePackages;
const route = useRoute();
// needMorePackages
const needMore = ref(false);

const formStore = useFormStore();
const { formValues, handleSubmit } = formStore;
const errors = ref(formStore.errors);

const shippingStore = useShippingStore();

// cartStore
const cartStore = useCartStore();
const couponSuccess = ref(cartStore.couponSuccess);

// Checkout store
const checkoutStore = useCheckoutStore();

const transactionStatus = computed(() => checkoutStore.transactionStatus);
const fullPageloader = computed(() => checkoutStore.fullPageloader);
//  const transactionStatus = true;

// selectedPackage
const selectedPackage = ref(1);
const selectPackage = (id) => {
  selectedPackage.value = id;
  cartStore.airmotoAddProduct(selectedPackage.value);
}

const handleExpressChck = () => {
  formStore.formValues.paymentMethod = "PAYPAL";
  handleSubmit();
}
//paypal and venmo
const paypalSdkParams = ref(null);
const paypalPrePaidType = ref(null);

// Watch for errors updates
watch(
  () => formStore.errors,
  (newErrors) => {
    errors.value = newErrors; // Update local errors
  }
);

watch(
  () => cartStore.couponSuccess,
  (newCouponSuccessAvailable) => {
    couponSuccess.value = newCouponSuccessAvailable; // Update new coupon list after removal
  }
);
onMounted(() => {
  startCountdown();
  if (window.paypal) {
    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          label: "paypal",
        },
        onClick: async (data, actions) => {
          try {
            formStore.formValues.ispaypalSdkCliked = true;
            if (data.fundingSource == 'venmo') formStore.formValues.prepaidType = "PAYPAL_VENMO";
            formStore.formValues.paymentMethod = "PAYPAL";
            const fundingSource =
              data && data.fundingSource && data.fundingSource.toUpperCase();
            if (["VENMO", "PAYLATER"].includes(fundingSource)) {
              paypalPrePaidType.value = "PAYPAL_" + fundingSource;
            }
            // Simulate API response for order parameters
            // const res = { result: "SUCCESS", message: { paypalSdkParams: { id: "C88AA30A0D" } } };
            const res = await importOrder();
            console.log('resres', res)
            if (res && res.result === "SUCCESS" && res.message.paypalSdkParams) {
              paypalSdkParams.value = res.message.paypalSdkParams;
              console.log('onclick', data);
              return actions.resolve();
            } else {
              return actions.reject();
            }
          } catch (err) {
            console.error("Error during onClick:", err);
            return actions.reject();
          }
        },
        createOrder: (data, actions) => {
          try {
            console.log('createorder', data);

            const orderId = paypalSdkParams.value && paypalSdkParams.value.id;
            if (!orderId) {
              throw new Error("Insufficient data to process PayPal checkout.");
            }
            return orderId;
          } catch (err) {
            console.error("Error during createOrder:", err);
            return actions.reject();
          }
        },
        onApprove: async (data, actions) => {
          try {
            console.log("Transaction approved:", data);
            console.log("Parameters for confirm PayPal API:");
            console.log({
              token: data.orderID,
              payerId: data.payerID,
              paypalSdk: 1,
              prepaidType: paypalPrePaidType.value,
            });
            confirmPayPal(data.payerID, data.orderID, '');
          } catch (err) {
            console.error("Error during onApprove:", err);
            throw new Error("Unable to confirm order.");
          }
        },
        onCancel: (data) => {
          // confirmPayPal('hsdjhj687', 'EC-3GR24566UD611731H', '');
          console.log("Transaction canceled by the customer.", data);
        },
        onError: (err) => {
          console.error("Error from PayPal SDK:", err);
        },
      })
      .render("#paypal-button-container");
  } else {
    console.error("PayPal SDK failed to load.");
  }
})
</script>
