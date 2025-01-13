import { serverApiHandler } from "../utils/serverApiHandler";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const query = getQuery(event);
    const config = useRuntimeConfig(event);
    // fetch response
    return await serverApiHandler(importUpsellEndpoint, body, config, query);
});
