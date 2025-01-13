export default defineNuxtRouteMiddleware((to) => {
    // Save the current query parameters to session storage
    storage.setSessionItem('urlParams', JSON.stringify(to.query));
})