const NL = String.fromCharCode(10);
const PRODUCTS = [
  ["chat", "Grok Chat", "other"],
  ["imagine", "Imagine", "imagine"],
  ["voice", "Voice", "voice"],
  ["build", "Grok Build", "build"],
  ["companions", "Companions", "other"],
  ["bot", "Grok Bot", "other"],
  ["connectors", "Connectors", "other"],
  ["files", "Files", "other"],
  ["grokipedia", "Grokipedia", "other"],
  ["accounts", "Accounts / login", "other"],
  ["billing", "Billing", "billing"],
  ["credits", "Extra credits / Auto Top Up", "billing"],
  ["api", "xAI API", "api"],
  ["console", "Console", "api"],
  ["imagine-api", "Imagine API", "imagine"],
  ["voice-api", "Voice API", "voice"],
  ["grok-x", "Grok in X", "x"],
  ["other", "Other", "other"],
];
const SEVERITIES = [["critical", "Critical"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]];
const FREQS = [["always", "Always"], ["often", "Often"], ["once", "Once"], ["unknown", "Unknown"]];
const PLATS = [["web", "Web"], ["ios", "iOS"], ["android", "Android"], ["x", "X"], ["api", "API"], ["console", "Console"], ["other", "Other"]];
const TIERS = [
  ["free", "Free"],
  ["super-grok", "SuperGrok"],
  ["super-grok-pro", "SuperGrokPro"],
  ["super-grok-heavy", "SuperGrok Heavy"],
  ["x-premium", "X Premium"],
  ["x-premium-plus", "Premium+"],
  ["api", "API / Enterprise"],
  ["unknown", "Not sure"],
];
const CATS = [
  ["crash", "Crash / freeze"],
  ["performance", "Performance / latency"],
  ["ui", "UI / rendering"],
  ["billing", "Authentication / subscription / billing"],
  ["imagine", "Image or video generation"],
  ["voice", "Voice / audio"],
  ["build", "Grok Build / generated apps"],
  ["api", "API / Console / developer tooling"],
  ["quota", "Quota / rate-limit"],
  ["x", "Grok in X / X integration"],
  ["other", "Other"],
];
const INCHAT = [["yes", "Yes"], ["no", "No"]];
const state = {
  product: "",
  severity: "",
  frequency: "",
  platform: "",
  subscription: "",
  category: "",
  inchat: "",
};

function uaParse() {
  const ua = navigator.userAgent || "";
  let browser = "Unknown";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";
  return {
    browser,
    os,
    screen: screen.width + "\u00d7" + screen.height,
    viewport: innerWidth + "\u00d7" + innerHeight,
    language: navigator.language || "\u2014",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "\u2014",
    userAgent: ua,
  };
}

const sys = uaParse();
document.getElementById("sys").innerHTML = [
  ["Browser", sys.browser],
  ["OS", sys.os],
  ["Screen", sys.screen],
  ["Viewport", sys.viewport],
  ["Language", sys.language],
  ["Timezone", sys.timezone],
]
  .map(function (row) {
    return "<div><b>" + row[0] + "</b> " + row[1] + "</div>";
  })
  .join("");

function chips(el, items, key, onPick) {
  el.innerHTML = items
    .map(function (item) {
      return (
        '<button type="button" class="chip" data-id="' +
        item[0] +
        '">' +
        item[1] +
        "</button>"
      );
    })
    .join("");
  el.addEventListener("click", function (e) {
    const b = e.target.closest(".chip");
    if (!b) return;
    state[key] = b.dataset.id;
    Array.prototype.forEach.call(el.children, function (c) {
      c.classList.toggle("on", c.dataset.id === state[key]);
    });
    if (onPick) onPick(b.dataset.id);
    render();
  });
}

function syncChips(el, id) {
  Array.prototype.forEach.call(el.children, function (c) {
    c.classList.toggle("on", c.dataset.id === id);
  });
}

chips(document.getElementById("products"), PRODUCTS, "product", function (id) {
  const row = PRODUCTS.find(function (x) {
    return x[0] === id;
  });
  if (row) {
    state.category = row[2];
    syncChips(document.getElementById("categories"), state.category);
  }
});
chips(document.getElementById("severities"), SEVERITIES, "severity");
chips(document.getElementById("frequencies"), FREQS, "frequency");
chips(document.getElementById("platforms"), PLATS, "platform");
chips(document.getElementById("tiers"), TIERS, "subscription");
chips(document.getElementById("categories"), CATS, "category");
chips(document.getElementById("inchat"), INCHAT, "inchat");

function $(id) {
  return document.getElementById(id);
}
[
  "email",
  "title",
  "actual",
  "expected",
  "steps",
  "share",
  "screenshot",
  "invoice",
  "workaround",
  "requestid",
].forEach(function (id) {
  $(id).addEventListener("input", render);
});

function lab(list, id) {
  const hit = list.find(function (x) {
    return x[0] === id;
  });
  return hit ? hit[1] : "\u2014";
}
function val(id) {
  return $(id).value.trim();
}
function emailOk(v) {
  const at = v.indexOf("@");
  const dot = v.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < v.length - 1 && v.indexOf(" ") === -1;
}
function hasShareId(url) {
  try {
    const u = new URL(url);
    let host = u.hostname.toLowerCase();
    if (host.indexOf("www.") === 0) host = host.slice(4);
    const ok = ["grok.com", "grok.x.ai", "grok.x.com", "x.com", "twitter.com"].indexOf(host) !== -1;
    if (!ok) return false;
    const parts = u.pathname.split("/").filter(Boolean);
    const shareAt = parts.lastIndexOf("share");
    if (shareAt === -1 || shareAt === parts.length - 1) return false;
    const id = parts[shareAt + 1] || "";
    return id.length > 0;
  } catch (e) {
    return false;
  }
}
function submitPath() {
  if (state.product === "billing" || state.product === "credits") return "billing";
  if (["api", "console", "imagine-api", "voice-api"].indexOf(state.product) !== -1) return "api";
  if (state.product === "grok-x") return "x";
  return "report";
}
function hasEvidence() {
  if (submitPath() === "api" && val("requestid").length > 0) return true;
  return val("screenshot").length > 0 || hasShareId(val("share"));
}

function format() {
  const desc =
    [
      val("title"),
      val("actual") && "Actual: " + val("actual"),
      val("expected") && "Expected: " + val("expected"),
      lab(PRODUCTS, state.product) !== "\u2014" && "Product: " + lab(PRODUCTS, state.product),
    ]
      .filter(Boolean)
      .join(NL) || "\u2014";
  const impact =
    [
      val("actual"),
      val("expected") && "Expected: " + val("expected"),
      state.frequency && "Frequency: " + lab(FREQS, state.frequency),
    ]
      .filter(Boolean)
      .join(" ") || "\u2014";
  const ready = missingFields().length === 0;
  const path = submitPath();
  const via =
    path === "api"
      ? "support@x.ai (API Bug Report)"
      : path === "billing"
        ? "receipt email + accounts.x.ai/refund"
        : path === "x"
          ? "X Help Center / @premium"
          : "Grok \u22ee Report an issue";
  return [
    "-----BEGIN REPORT-----",
    "Status: " + (ready ? "READY" : "INCOMPLETE"),
    "",
    "=== TRIAGE ===",
    "Product: " + lab(PRODUCTS, state.product),
    "Surface: " + lab(PLATS, state.platform),
    "Submit via: " + via,
    "Severity: " + lab(SEVERITIES, state.severity),
    "Category: " + lab(CATS, state.category),
    "Impact: " + impact,
    "",
    "=== REQUIRED ===",
    "Account email: " + (val("email") || "\u2014"),
    "Subscription tier: " + lab(TIERS, state.subscription),
    "Platform: " + lab(PLATS, state.platform),
    "System & app info: " + sys.os + "; " + sys.browser + "; " + sys.screen,
    "Bug description: " + desc,
    "",
    "Evidence:",
    "  Conversation share link: " + (val("share") || "\u2014"),
    "  Screenshot: " + (val("screenshot") || "\u2014"),
    "  API request / response / logs (sanitized): " +
      (val("requestid") ? "request id " + val("requestid") : "\u2014"),
    "",
    "=== PREFERRED ===",
    "Steps to reproduce: " + (val("steps") || "\u2014"),
    "Expected vs actual: " + ([val("expected"), val("actual")].filter(Boolean).join(" / ") || "\u2014"),
    "",
    "=== BILLING (if applicable) ===",
    "Invoice / receipt number: " + (val("invoice") || "\u2014"),
    "Purchase channel (Web / App Store / Google Play / X / API): \u2014",
    "",
    "=== NOTES ===",
    "Workaround: " + (val("workaround") || "\u2014"),
    "Frequency: " + lab(FREQS, state.frequency),
    "Reported from inside the chat where the bug occurred: " + lab(INCHAT, state.inchat),
    "Outage check (status.x.ai): \u2014",
    "-----END REPORT-----",
  ].join(NL);
}

function missingFields() {
  const missing = [];
  if (!state.product) missing.push("Product");
  if (!state.severity) missing.push("Severity");
  if (!state.platform) missing.push("Platform");
  if (!emailOk(val("email"))) missing.push("Account email");
  if (!state.subscription) missing.push("Subscription tier");
  if (val("title").length < 8 && val("actual").length < 8) missing.push("Bug description");
  if (!hasEvidence()) missing.push("Evidence");
  if ((state.product === "billing" || state.product === "credits") && !val("invoice")) {
    missing.push("Invoice / receipt number");
  }
  return missing;
}

function render() {
  const missing = missingFields();
  const preferred = val("steps").length < 8;
  const tracked = 8 + (state.product === "billing" || state.product === "credits" ? 1 : 0);
  const filled = tracked - missing.length - (preferred ? 1 : 0);
  const pct = Math.max(0, Math.round((filled / (tracked + 1)) * 100));
  const pill = $("score");
  pill.textContent = pct + "%";
  pill.classList.toggle("ready", missing.length === 0);
  $("status").textContent = missing.length ? "INCOMPLETE" : "READY";
  $("missing").textContent = missing.length
    ? "Still missing required fields: " + missing.join(", ")
    : preferred
      ? "Ready. Preferred still empty: Steps to reproduce."
      : "Ready to submit via the official path.";
  const path = submitPath();
  if (path === "api") {
    $("submit-hint").innerHTML =
      'API / Console / Imagine API / Voice API: email support@x.ai with subject \u201cAPI Bug Report\u201d. Not a Grok-app inbox. Hangouts (not a ticket): <a href="https://discord.gg/x-ai">xAI API Discord</a>.';
  } else if (path === "billing") {
    $("submit-hint").innerHTML =
      'Billing: reply to your receipt email. Web/Play refunds: <a href="https://accounts.x.ai/refund">accounts.x.ai/refund</a>. Apple IAP uses Apple. Large invoices are often SuperGrok Heavy, not API.';
  } else if (path === "x") {
    $("submit-hint").innerHTML =
      'Grok in X / X service: xAI does not operate X. Use <a href="https://help.x.com/">X Help Center</a> or <a href="https://x.com/premium">@premium</a>. X Premium refunds: <a href="https://help.x.com/forms/x-refund-request">X refund form</a>. If the same model bug happens on grok.com, also use \u22ee Report an issue there.';
  } else {
    $("submit-hint").innerHTML =
      'Grok Chat / Imagine / Voice / Build / Companions: paste into Grok \u2192 \u22ee Report an issue. Do not email support@x.ai. Hangouts (not a ticket): <a href="https://discord.gg/kqCc86jM55">Grok Community</a>.';
  }
  $("mail").disabled = false;
  $("mail").title =
    path === "api"
      ? "Opens a draft to support@x.ai and copies the full report"
      : "Only for xAI API / Console / Imagine API / Voice API. Click for how to submit instead.";
  $("out").textContent = format();
}

$("copy").onclick = function () {
  copyText(format());
  $("copy").textContent = "Copied";
  setTimeout(function () {
    $("copy").textContent = "Copy";
  }, 1200);
};

function copyText(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  } catch (e) {}
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function () {});
  }
}

function mailtoHrefFor(full) {
  const sub = encodeURIComponent("API Bug Report: " + (val("title") || "Incident"));
  const prefix = "Paste the full report from your clipboard below if this draft is truncated." + NL + NL;
  let raw = prefix + full;
  function build(body) {
    return "mailto:support@x.ai?subject=" + sub + "&body=" + encodeURIComponent(body);
  }
  let href = build(raw);
  while (href.length > 1800 && raw.length > 120) {
    raw = raw.slice(0, Math.max(80, raw.length - 220)) + NL + NL + "[truncated \u2014 paste the copied report]";
    href = build(raw);
  }
  return href;
}

$("mail").onclick = function () {
  if (submitPath() !== "api") {
    alert(
      "Email API is only for xAI API, Console, Imagine API, or Voice API." +
        NL +
        NL +
        "For Grok apps: Copy, then paste into Grok \u2192 \u22ee Report an issue." +
        NL +
        "For billing: reply to the receipt email.",
    );
    return;
  }
  const full = format();
  copyText(full);
  const href = mailtoHrefFor(full);
  $("mail").textContent = "Copied \u2014 opening mail";
  setTimeout(function () {
    $("mail").textContent = "Email API";
  }, 1600);
  window.location.href = href;
};

$("dl").onclick = function () {
  const blob = new Blob([format()], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "xai-bug-report.txt";
  a.click();
};

render();
