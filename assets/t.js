/* Islang site stats: a page view, how long the page stayed visible, and download clicks.
   No cookies, nothing stored in the browser, no IP addresses kept on the server. */
(function () {
  var E = "https://islang-api.r-oybek2001.workers.dev/t";
  if (navigator.webdriver || /^(localhost|127\.)/.test(location.hostname)) return;
  function send(o) {
    var b = JSON.stringify(o);
    try { if (navigator.sendBeacon && navigator.sendBeacon(E, b)) return; } catch (e) {}
    try { fetch(E, { method: "POST", body: b, keepalive: true, mode: "no-cors" }); } catch (e) {}
  }
  var path = location.pathname;
  send({ k: "view", p: path, r: document.referrer });
  var seen = 0, since = document.visibilityState === "visible" ? Date.now() : 0;
  function flush() {
    if (since) { seen += Date.now() - since; since = 0; }
    var s = Math.round(seen / 1000);
    if (s > 0) { send({ k: "time", p: path, s: s }); seen = 0; }
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush(); else since = Date.now();
  });
  addEventListener("pagehide", flush);
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var m = a.href.match(/\/(v[\d.]+)\/[^\/]+\.dmg$/);
    if (m) send({ k: "dl", p: path, v: m[1] });
  }, true);
  window.islangTrack = send;
})();
