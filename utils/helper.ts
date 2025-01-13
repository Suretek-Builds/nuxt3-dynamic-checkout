import type { RequestOptions } from "./interface";

export const requestOptions: RequestOptions = {
  method: "POST",
  redirect: "follow",
};

export const inputConfig = {
  customerInfo: [
    {
      model: 'phone',
      type: 'text',
      placeholder: 'Phone (For Tracking Confirmation)',
      errorMessage: 'errors.phone',
      maxLength: 10,
      regex: '^[0-9]*$',
    },
    {
      model: 'email',
      type: 'email',
      placeholder: 'Email (For Order Confirmation)',
      errorMessage: 'errors.email',
      maxLength: 50, // Optional, you can omit if not needed
    }
  ],
  paymentInfo: [
    {
      model: 'cardNumber',
      type: 'text',
      placeholder: 'Card Number',
      errorMessage: 'errors.cardNumber',
      maxLength: 16,
      regex: '^[0-9]*$',
    },
    {
      model: 'expiryMonthYear',
      type: 'text',
      placeholder: 'MMYY',
      errorMessage: 'errors.expiryMonthYear',
      maxLength: 2,
      regex: '^[0-9]*$',
    },
    // {
    //   model: 'expiryYear',
    //   type: 'text',
    //   placeholder: 'YYYY',
    //   errorMessage: 'errors.expiryYear',
    //   maxLength: 4,
    //   regex: '^[0-9]*$',
    // },
    {
      model: 'cvv',
      type: 'text',
      placeholder: 'CVV Code',
      errorMessage: 'errors.cvv',
      maxLength: 4,
      regex: '^[0-9]*$',
    },
  ],
}

export const emptyCart = {
  product_id: 1,
  title: 'Your cart is empty',
  variant_id: '',
  price: 0,
  image: '/images/empty-cart.png',
  variant_title: 'Add something to make me happy :)',
  product_qty: 0,
};

export const checkoutHeaderContent = {
  headerLogo: '/images/logo.webp',
  guaranteeBadge: '/images/badge_guarantee.webp',
  guaranteeText: ['90-Day 100%', 'Money Back Guarantee'],
  enquiryText: ['Questions?', 'Call: 888-855-6433'],
  title: '100% Encrypted & Secure Checkout'
}

export const stepHeaderContent = {
  step1: 'Select Quantity',
  step2: 'Checkout',
  step3: 'Bonus Deals',
  img: '/images/active_arrow.webp'
}

const packageWasPrice = 139.95
export const formContent = {
  discountTimer: ['Discount Applied!', 'Limited Discount Ends Soon'],
  expressChck: {
    text: 'Express Checkout',
    img: '/images/paypal.svg'
  },
  airmotoPackage: {
    packageLabel: { left: 'Choose Your Package', right: 'ON Sale' },
    packages: [
      { id: 1, leftText: 'Buy 1 <span>- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 1).toFixed(2)}`, is: '$69.99/ea' } },
      { id: 2, leftText: 'Buy 2 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 2).toFixed(2)}`, is: '$67.99/ea' } },
      { id: 3, leftText: 'Buy 3 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 3).toFixed(2)}`, is: '$65.99/ea' }, rating: '⭐ Most Popular' },
      { id: 4, leftText: 'Buy 4 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 4).toFixed(2)}`, is: '$63.99/ea' } },
      { id: 5, leftText: 'Buy 5 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 5).toFixed(2)}`, is: '$61.99/ea' }, rating: '⭐⭐ Family Deal' },
      { id: 6, leftText: 'Buy 6 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 6).toFixed(2)}`, is: '$59.99/ea' } },
      { id: 7, leftText: 'Buy 7 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 7).toFixed(2)}`, is: '$57.99/ea' }, rating: '⭐⭐⭐ Gift Saver' }
    ],
    needMorePackages: [
      { id: 8, leftText: 'Buy 8 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 8).toFixed(2)}`, is: '$56.99/ea' } },
      { id: 9, leftText: 'Buy 9 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 9).toFixed(2)}`, is: '$55.99/ea' } },
      { id: 10, leftText: 'Buy 10 <span class="font-normal">- Airmoto</span>', rightPrice: { was: `$${(packageWasPrice * 10).toFixed(2)}`, is: '$54.99/ea' }, rating: '⭐⭐⭐ Super Saver' }
    ]
  }
}
export const upsellConfig = {
  up1: {
    pageType: "upsellPage1",
    header: "WAIT! Don't Miss This Exclusive One-Time Deal",
    headerClass: 'bg-customRed py-2',
    heading: "Select Your Special Upgrade Offer",
    headingClass: "font-bold text-xl text-center text-customRed mb-4",
    des: "Power Kit and 2-YR Warranty",
    offerType: "Best Value Deal",
    stepCompleted: {yes:3,no:2},
    nextStep: {yes:"up2",no:"down1"},
    offerTxtColor: "text-customRed",
    offerDes: "Charge Your Airmoto Anywhere PLUS... 2 Year Total Protection!",
    offerDescClass: "font-bold text-lg text-black",
    productImg: "/images/offers/up1.jpg",
    productImgMob: "/images/offers/up1-mob.jpg",
    price: { is: 37, was: 59 },
    point: {
      is: true,
      options: ["Extended 3ft. Cable", "Home Adapter", "Car Charger", "2-Year Warranty"]
    },
    productDes: { is: false },
    submitBtnColor: " text-lg font-semibold py-3 rounded-lg w-full mt-7 shadow-lg hover:shadow-lg hover:!bg-[#e9be19] animate-wiggle bg-yellow",
    submitBtnTitle: "purchase upsell",
    quantitySelector: {
      is: false,
      selectedQuantity: [false, true, false, false, false],
    },
    event: "Purchase"
  },
  down1: {
    pageType: "upsellPage1",
    header: "JUST CHECKING... ARE YOU SURE?",
    headerClass: 'bg-customBlue py-2',
    heading: "76% OF CUSTOMERS TAKE THIS LAST CHANCE OFFER!",
    headingClass: "font-bold text-xl text-center text-customBlue mb-4 underline",
    des: "Power Kit and 2-YR Warranty",
    offerType: "Last Chance Offer",
    stepCompleted: {yes:3,no:3},
    nextStep: {yes:"up2",no:"up2"},
    offerTxtColor: "text-customRed",
    offerDes: "Charge Your Airmoto Anywhere PLUS... 2 Year Total Protection!",
    offerDescClass: "font-bold text-lg text-black",
    productImg: "/images/offers/down1.jpg",
    productImgMob: "/images/offers/down1-mob.jpg",
    price: { is: 24.95, was: 59 },
    point: {
      is: true,
      options: ["Extended 3ft. Cable", "Home Adapter", "Car Charger", "2-Year Warranty"]
    },
    productDes: { is: false },
    submitBtnColor: " text-lg font-semibold py-3 rounded-lg w-full mt-7 shadow-lg hover:shadow-lg hover:!bg-[#e9be19] animate-wiggle bg-[#ff0000] text-white border-2 border-[#cd0000] p-4",
    submitBtnTitle: "purchase downsell",
    quantitySelector: {
      is: false,
      selectedQuantity: [false, true, false, false, false],
    },
    event: "Purchase"

  },
  up2: {
    pageType: "upsellPage2",
    header: "WAIT! Don't Miss This Exclusive One-Time Deal",
    headerClass: 'bg-customRed py-2',
    heading: "Keep Your Airmoto Organized and Protected",
    headingClass: "font-bold text-xl text-center text-customRed mb-4",
    des: "Premium Carrying Case",
    offerType: "One-Time Offer",
    stepCompleted: {yes:5,no:4},
    nextStep: {yes:"up3",no:"down2"},
    offerTxtColor: "",
    offerDes: "Exclusive premium carrying case to keep your Airmoto safe and organized.",
    offerDescClass: "font-bold text-lg text-black",
    productImg: "/images/offers/up2.jpg",
    productImgMob: "/images/offers/up2-mob.jpg",
    price: { is: 19.95, was: 24.95 },
    priceColor: "",
    point: {
      is: false,
      options: ["Extended 3ft. Cable", "Home Adapter", "Car Charger", "2-Year Warranty"]
    },
    productDes: { is: true, text: "The best way to keep your Airmoto and accessories organized. Our exclusive premium hard shell case will protect your items and fits perfectly in your glovebox, trunk, or bag." },
    submitBtnColor: " text-lg font-semibold py-3 rounded-lg w-full mt-7 shadow-lg hover:shadow-lg hover:scale-105 animate-wiggle bg-yellow",
    submitBtnTitle: "purchase upsell",
    quantitySelector: {
      is: false,
      selectedQuantity: [false, true, false, false, false],
    },
    event: "Upsell1cv"

  },
  down2: {
    pageType: "upsellPage2",
    header: "JUST CHECKING... ARE YOU SURE?",
    headerClass: 'bg-customBlue py-2',
    heading: "LUCKY DISCOUNT WINNER!",
    headingClass: "font-bold text-xl text-center text-customBlue mb-4 underline",
    des: "Premium Carrying Case",
    offerType: "Lucky Discount Winner",
    stepCompleted: {yes:5,no:5},
    nextStep: {yes:"up3",no:"up3"},
    offerTxtColor: "text-customBlue",
    offerDes: "Exclusive premium carrying case to keep your Airmoto safe and organized.",
    offerDescClass: "font-bold text-lg text-black",
    productImg: "/images/offers/down2.jpg",
    productImgMob: "/images/offers/down2-mob.jpg",
    price: { is: 12.95, was: 24.95 },
    point: {
      is: false,
      options: ["Extended 3ft. Cable", "Home Adapter", "Car Charger", "2-Year Warranty"]
    },
    productDes: { is: true, text: "The best way to keep your Airmoto and accessories organized. Our exclusive premium hard shell case will protect your items and fits perfectly in your glovebox, trunk, or bag." },
    submitBtnColor: " text-lg font-semibold py-3 rounded-lg w-full mt-7 shadow-lg hover:shadow-lg hover:bg-[#e9be19] animate-wiggle bg-[#ff0000] text-white border-2 border-[#cd0000] p-4",
    submitBtnTitle: "purchase downsell",
    quantitySelector: {
      is: false,
      selectedQuantity: [false, true, false, false, false],
    },
    event: "Upsell1cv"

  },
  up3: {
    pageType: "upsellPage3",
    header: "CHECK THIS OUT...",
    headerClass: 'bg-customRed py-2',
    heading: "Add More Airmoto's at our Best Deal Ever",
    headingClass: "font-bold text-base sm:text-xl text-center text-customRed mb-4",
    des: "New Customer One-Time Offer!",
    offerType: "New Customer Offer",
    stepCompleted: {yes:7,no:6},
    nextStep: {yes:"thankyou",no:"down3"},
    offerTxtColor: "text-customRed",
    offerDes: "Over 80% of Customers Buy More and You Can Save Money Now!",
    offerDescClass: "font-bold text-base sm:text-lg text-black uppercase",
    productImg: "/images/offers/up3.jpg",
    productImgMob: "/images/offers/up3-mob.jpg",
    price: { is: 59, was: 139 },
    priceColor: "",
    point: {
      is: false,
      options: ["Extended 3ft. Cable", "Home Adapter", "Car Charger", "2-Year Warranty"]
    },
    productDes: { is: true, text: "Here's your chance to grab an additional Airmoto with our One-Time New Customer discount! Just click the quantity below you want to add to your order. Hurry, we are selling out quick!" },
    submitBtnColor: " text-lg font-semibold py-3 rounded-lg w-full mt-7 shadow-lg hover:shadow-lg hover:scale-105 animate-wiggle bg-yellow",
    submitBtnTitle: "purchase upsell",
    quantitySelector: {
      is: true,
      options: [1, 2, 3, 4, 5]
    },
    event: "Upsell2cv"

  },
  down3: {
    pageType: "upsellPage3",
    header: "HOLD UP! This is one deal you shouldn't miss...",
    headerClass: 'bg-customBlue py-2',
    heading: "This Is Your Last and Final Chance",
    headingClass: "font-bold text-xl text-center text-customBlue mb-4 underline",
    des: "You Will Never See This Deal Again!",
    offerType: "Lucky Discount Winner",
    stepCompleted:{yes:7,no:7},
    nextStep: {yes:"thankyou",no:"thankyou"},
    offerTxtColor: "text-customBlue",
    offerDes: "Save money now with this exclusive one-time deal for new customers",
    offerDescClass: "font-bold text-lg text-black uppercase",
    productImg: "/images/offers/down3.jpg",
    productImgMob: "/images/offers/down3-mob.jpg",
    price: { is: 49, was: 139 },
    point: {
      is: false,
      options: ["Extended 3ft. Cable", "Home Adapter", "Car Charger", "2-Year Warranty"]
    },
    productDes: { is: true, text: "The best way to keep your Airmoto and accessories organized. Our exclusive premium hard shell case will protect your items and fits perfectly in your glovebox, trunk, or bag." },
    submitBtnColor: "text-lg font-semibold py-3 rounded-lg w-full mt-7 shadow-lg hover:shadow-lg hover:bg-[#e9be19] animate-wiggle bg-[#ff0000] text-white border-2 border-[#cd0000] p-4",
    submitBtnTitle: "purchase downsell",
    quantitySelector: {
      is: true,
      options: [1, 2, 3, 4, 5]
    },
    event: "Upsell2cv"
  },
  thankYou: {
    header: "Thank you for ordering!",
    headerClass: 'bg-customRed py-2 text-15px',
    phone: "888-855-6433"
  }



}