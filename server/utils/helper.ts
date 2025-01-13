import CryptoJS from "crypto-js"; // Import the crypto-js library

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export const requestOptions: ApiEndpoint = {
  method: "POST",
};

export const encryptedResult = (result) => {
  const secretKey = useRuntimeConfig().public.SecretKey; // Replace with a secure key
  return CryptoJS.AES.encrypt(JSON.stringify(result), secretKey).toString();
}