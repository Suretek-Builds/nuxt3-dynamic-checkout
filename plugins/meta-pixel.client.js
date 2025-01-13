export default defineNuxtPlugin(() => {
  // Check if pixel id is exist or not
  const config =useRuntimeConfig();
  const pixelId=config.public.pixel_id;
  if(!pixelId)return;
  // Check if fbq is already defined to prevent duplicate initialization
  if (window.fbq) return;

  (function (f, b, e, v, n, t, s) {
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  window.fbq('init', pixelId);
});
