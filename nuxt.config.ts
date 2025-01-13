// https://nuxt.com/docs/api/configuration/nuxt-config
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
export default defineNuxtConfig({

  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image"],
  css: ["@/assets/css/main.css"],
  app: {
    baseURL: process.env.PUBLIC_BASE_URL,
    head: {
      title: "Airmoto",
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
      ],
      script: [
        {
          src: "https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places",
          async: true,
          defer: true,
        },
        // {
        //   src: "https://www.paypal.com/sdk/js?client-id=YOUR_ID",
        //   async: true,
        // }
         {
          src: "https://www.paypal.com/sdk/js?client-id=YOUR_ID",
        }
      ]
    }
  },

  runtimeConfig: {
    CC_LOGIN_ID: "CHECKOUT_CHAMP_API_LOGIN_ID",
    CC_PASSWORRD: "CHECKOUT_CHAMP_API_PASSWORD",
    pixel_id: "PIXEL_ID",
    access_token:
      "ACCESS_TOKEN",
    public: {
      pixel_id: "PIXEL_ID",
      access_token:
        "ACCESS_TOKEN",
      CC_CAMPAIGN_ID: "65",
      SecretKey: "darkAngle",
      email: "support@getairmoto.com",
      phoneNumber: "888-855-6433",
      BILLER_ID: 3,
      AirmotoIds: [3859, 3860, 3861, 3862, 3863, 3864, 3865, 3866, 3867, 3868],
      vipProduct: 3880,
      shipGuardId: 3817,
      shipProfile: 153,
      up1: 3950,
      down1: 3951,
      up2: 3952,
      down2: 3953,
      up3: 3954,
      down3: 3955
      // gtm: {
      //   id: "GTM-YOUR_ID",
      //   queryParams: "",
      //   defer: true,
      //   compatibility: false,
      //   nonce: "2726c7f26c",
      //   enabled: true,
      //   debug: true,
      //   loadScript: true,
      //   enableRouterSync: true,
      //   ignoredViews: "",
      //   trackOnNextTick: true,
      //   devtools: false,
      // },
    },
  },
});
