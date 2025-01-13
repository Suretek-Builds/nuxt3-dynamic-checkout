// middleware/checkProgress.ts

import { useCheckoutStore } from "~/stores";

export default defineNuxtRouteMiddleware((to) => {
    const checkoutStore = useCheckoutStore();
    console.log("to.name", to.name, checkoutStore.stepCompleted);

    // Check for route names as string literals to avoid errors
    // if (to.name === 'checkout' && +checkoutStore.stepCompleted > 1) {
    //     return navigateTo('/up1'); // Redirect to upsell 1 if they've already completed the checkout
    // }

    // if (+checkoutStore.stepCompleted === 0) {
    //     return navigateTo('/');
    // }
    if (+checkoutStore.stepCompleted === 1) {
        return navigateTo('/offer1');
    }
    if (+checkoutStore.stepCompleted === 2) {
        return navigateTo('/offer2');
    }
    if (+checkoutStore.stepCompleted === 3) {
        return navigateTo('/offer3');
    }
    if (+checkoutStore.stepCompleted === 4) {
        return navigateTo('/thankyou');
    }

    // Allow navigation for other valid conditions
});
