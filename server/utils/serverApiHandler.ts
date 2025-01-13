export const serverApiHandler = async (endpont: string, body: object, config: { CC_LOGIN_ID: string, CC_PASSWORRD: string, public: { CC_CAMPAIGN_ID: string } }, query: any) => {
    // Prepare all parameters, including login and password from config
    const params = new URLSearchParams({
        loginId: config.CC_LOGIN_ID,
        password: config.CC_PASSWORRD,
        campaignId: config.public.CC_CAMPAIGN_ID,
        ...body, // Spread the body parameters directly into URLSearchParams
    });
    const response: any = await $fetch(`${endpont}?${params.toString()}`, requestOptions);
    const result = JSON.parse(response);
    if (query.encrypt == 'false') return result
    return encryptedResult(result)
}