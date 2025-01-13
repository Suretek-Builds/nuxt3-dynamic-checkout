import { defineStore } from "pinia";
import { useCartStore } from "./cartStore";
import { useFormStore } from "./formStore";
import { useShippingStore } from "./shippingStore";

export const useCheckoutStore = defineStore("checkout", () => {
  // cartStore
  const cartStore = useCartStore();
  // formStore
  const formStore = useFormStore();
  // checkoutStore
  const checkoutStore = useCheckoutStore();
  // shippingStore
  const shippingStore = useShippingStore();
  // Alert
  const alertVisible = ref(false);
  const alertMsg = ref("");
  // OneTimeOffers
  const oneTimeOffers = ref<any[]>([]);
  // UTM
  const utmParams = ref({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  });
  // Progress Steps
  const stepCompleted = ref<Number>(Number(storage.getLocalItem('stepCompleted')) || 0)
  //facebook capi
  const config = useRuntimeConfig();
  const emailOptIn = ref(true);
  const vipOptIn = ref(false);
  const shipGuardOptIn = ref(false);
  const tester = ref(false);
  const vipProduct = ref({});
  const shipGuranteeProduct = ref({});
  const requestUri = ref("");
  const ipAddress = ref("");
  const pageType = ref("");
  const sessionId = ref("");
  const affId = ref("");
  const defaultCountry = ref("None");
  const defaultRegion = ref("No");
  const transactionStatus = ref(false);
  const shippingThreshold = ref(false);
  const fbPixelId = ref(config.public.pixel_id);
  const fbaccess_token = ref(config.public.access_token);
  const upsSltdQty = ref(1);
  const upsellCart = ref({});
  const redirectOnError = ref(false);
  const fullPageloader = ref(false);

  // One Time Offers
  const oneTimeOffersArray = ref([
    {
      title: 'Yes, Add Tire Pressure Detection Caps Only $22.95',
      des: 'READ TIRE PRESSURE EASILY AND ACCURATELY Accurate and Precise Reading Avoid Premature Tire Wear and Blowouts Easy-To-Install New and Updated: Leak-Proof and Corrosion-Proof',
      img: '/images/oneTime/campaignProduct396.webp',
      for: '396',
      id: '396',
      checked: false
    },
    {
      title: 'Yes, Add Tire Plug Kit Only $19.95',
      des: 'Easy Fix For Punctured Tires! Just Plug and Go Complete Repair Kit Easy To Carry Case Works On Any Tire',
      img: '/images/oneTime/campaignProduct423.webp',
      for: '423',
      id: '423',
      checked: false
    },
    {
      title: 'Yes, Add 2 Year Warranty Only $11.95',
      des: 'Add an extended 2-year warranty to your Airmoto purchase today to stay protected!',
      img: '/images/oneTime/warranty.webp',
      for: '338',
      id: '338',
      checked: false
    }
  ])

  const updateOneTimeOfferArray = (ids: any[]) => {
    const config = useRuntimeConfig().public;
    const offerBundle = config.offerBundle;
    // Extract productIds from array
    const idsArray = ids.map(item => item.productId)
    // Convert ids from string to number
    const idsAsNumbers = idsArray.map(id => Number(id));
    // Check if there is any common id
    const hasCommonId = idsAsNumbers.some(id => offerBundle.includes(id));
    if (hasCommonId) {
      oneTimeOffersArray.value.pop();
      oneTimeOffersArray.value.push({
        title: 'Yes, Add InstaSeal Only $24.95',
        des: 'Fix Holes and Leaks In Seconds! Detects and Seals Tread Punctures Long-Lasting Plug To Prevent Air Loss Easy To Use - No Experience Needed Guaranteed Safe For Your Tires',
        img: '/images/oneTime/instaseal.webp',
        for: '385',
        id: '385',
        checked: false
      });
    } else return;
  }

  // Function to initialize session ID from storage
  const initializeSessionId = () => {
    const storedSessionId = storage.getSessionItem<string>("sessionId");
    if (storedSessionId) {
      sessionId.value = storedSessionId;
    }
  };

  const updateVipOptIn = () => {
    vipOptIn.value = !vipOptIn.value;
    if (vipOptIn.value) addVipInCart();
    else removeVipInCart();
  };
  const updateShipGuranteeOptIn = () => {
    shipGuardOptIn.value = !shipGuardOptIn.value;
    if (shipGuardOptIn.value) addShipGuranteeInCart();
    else removeShipGuranteeInCart();
  };

  const updateVipProduct = (productObject: object) => {
    vipProduct.value = productObject;
  };
  const updateShipGuranteeProduct = (productObject: object) => {
    shipGuranteeProduct.value = productObject;
    updateShipGuranteeOptIn();
  };

  const addVipInCart = () => {
    cartStore.updateLoading(true, 'shipping');
    cartStore.addProduct(vipProduct.value);
    // calculateDiscount();
    // shippingStore.handleStateList()
    if (checkoutStore.vipOptIn) formStore.formValues.shippingMethod = '156';
    shippingStore.updateShipping();
    storage.setLocalItem('vipOptIn', true);
  };
  const removeVipInCart = () => {
    cartStore.updateLoading(true, 'shipping');
    cartStore.removeProduct(vipProduct.value.product_id);
    formStore.formValues.shippingMethod = '153'
    shippingStore.updateShipping();
    storage.setLocalItem('vipOptIn', false);
  }
  const addShipGuranteeInCart = () => {
    cartStore.updateLoading(true, 'shipping');
    cartStore.addProduct(shipGuranteeProduct.value);
    cartStore.updateLoading(false, 'shipping');
  };
  const removeShipGuranteeInCart = () => {
    cartStore.updateLoading(true, 'shipping');
    cartStore.removeProduct(shipGuranteeProduct.value.product_id);
    cartStore.updateLoading(false, 'shipping');
  }
  const updateOneTimeOffers = (offers: Object[]) => {
    oneTimeOffers.value = offers;
  }
  const addOfferInCart = (id: number) => {
    const product = oneTimeOffers.value.filter(item => item.product_id === id);
    cartStore.addProduct(product[0]);
  }
  const addRequestUri = (url: string) => (requestUri.value = url);
  const addIpAddress = (ip: string) => (ipAddress.value = ip);
  const addPageType = (page: string) => (pageType.value = page);
  const addAffId = (id: string) => (affId.value = id);
  const addSessionId = (id: string) => {
    sessionId.value = id;
    storage.setSessionItem("sessionId", id);
  };

  const addIpInfo = ({ ip, country, postal, region }: { ip: string, country: string, postal: string, region: string }) => {
    addIpAddress(ip);
    storage.setSessionItem('ipAddress', ip);
  }

  const updateTester = (status: boolean) => {
    tester.value = status;
  }

  const updateAlert = (status: boolean, msg: string) => {
    if (!status) redirectOnError.value = true;
    alertVisible.value = status;
    alertMsg.value = msg;
  }

  const setUTMparams = (params: any) => {
    utmParams.value.utm_campaign = params.utm_campaign || '';
    utmParams.value.utm_medium = params.utm_medium || '';
    utmParams.value.utm_source = params.utm_source || '';
    utmParams.value.utm_term = params.utm_term || '';
    utmParams.value.utm_content = params.utm_content || '';
  }

  const setTransactionStatus = (status: boolean) => {
    transactionStatus.value = status;
  }

  const updateShippingThreshold = (status: boolean) => {
    shippingThreshold.value = status;
  }

  const setStepCompleted = (step: number) => {
    stepCompleted.value = step;
    storage.setLocalItem('stepCompleted', stepCompleted.value);
  }

  const resetStepCompleted = () => {
    stepCompleted.value = 0;
    storage.setLocalItem('stepCompleted', stepCompleted.value);
  }

  // Initialize session ID when the store is created
  onMounted(() => {
    initializeSessionId();
  });

  return {
    vipOptIn,
    updateVipOptIn,
    updateVipProduct,
    requestUri,
    addRequestUri,
    ipAddress,
    addIpAddress,
    pageType,
    addPageType,
    sessionId,
    addSessionId,
    addIpInfo,
    addAffId,
    affId,
    defaultCountry,
    defaultRegion,
    tester,
    updateTester,
    emailOptIn,
    alertVisible,
    alertMsg,
    updateAlert,
    utmParams,
    setUTMparams,
    transactionStatus,
    setTransactionStatus,
    shippingThreshold,
    updateShippingThreshold,
    fbPixelId,
    fbaccess_token,
    stepCompleted,
    setStepCompleted,
    resetStepCompleted,
    upsSltdQty,
    oneTimeOffers,
    updateOneTimeOffers,
    addOfferInCart,
    oneTimeOffersArray,
    updateOneTimeOfferArray,
    upsellCart,
    redirectOnError,
    fullPageloader,
    shipGuardOptIn,
    updateShipGuranteeProduct,
    updateShipGuranteeOptIn
  };
});
