// ~/utils/apiHandler.ts
import { $fetch } from 'ofetch'; // Ensure you import $fetch
import { apiEndpoints } from './apiEndpoints';

export const apiHandler = async <T = unknown, R = unknown>(
    endpointKey: string,
    params: T,
    options: RequestInit = {}
): Promise<R> => {
    const endpoint: ApiEndpoint | undefined = apiEndpoints[endpointKey];

    if (!endpoint) {
        throw new Error(`API endpoint '${endpointKey}' not found.`);
    }

    const { url, method } = endpoint;

    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        body: JSON.stringify(params),
        ...options,
    };

    try {
        // $fetch automatically handles JSON parsing
        let encryptedResult: any
        if (url === 'https://ipinfo.io/json') {
            encryptedResult = await $fetch<R>(url);
        } else {
            encryptedResult = await $fetch<R>(`${url}`, fetchOptions);
        }
        let response: any = {};
        if (typeof encryptedResult == "string") {
            response = decryptedResult(encryptedResult); // Now you have the original result
        } else {
            response = encryptedResult; // Now you have the encrypted result
        }
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error; // Rethrow for further handling if necessary
    }
};
