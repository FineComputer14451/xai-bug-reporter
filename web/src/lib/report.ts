export const DISCORD_GROK_COMMUNITY = "https://discord.gg/kqCc86jM55";
export const DISCORD_XAI_API = "https://discord.gg/x-ai";
export const SKILL_RAW =
  "https://github.com/FineComputer14451/xai-bug-reporter/raw/main/SKILL.md";
export const REPO_URL = "https://github.com/FineComputer14451/xai-bug-reporter";
export const GROK_SKILLS = "https://grok.com/skills";
export const STATUS_URL = "https://status.x.ai";
export const REFUND_URL = "https://accounts.x.ai/refund";
export const BILLING_URL = "https://grok.com/?_s=billing";
export const CONSOLE_URL = "https://console.x.ai";
export const FAQ_URL = "https://docs.x.ai/grok/faq#how-do-i-report-a-bug-or-reach-a-human";
export const API_DEBUG_URL = "https://docs.x.ai/developers/debugging";

export type SubmitPath = "report-an-issue" | "billing-receipt" | "api-email";

export const PRODUCTS = [
  {
    id: "grok-chat",
    label: "Grok Chat",
    hint: "Answers, tools, grok.com",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Include the conversation share link, the model if you know it, and whether a new chat fixes it.",
    categoryId: "other",
  },
  {
    id: "imagine",
    label: "Imagine",
    hint: "Images and video",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Paste the prompt, aspect ratio, image vs video, and whether the job failed, stalled, or looked wrong.",
    categoryId: "imagine",
  },
  {
    id: "voice",
    label: "Voice",
    hint: "Talk mode and TTS",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Note input vs output, headset vs speaker, and whether text chat still works.",
    categoryId: "other",
  },
  {
    id: "grok-x",
    label: "Grok on X",
    hint: "Grok inside X",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Note the X client (web, iOS, Android) and whether it happens on grok.com too.",
    categoryId: "other",
  },
  {
    id: "ios",
    label: "iOS app",
    hint: "iPhone and iPad",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Include iOS version, app version, and device. Screenshots help more than a long write-up.",
    categoryId: "other",
  },
  {
    id: "android",
    label: "Android app",
    hint: "Phone and tablet",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Include Android version, app version, and device. Note if it is the Play Store build.",
    categoryId: "other",
  },
  {
    id: "companions",
    label: "Companions",
    hint: "iOS-only personas",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Companions are iOS-only. Name the companion, and whether chat, voice, or memory failed.",
    categoryId: "other",
  },
  {
    id: "grok-bot",
    label: "Grok Bot",
    hint: "Assistant on X",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Note whether this is the X Grok Bot vs grok.com, and include a post or share link if you have one.",
    categoryId: "other",
  },
  {
    id: "tesla",
    label: "Tesla",
    hint: "In-car Grok",
    group: "grok",
    submit: "report-an-issue" as const,
    tip: "Include vehicle software version, whether you used voice or the screen, and what the car did.",
    categoryId: "other",
  },
  {
    id: "grok-build",
    label: "Grok Build",
    hint: "App Builder",
    group: "create",
    submit: "report-an-issue" as const,
    tip: "Include the preview URL if you have one, what step failed (generate, preview, publish), and a screenshot.",
    categoryId: "other",
  },
  {
    id: "grok-cli",
    label: "Grok CLI",
    hint: "Terminal agent",
    group: "create",
    submit: "report-an-issue" as const,
    tip: "Include grok --version, the command, and a redacted transcript. Do not paste API keys.",
    categoryId: "other",
  },
  {
    id: "api",
    label: "xAI API",
    hint: "Models, keys, calling",
    group: "developers",
    submit: "api-email" as const,
    tip: "Include model name, HTTP status, request id, and a redacted request/response. Do not paste API keys. Email support@x.ai with subject API Bug Report.",
    categoryId: "other",
  },
  {
    id: "console",
    label: "Console",
    hint: "console.x.ai",
    group: "developers",
    submit: "api-email" as const,
    tip: "Console and team billing often route with API bugs. Include team name, the page URL, and a screenshot. Do not paste keys.",
    categoryId: "other",
  },
  {
    id: "billing",
    label: "Billing",
    hint: "Plans and receipts",
    group: "account",
    submit: "billing-receipt" as const,
    tip: "Include the invoice or receipt number and the account email. Reply to the receipt email. Do not paste full card numbers.",
    categoryId: "billing",
  },
  {
    id: "safety",
    label: "Safety",
    hint: "Harm or jailbreaks",
    group: "account",
    submit: "report-an-issue" as const,
    tip: "Paste into Grok → Report an issue. Describe the output and context. Do not repeat harmful content in full.",
    categoryId: "other",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    hint: "Bedrock, Gemini",
    group: "more",
    submit: "api-email" as const,
    tip: "Name the host (Bedrock, Gemini Enterprise, or other), region, and model. Include a request id if you have one.",
    categoryId: "other",
  },
  {
    id: "other",
    label: "Other",
    hint: "Something else",
    group: "more",
    submit: "report-an-issue" as const,
    tip: "Name the product in the summary so the team can route it.",
    categoryId: "other",
  },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];
export type ProductGroupId = (typeof PRODUCTS)[number]["group"];

export const PRODUCT_GROUPS: { id: ProductGroupId; label: string }[] = [
  { id: "grok", label: "Grok" },
  { id: "create", label: "Build" },
  { id: "developers", label: "Developers" },
  { id: "account", label: "Account" },
  { id: "more", label: "More" },
];

export const SEVERITIES = [
  { id: "critical", label: "Critical", hint: "Data loss / unusable" },
  { id: "high", label: "High", hint: "Major breakage" },
  { id: "medium", label: "Medium", hint: "Workaround exists" },
  { id: "low", label: "Low", hint: "Polish / niggle" },
] as const;

export type SeverityId = (typeof SEVERITIES)[number]["id"];

export const PLATFORMS = [
  { id: "web", label: "Web" },
  { id: "ios", label: "iOS" },
  { id: "android", label: "Android" },
  { id: "api", label: "API" },
  { id: "tesla", label: "Tesla" },
  { id: "other", label: "Other" },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];

export const FREQUENCIES = [
  { id: "always", label: "Always" },
  { id: "often", label: "Often" },
  { id: "once", label: "Once" },
  { id: "unknown", label: "Unknown" },
] as const;

export type FrequencyId = (typeof FREQUENCIES)[number]["id"];

export const TIERS = [
  { id: "free", label: "Free" },
  { id: "super-grok", label: "SuperGrok" },
  { id: "super-grok-pro", label: "SuperGrok Pro" },
  { id: "super-grok-heavy", label: "SuperGrok Heavy" },
  { id: "x-premium", label: "X Premium" },
  { id: "x-premium-plus", label: "Premium+" },
  { id: "api", label: "API / Enterprise" },
  { id: "unknown", label: "Not sure" },
] as const;

export type TierId = (typeof TIERS)[number]["id"];

export const CATEGORIES = [
  { id: "crash", label: "Crash / freeze" },
  { id: "performance", label: "Performance / latency" },
  { id: "ui", label: "UI / rendering" },
  { id: "billing", label: "Authentication / subscription / billing" },
  { id: "imagine", label: "Image or video generation" },
  { id: "quota", label: "Quota / rate-limit" },
  { id: "other", label: "Other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const IMAGINE_KINDS = [
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
] as const;

export type ImagineKindId = (typeof IMAGINE_KINDS)[number]["id"];

export type SystemInfo = {
  browser: string;
  os: string;
  device: string;
  screen: string;
  viewport: string;
  language: string;
  timezone: string;
  userAgent: string;
};

export type ReportDraft = {
  product: ProductId | null;
  severity: SeverityId | null;
  platform: PlatformId | null;
  frequency: FrequencyId | null;
  subscription: TierId | null;
  title: string;
  steps: string;
  expected: string;
  actual: string;
  shareLink: string;
  extra: string;
  contactEmail: string;
  invoice: string;
  category: CategoryId | null;
  workaround: string;
  screenshot: string;
  reportedFromChat: "yes" | "no" | null;
  model: string;
  requestId: string;
  httpStatus: string;
  endpoint: string;
  imagineKind: ImagineKindId | "";
  appVersion: string;
} & SystemInfo;

export type SavedDraft = ReportDraft & {
  id: string;
  savedAt: number;
};

export const emptySystem = (): SystemInfo => ({
  browser: "",
  os: "",
  device: "",
  screen: "",
  viewport: "",
  language: "",
  timezone: "",
  userAgent: "",
});

export const emptyDraft = (): ReportDraft => ({
  product: null,
  severity: null,
  platform: null,
  frequency: null,
  subscription: null,
  title: "",
  steps: "",
  expected: "",
  actual: "",
  shareLink: "",
  extra: "",
  contactEmail: "",
  invoice: "",
  category: null,
  workaround: "",
  screenshot: "",
  reportedFromChat: null,
  model: "",
  requestId: "",
  httpStatus: "",
  endpoint: "",
  imagineKind: "",
  appVersion: "",
  ...emptySystem(),
});

export function productById(id: ProductId | null) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function productsInGroup(group: ProductGroupId) {
  return PRODUCTS.filter((p) => p.group === group);
}

export function labelOf<T extends { id: string; label: string }>(
  list: readonly T[],
  id: string | null,
) {
  return list.find((item) => item.id === id)?.label ?? "—";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}

function pick(ua: string, re: RegExp) {
  return re.exec(ua)?.[1] ?? "";
}

export function detectPlatformFromUa(ua: string): PlatformId {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "web";
}

export function detectSystemInfo(): SystemInfo {
  if (typeof navigator === "undefined") return emptySystem();
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = `Edge ${pick(ua, /Edg\/([\d.]+)/)}`.trim();
  else if (/OPR\//.test(ua)) browser = `Opera ${pick(ua, /OPR\/([\d.]+)/)}`.trim();
  else if (/Firefox\//.test(ua)) browser = `Firefox ${pick(ua, /Firefox\/([\d.]+)/)}`.trim();
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua))
    browser = `Chrome ${pick(ua, /Chrome\/([\d.]+)/)}`.trim();
  else if (/Safari\//.test(ua)) browser = `Safari ${pick(ua, /Version\/([\d.]+)/)}`.trim();

  let os = "Unknown";
  if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
  else if (/Windows NT/.test(ua)) os = "Windows";
  else if (/CrOS/.test(ua)) os = "Chrome OS";
  else if (/Android/.test(ua)) os = `Android ${pick(ua, /Android ([\d.]+)/)}`.trim();
  else if (/iPhone|iPad|iPod/.test(ua))
    os = `iOS ${pick(ua, /OS (\d+[._]\d+)/).replaceAll("_", ".")}`.trim();
  else if (/Mac OS X/.test(ua))
    os = `macOS ${pick(ua, /Mac OS X (\d+[._]\d+)/).replaceAll("_", ".")}`.trim();
  else if (/Linux/.test(ua)) os = "Linux";

  const device = /iPad|Tablet/i.test(ua) ? "Tablet" : /Mobi/i.test(ua) ? "Phone" : "Desktop";
  const dpr =
    typeof window !== "undefined" && window.devicePixelRatio
      ? `${window.devicePixelRatio}x`
      : "1x";
  const screenSize =
    typeof screen !== "undefined" ? `${screen.width}×${screen.height} @${dpr}` : "";
  const viewport =
    typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}` : "";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

  return {
    browser,
    os,
    device,
    screen: screenSize,
    viewport,
    language: navigator.language || "",
    timezone,
    userAgent: ua,
  };
}

export function systemFilled(info: SystemInfo) {
  return Boolean(info.browser || info.os || info.userAgent);
}

export function submitPath(draft: ReportDraft): SubmitPath {
  return productById(draft.product)?.submit ?? "report-an-issue";
}

export function hasShareId(url: string) {
  return parseShareLink(url).ok;
}

export function parseShareLink(url: string): {
  ok: boolean;
  host?: string;
  id?: string;
  reason?: string;
} {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const okHost = ["grok.com", "grok.x.ai", "grok.x.com", "x.com", "twitter.com"].includes(
      host,
    );
    if (!okHost) return { ok: false, host, reason: "host" };
    const match = parsed.pathname.match(/\/(?:i\/grok\/)?share\/([A-Za-z0-9_-]+)$/);
    if (!match?.[1]) return { ok: false, host, reason: "id" };
    return { ok: true, host, id: match[1] };
  } catch {
    return { ok: false, reason: "url" };
  }
}

export function hasEvidence(draft: ReportDraft) {
  if (submitPath(draft) === "api-email" && draft.requestId.trim().length > 0) return true;
  return draft.screenshot.trim().length > 0 || hasShareId(draft.shareLink);
}

const REQUIRED: { key: keyof ReportDraft; label: string; min: number; anchor: string }[] = [
  { key: "product", label: "Product", min: 1, anchor: "section-product" },
  { key: "severity", label: "Severity", min: 1, anchor: "section-severity" },
  { key: "platform", label: "Platform", min: 1, anchor: "section-where" },
  { key: "contactEmail", label: "Account email", min: 5, anchor: "section-you" },
  { key: "subscription", label: "Subscription tier", min: 1, anchor: "section-you" },
  { key: "title", label: "Bug description", min: 8, anchor: "section-story" },
  { key: "actual", label: "What happened", min: 8, anchor: "section-story" },
];

const PREFERRED: { key: keyof ReportDraft; label: string; min: number; anchor: string }[] = [
  { key: "steps", label: "Steps to reproduce", min: 8, anchor: "section-story" },
];

function fieldFilled(draft: ReportDraft, key: keyof ReportDraft, min: number) {
  const value = draft[key];
  if (value == null) return false;
  return String(value).trim().length >= min;
}

export type MissingItem = { label: string; anchor: string };

export function scoreReport(draft: ReportDraft) {
  const missingRequired: MissingItem[] = REQUIRED.filter((item) => {
    if (item.key === "contactEmail") return !isValidEmail(draft.contactEmail);
    return !fieldFilled(draft, item.key, item.min);
  }).map((item) => ({ label: item.label, anchor: item.anchor }));

  if (!systemFilled(draft)) {
    missingRequired.push({ label: "System & app info", anchor: "section-you" });
  }
  if (!hasEvidence(draft)) {
    missingRequired.push({ label: "Evidence", anchor: "section-extras" });
  }
  if (submitPath(draft) === "billing-receipt" && !draft.invoice.trim()) {
    missingRequired.push({ label: "Invoice / receipt number", anchor: "section-extras" });
  }

  const missingPreferred: MissingItem[] = PREFERRED.filter(
    (item) => !fieldFilled(draft, item.key, item.min),
  ).map((item) => ({ label: item.label, anchor: item.anchor }));

  const totalTracked = REQUIRED.length + PREFERRED.length;
  const filled = totalTracked - missingRequired.length - missingPreferred.length;
  const percent = Math.max(0, Math.min(100, Math.round((filled / totalTracked) * 100)));

  return {
    percent,
    missing: missingRequired.map((item) => item.label),
    missingItems: missingRequired,
    missingPreferred: missingPreferred.map((item) => item.label),
    missingPreferredItems: missingPreferred,
    ready: missingRequired.length === 0,
  };
}

export function isDraftBlank(draft: ReportDraft) {
  return (
    draft.product == null &&
    draft.severity == null &&
    draft.platform == null &&
    draft.frequency == null &&
    !draft.title.trim() &&
    !draft.steps.trim() &&
    !draft.expected.trim() &&
    !draft.actual.trim() &&
    !draft.shareLink.trim() &&
    !draft.extra.trim() &&
    !draft.workaround.trim() &&
    !draft.screenshot.trim() &&
    !draft.invoice.trim() &&
    !draft.model.trim() &&
    !draft.requestId.trim() &&
    !draft.httpStatus.trim() &&
    !draft.endpoint.trim() &&
    !draft.appVersion.trim() &&
    draft.imagineKind === "" &&
    draft.category == null &&
    draft.reportedFromChat == null
  );
}

function buildSystemInfo(draft: ReportDraft): string {
  const parts = [
    draft.device && `Device: ${draft.device}`,
    draft.os && `OS: ${draft.os}`,
    draft.browser && `Browser: ${draft.browser}`,
    draft.appVersion && `App version: ${draft.appVersion}`,
    draft.screen && `Screen: ${draft.screen}`,
    draft.viewport && `Viewport: ${draft.viewport}`,
    draft.language && `Language: ${draft.language}`,
    draft.timezone && `Timezone: ${draft.timezone}`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function extraContext(draft: ReportDraft): string[] {
  const chunks: string[] = [];
  if (draft.model.trim()) chunks.push(`Model: ${draft.model.trim()}`);
  if (draft.imagineKind) chunks.push(`Imagine: ${draft.imagineKind}`);
  if (draft.endpoint.trim()) chunks.push(`Endpoint: ${draft.endpoint.trim()}`);
  if (draft.requestId.trim()) chunks.push(`Request id: ${draft.requestId.trim()}`);
  if (draft.httpStatus.trim()) chunks.push(`HTTP status: ${draft.httpStatus.trim()}`);
  if (draft.extra.trim()) chunks.push(draft.extra.trim());
  return chunks;
}

function buildBugDescription(draft: ReportDraft): string {
  const title = draft.title.trim();
  const actual = draft.actual.trim();
  const expected = draft.expected.trim();
  const product = productById(draft.product)?.label;

  const chunks: string[] = [];
  if (title) chunks.push(title);
  if (actual) chunks.push(`Actual: ${actual}`);
  if (expected) chunks.push(`Expected: ${expected}`);
  if (product) chunks.push(`Product: ${product}`);
  chunks.push(...extraContext(draft));
  return chunks.length > 0 ? chunks.join("\n") : "—";
}

function buildImpact(draft: ReportDraft): string {
  const freq = labelOf(FREQUENCIES, draft.frequency);
  const actual = draft.actual.trim();
  const expected = draft.expected.trim();

  const parts: string[] = [];
  if (actual) parts.push(actual);
  if (expected) parts.push(`Expected: ${expected}`);
  if (freq && freq !== "—") parts.push(`Frequency: ${freq}`);
  return parts.length > 0 ? parts.join(" ") : "—";
}

/** Emits the exact paste template used by the xai-bug-reporter skill */
export function formatReport(draft: ReportDraft, _filedAt = new Date()) {
  const product = productById(draft.product);
  const { ready } = scoreReport(draft);
  const status = ready ? "READY" : "INCOMPLETE";

  const severity = labelOf(SEVERITIES, draft.severity);
  const category = labelOf(
    CATEGORIES,
    draft.category ?? product?.categoryId ?? "other",
  );
  const impact = buildImpact(draft);
  const platform = labelOf(PLATFORMS, draft.platform);
  const tier = labelOf(TIERS, draft.subscription);
  const systemInfo = buildSystemInfo(draft);
  const description = buildBugDescription(draft);
  const share = draft.shareLink.trim() || "—";
  const steps = draft.steps.trim() || "—";
  const frequency = labelOf(FREQUENCIES, draft.frequency);
  const workaround = draft.workaround.trim() || "—";
  const screenshot = draft.screenshot.trim() || "—";
  const reportedFrom =
    draft.reportedFromChat === "yes"
      ? "yes"
      : draft.reportedFromChat === "no"
        ? "no"
        : "—";

  const submit = submitPath(draft);
  const via =
    submit === "api-email"
      ? "support@x.ai (API Bug Report)"
      : submit === "billing-receipt"
        ? "receipt email + accounts.x.ai/refund"
        : "Grok ⋮ Report an issue";
  const expectedVsActual = [draft.expected.trim(), draft.actual.trim()]
    .filter(Boolean)
    .join(" / ") || "—";
  const apiLogs = [
    draft.endpoint.trim() && `endpoint ${draft.endpoint.trim()}`,
    draft.requestId.trim() && `request id ${draft.requestId.trim()}`,
    draft.httpStatus.trim() && `HTTP ${draft.httpStatus.trim()}`,
  ]
    .filter(Boolean)
    .join("; ") || "—";

  const lines = [
    "-----BEGIN REPORT-----",
    `Status: ${status}`,
    "",
    "=== TRIAGE ===",
    `Product: ${product?.label ?? "—"}`,
    `Surface: ${platform}`,
    `Submit via: ${via}`,
    `Severity: ${severity}`,
    `Category: ${category}`,
    `Impact: ${impact}`,
    "",
    "=== REQUIRED ===",
    `Account email: ${draft.contactEmail.trim() || "—"}`,
    `Subscription tier: ${tier}`,
    `Platform: ${platform}`,
    `System & app info: ${systemInfo}`,
    `Bug description: ${description}`,
    "",
    "Evidence:",
    `  Conversation share link: ${share}`,
    `  Screenshot: ${screenshot}`,
    `  API request / response / logs (sanitized): ${apiLogs}`,
    "",
    "=== PREFERRED ===",
    `Steps to reproduce: ${steps}`,
    `Expected vs actual: ${expectedVsActual}`,
    "",
    "=== BILLING (if applicable) ===",
    `Invoice / receipt number: ${draft.invoice.trim() || "—"}`,
    `Purchase channel (Web / App Store / Google Play / X / API): —`,
    "",
    "=== NOTES ===",
    `Workaround: ${workaround}`,
    `Frequency: ${frequency}`,
    `Reported from inside the chat where the bug occurred: ${reportedFrom}`,
    `Outage check (status.x.ai): —`,
    "-----END REPORT-----",
  ];

  return lines.join("\n");
}

export function mailSubject(draft: ReportDraft) {
  const product = productById(draft.product)?.label ?? "Grok";
  const severity = labelOf(SEVERITIES, draft.severity);
  const title = draft.title.trim() || "Untitled incident";
  return `[${severity}] ${product}: ${title}`.slice(0, 140);
}

export function mailtoHref(draft: ReportDraft) {
  if (submitPath(draft) !== "api-email") return "";
  const subject = encodeURIComponent(`API Bug Report: ${mailSubject(draft)}`);
  const body = encodeURIComponent(formatReport(draft));
  return `mailto:support@x.ai?subject=${subject}&body=${body}`;
}

export function suggestSeverity(text: string): {
  id: SeverityId;
  label: string;
  scores: Record<SeverityId, number>;
} {
  const desc = text.toLowerCase();
  const scores: Record<SeverityId, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  if (
    /(data.?loss|lost all|deleted everything|security|leak|exposed|ransomware|cannot log|locked out permanently)/.test(
      desc,
    )
  ) {
    scores.critical += 3;
  }
  if (/(complete(ly)? (down|broken|unusable)|total (failure|outage)|cannot use at all)/.test(desc)) {
    scores.critical += 2;
  }
  if (/(crash|freezes?|hangs?|force.?close|segfault|panic)/.test(desc)) scores.high += 2;
  if (
    /(no workaround|cannot work around|blocked|billing.*(wrong|charged|double)|subscription.*(fail|error))/.test(
      desc,
    )
  ) {
    scores.high += 2;
  }
  if (/(major feature|core (feature|function)|completely fail)/.test(desc)) scores.high += 1;
  if (/(slow|latency|lag|timeout|intermittent|sometimes|degraded|workaround)/.test(desc)) {
    scores.medium += 2;
  }
  if (/(error|bug|broken|fail|issue|problem)/.test(desc)) scores.medium += 1;
  if (/(cosmetic|visual|alignment|typo|minor|annoy|ui (glitch|polish)|nice.?to.?have)/.test(desc)) {
    scores.low += 3;
  }
  if (/(suggestion|improvement|feature request)/.test(desc)) scores.low += 2;

  let id: SeverityId = "medium";
  let max = scores.medium;
  (["low", "high", "critical"] as const).forEach((key) => {
    if (scores[key] > max) {
      max = scores[key];
      id = key;
    }
  });
  if (max === 0) id = "medium";

  return {
    id,
    label: SEVERITIES.find((item) => item.id === id)?.label ?? "Medium",
    scores,
  };
}

export function showsApiFields(product: ProductId | null) {
  return product === "api" || product === "console" || product === "enterprise";
}

export function showsImagineFields(product: ProductId | null) {
  return product === "imagine";
}

export function showsAppVersion(product: ProductId | null) {
  return (
    product === "ios" ||
    product === "android" ||
    product === "companions" ||
    product === "grok-cli" ||
    product === "tesla" ||
    product === "grok-build"
  );
}
