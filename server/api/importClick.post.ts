import { serverApiHandler } from "../utils/serverApiHandler";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const query = getQuery(event);
  const config = useRuntimeConfig(event);

  // Access HTTP_REFERER and User-Agent
  const httpReferer = event.node.req.headers.referer || event.node.req.headers.referrer;
  const userAgent = event.node.req.headers['user-agent'];
  body.userAgent = userAgent;
  body.httpReferer = httpReferer;
  // fetch response
  return await serverApiHandler(importClickEndpoint, body, config, query);
});
