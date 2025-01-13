<template>
  <div>
    <FormSectionHeader label="Customer Info" />
    <CustomInput v-model="formValues.email" type="email" placeholder="Email (For Order Confirmation)"
      :errorMessage="errors.email" :maxLength="50" :submitPartialOrder="submitPartialOrder"/>
    <!-- Marketing Opt-in -->
    <div @click="handleEmailOptIn" class="mt-2 flex items-center w-fit">
      <input class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
        v-model="checkoutStore.emailOptIn" type="checkbox" name="newsletter" value="subscribe">
      <label class="cursor-pointer ml-2 text-sm font-medium text-gray-900">
        Email and/or Text me with news and offers
      </label>
    </div>
    <section id="phone-field" v-if="checkoutStore.emailOptIn">
      <CustomInput v-model="formValues.phone" type="text" placeholder="Phone ( Optional )" :errorMessage="errors.phone"
        :maxLength="10" regex="^[0-9]*$" :submitPartialOrder="submitPartialOrder" />
      <p class="mt-2 text-xs">By signing up, you agree to receive order receipt, shipping informaiton and recurring
        automated marketing
        messages, including cart reminders, at the phone number provided. Consent is not a condition of purchase. Reply
        STOP to unsubscribe. Reply HELP for help. Message frequency varies. Msg & data rates may apply. View our
        <CustomLink link="https://fewwillhunt.com/policies/privacy-policy" placeholder="Privacy Policy" /> and
        <CustomLink link="https://fewwillhunt.com/policies/terms-of-service" placeholder="Terms of Service" />.
      </p>
    </section>
  </div>
</template>

<script setup>
import { useCheckoutStore } from "~/stores";
import CustomInput from "../CustomInput.vue";
import FormSectionHeader from "../FormSectionHeader.vue";

const props = defineProps({
  formValues: Object,
  errors: Object,
});
// Checkout store
const checkoutStore = useCheckoutStore();

// Directly assign the customerInfo array to inputFields
const inputFields = inputConfig.customerInfo;
const handleEmailOptIn = () => {
  checkoutStore.emailOptIn = !checkoutStore.emailOptIn;
}
</script>
