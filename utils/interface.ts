// FormTypes.ts

export interface FormData {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string; // Optional field
  city: string;
  country: string;
  state: string;
  postalCode: string;
  sameAddress: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress1: string;
  billingAddress2?: string; // Optional field
  billingCity: string;
  billingCountry: string;
  billingState: string;
  billingPostalCode: string;
  shippingMethod: string;
  discountCode: string;
  paymentMethod: string;
  cardNumber: string;
  expiryMonth: string;
  expiryMonthYear:string;
  expiryYear: string;
  cvv: string;
  prepaidType:string,
  ispaypalSdkCliked:boolean
}

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "post"; // Specify allowed HTTP methods
  redirect: "follow" | "error" | "manual"; // Specify allowed redirect options
}

export interface ApiEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}