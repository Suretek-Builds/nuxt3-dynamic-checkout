<template>
  <section id="main" class="bg-white">
    <CheckoutHeader />
    <FormHead />
    <div class="container mx-auto max-w-[960px] bg-white">
      <FormComponent />
    </div>
  </section>

  <CheckoutFooter />
  <Alert message="" />
</template>
<script lang="ts" setup>
import Alert from "~/components/Alert.vue";
import { CheckoutFooter, CheckoutHeader } from "~/components/export";
import { useCartStore, useCheckoutStore, useFormStore, useShippingStore } from "~/stores";


definePageMeta({
  middleware: 'save-params'
});

const route = useRoute();
const productsParams = route.query.products;
const affId = route.query.affId;
const tester = route.query.cctester;

// Cart Store
const cartStore = useCartStore();
const { addProduct, loadCart, updateAirmotoCart } = cartStore;

// Shipping Store
const shippingStore = useShippingStore();
const { setCountry, setShippingMethods } = shippingStore;

// Checkout Store
const checkoutStore = useCheckoutStore();
const { updateVipProduct, addRequestUri, addPageType, addIpInfo, addAffId, setUTMparams, updateShipGuranteeProduct } = checkoutStore;
addPageType("checkoutPage");
if (tester) checkoutStore.updateTester(true);
// setUTMparams(route.query);

// formStore
const formStore = useFormStore();
// Fetch the results asynchronously
function fetchCampaignResults() {
  loadCart("true");
  requestIdleCallback(async () => {
    try {
      payPalConfirmed()
      const { cartDetails, countries, shipProfiles, vipProductData, shipGuranteeData } =
        await campaignQuery(productsParams);
      // debugger;
      const info = await fetchIpInfo(); // get ip address
      if (info) addIpInfo(info);
      if (cartDetails.length) updateAirmotoCart(cartDetails);
      else addProduct(emptyCart);
      if (vipProductData) updateVipProduct(vipProductData);
      if (shipGuranteeData) updateShipGuranteeProduct(shipGuranteeData);
      if (countries) setCountry(countries);
      if (shipProfiles) setShippingMethods(shipProfiles);
      addAffId(affId);
      setTimeout(() => {
        formStore.billSame();
      }, 1000);
      await getRequestUri().then(url => addRequestUri(url)); // add requestUri in store
      importClick();
    } catch (error) {
      console.error("Error fetching campaign results:", error);
    } finally {
      loadCart("false");
      fbCAPI("Checkout");
      dataLayer("Checkout");
      storage.setLocalItem('vipOptIn', false);
    }
  });
}

// Call the function
fetchCampaignResults();

const router = useRouter();
onMounted(async () => {
  await checkSteps();
  const newQuery = mergeParams({});
  router.push({ query: newQuery });
});
</script>
