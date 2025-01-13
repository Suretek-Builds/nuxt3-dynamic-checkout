<script setup>
import { ref, onMounted } from "vue";

const paypalSdkParams = ref(null);
const paypalPrePaidType = ref("");

async function importOrder() {
  // Simulate API call
  return { result: "SUCCESS", message: { paypalSdkParams: { id: "C88AA30A0D" } } };
}

async function confirmPayPal(payerId, orderId, additionalParams) {
  console.log("Order confirmed:", { payerId, orderId, additionalParams });
}

async function handlePayPalClick() {
  try {
    formStore.formValues.paymentMethod = "PAYPAL";
    const fundingSource = "PAYPAL"; // Default funding source for custom button
    if (["VENMO", "PAYLATER"].includes(fundingSource)) {
      paypalPrePaidType.value = "PAYPAL_" + fundingSource;
    }

    const res = await importOrder();
    if (res?.result === "SUCCESS" && res.message.paypalSdkParams) {
      paypalSdkParams.value = res.message.paypalSdkParams;
      console.log("Custom button PayPal click succeeded.");
      // Optionally, redirect to PayPal for further steps
      const orderId = paypalSdkParams.value.id;
      const approveUrl = `https://www.paypal.com/checkoutnow?token=${orderId}`;
      window.location.href = approveUrl;
    } else {
      console.error("Custom button PayPal click failed: Unable to create order.");
    }
  } catch (err) {
    console.error("Error during custom PayPal click:", err);
  }
}

onMounted(() => {
  const paypal = window.paypal;
  if (!paypal) {
    console.error("PayPal SDK not loaded.");
    return;
  }

  // Render SDK PayPal Button
  paypal.Buttons({
    style: {
      layout: "vertical",
      label: "paypal",
    },
    onClick: async (data, actions) => {
      await handlePayPalClick();
      return actions.resolve();
    },
    createOrder: () => {
      const orderId = paypalSdkParams.value?.id;
      if (!orderId) throw new Error("Insufficient data to process PayPal checkout.");
      return orderId;
    },
    onApprove: async (data) => {
      console.log("Transaction approved:", data);
      confirmPayPal(data.payerID, data.orderID, "");
    },
    onCancel: (data) => {
      console.log("Transaction canceled by the customer.", data);
    },
    onError: (err) => {
      console.error("Error from PayPal SDK:", err);
    },
  }).render("#paypal-button-container");

  // Attach functionality to custom button
  const customButton = document.querySelector("#custom-paypal-button");
  if (customButton) {
    customButton.addEventListener("click", handlePayPalClick);
  }
});
</script>

<template>
  <div>
    <!-- SDK PayPal Button -->
    <div id="paypal-button-container"></div>

    <!-- Custom PayPal Button -->
    <button id="custom-paypal-button" class="custom-button">Custom PayPal Button</button>
  </div>
</template>
