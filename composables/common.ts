import CryptoJS from "crypto-js";
import { string } from "zod";
import { useCheckoutStore, useFormStore, useShippingStore, useCartStore } from "~/stores";

export const campaignQuery = async (params: any) => {
  const checkoutStore = useCheckoutStore();
  const config = useRuntimeConfig().public;
  const [ids, campaignProductId] = campaignProductIds(config.AirmotoIds);
  const response: any = await apiHandler('getCampaign', { campaignProductId: campaignProductId.join(",") })
  if (response.result === "SUCCESS") {
    const { products, countries, shipProfiles } = response.message.data[config.CC_CAMPAIGN_ID];
    const cartDetails = cartData(ids, products);
    const vipProductData = updateVipData(products, config.vipProduct);
    const shipGuranteeData = updateVipData(products, config.shipGuardId);
    // const oneTimeOffers = getOneTimeOffers(products);
    // checkoutStore.updateOneTimeOfferArray(ids); // check for one time offers
    return { cartDetails, countries, shipProfiles, vipProductData, shipGuranteeData };
  } else {
    return response;
  }
};
export const orderQuery = async (params: string) => {
  const config = useRuntimeConfig().public;
  const response: any = await apiHandler('getOrder', { orderId: params });
  console.log('response', response);

}

export const cartData = (ids, products) => {
  const data: object[] = [];
  ids.map((id) => {
    products.map((product) => {
      if (product.campaignProductId == id.productId) {
        let variants = [];
        if (id.variantId) {
          variants = product.variants.filter(
            (v) => v.variantDetailId == id.variantId
          );
        }
        data.push({
          product_id: product.campaignProductId,
          compareAtPrice: product.compareAtPrice == null ? 0 : +product.compareAtPrice,
          title: product.productName,
          variant_id: variants[0] ? variants[0].variantDetailId : "",
          price: variants[0]
            ? Number(variants[0].price) * Number(id.quantity)
            : Number(product.price) * Number(id.quantity),
          image: variants[0] ? variants[0].imageUrl : product.imageUrl,
          variant_title: variants[0] ? variants[0].title : "",
          product_qty: id.quantity,
        });
      }
    });
  });
  return data;
};

// modified as per requirements
const campaignProductIds = (productIds: number[]) => {
  const config = useRuntimeConfig().public;

  // Initialize the ids array
  const ids: { productId: string; quantity: string; variantId: string }[] = [];

  // Iterate through the productIds array
  productIds.forEach((productId, index) => {
    const quantity = '1';  // Quantity is index + 1
    const variantId = "";  // Variant is empty
    ids.push({ productId: productId.toString(), quantity, variantId });
  });

  // Create the campaignProductId array
  const campaignProductId = ids.map((item) => item.productId);
  campaignProductId.push(config.vipProduct.toString());  // Add VIP product to the list
  campaignProductId.push(config.shipGuardId.toString());  // Add shipGurantee product to the list

  return [ids, campaignProductId];
};

export const decryptedResult = (encryptedResult: string) => {
  const secretKey = useRuntimeConfig().public.SecretKey; // Ensure this matches the key used for encryption

  // Decrypt the result
  const bytes = CryptoJS.AES.decrypt(encryptedResult, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const updateVipData = (products: object[], productId: number) => {
  const requiredProduct = products.filter(
    (product) => product.campaignProductId == productId
  )[0];
  return {
    product_id: requiredProduct.campaignProductId,
    title: requiredProduct.productName,
    variant_id: "",
    compareAtPrice: requiredProduct.compareAtPrice == null ? 0 : +requiredProduct.compareAtPrice,
    price: Number(requiredProduct.price),
    image: requiredProduct.imageUrl,
    variant_title: "",
    product_qty: 1,
  };
};

const getOneTimeOffers = (products: object[]) => {
  const config = useRuntimeConfig().public;
  const productIds: String[] = [...config.oneTimeOfferProducts.map(String), String(config.oneTimeOfferProduct3_1), String(config.oneTimeOfferProduct3_2)];
  // Map over the product IDs array to find matching products
  const updatedProducts = products
    .filter((product: any) => productIds.includes(String(product.campaignProductId))) // Filter by campaignProductId
    .map((product: any) => ({
      product_id: product.campaignProductId,
      title: product.productName,
      variant_id: "", // You can replace this with actual data if available
      price: Number(product.price), // Convert price to number
      image: product.imageUrl,
      variant_title: "", // You can replace this with actual data if available
      product_qty: 1, // Default to 1, you can adjust if needed
    }));
  // console.log("updatedProducts",updatedProducts)
  return updatedProducts;
};

export const formParams = async (type = "lead") => {
  // Checkout Store
  const route = useRoute();
  const urlParams = route.query;
  const checkoutStore = useCheckoutStore();
  const { requestUri, ipAddress, pageType, sessionId, affId, emailOptIn, utmParams } =
    checkoutStore;
  // formStore
  const formStore = useFormStore();
  const { formValues } = formStore;
  // cartStore
  const cartStore = useCartStore();
  const { productCart } = cartStore;
  // orderId
  const orderId = storage.getSessionItem("orderId") ? storage.getSessionItem("orderId") : "";
  // couponCode
  const value = cartStore.couponSuccess;
  const couponCode = value.length === 2 ? value[0].code + ',' + value[1].code : value.length === 1 ? value[0].code : "";
  // params
  const storedParams: any = JSON.parse(storage.getSessionItem('urlParams') || '{}');
  // Lead Details
  const params: any = {
    pageType,
    requestUri,
    ipAddress,
    sessionId,
    affId,
    orderId,
    emailOptIn,
    couponCode,
    salesUrl: await getRequestUri(),
    shipProfileId: formValues.shippingMethod,
    shipAddress1: formValues.address1,
    shipAddress2: formValues.address2,
    shipCity: formValues.city,
    shipCountry: formValues.country,
    shipPostalCode: formValues.postalCode,
    shipState: formValues.state,
    shipFirstName: formValues.firstName,
    shipLastName: formValues.lastName,
    address1: formValues.billingAddress1,
    address2: formValues.billingAddress2,
    billShipSame: formValues.sameAddress,
    city: formValues.billingCity,
    country: formValues.billingCountry,
    postalCode: formValues.billingPostalCode,
    state: formValues.billingState,
    paySource: formValues.paymentMethod,
    custom1: "Airmoto RevBoost",
    custom2: "CheckoutV3",
    custom5: "APIcheckoutC",
    redirectsTo: `${window.location.origin}/up1`,
    errorRedirectsTo: `${window.location.origin}?${new URLSearchParams(storedParams).toString()}`,
  }
  if (formValues.paymentMethod !== 'PAYPAL') {
    params.firstName = formValues.billingFirstName;
    params.lastName = formValues.billingLastName;
    params.emailAddress = formValues.email;
    params.phoneNumber = formValues.phone;
  }
  // merchant
  const merchant = await storage.getLocalItem('vipOptIn');
  if (!merchant && formValues.paymentMethod !== "PAYPAL") params.forceMerchantId = 2;

  productCart.map((el, index) => {
    const pid = "product" + (index + 1) + "_id";
    const pqty = "product" + (index + 1) + "_qty";
    const vid = "variant" + (index + 1) + "_id";
    const prz = "product" + (index + 1) + "_price";
    params[pid] = el.product_id;
    params[pqty] = el.product_qty;
    params[vid] = el.variant_id;
    params[prz] = el.price;
  });

  if (type === "order") {
    if (formValues.paymentMethod !== "PAYPAL") {
      params.cardNumber = formValues.cardNumber;
      params.cardMonth = formValues.expiryMonth;
      params.cardYear = formValues.expiryYear;
      params.cardSecurityCode = formValues.cvv;
      // UTM
      // Object.entries(utmParams).forEach(([key, value]) => {
      //   // params[`custom_order_${key}`] = value;
      //   console.log("add hua", type)
      //   // if (value) { // Ensure value is not empty or undefined
      //   // }
      // });
    } else {
      for (const key in urlParams) {
        if (urlParams.hasOwnProperty(key)) {
          if(!key.startsWith('utm'))params[`custom_order_${key}`] = urlParams[key];
        }
      }
      params.paySource = 'PAYPAL';
      params.paypalBillerId = 3;
      if(formValues.ispaypalSdkCliked)params.paypalSdk=1;
      params.prepaidType=formValues.prepaidType;

    }

  };

  params.browserData = await getBrowserData();

  return params;
}
export const partialOrderFormParams = async (type = "lead") => {
  // cartStore
  const cartStore = useCartStore();
  // Checkout Store
  const checkoutStore = useCheckoutStore();
  const { ipAddress, pageType, sessionId, affId } =
    checkoutStore;
  // formStore
  const formStore = useFormStore();
  const { formValues } = formStore;
  if (!formValues.lastName || !formValues.firstName) return false
  // couponCode
  const value = cartStore.couponSuccess;
  const couponCode = value.length === 2 ? value[0].code + ',' + value[1].code : value.length === 1 ? value[0].code : "";
  const partialOrderParams: any = {
    pageType,
    ipAddress,
    sessionId,
    affId,
    couponCode,
    salesUrl: await getRequestUri(),
    shipAddress1: formValues.address1,
    shipAddress2: formValues.address2,
    shipCity: formValues.city,
    shipState: formValues.state,
    shipFirstName: formValues.firstName,
    shipLastName: formValues.lastName,
    country: formValues.billingCountry,
    firstName: formValues.billingFirstName,
    lastName: formValues.billingLastName,
    emailAddress: formValues.email,
    phoneNumber: formValues.phone,
    postalCode: formValues.billingPostalCode,
  }
  const route = useRoute();
  const urlParams = route.query;
  for (const key in urlParams) {
    if (urlParams.hasOwnProperty(key)) {
      if(!key.startsWith('utm'))partialOrderParams[`custom_order_${key}`] = urlParams[key];
    }
  }
  // merchant
  const merchant = await storage.getLocalItem('vipOptIn');
  if (!merchant) partialOrderParams.forceMerchantId = 2;
  return partialOrderParams;
}

export const getRequestUri = async () => {
  const route = useRoute();
  const fullPath = `${window.location.origin}${route.fullPath}`;
  return fullPath;
};

export const fetchIpInfo = async () => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    // await fetch("https://ipinfo.io/json", requestOptions)
    const response = await fetch("https://ipinfo.io/json", requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    // throw new Error;
    console.error("Error fetching IP address:", error);
    return error;
  }
};

export const importClick = async () => {
  // Checkout Store
  const checkoutStore = useCheckoutStore();
  const { requestUri, ipAddress, pageType, sessionId, addSessionId, affId } =
    checkoutStore;
  const params = { requestUri, ipAddress, pageType, sessionId, affId };
  const response = await apiHandler('importClick', params);
  addSessionId(response.message.sessionId); // add the sessionId to the session
};

export const calculateDiscount = async () => {
  // cartStore
  const cartStore = useCartStore();
  const { productCart, applyDiscount, updateLoading, updateCouponSuccess, updateCouponError } = cartStore;
  updateLoading(true, 'discount');
  // formStore
  const formStore = useFormStore();
  const { formValues } = formStore;
  // Discount Coupon
  const params: any = { couponCode: formValues.discountCode }
  //products
  productCart.map((el, index) => {
    const pid = "product" + (index + 1) + "_id";
    const pqty = "product" + (index + 1) + "_qty";
    const vid = "variant" + (index + 1) + "_id";
    params[pid] = el.product_id;
    params[pqty] = el.product_qty;
    params[vid] = el.variant_id;
  });
  try {
    const response: any = await apiHandler('getDiscount', params)
    // console.log(response.result);
    if (response.result === "SUCCESS") {
      if (response.message.priceDiscount > 0) {
        updateCouponSuccess(formValues.discountCode, "Coupon Code has been applied", response.message.priceDiscount);
        updateCouponError('', "");

      } else {
        updateCouponError(formValues.discountCode, "Please Enter a Valid Coupon Code");
      }
      // applyDiscount(response.message.priceDiscount);
    } else if (response.result === "ERROR") {
      updateCouponError(formValues.discountCode, response.message)
    }
  } catch (error) {
    updateLoading(false, 'discount');
  } finally {
    formValues.discountCode = "";
    updateLoading(false, 'discount');
  }
};

export async function getBrowserData() {
  const data = {
    acceptHeader: 'application/json',
    userAgent: navigator.userAgent,
    language: navigator.language || navigator.userLanguage,
    timezone: String(new Date().getTimezoneOffset() * -1 * 60), // Timezone in minutes as a string
    colorDepth: window.screen.colorDepth,
    screen: {
      height: String(window.screen.height), // Convert to string
      width: String(window.screen.width), // Convert to string
    },
    javaScriptEnabled: true, // Always true when running in the browser
    javaEnabled: false, // Typically false; use `navigator.javaEnabled()` if needed
  };

  return JSON.stringify(data);
}

export const extractAddressComponents = async (addressComponents: object[], type = 'ship') => {
  const formStore = useFormStore();
  const handleError = formStore.handleError;
  const shippingStore = useShippingStore();
  let streetNumber = '';
  let route = '';
  let locality = '';
  let stateCode = '';
  let countryCode = '';
  let postalCode = '';
  addressComponents.forEach(component => {
    const types = component.types;

    // Combine premise, route, and sublocality levels into streetNumber
    if (types.includes('premise') || types.includes('street_number') ||
      types.includes('sublocality_level_3') || types.includes('sublocality_level_2') ||
      types.includes('sublocality_level_1') || types.includes('route')) {
      if (streetNumber) {
        streetNumber += ', ';
      }
      streetNumber += component.long_name;
    } else if (types.includes('locality')) {
      locality = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      stateCode = component.short_name; // State
    } else if (types.includes('country')) {
      countryCode = component.short_name;
    } else if (types.includes('postal_code')) {
      postalCode = component.long_name; // Main postal code
    }
  });
  // Log the extracted values
  if (type === 'ship') {
    formStore.formValues.address1 = streetNumber;
    handleError('address1');
    formStore.formValues.city = locality;
    handleError('city');
    formStore.formValues.country = countryCode;
    handleError('country');
    await shippingStore.handleStateList();
    formStore.formValues.state = stateCode;
    handleError('state');
    formStore.formValues.postalCode = postalCode;
    handleError('postalCode');
  }
  if (formStore.formValues.sameAddress || type !== 'ship') {
    formStore.formValues.billingAddress1 = streetNumber + " " + route;
    handleError('billingAddress1');
    formStore.formValues.billingCity = locality;
    handleError('billingCity');
    formStore.formValues.billingCountry = countryCode;
    handleError('billingCountry');
    await shippingStore.handleBillStateList();
    formStore.formValues.billingState = stateCode;
    handleError('billingState');
    formStore.formValues.billingPostalCode = postalCode;
    handleError('billingPostalCode');
  }
};

export const SHA256 = (data: any) => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}
/*  ------------------------------------Regarding FBC ID------------------------------------------------- */
//  Helper function to generate a consistent hash code for a string
export function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// Function to get the subdomain index
export function getSubdomainIndex() {
  const hostname = window.location.hostname;
  const subdomain = hostname.split(".")[0];
  return Math.abs(hashCode(subdomain));
}

// Function to get the creation time (first page view timestamp)
export function getCreationTime() {
  const creationTimeKey = "creation_time";
  let creationTime: any = localStorage.getItem(creationTimeKey);
  if (!creationTime) {
    creationTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    localStorage.setItem(creationTimeKey, creationTime);
  }
  return creationTime;
}

// Function to get the fbclid from URL parameters
export function getFbclid() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("fbclid");
}

// Function to create the fbc ID
export function createFBCID() {
  const subdomainIndex = getSubdomainIndex();
  const creationTime = getCreationTime();
  const fbclid = getFbclid();

  if (fbclid) {
    return `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
  }

  return "Click ID is not present in the URL parameters";
}
// const storageKeys = {
//   ipAddress: 'ipAddress',
//   productCart: 'productCart',
//   cartTotal: 'cartTotal',
//   orderId: 'orderId',
//   firstName: 'firstName',
//   lastName: 'lastName',
//   emailAddress: 'emailAddress',
//   phoneNumber: 'phoneNumber',
//   city: 'city',
//   state: 'state',
//   postalCode: 'postalCode',
//   country: 'country',
//   shippingAddress: 'shippingAddress',
//   paySource: 'paySource',
//   shippingMethod:'shippingMethod'
// };
export const getOrderDetails = async () => {
  const ipAddress = storage.getSessionItem('ipAddress');
  const cartTotal = storage.getSessionItem('cartTotal');
  const productCart = storage.getSessionItem('productCart');
  const orderId = storage.getSessionItem('orderId');
  const firstName = storage.getLocalItem('firstName');
  const lastName = storage.getLocalItem('lastName');
  const emailAddress = storage.getLocalItem('emailAddress');
  const phoneNumber = storage.getLocalItem('phoneNumber');
  const city = storage.getLocalItem('city');
  const state = storage.getLocalItem('state');
  const postalCode = storage.getLocalItem('postalCode');
  const country = storage.getLocalItem('country');
  const shippingAddress = storage.getLocalItem('shippingAddress');
  const paySource = storage.getLocalItem('paySource');
  const shippingMethod = storage.getLocalItem('shippingMethod');
  const billingAddress = storage.getLocalItem('billingAddress')
  return { ipAddress, productCart, cartTotal, orderId, firstName, lastName, emailAddress, phoneNumber, city, state, postalCode, country, shippingAddress, paySource, shippingMethod, billingAddress }
}
// export const getOrderDetails = async () => {
//   const orderDetails = Object.keys(storageKeys).reduce((details, key) => {
//     details[key] = storage.getLocalItem(storageKeys[key]);
//     return details;
//   }, {} as Record<string, any>);

//   return orderDetails;
// };
export const setOrderDetails = async (response: any) => {
  let address2;
  let billingAddress2;
  if (response.shipAddress2 == null) address2 = '';
  else address2 = response.shipAddress2;
  if (response.address2 == null) billingAddress2 = '';
  else billingAddress2 = response.address2;

  storage.setLocalItem("orderId", response.orderId);
  storage.setLocalItem("firstName", response.firstName);
  storage.setLocalItem("lastName", response.lastName);
  storage.setLocalItem("emailAddress", response.emailAddress);
  storage.setLocalItem("phoneNumber", response.phoneNumber);
  storage.setLocalItem("city", response.city);
  storage.setLocalItem("state", response.state);
  storage.setLocalItem("postalCode", response.postalCode);
  storage.setLocalItem("country", response.country);
  storage.setLocalItem("shippingAddress", response.shipAddress1 + ',' + address2 + ',' + response.shipCity + ',' + response.shipState + ',' + response.shipCountry + ',' + response.shipPostalCode);

  storage.setLocalItem("billingAddress", response.address1 + ',' + billingAddress2 + ',' + response.city + ',' + response.state + ',' + response.country + ',' + response.postalCode);
  storage.setLocalItem("paySource", response.paySource);
  storage.setLocalItem("shippingMethod", response.shipMethod);

}
// fbc and fbp
export function getCookie(name: any) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
export function dataLayer(eventType: string) {
  const config = useRuntimeConfig();
  const pixelId = config.public.pixel_id;
  const { ipAddress, productCart, cartTotal, orderId, firstName, lastName, emailAddress, phoneNumber, city, state, postalCode, country } = getOrderDetails();
  const datalayerobj = {
    event: eventType,
    total: cartTotal,
    value: cartTotal,
    currency: "USD",
    items: productCart,
    ...eventType !== "Checkout" && eventType !== "AddToCart" && {
      customerfname: firstName,
      customerlname: lastName,
      customeremail: emailAddress,
      customerphone: phoneNumber,
      orderid: orderId
    }
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(datalayerobj);
  if (pixelId) window.fbq('track', eventType, datalayerobj);



}

export function handleFocus() {
  dataLayer('AddToCart');
}

export function getUpsellproId(id: string | string[]) {
  const config = useRuntimeConfig();
  const key = Array.isArray(id) ? id[0] : id;
  const productId = config.public[key];
  return productId;
}
export const addStoredParamsToUrl = () => {
  const router = useRouter();
  const route = useRoute();
  const storedParams = JSON.parse(sessionStorage.getItem('urlParams') || '{}');
  const currentParams = { ...route.query, ...storedParams }; // Combine
  router.replace({ query: currentParams }); // Update URL without reloading
};
