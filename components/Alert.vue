<template>
    <div  v-if="visible" :id="id" class="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-[9999]">
    <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-2/3 flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert">
        <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            viewBox="0 0 20 20">
            <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <div class="ms-3 text-sm font-medium">
            {{ message }}
            <a :href="linkUrl" v-if="linkUrl" class="font-semibold underline hover:no-underline">{{ linkText }}</a>
        </div>
        <button @click="closeAlert" type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
            aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
    </div>
</div>
</template>

<script setup>
import { number } from 'card-validator';
import { string } from 'zod';
import { useCheckoutStore } from '~/stores';
const props = defineProps({
    linkUrl: {
        type: String,
        default: null
    },
    linkText: {
        type: String,
        default: 'Click here'
    },
    id: {
        type: String,
        default: 'alert-1'
    },
    pageTo:{
        type:String,
        default:''
    },
    stepCompleted:{
        type:Number,
    }
});

// chcekoutStore
const checkoutStore = useCheckoutStore();

const visible = computed(() => checkoutStore.alertVisible);
const message = computed(() => checkoutStore.alertMsg);
const updateAlert = checkoutStore.updateAlert;
const closeAlert = () => {
if(props.pageTo)
{
    redirectToNextpage();
}
    updateAlert(false, "");
};
watch(visible, (newValue) => {
    if (newValue) {
        document.body.classList.add('disable-background');
    } else {
        document.body.classList.remove('disable-background');
    }
});
function redirectToNextpage(){
    console.log('props.stepCompleted',props.stepCompleted);
    console.log('props.props.pageTo',props.pageTo)

  const router=  useRouter();
  checkoutStore.setStepCompleted(props.stepCompleted);
  router.push(props.pageTo);
}
</script>

<style scoped>
/* Additional custom styling if needed */
.disable-background {
    pointer-events: none; /* Disable all interactions */
    overflow: hidden; /* Prevent scrolling */
}

.disable-background .fixed {
    pointer-events: auto; /* Allow interactions with alert and overlay */
}
</style>