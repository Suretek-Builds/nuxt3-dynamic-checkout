export default defineNuxtRouteMiddleware((to) => {
    // Access the pageKey from the route params
    const pageKey = to.params.id as string;

    // Import or access your upsellConfig
    const pageData = upsellConfig[pageKey];
    // console.log(pageData);

    // Check if the pageKey exists in upsellConfig
    if (!pageData) {
        // console.error(`Invalid pageKey: ${pageKey}`);
        return navigateTo('/notfound'); // Redirect to the "not found" page
    }
});
