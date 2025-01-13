<script lang="ts" setup>
import { number } from "card-validator";
import { ref, onMounted, onUnmounted } from "vue";
import { useCheckoutStore } from "~/stores";
const { minutes, seconds, startCountdown } = useCountdown(5, 0);
definePageMeta({
    layout: 'custom',
    middleware: 'check-page-key'
})
const route = useRoute();
const router = useRouter();
const pageKey = route.params.id
const pageData = upsellConfig[pageKey];
const checkoutStore = useCheckoutStore();
const { addPageType, addRequestUri, setStepCompleted, upsSltdQty } = checkoutStore;
const transactionStatus = computed(() => checkoutStore.transactionStatus);
addPageType(pageData.pageType);

// confirmPaypal

let qty: number | null = null
let productQty: string
if (pageKey !== "up3" && pageKey !== "down3") {
    qty = await storage.getLocalItem('airmotoQty')!;
    productQty = '(' + qty + ')';
}
onMounted(async () => {
    startCountdown()
    await checkSteps();
    addStoredParamsToUrl()
    const newQuery = mergeParams({});
    router.push({ query: newQuery });
    fbCAPI(pageData.event);
    dataLayer(pageData.event)
    upsell();
});
const productDetails: any = ref({
    productId: "",
    productQty: qty,
    productPrice: "",
    variantDetailId: "",
    pageTo: pageData.nextStep.yes,
    stepCompleted: pageData.stepCompleted.yes,
})

const upsell = async () => {
    const productsId = getUpsellproId(route.params.id);
    await getRequestUri().then(url => addRequestUri(url));
    const { productId, price, title } = await upsellProducts(productsId);
    productDetails.value.productId = productId;
    productDetails.value.productPrice = price;
    productDetails.value.stepCompleted = pageData.stepCompleted.yes;
    productDetails.value.title = title;
    importClick();
}
const handlePurchase = async () => {
    if (pageKey == 'up3' || pageKey == 'down3') productDetails.value.productQty = checkoutStore.upsSltdQty;
    else productDetails.value.productQty = qty;
    importUpsell(productDetails.value);
}
const mayBeLater = async () => {
    checkoutStore.setStepCompleted(pageData.stepCompleted.no);
    router.push({ path: pageData.nextStep.no });
}
 const selectQuantity=(qty: number) =>{
  const checkoutStore = useCheckoutStore();
  checkoutStore.upsSltdQty = qty;
  handlePurchase();
}
</script>
<template>
    <UpsellHeader :text="pageData.header" :classes="pageData.headerClass" />
    <section id="main">
        <div class="container lg:w-2/3 sm:w-full mx-auto p-4">
            <div class="">
                <h4 :class="pageData.headingClass"  >{{ pageData.heading }}
                </h4>
                <div v-if="minutes === 0 && seconds === 0" class="text-center font-bold text-customRed">
                    <h4>DEAL IS EXPIRING
                    </h4>
                </div>

                <div v-else class="countdown text-center lg:w-2/3 mx-auto">
                    <span class="text-gray-800 font-bold">Ending Soon:</span>
                    <span id="minutes" class="mx-2 font-bold text-customRed">
                        {{ minutes.toString().padStart(2, '0') }} Minutes
                    </span>
                    <span id="colon" class="font-bold text-customRed">:</span>
                    <span id="seconds" class="mx-2 font-bold text-customRed">
                        {{ seconds.toString().padStart(2, '0') }} Seconds
                    </span>
                </div>
                <h2 id="productTitle" class="text-center font-bold text-lg sm:text-3xl text-black mt-1 sm:mt-4">{{ (qty ? productQty : '')
                    + ' ' + pageData.des }}
                </h2>
            </div>
            <div class="mt-1 sm:mt-4 flex flex-wrap">
                <div class="lg:w-6/12 sm:w-full lg:p-8">
                    <NuxtImg :src="pageData.productImg" class="w-screen hide-sm border border-gray-300 border-2 rounded-lg" />
                    <NuxtImg :src="pageData.productImgMob" class="w-screen hide-lg border border-gray-300 border-2 rounded-lg" />
                </div>
                <div class="lg:w-6/12 sm:w-full lg:pl-8 mt-3">
                    <p :class="'font-semibold text-sm ' + pageData.offerTxtColor"><span class="yellow-bg">★★★★★</span>
                        {{ pageData.offerType }}
                    </p>
                    <h3 :class="pageData.offerDescClass">{{ pageData.offerDes }}</h3>
                    <div class="flex flex-wrap mt-1 sm:mt-4">
                        <h2 class="font-bold text-customRed text-lg">Only ${{ pageData.price.is }}/ea</h2>
                        <h2 class="text-md text-gray-400 font-medium mx-1"><del> Only
                                ${{ pageData.price.was }}/ea</del></h2>
                    </div>
                    <div class=" font-medium text-md sm:mt-3">
                        <ul v-if="pageData.point.is" class="space-y-2">
                            <li v-for="list in pageData.point.options" class="flex items-center space-x-2">
                                <div class="bg-green-500 text-white rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>(1) {{ list }}</span>
                            </li>
                        </ul>
                        <p v-if="pageData.productDes.is" class="text-md">{{ pageData.productDes.text }}</p>
                    </div>
                    <div v-if="pageData.quantitySelector.is">
                        <div class="bg-gray-200 text-lg  rounded-lg uppercase px-4 font-bold mt-4">Select Quantity to
                            Add:</div>
                        <div class="flex">
                            <button v-for=" qty in pageData.quantitySelector.options" @click="selectQuantity(qty)"
                                :class="[
                                    'text-lg font-bold py-3 rounded-lg w-full mt-7 shadow-lg mx-1',
                                    qty === checkoutStore.upsSltdQty ? 'bg-[#e9be19]' : 'bg-yellow'
                                ]">{{ qty
                                }}</button>
                        </div>
                    </div>
                    <div class="mx-auto text-center block">
                        <button v-if="!transactionStatus && !pageData.quantitySelector.is" :title="pageData.submitBtnTitle"
                            :class="pageData.submitBtnColor" @click="handlePurchase()">Yes,
                            Add to My Order!</button>
                        <PurchaseSpinner v-if="transactionStatus" />
                        <div class="text-center mt-8 mb-7">
                            <button @click="mayBeLater" class="text-gray-400 font-medium text-xl cursor-pointer"
                                id="openModal">
                                No thanks, maybe later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- <UpsellsUpsellFooter /> -->
    <!-- Alert -->
    <Alert message="" :pageTo="pageData.nextStep.yes" :stepCompleted="pageData.stepCompleted.yes" />
</template>
<style scoped>
.content-auto {
    content-visibility: auto;
}

.width-300 {
    width: 300px
}

.width-600 {
    width: 600px
}

.spacer {
    margin: 30px 0;
}

.countdown {
    background: #f2ffd6 !important;
    border-color: #c5d89c !important;
    border: 2px dashed;
    padding: 4px 10px;
    border-radius: 10px;
}

.bg-customRed {
    background-color: #E00000;
}

.bg-customBlue {
    background-color: #3547ff;
}

.text-customBlue {
    color: #3547ff;
}

.text-customRed {
    color: #E00000;
}

.yellow-bg {
    color: #FFB800;
    font-size: 20px;
}

.bg-yellow {
    background-color: #FFD431 !important;
    border: 2px solid #cca100 !important;
    color: #000;
}

@keyframes wiggle {
    0% {
        transform: rotate(0deg);
    }

    80% {
        transform: rotate(0deg);
    }

    85% {
        transform: rotate(2deg);
    }

    95% {
        transform: rotate(-2deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

.animate-wiggle {
    /* Apply the animation properties with adjusted timings */
    animation-name: wiggle;
    animation-duration: 2s;
    /* Duration of the wiggle */
    animation-timing-function: ease;
    animation-delay: 3s;
    /* Delay before the next wiggle starts */
    animation-iteration-count: infinite;
    /* Infinite repeats */
    animation-direction: normal;
    animation-fill-mode: none;
    animation-play-state: running;
    animation-timeline: auto;
    animation-range-start: normal;
}
.hide-lg {
    display: none;
}
.hide-sm{
    display: block;
}

@media (min-width:280px) and (max-width:500px) {
    .hide-lg {
    display: block;
}
.hide-sm{
    display: none;
}
.countdown {
    padding: 0;
    font-size: 14px;
}
}
</style>