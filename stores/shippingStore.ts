// stores/shippingStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { useCartStore } from "./cartStore";
import { useCheckoutStore } from "./checkoutStore";
import { useFormStore } from "./formStore";

export const useShippingStore = defineStore("shipping", () => {
  // CheckoutStore
  const checkoutStore = useCheckoutStore();
  // formStore
  const formStore = useFormStore();
  // cartStore
  const cartStore = useCartStore();

  const countries = ref<object[]>([]);
  const allStates = ref<any>();
  const shipState = ref<object[]>([]);
  const billState = ref<object[]>([]);
  const allShippingStates = ref<shippingMethods[]>([]);
  const shippingMethods = ref<object[]>([]);
  const shippingAvailable = ref<object[]>([]);
  const freeShipping = ref<object[]>([]); // if vipOptIn or freeShipThreshold is applicable

  // Fetch states using useAsyncData
  const { data: stateData, error } = useAsyncData(
    "All States",
    async () => await $fetch("https://assets.checkoutchamp.com/countries.json")
  );

  if (stateData.value) allStates.value = stateData.value;

  const getStatesByCountry = async (countryCode: string) => {
    return allStates.value.filter((state) => state.countryCode === countryCode);
  };

  const updateStateByName = async (name: string) => {
    formStore.formValues.state = shipState.value.filter(state => state.stateName === name)[0].stateCode
  }
  const updateBillStateByName = async (name = "code") => {
    if (name !== "code") formStore.formValues.billingState = billState.value.filter(state => state.stateName === name)[0].stateCode;
    else formStore.formValues.billingState = billState.value.filter(state => state.stateCode === formStore.formValues.billingState)[0].stateCode;
  }

  const setCountry = (country: object[]) => {
    countries.value = country;
    // formStore.formValues.country = checkoutStore.defaultCountry;
    if (formStore.formValues.sameAddress) formStore.formValues.billingCountry = formStore.formValues.country;
  };

  const updateShipping = async () => {
    if (allShippingStates.value.length > 0) {
      if (!formStore.formValues.shippingMethod) {
        shippingAvailable.value = [];
        cartStore.updateLoading(false, 'shipping');
        return false;
      }
      shippingAvailable.value = allShippingStates.value.filter(method => method.shipProfileId == formStore.formValues.shippingMethod);
      // console.log("shippingAvailable.value", shippingAvailable.value)
      if (+shippingAvailable.value[0]?.freeShipThreshold <= cartStore.subTotal && shippingAvailable.value[0]?.freeShipThreshold != null) {
        checkoutStore.updateShippingThreshold(true);
        cartStore.updateCart(0, 'shipping');
        // console.log('shipping available', shippingAvailable.value)
      } else {
        checkoutStore.updateShippingThreshold(false);
        cartStore.updateCart(+shippingAvailable.value[0]?.rules[0].shipPrice, 'shipping');
      }
      if (checkoutStore.shippingThreshold || checkoutStore.vipOptIn) formStore.formValues.shippingMethod = '156';
      else if (formStore.formValues.shippingMethod === '156') formStore.formValues.shippingMethod = '153'
    }
    cartStore.updateLoading(false, 'shipping');
  }

  const handleStateList = async () => {
    cartStore.updateLoading(true, 'shipping');
    const stateCountryCode = formStore.formValues.country;
    if (!stateCountryCode) return; // Guard against empty country code
    const filteredStates = await getStatesByCountry(stateCountryCode);
    formStore.formValues.state = ""; // Reset state when filtering
    shipState.value = filteredStates;
    await updateShipping();
  };

  const handleBillStateList = async () => {
    const billCountryCode = formStore.formValues.billingCountry;
    if (!billCountryCode) return; // Guard against empty billing country code
    const filteredStates = await getStatesByCountry(billCountryCode);
    formStore.formValues.billingState = ""; // Reset billing state when filtering
    billState.value = filteredStates;
  };

  const modifyProfileNames = (shipProfiles: shippingMethods[]) => {
    // Create a new array with modified profileName
    const modifiedShipProfiles = shipProfiles.map(profile => {
      // Extract the shipPrice from the first rule in the rules array
      const shipPrice = profile.rules[0]?.shipPrice || "0.00";

      // Modify the profileName in the profile object
      return {
        ...profile,
        profileName: `${profile.profileName} - $${shipPrice}`,
      };
    });

    // Return the new array
    return modifiedShipProfiles;
  }

  const setShippingMethods = (methods: shippingMethods[]) => {
    // Exlude VIP Shipping Processing as requested by Client
    // allShippingStates.value = modifyProfileNames(methods).filter(method => +method.shipProfileId !== 155);
    
    // Inlucde VIP Shipping Processing as requested by Client
    allShippingStates.value = modifyProfileNames(methods);
    
    shippingMethods.value = allShippingStates.value.filter(method => +method.shipProfileId !== 156);
    freeShipping.value = allShippingStates.value.filter(method => +method.shipProfileId === 156);
  };

  return {
    countries,
    setCountry,
    handleStateList,
    handleBillStateList,
    allStates,
    shipState,
    billState,
    shippingMethods,
    setShippingMethods,
    shippingAvailable,
    updateStateByName,
    updateBillStateByName,
    updateShipping,
    freeShipping
  };
});

type shippingMethods = { shipProfileId: string; profileName: string; rules: { shipPrice: string }[] }