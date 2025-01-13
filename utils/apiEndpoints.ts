import type { ApiEndpoint } from "./interface";

// ~/utils/apiEndpoints.ts
export const apiEndpoints: Record<string, ApiEndpoint> = {
    getCampaign: {
        url: 'api/queryCampaign',
        method: 'POST',
    },
    importClick: {
        url: 'api/importClick',
        method: 'POST',
    },
    getDiscount: {
        url: 'api/orderCoupon',
        method: 'POST',
    },
    importLead: {
        url: 'api/importLead',
        method: 'POST',
    },
    importOrder: {
        url: 'api/importOrder',
        method: 'POST',
    },
    ipInfo: {
        url: 'https://ipinfo.io/json',
        method: 'GET',
    },
    importUpsell: {
        url: 'api/importUpsell',
        method: 'POST',
    },
    fbCAPI: {
        url:'api/facebookApi',
        method:'POST'
    },
    getOrder:{
        url:'api/getOrder',
        method:'POST'
    },
    confirmPaypal: {
        url: 'api/confirmPaypal',
        method: 'POST'
    }
    // Add more endpoints as needed
};
