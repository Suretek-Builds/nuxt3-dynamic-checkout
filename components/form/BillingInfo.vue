<template>
  <div>
    <FormSectionHeader label="Billing Information" />
    <p class="text-xs sm:text-sm font-light">Enter your billing address</p>
    <CustomInput id="billaddress1" v-model="formValues.billingAddress1" type="text" placeholder="Street Address"
      :errorMessage="errors.billingAddress1" />
    <!-- <CustomInput v-model="formValues.billingAddress2" type="text" placeholder="Apt, suite, etc. (optional)" /> -->
    <CustomInput v-model="formValues.billingCity" type="text" placeholder="City"
      :errorMessage="errors.billingCity" />
    <div class="sm:flex sm:space-x-2">
      <CustomSelect v-model="formValues.billingCountry" :options="countries" optionsValue="countryCode"
        displayName="countryName" :errorMessage="errors.billingCountry" @change="handleBillStateList"
        placeholder="Select country" />
      <CustomSelect v-model="formValues.billingState" :options="billState" optionsValue="stateCode"
        displayName="stateName" :errorMessage="errors.billingState" placeholder="Select state" />
      <CustomInput v-model="formValues.billingPostalCode" type="text" placeholder="Zip"
        :errorMessage="errors.billingPostalCode" />
    </div>
  </div>
</template>

<script setup>
import CustomInput from "../CustomInput.vue";
import CustomSelect from "../CustomSelect.vue";
import FormSectionHeader from "../FormSectionHeader.vue";
import { useShippingStore } from "~/stores/shippingStore";

const props = defineProps({
  formValues: Object,
  errors: Object,
});

const shippingStore = useShippingStore();
const countries = ref(shippingStore.countries); // Make sure to use ref
const billState = ref(shippingStore.billState); // Make sure to use ref
// Handle the state list update
const handleBillStateList = () => {
  shippingStore.handleBillStateList();
};

// address auto complete
const initAutocomplete = () => {
  if (typeof google === 'undefined') {
    console.error("Google Maps API is not loaded.");
    return;
  }

  const input = document.querySelector('#billaddress1');
  const autocomplete = new google.maps.places.Autocomplete(input)

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (place && place.formatted_address) {
      extractAddressComponents(place.address_components, 'bill');
    }
  })
}

onMounted(() => {
  initAutocomplete(); // Initialize on component mount
});

// Watch for updates to countries from the store
watch(
  () => shippingStore.countries,
  (newCountries) => {
    countries.value = newCountries; // Update local countries
    shippingStore.handleBillStateList();
  }
);

// Watch for updates to BillState from the store
watch(
  () => shippingStore.billState,
  (newBillState) => {
    billState.value = newBillState; // Update local BillState
  }
);
</script>
