<template>
  <FormSectionHeader :label="'Payment'" />
  <small class="text-gray-500 font-poppins">All transactions are secure and encrypted</small>
  <div class="pay-box mt-2">
    <input type="radio" name="paymentMethod" id="creditCard" value="CREDITCARD" v-model="formValues.paymentMethod"
      checked />
    <label for="creditCard" class="font-montserrat font-bold">
      <span>Credit Card</span>
      <NuxtImg src="/images/cart-logo.jpg" loading="lazy" class="w-40 card-cls" width="160" height="28" />
    </label>
    <div class="collapse bg-gray-50 border border-gray-300 p-4">
      <CustomInput id="cardNumber" v-model="formValues.cardNumber" type="text" placeholder="Card Number"
        :errorMessage="errors.cardNumber" :maxLength="16" regex="^[0-9]*$" @paste="handlePaste"/>
      <div class="sm:flex sm:space-x-4">
        <CustomInput id="expiryMonthYear" v-model="formValues.expiryMonthYear" type="text" placeholder="MMYY" :errorMessage="errors.expiryMonthYear"
          :maxLength="4" regex="^[0-9]*$" />
        <!-- <CustomInput v-model="formValues.expiryYear" type="text" placeholder="YYYY" :errorMessage="errors.expiryYear"
          :maxLength="4" regex="^[0-9]*$" /> -->
        <CustomInput id="cvv" v-model="formValues.cvv" type="text" placeholder="CVV Code" :errorMessage="errors.cvv"
          :maxLength="4" regex="^[0-9]*$" />
      </div>
    </div>
    <input type="radio" name="paymentMethod" id="paypal_1" value="PAYPAL" v-model="formValues.paymentMethod" />
    <label for="paypal_1" class="font-bold">PayPal</label>
    <div v-if="!transactionStatus"  class="collapse bg-gray-50 border border-gray-300 p-6">
      <NuxtImg @click="handleSubmit" src="/images/paypal-checkout.png" width="300" height="100" class="w-200 mx-auto cursor-pointer"
        loading="lazy" />
    </div>
    <PurchaseSpinner v-if="transactionStatus && formValues.paymentMethod=='PAYPAL'"  />
  </div>
</template>
<script setup>
import CustomInput from "../CustomInput.vue";
import FormSectionHeader from "../FormSectionHeader.vue";
import { useFormStore ,useCheckoutStore } from "~/stores";
const checkoutStore = useCheckoutStore();

const transactionStatus = computed(() => checkoutStore.transactionStatus);
const props = defineProps({
  formValues: Object,
  errors: Object,
});

// formStore
const formStore = useFormStore();
const { handleSubmit } = formStore;
const handlePaste = (event) => {
  const pastedData = event.clipboardData.getData("text");
  // Remove spaces and keep only digits
  const sanitizedData = pastedData.replace(/\s+/g, "").replace(/[^0-9]/g, "");
  event.preventDefault(); // Prevent default paste behavior
  props.formValues.cardNumber = sanitizedData.slice(0, 16); // Update with sanitized value
}
</script>
<style scoped>
.card-cls {
  position: absolute;
  top: 14px;
  right: 5%;
}

.pay-box input[type="radio"] {
  display: block;
  position: absolute;
  z-index: 10;
  width: 40px;
  margin-top: 20px;
  height: 17px;
}

.pay-box label {
  display: block;
  padding: 15px 40px;
  margin: 0 0 1px 0;
  cursor: pointer;
  background: #ffffff;
  border-radius: 3px;
  color: #131313;
  transition: ease 0.5s;
  position: relative;
  border: 1px solid #dadada;
}

.pay-box label:hover {
  background: #fff;
}

.pay-box label::after {
  content: "+";
  font-size: 22px;
  font-weight: bold;
  position: absolute;
  right: 10px;
  top: 2px;
}

.pay-box input:checked+label::after {
  content: "-";
  right: 14px;
  top: 3px;
}

.pay-box .content {
  background: #e2e5f6;
  padding: 10px 25px;
  border: 1px solid #a7a7a7;
  margin: 0 0 1px 0;
  border-radius: 3px;
}

.pay-box input+label+.collapse {
  display: none;
}

.pay-box input:checked+label+.collapse {
  display: block;
}

.collapse {
  visibility: visible;
}
</style>
