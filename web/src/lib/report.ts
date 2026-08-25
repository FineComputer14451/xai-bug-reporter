export const PRODUCTS = [
  {
    id: "grok-chat",
    label: "Grok Chat",
    hint: "Answers, tools, web UI",
    inbox: "support@x.ai",
    tip: "Include the conversation share link, the model if you know it, and whether a new chat fixes it.",
    category: "Other",
  },
  {
    id: "imagine",
    label: "Imagine",
    hint: "Images and video",
    inbox: "support@x.ai",
    tip: "Paste the prompt, aspect ratio, image vs video, and whether the job failed, stalled, or looked wrong.",
    category: "Image or video generation",
  },
  {
    id: "grok-x",
    label: "Grok on X",
    hint: "Grok inside X",
    inbox: "support@x.ai",
    tip: "Note the X client (web, iOS, Android) and whether it happens on grok.com too.",
    category: "Other",
  },
  {
    id: "api",
    label: "API",
    hint: "Models, keys, calling",
    inbox: "support@x.ai",
    tip: "Include model name, HTTP status, request id, and a redacted request/response. Do not paste API keys.",
    category: "Other",
  },
  {
    id: "ios",
    label: "iOS app",
    hint: "iPhone and iPad",
    inbox: "support@x.ai",
    tip: "Include iOS version, app version, and device. Screenshots help more than a long write-up.",
    category: "Other",
  },
  {
    id: "android",
    label: "Android app",
    hint: "Phone and tablet",
    inbox: "support@x.ai",
    tip: "Include Android version, app version, and device. Note if it is the Play Store build.",
    category: "Other",
  },
  {
    id: "voice",
    label: "Voice",
    hint: "Talk mode and TTS",
    inbox: "support@x.ai",
    tip: "Note input vs output, headset vs speaker, and whether text chat still works.",
    category: "Other",
  },
  {
    id: "tesla",
    label: "Tesla",
    hint: "In-car Grok",
    inbox: "support@x.ai",
    tip: "Include vehicle software version, whether you used voice or the screen, and what the car did.",
    category: "Other",
  },
  {
    id: "billing",
    label: "Billing",
    hint: "Plans and receipts",
    inbox: "support@x.ai",
    tip: "Include the invoice or receipt number and the account email. Do not paste full card numbers.",
    category: "Authentication / subscription / billing",
  },
  {
    id: "safety",
    label: "Safety",
    hint: "Harm or jailbreaks",
    inbox: "safety@x.ai",
    tip: "This routes to safety@x.ai. Describe the output and context. Do not repeat harmful content in full.",
    category: "Other",
  },
  {
    id: "other",
    label: "Other",
    hint: "Something else",
    inbox: "support@x.ai",
    tip: "Name the product in the summary so the team can route it.",
    category: "Other",
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

/** Required fields that block Status: READY */
const REQUIRED: { key: keyof ReportDraft; label: string; min: number }[] = [
  { key: "product", label: "Product", min: 1 },
  { key: "severity", label: "Severity", min: 1 },
  { key: "platform", label: "Platform", min: 1 },
  { key: "contactEmail", label: "Email", min: 5 },
  { key: "subscription", label: "Plan", min: 1 },
  { key: "title", label: "Summary", min: 8 },
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
    !draft.extra.trim()
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

  const chunks: string[] = [];
  if (title) chunks.push(title);
  if (actual) chunks.push(`Actual: ${actual}`);
  if (expected) chunks.push(`Expected: ${expected}`);
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
  const category = product?.category ?? "Other";
  const impact = buildImpact(draft);
  const platform = labelOf(PLATFORMS, draft.platform);
  const tier = labelOf(TIERS, draft.subscription);
  const systemInfo = buildSystemInfo(draft);
  const description = buildBugDescription(draft);
  const share = draft.shareLink.trim() || "—";
  const steps = draft.steps.trim() || "—";
  const notes = draft.extra.trim() || "—";
  const frequency = labelOf(FREQUENCIES, draft.frequency);

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
    `  Screenshot: —`,
    "",
    "=== PREFERRED ===",
    `Steps to reproduce: ${steps}`,
    "",
    "=== BILLING (if applicable) ===",
    "Invoice / receipt number: —",
    "",
    "=== NOTES ===",
    `Workaround: —`,
    `Frequency: ${frequency}`,
    `Reported from inside the chat where the bug occurred: —`,
    `Product: ${product?.label ?? "—"}`,
    `Notes: ${notes}`,
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
  const to = productById(draft.product)?.inbox ?? "support@x.ai";
  const subject = encodeURIComponent(mailSubject(draft));
  const body = encodeURIComponent(formatReport(draft));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
