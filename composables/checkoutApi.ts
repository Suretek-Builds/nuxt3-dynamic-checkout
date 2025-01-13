import { useCartStore, useCheckoutStore, useFormStore } from "~/stores";
export const importLead = async () => {
    const params = await formParams();
    const response: any = await apiHandler('importLead', params);
    if (response.result === "SUCCESS") {
        storage.setSessionItem("orderId", response.message.orderId);
        return true;
    }
}
export const submitPartialOrder = async () => {
    const partialOrderParams = await partialOrderFormParams();
    if (!partialOrderParams) return;
    const response: any = await apiHandler('importLead', partialOrderParams);
    if (response.result === "SUCCESS") {
        storage.setSessionItem("orderId", response.message.orderId);
        return true;
    }
}

export const importOrder = async () => {
    // checkoutStore
    const checkoutStore = useCheckoutStore();
    const alert = checkoutStore.updateAlert;
    const params = await formParams("order");
    const response: any = await apiHandler('importOrder', params);
    const router = useRouter();

    if (response.result === 'SUCCESS') {
        setOrderDetails(response.message);
        if (response.message.paypalSdkParams) {
            return response;
        } else if(response.message.paypalUrl)
        {
         window.location.href = response.message.paypalUrl;

        }
        else {
            checkoutStore.setStepCompleted(1);
            router.push({ path: '/up1' });
        }

    }
    if (response.result === "MERC_REDIRECT") {
        if (response.message && response.message.url) {
            window.location.href = response.message.url;
        }
    }
    if (response.result === 'SUCCESS') console.log("Success Hit");
    if (response.result === 'ERROR') checkoutStore.updateAlert(true, response.message);

    // else alert(true, response.message);
}

// Upsell product Query
export const upsellProducts = async (id: number) => {
    const config = useRuntimeConfig();
    const campaignId = config.public.CC_CAMPAIGN_ID;
    const params = { campaignProductId: id }
    const response: any = await apiHandler('getCampaign', params)
    let data: any;
    if (response.result === 'SUCCESS') {
        const { products } = response.message.data[campaignId];
        data = { productId: products[0].campaignProductId, price: products[0].price, variants: products[0].variants, title: products[0].productName };
    }
    return data
}

// Upsell Import
export const importUpsell = async ({ productId, productQty, productPrice, variantDetailId, pageTo, stepCompleted, title }: { productId: string, productQty: number, productPrice: string, variantDetailId: string, pageTo: string, stepCompleted: number, title: string }) => {
    // checkoutStore
    const checkoutStore = useCheckoutStore();
    const productCart = {
        product_id: productId,
        title: title,
        variant_id: "",
        price: Number(productPrice),
        image: "",
        variant_title: "",
        product_qty: productQty,
    };

    checkoutStore.setTransactionStatus(true)
    const alert = checkoutStore.updateAlert;
    const orderId = await storage.getSessionItem('orderId')
    const params: any = {
        orderId,
        productId,
        productQty,
        productPrice,
        variantDetailId
    }

    // merchant
    const merchant = await storage.getLocalItem('vipOptIn');
    if (!merchant) params.forceMerchantId = 2;


    const response: any = await apiHandler('importUpsell', params)
    // console.log("response", response)
    const router = useRouter();
    if (response.result === 'SUCCESS') {
        appendCart(productCart);
        checkoutStore.setTransactionStatus(false)
        checkoutStore.setStepCompleted(stepCompleted);
        router.push({ path: pageTo });
    }
    else {
        checkoutStore.setTransactionStatus(false);
        alert(true, response.message);
    }
}
const appendCart = async (productCart: any) => {
    let existingCart: any = storage.getSessionItem('productCart');
    existingCart.push(productCart);
    storage.setSessionItem('productCart', existingCart);

}
export const fbCAPI = async (eventType: string) => {
    const checkoutStore = await useCheckoutStore()
    const fbPixelId = checkoutStore.fbPixelId;
    const fbaccess_token = checkoutStore.fbaccess_token;
    if (!fbPixelId || !fbaccess_token) return;
    const cartStore = await useCartStore();
    const hashedEmail = SHA256('testemail@email.com');
    const hashedPhoneNumber = SHA256(12345679890);
    const getOrderDetail = await getOrderDetails();
    const user_data = {
        client_ip_address: getOrderDetail.ipAddress,
        client_user_agent: navigator.userAgent,
        em: hashedEmail,
        ph: hashedPhoneNumber,
        // Additional hashed fields if `Purchase` event
        ...eventType !== "Checkout" && {
            fn: await SHA256(getOrderDetail.firstName),
            ln: await SHA256(getOrderDetail.lastName),
            ct: await SHA256(getOrderDetail.city),
            st: await SHA256(getOrderDetail.state),
            zp: await SHA256(getOrderDetail.postalCode),
            country: await SHA256(getOrderDetail.country),
            fbc: getCookie("_fbc") || createFBCID(),
            fbp: getCookie("_fbp")
        }
    };
    const custom_data = {
        currency: "USD",
        value: getOrderDetail.cartTotal,
        item: getOrderDetail.productCart,
        ...(eventType !== "Checkout" && {
            orderid: getOrderDetail.orderId
        })
    };

    const params = [
        {
            event_name: eventType,
            event_time: Math.floor(new Date() / 1000),
            event_id: eventType != "Purchase" ? 1 : getOrderDetail.orderId,
            event_source_url: await getRequestUri(),
            action_source: "website",
            user_data: user_data,
            custom_data: custom_data,
        },
    ];
    const response: any = await apiHandler('fbCAPI', params);
}

// confirmPaypal
export const payPalConfirmed = async () => {
    // Extract parameters

    const route = useRoute();
    const paypalAccept = route.query.paypalAccept;
    if (paypalAccept == '1') {
    const token = route.query.token;
    const payerID = route.query.PayerID;
    const ba_token = route.query.ba_token;
    const checkoutStore = useCheckoutStore();
    checkoutStore.setTransactionStatus(true);
    checkoutStore.fullPageloader = true;
        confirmPayPal(payerID, token, ba_token);
    }
}
// confirmPayPal
export const confirmPayPal = async (payerId: String, token: String, baToken: string) => {
    const router = useRouter();
    const checkoutStore = useCheckoutStore();
    const formStore =useFormStore();
    const prepaidType=formStore.formValues.prepaidType;
    const paypalBillerId = '3';
    const productCart: any = await storage.getSessionItem('productCart');
    const sessionId = await storage.getSessionItem('sessionId');
    const params: any = { paypalBillerId, sessionId, payerId, token, baToken ,prepaidType};
    productCart.map((el: any, index: any) => {
        const pid = "product" + (index + 1) + "_id";
        const pqty = "product" + (index + 1) + "_qty";
        const vid = "variant" + (index + 1) + "_id";
        const prz = "product" + (index + 1) + "_price";
        params[pid] = el.product_id;
        params[pqty] = el.product_qty;
        params[vid] = el.variant_id;
        params[prz] = el.price;
    });
    const response: any = await apiHandler('confirmPaypal', params);
    checkoutStore.setTransactionStatus(false);
    checkoutStore.fullPageloader = false;
    if (response.result === "SUCCESS") {
        storage.setSessionItem("orderId", response.message.orderId);
        checkoutStore.setStepCompleted(1);
        router.push({ path: '/up1' });
    }
    else {
        checkoutStore.updateAlert(true, response.message);
    }
}
