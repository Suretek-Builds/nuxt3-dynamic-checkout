// stores/cartStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useShippingStore } from "./shippingStore";
import { useFormStore } from "./formStore";

export const useCartStore = defineStore("cart", () => {
  // shipping store
  const shippingStore = useShippingStore();
  // formStore
  const formStore = useFormStore();

  const productCart = ref<any[]>([]); // Array to hold cart products
  const airmotoCart = ref<any[]>([]); // Array to hold airmoto cart products
  const subTotal = ref(0); // Subtotal of cart
  // const discount = ref(0); // Discount applied to cart
  const salesTax = ref(0); // Sales tax applied to cart
  const shipping = ref(0); // Shipiing applied to cart
  const cartLoading = ref(false);
  const cartEmpty = ref(false);
  const discountLoading = ref(false);
  const shippingLoading = ref(false);
  const couponSuccess = ref<any[]>([]);
  const couponError = ref<{}>({});
  const discountSavings = computed(() => {
    let totalSavings = 0;
    let airmotoProducts = productCart.value[0];
    if (airmotoProducts) {
      totalSavings += (airmotoProducts.compareAtPrice - airmotoProducts.price);
    }
    return totalSavings;
  });

  const discount = computed(() => {
    if (couponSuccess.value.length > 0) {
      const value = couponSuccess.value.reduce((sum, item) => sum += item.price, 0);
      return value;
    }
    // Return 0 if no discounts are available
    return 0;
  });

  const handleEmptyCart = () => {
    if (productCart.value.length === 0) {
      addProduct(
        {
          product_id: 1,
          title: 'Your cart is empty',
          variant_id: '',
          price: 0,
          image: '/images/empty-cart.png',
          variant_title: 'Add something to make me happy :)',
          product_qty: 0,
        }
      )
    } else if (productCart.value.length > 1) {
      const emptyProduct = productCart.value.find(
        (item) => item.product_id === 1
      );
      if (emptyProduct) removeProduct(1)
    } else return;
  };

  const cartTotal = computed(() => {
    storage.setSessionItem('cartTotal', subTotal.value - discount.value + salesTax.value + shipping.value);
    return subTotal.value - discount.value + salesTax.value + shipping.value;
  });

  const cartTotalLoading = computed(() => {
    if (discountLoading.value || shippingLoading.value) return true;
  });

  const addProduct = (product: any, isAirmoto: boolean = false) => {
    // Check if the product already exists in the cart
    const existingProduct = productCart.value.find(
      (item) =>
        item.product_id === product.product_id &&
        item.variant_id === product.variant_id
    );
    // If the product already exists, do not add it again
    if (existingProduct) {
      //   console.log("Product already exists in the cart.");
      return;
    }
    // If it does not exist, add the product to the cart
    if (isAirmoto) productCart.value[0] = product;
    else productCart.value.push(product);
    // Empty Product
    handleEmptyCart();
    storage.setSessionItem('productCart', productCart.value)
    updateSubTotal();
    calculateDiscountSavings();
  };

  const removeProduct = (productId: number) => {
    productCart.value = productCart.value.filter(
      (product) => product.product_id !== productId
    );
    // Empty Product
    handleEmptyCart();
    storage.setSessionItem('productCart', productCart.value)
    updateSubTotal();
  };

  const updateSubTotal = () => {
    subTotal.value = productCart.value.reduce(
      (total, product) => total + product.price,
      0
    );
  };

  const applyDiscount = (amount: number) => {
    discount.value = amount;
    updateLoading(false, 'discount');
  };

  const calculateSalesTax = (rate: number) => {
    salesTax.value = subTotal.value * rate;
  };

  const loadCart = (status: string) => {
    if (status == "true") cartLoading.value = true;
    if (status == "false") cartLoading.value = false;
  };

  const emptyCart = (status: string) => {
    if (status == "true") cartEmpty.value = true;
    if (status == "false") cartEmpty.value = false;
  };

  const updateLoading = (status: boolean, type: string) => {
    if (type === "discount") discountLoading.value = status;
    if (type === "cart") cartLoading.value = status;
    if (type === "empty") cartEmpty.value = status;
    if (type === "shipping") shippingLoading.value = status;
  }

  const updateShipping = (amount: number) => {
    shipping.value = amount;
    // updateLoading(false, 'cart');
  }

  const updateCart = (amount: number, type: string) => {
    if (type === "discount") applyDiscount(amount);
    if (type === "subTotal") updateSubTotal();
    if (type === "shipping") updateShipping(amount);
  }

  const updateCouponSuccess = (code: string, msg: string, price: number) => {
    if (couponSuccess.value.length === 2 && !duplicateCoupon(code)) {
      couponSuccess.value.shift();
      couponSuccess.value.push({ code, msg, price });
    } else if (!duplicateCoupon(code)) {
      couponSuccess.value.push({ code, msg, price });
    }
  }

  const updateCouponError = (code: string, msg: string) => {
    couponError.value = { code, msg };
  }

  const duplicateCoupon = (code: string) => {
    if (couponSuccess.value.length > 0) {
      return couponSuccess.value.some((item) => item.code === code);
    }
  }

  const removeCoupon = (code: string) => {
    if (couponSuccess.value.length > 0) {
      couponSuccess.value = couponSuccess.value.filter((item) => item.code !== code);
    }
    // Remove Error message
    if (couponError.value) {
      couponError.value = {};
    }
  }

  const updateAirmotoCart = (products: object[]) => {
    airmotoCart.value = products;
    airmotoAddProduct(1);
  }

  const airmotoAddProduct = (id: number) => {
    addProduct(airmotoCart.value[id - 1], true);
    storage.setLocalItem('airmotoQty', id);
    if (id === 1 && formStore.formValues.shippingMethod === '156') formStore.formValues.shippingMethod = '153';
    shippingStore.updateShipping();
  }

  const calculateDiscountSavings = () => {
    return productCart.value.reduce((total, product) => {
      return total + (product.compareAtPrice - product.price);
    }, 0);
  }

  return {
    productCart,
    subTotal,
    discount,
    salesTax,
    shipping,
    cartTotal,
    addProduct,
    removeProduct,
    applyDiscount,
    calculateSalesTax,
    cartLoading,
    cartEmpty,
    loadCart,
    emptyCart,
    discountLoading,
    updateLoading,
    updateCart,
    cartTotalLoading,
    shippingLoading,
    couponSuccess,
    couponError,
    updateCouponSuccess,
    updateCouponError,
    removeCoupon,
    updateAirmotoCart,
    airmotoAddProduct,
    discountSavings
  };
});
