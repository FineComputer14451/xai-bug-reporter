export const PRODUCTS = [
  {
    id: "grok-chat",
    label: "Grok Chat",
    hint: "Answers, tools, web UI",
    inbox: "support@x.ai",
    tip: "Include the conversation share link, the model if you know it, and whether a new chat fixes it.",
  },
  {
    id: "imagine",
    label: "Imagine",
    hint: "Images and video",
    inbox: "support@x.ai",
    tip: "Paste the prompt, aspect ratio, image vs video, and whether the job failed, stalled, or looked wrong.",
  },
  {
    id: "grok-x",
    label: "Grok on X",
    hint: "Grok inside X",
    inbox: "support@x.ai",
    tip: "Note the X client (web, iOS, Android) and whether it happens on grok.com too.",
  },
  {
    id: "api",
    label: "API",
    hint: "Models, keys, calling",
    inbox: "support@x.ai",
    tip: "Include model name, HTTP status, request id, and a redacted request/response. Do not paste API keys.",
  },
  {
    id: "ios",
    label: "iOS app",
    hint: "iPhone and iPad",
    inbox: "support@x.ai",
    tip: "Include iOS version, app version, and device. Screenshots help more than a long write-up.",
  },
  {
    id: "android",
    label: "Android app",
    hint: "Phone and tablet",
    inbox: "support@x.ai",
    tip: "Include Android version, app version, and device. Note if it is the Play Store build.",
  },
  {
    id: "voice",
    label: "Voice",
    hint: "Talk mode and TTS",
    inbox: "support@x.ai",
    tip: "Note input vs output, headset vs speaker, and whether text chat still works.",
  },
  {
    id: "tesla",
    label: "Tesla",
    hint: "In-car Grok",
    inbox: "support@x.ai",
    tip: "Include vehicle software version, whether you used voice or the screen, and what the car did.",
  },
  {
    id: "billing",
    label: "Billing",
    hint: "Plans and receipts",
    inbox: "support@x.ai",
    tip: "Include the invoice or receipt number and the account email. Do not paste full card numbers.",
  },
  {
    id: "safety",
    label: "Safety",
    hint: "Harm or jailbreaks",
    inbox: "safety@x.ai",
    tip: "This routes to safety@x.ai. Describe the output and context. Do not repeat harmful content in full.",
  },
  {
    id: "other",
    label: "Other",
    hint: "Something else",
    inbox: "support@x.ai",
    tip: "Name the product in the summary so the team can route it.",
  },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];

export const SEVERITIES = [
  { id: "blocker", label: "Blocker", hint: "Cannot use it" },
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

const REQUIRED: { key: keyof ReportDraft; label: string; min: number }[] = [
  { key: "product", label: "Product", min: 1 },
  { key: "severity", label: "Severity", min: 1 },
  { key: "platform", label: "Platform", min: 1 },
  { key: "contactEmail", label: "Email", min: 5 },
  { key: "subscription", label: "Plan", min: 1 },
  { key: "title", label: "Summary", min: 8 },
  { key: "steps", label: "Steps", min: 16 },
  { key: "actual", label: "What happened", min: 8 },
];

function fieldFilled(draft: ReportDraft, key: keyof ReportDraft, min: number) {
  const value = draft[key];
  if (value == null) return false;
  return String(value).trim().length >= min;
}

export function scoreReport(draft: ReportDraft) {
  const missing = REQUIRED.filter((item) => {
    if (item.key === "contactEmail") return !isValidEmail(draft.contactEmail);
    return !fieldFilled(draft, item.key, item.min);
  }).map((item) => item.label);
  const filled = REQUIRED.length - missing.length;
  const percent = Math.round((filled / REQUIRED.length) * 100);
  return { percent, missing, ready: missing.length === 0 };
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

export function formatReport(draft: ReportDraft, filedAt = new Date()) {
  const product = productById(draft.product);
  const date = filedAt.toISOString().slice(0, 10);
  const lines = [
    "INCIDENT REPORT",
    "===============",
    `Filed via xAI Bug Reporter · ${date}`,
    "",
    "Reporter",
    "--------",
    `Email:       ${draft.contactEmail.trim() || "—"}`,
    `Plan:        ${labelOf(TIERS, draft.subscription)}`,
    "",
    "Incident",
    "--------",
    `Product:     ${product?.label ?? "—"}`,
    `Severity:    ${labelOf(SEVERITIES, draft.severity)}`,
    `Platform:    ${labelOf(PLATFORMS, draft.platform)}`,
    `Frequency:   ${labelOf(FREQUENCIES, draft.frequency)}`,
    `Inbox:       ${product?.inbox ?? "support@x.ai"}`,
    "",
    "Summary",
    "-------",
    draft.title.trim() || "—",
    "",
    "Steps to reproduce",
    "------------------",
    draft.steps.trim() || "—",
    "",
    "Expected",
    "--------",
    draft.expected.trim() || "—",
    "",
    "Actual",
    "------",
    draft.actual.trim() || "—",
    "",
    "System",
    "------",
    `Browser:     ${draft.browser || "—"}`,
    `OS:          ${draft.os || "—"}`,
    `Device:      ${draft.device || "—"}`,
    `Screen:      ${draft.screen || "—"}`,
    `Viewport:    ${draft.viewport || "—"}`,
    `Language:    ${draft.language || "—"}`,
    `Timezone:    ${draft.timezone || "—"}`,
    `User-Agent:  ${draft.userAgent || "—"}`,
  ];

  if (draft.shareLink.trim()) {
    lines.push("", "Share link", "----------", draft.shareLink.trim());
  }
  if (draft.extra.trim()) {
    lines.push("", "Notes", "-----", draft.extra.trim());
  }

  lines.push(
    "",
    "---",
    "Please attach screenshots if you have them.",
    "Status: https://status.x.ai",
  );

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
