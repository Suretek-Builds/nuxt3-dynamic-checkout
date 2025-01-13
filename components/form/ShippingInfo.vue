<template>
  <div>
    <FormSectionHeader label="Shipping Address" />
    <p class="text-xs sm:text-sm font-light">Enter your shipping address</p>
    <CustomInput id="email" v-model="formValues.email" type="email" placeholder="Email (For Order Confirmation)"
      :errorMessage="errors.email" :maxLength="50" :submitPartialOrder="submitPartialOrder" />
    <div class="sm:flex sm:space-x-4 w-full">
      <CustomInput id="firstName" v-model="formValues.firstName" type="text" placeholder="First Name" :errorMessage="errors.firstName"
        :submitPartialOrder="submitPartialOrder" />
      <CustomInput id="lastName" v-model="formValues.lastName" type="text" placeholder="Last Name" :errorMessage="errors.lastName"
        :submitPartialOrder="submitPartialOrder" />
    </div>
    <CustomInput id="address1" @focus="initAutocomplete" v-model="formValues.address1" type="text"
      placeholder="Address 1" :errorMessage="errors.address1" :submitPartialOrder="submitPartialOrder" />
    <CustomInput v-model="formValues.address2" type="text" placeholder="Apt, suite, etc. (optional)" />
    <CustomInput id="city" v-model="formValues.city" type="text" placeholder="Town / City" :errorMessage="errors.city"
      :submitPartialOrder="submitPartialOrder" />
    <div class="sm:flex sm:space-x-4">
      <CustomSelect id="country" v-model="formValues.country" :options="countries" optionsValue="countryCode"
        displayName="countryName" :errorMessage="errors.country" @change="handleStateList"
        placeholder="Select country" />
      <CustomSelect id="state" v-model="formValues.state" :options="shipState" optionsValue="stateCode" displayName="stateName"
        :errorMessage="errors.state" placeholder="Select state" />
      <CustomInput id="postalCode" v-model="formValues.postalCode" type="text" placeholder="Postal Code"
        :errorMessage="errors.postalCode" :maxLength="10" :submitPartialOrder="submitPartialOrder" />
    </div>
    <CustomInput id="phone" v-model="formValues.phone" type="text" placeholder="Phone ( Optional )" :errorMessage="errors.phone"
      :maxLength="10" regex="^[0-9]*$" :submitPartialOrder="submitPartialOrder" />
  </div>
</template>

<script setup>
import { useShippingStore, useFormStore } from "~/stores";
import CustomInput from "../CustomInput.vue";
import CustomSelect from "../CustomSelect.vue";
import FormSectionHeader from "../FormSectionHeader.vue";

const shippingStore = useShippingStore();
const formStore = useFormStore();
const countries = ref(shippingStore.countries); // Make sure to use ref
const shipState = ref(shippingStore.shipState); // Make sure to use ref
const isAutocompleteActive = ref(false);

// Handle the state list update
const handleStateList = () => {
  shippingStore.handleStateList();
};

const props = defineProps({
  formValues: Object,
  errors: Object,
});

const handleBillSame = () => {
  props.formValues.sameAddress = !props.formValues.sameAddress
  formStore.billSame("same");
}

const isVisible = (elem) => {
    if (!elem) return false; // If the element doesn't exist, it's not visible
    const style = getComputedStyle(elem);
    return style.display !== 'none' && style.visibility !== 'hidden' && elem.offsetWidth > 0 && elem.offsetHeight > 0;
};

// address auto complete
const initAutocomplete = () => {
    if (typeof google === 'undefined') {
        console.error("Google Maps API is not loaded.");
        return;
    }

    const input = document.querySelector('#address1');
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: ['us', 'ca'] }
    });

    google.maps.event.addDomListener(input, 'keydown', function(event) {
        if (event.keyCode === 13 && document.querySelector('.pac-container.pac-logo').style.display !== 'none') {
            event.preventDefault(); // Prevent form submission
            isAutocompleteActive.value = true; // Indicate that autocomplete is actively used
        }
    });

    autocomplete.addListener('place_changed', () => {
        isAutocompleteActive.value = false; // Reset on place selection
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
            extractAddressComponents(place.address_components);
            input.blur(); // Optionally, you can blur the input after selection
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => { // Allow slight delay for autocomplete to settle
            isAutocompleteActive.value = false;
        }, 300);
    });
}

onMounted(() => {
  initAutocomplete(); // Initialize on component mount
});

// Watch for updates to countries from the store
watch(
  () => shippingStore.countries,
  (newCountries) => {
    countries.value = newCountries; // Update local countries
    shippingStore.handleStateList();
  }
);

// Watch for updates to shipState from the store
watch(
  () => shippingStore.shipState,
  (newShipState) => {
    shipState.value = newShipState; // Update local shipState
  }
);
</script>
