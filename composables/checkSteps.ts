import { useCheckoutStore } from "~/stores";

export const checkSteps = async () => {
    const checkoutStore = await useCheckoutStore();
    const router = useRouter();

    // Switch based on the value of `stepCompleted`
    switch (+checkoutStore.stepCompleted) {
        case 1:
            return router.push({ path: '/up1' });  // Use router.push for navigation
        case 2:
            return router.push({ path: '/down1' });
        case 3:
            return router.push({ path: '/up2' });
        case 4:
            return router.push({ path: '/down2' });
        case 5:
            return router.push({ path: '/up3' });
        case 6:
            return router.push({ path: '/down3' });
        case 7:
            return router.push({ path: '/thankyou' });
        // default:
        //     // Optionally handle a default case, if needed
        //     console.log('Invalid step or no step completed');
        //     return router.push('/');  // Redirect to a fallback route
    }
};