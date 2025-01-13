// stores/formStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { z } from "zod";
import type { FormData } from "../utils/interface"; // Adjust the path as needed
import { useShippingStore } from "./shippingStore";
import { useCheckoutStore } from "./checkoutStore";
import cardValidator from "card-validator";
import { cardNumber } from "card-validator/dist/card-number";

export const useFormStore = defineStore("form", () => {
  // Form Schema
  const formSchema = ref<FormData>({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    country: "US",
    state: "",
    postalCode: "",
    sameAddress: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingCountry: "",
    billingState: "",
    billingPostalCode: "",
    shippingMethod: "153",
    discountCode: "",
    paymentMethod: "CREDITCARD",
    cardNumber: "",
    expiryMonth: "",
    expiryMonthYear: "",
    expiryYear: "",
    cvv: "",
    prepaidType: '',
    ispaypalSdkCliked: true
  });

  // Validation Schema
  const schema = z.object({
    email: z.string().email("Invalid email format"),
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    address1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(5, "Postal Code is required"),
    billingAddress1: z.string().min(1, "Billing Address is required"),
    billingCity: z.string().min(1, "Billing City is required"),
    billingCountry: z.string().min(1, "Billing Country is required"),
    billingState: z.string().min(1, "Billing State is required"),
    billingPostalCode: z.string().min(5, "Billing Postal Code is required"),
    shippingMethod: z.string().min(1, "Shipping Method is required"),
    // cardNumber: z.string()
    //   .min(12, "Card number is required")
    //   .refine((val) => isValidCardNumber(val), {
    //     message: "Invalid card number",
    //   }),
    cardNumber: z.string().min(12, "Card number is required").superRefine((val, ctx) => {
      if (checkoutStore.tester) return checkoutStore.tester
      const valid = cardValidator;
      const result = valid.number(val);
      if (!result.isValid) {
        if (result.isPotentiallyValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Card number is incomplete or incorrect."
          })
        } else if (!result.card) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Card number is invalid or unsupported."
          })
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid card number."
          })
        }
        return false;
      }
    }),
    expiryMonthYear: z.string().min(4, "Expiry Month/Year is required").superRefine((expiryDate, ctx) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const month = expiryDate.slice(0, 2);
      const year = expiryDate.slice(2);
      const parsedMonth = parseInt(month, 10);
      const parsedYear = 2000 + parseInt(year, 10);
      formValues.value.expiryMonth = parsedMonth.toString();
      formValues.value.expiryYear = parsedYear.toString();
      if (parsedMonth > 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid month"
        })
      }
      if (parsedYear < currentYear || (parsedYear === currentYear && parsedMonth < currentMonth)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card is expired"
        })

      }
      if (parsedYear > currentYear + 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid year"
        })
      }
    }),
    // expiryYear: z.string().min(4, "Expiry Year is required"),
    cvv: z.string().min(3, "CVV is required"),
  });

  // shippingStore
  const shippingStore = useShippingStore();
  // checkoutStore
  const checkoutStore = useCheckoutStore();
  const isAutocompleteActive = ref(false);
  
  const formValues = formSchema;
  const errors = ref<Record<string, string>>({});

  const handleError = (input: any) => {
    errors.value[input] = [""];
  }

  // BrainTree for credit card validation
  const isValidCardNumber = (number: string): boolean => {
    if (checkoutStore.tester) return checkoutStore.tester
    const valid = cardValidator;
    const result = valid.number(number);
    return result.isValid;
  };

  // Function to validate expiry month and year
  const validateExpiryDate = (expiryDate: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const month = expiryDate.slice(0, 2);
    const year = expiryDate.slice(2);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = 2000 + parseInt(year, 10);
    console.log('parsedYear', parsedYear)
    formValues.value.expiryMonth = parsedMonth.toString();
    formValues.value.expiryYear = parsedYear.toString();
    if (parsedMonth > 12) {
      errors.value.expiryMonthYear = ["Invalid month"];
      console.log('1', errors.value.expiryMonthYear)
    }
    // Check if the expiry date is in the past
    if (parsedYear < currentYear || (parsedYear === currentYear && parsedMonth < currentMonth)) {
      console.log('2', errors.value.expiryMonthYear)
    }
    // Check if the expiry date is more than 10 years in the future
    if (parsedYear > currentYear + 10) {
      console.log('3', errors.value.expiryMonthYear)

    }
  }

  const handleSubmit = async () => {
    formValues.value.ispaypalSdkCliked = false;

    await billSame("same");
    const validationResult = schema.safeParse(formValues.value);

    if (!validationResult.success && formValues.value.paymentMethod !== "PAYPAL" && !isAutocompleteActive.value) {
        errors.value = validationResult.error.formErrors.fieldErrors;
        checkoutStore.updateAlert(true, "There are errors in your form. Please review and correct the highlighted fields.");
    } else if (!isAutocompleteActive.value) { // Check also here to ensure not handling during autocomplete
        checkoutStore.setTransactionStatus(true);
        console.log("Form submitted:", formValues.value);
        if (formValues.value.paymentMethod !== 'PAYPAL') await importLead();
        await importOrder();
        errors.value = {}; // Clear errors after successful submission
        checkoutStore.setTransactionStatus(false);
    }

    // Reset autocomplete interaction flag
    isAutocompleteActive.value = false;
  };


  const billSame = async (type = "onLoad") => {
    try {
      if (type === "onLoad") {
        await shippingStore.handleBillStateList();
      }
      if (formValues.value.sameAddress) {
        formValues.value.billingFirstName = formValues.value.firstName;
        formValues.value.billingLastName = formValues.value.lastName;
        formValues.value.billingAddress1 = formValues.value.address1;
        formValues.value.billingAddress2 = formValues.value.address2;
        formValues.value.billingCity = formValues.value.city;
        formValues.value.billingCountry = formValues.value.country;
        formValues.value.billingPostalCode = formValues.value.postalCode;
        await shippingStore.handleBillStateList();
        formValues.value.billingState = formValues.value.state;
      }
      shippingStore.updateShipping();
    } catch (error) {
      console.error("Error updating billing address:", error);
    }

  }

  return {
    formValues,
    errors,
    handleSubmit,
    handleError,
    billSame,
  };
});
