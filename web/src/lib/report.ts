export const DISCORD_GROK_COMMUNITY = "https://discord.gg/kqCc86jM55";
export const DISCORD_XAI_API = "https://discord.gg/x-ai";

export type SubmitPath = "report-an-issue" | "billing-receipt" | "api-email";

export const PRODUCTS = [
  {
    id: "grok-chat",
    label: "Grok Chat",
    hint: "Answers, tools, web UI",
    submit: "report-an-issue" as const,
    tip: "Include the conversation share link, the model if you know it, and whether a new chat fixes it.",
    categoryId: "other",
  },
  {
    id: "imagine",
    label: "Imagine",
    hint: "Images and video",
    submit: "report-an-issue" as const,
    tip: "Paste the prompt, aspect ratio, image vs video, and whether the job failed, stalled, or looked wrong.",
    categoryId: "imagine",
  },
  {
    id: "grok-x",
    label: "Grok on X",
    hint: "Grok inside X",
    submit: "report-an-issue" as const,
    tip: "Note the X client (web, iOS, Android) and whether it happens on grok.com too.",
    categoryId: "other",
  },
  {
    id: "api",
    label: "API",
    hint: "Models, keys, calling",
    submit: "api-email" as const,
    tip: "Include model name, HTTP status, request id, and a redacted request/response. Do not paste API keys. Email support@x.ai with subject API Bug Report.",
    categoryId: "other",
  },
  {
    id: "ios",
    label: "iOS app",
    hint: "iPhone and iPad",
    submit: "report-an-issue" as const,
    tip: "Include iOS version, app version, and device. Screenshots help more than a long write-up.",
    categoryId: "other",
  },
  {
    id: "android",
    label: "Android app",
    hint: "Phone and tablet",
    submit: "report-an-issue" as const,
    tip: "Include Android version, app version, and device. Note if it is the Play Store build.",
    categoryId: "other",
  },
  {
    id: "voice",
    label: "Voice",
    hint: "Talk mode and TTS",
    submit: "report-an-issue" as const,
    tip: "Note input vs output, headset vs speaker, and whether text chat still works.",
    categoryId: "other",
  },
  {
    id: "tesla",
    label: "Tesla",
    hint: "In-car Grok",
    submit: "report-an-issue" as const,
    tip: "Include vehicle software version, whether you used voice or the screen, and what the car did.",
    categoryId: "other",
  },
  {
    id: "billing",
    label: "Billing",
    hint: "Plans and receipts",
    submit: "billing-receipt" as const,
    tip: "Include the invoice or receipt number and the account email. Reply to the receipt email. Do not paste full card numbers.",
    categoryId: "billing",
  },
  {
    id: "safety",
    label: "Safety",
    hint: "Harm or jailbreaks",
    submit: "report-an-issue" as const,
    tip: "Paste into Grok → Report an issue. Describe the output and context. Do not repeat harmful content in full.",
    categoryId: "other",
  },
  {
    id: "other",
    label: "Other",
    hint: "Something else",
    submit: "report-an-issue" as const,
    tip: "Name the product in the summary so the team can route it.",
    categoryId: "other",
  },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];

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
  /** Free-text workaround description */
  workaround: string;
  /** Free-text: "yes", "attached", short description, etc. */
  screenshot: string;
  /** Whether the report is being prepared from the chat where the bug occurred */
  reportedFromChat: "yes" | "no" | null;
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
  ...emptySystem(),
});

export function productById(id: ProductId | null) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
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
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const okHost = ["grok.com", "grok.x.ai", "grok.x.com", "x.com", "twitter.com"].includes(
      host,
    );
    if (!okHost) return false;
    const match = parsed.pathname.match(/\/(?:i\/grok\/)?share\/([A-Za-z0-9_-]+)$/);
    return Boolean(match?.[1]);
  } catch {
    return false;
  }
}

export function hasEvidence(draft: ReportDraft) {
  return draft.screenshot.trim().length > 0 || hasShareId(draft.shareLink);
}

/** Required fields that block Status: READY */
const REQUIRED: { key: keyof ReportDraft; label: string; min: number }[] = [
  { key: "product", label: "Product", min: 1 },
  { key: "severity", label: "Severity", min: 1 },
  { key: "platform", label: "Platform", min: 1 },
  { key: "contactEmail", label: "Account email", min: 5 },
  { key: "subscription", label: "Subscription tier", min: 1 },
  { key: "title", label: "Bug description", min: 8 },
  { key: "actual", label: "What happened", min: 8 },
];

/** Preferred — shown as missing but do not block READY */
const PREFERRED: { key: keyof ReportDraft; label: string; min: number }[] = [
  { key: "steps", label: "Steps to reproduce", min: 8 },
];

function fieldFilled(draft: ReportDraft, key: keyof ReportDraft, min: number) {
  const value = draft[key];
  if (value == null) return false;
  return String(value).trim().length >= min;
}

export function scoreReport(draft: ReportDraft) {
  const missingRequired = REQUIRED.filter((item) => {
    if (item.key === "contactEmail") return !isValidEmail(draft.contactEmail);
    return !fieldFilled(draft, item.key, item.min);
  }).map((item) => item.label);

  if (!systemFilled(draft)) missingRequired.push("System & app info");
  if (!hasEvidence(draft)) missingRequired.push("Evidence");
  if (submitPath(draft) === "billing-receipt" && !draft.invoice.trim()) {
    missingRequired.push("Invoice / receipt number");
  }

  const missingPreferred = PREFERRED.filter(
    (item) => !fieldFilled(draft, item.key, item.min),
  ).map((item) => item.label);

  const totalTracked = REQUIRED.length + PREFERRED.length;
  const filled =
    totalTracked - missingRequired.length - missingPreferred.length;
  const percent = Math.round((filled / totalTracked) * 100);

  return {
    percent,
    missing: missingRequired, // only required block READY
    missingPreferred,
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
    draft.category == null &&
    draft.reportedFromChat == null
  );
}

function buildSystemInfo(draft: ReportDraft): string {
  const parts = [
    draft.device && `Device: ${draft.device}`,
    draft.os && `OS: ${draft.os}`,
    draft.browser && `Browser: ${draft.browser}`,
    draft.screen && `Screen: ${draft.screen}`,
    draft.viewport && `Viewport: ${draft.viewport}`,
    draft.language && `Language: ${draft.language}`,
    draft.timezone && `Timezone: ${draft.timezone}`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function buildBugDescription(draft: ReportDraft): string {
  const title = draft.title.trim();
  const actual = draft.actual.trim();
  const expected = draft.expected.trim();
  const extra = draft.extra.trim();
  const product = productById(draft.product)?.label;

  const chunks: string[] = [];
  if (title) chunks.push(title);
  if (actual) chunks.push(`Actual: ${actual}`);
  if (expected) chunks.push(`Expected: ${expected}`);
  if (product) chunks.push(`Product: ${product}`);
  if (extra) chunks.push(extra);
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

  const lines = [
    "-----BEGIN REPORT-----",
    `Status: ${status}`,
    "",
    "=== TRIAGE ===",
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
    "",
    "=== PREFERRED ===",
    `Steps to reproduce: ${steps}`,
    "",
    "=== BILLING (if applicable) ===",
    `Invoice / receipt number: ${draft.invoice.trim() || "—"}`,
    "",
    "=== NOTES ===",
    `Workaround: ${workaround}`,
    `Frequency: ${frequency}`,
    `Reported from inside the chat where the bug occurred: ${reportedFrom}`,
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
