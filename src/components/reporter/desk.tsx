import {
  AtSign,
  Blocks,
  Bot,
  Building2,
  Car,
  Code2,
  CreditCard,
  Github,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Shield,
  Smartphone,
  ScanSearch,
  Terminal,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { CompletenessPill, ReportPreview } from "@/components/reporter/preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORIES,
  DISCORD_GROK_COMMUNITY,
  DISCORD_XAI_API,
  FAQ_URL,
  FREQUENCIES,
  GROK_SKILLS,
  IMAGINE_KINDS,
  PLATFORMS,
  PRODUCT_GROUPS,
  REPO_URL,
  SEVERITIES,
  SKILL_RAW,
  STATUS_URL,
  TIERS,
  formatReport,
  isDraftBlank,
  parseShareLink,
  productById,
  productsInGroup,
  scoreReport,
  showsApiFields,
  showsAppVersion,
  showsImagineFields,
  suggestSeverity,
  type CategoryId,
  type FrequencyId,
  type ImagineKindId,
  type PlatformId,
  type ProductId,
  type SeverityId,
  type TierId,
} from "@/lib/report";
import { persistDesk, useDeskStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRODUCT_ICONS: Record<ProductId, typeof MessageSquare> = {
  "grok-chat": MessageSquare,
  imagine: ImageIcon,
  voice: Mic,
  "grok-x": AtSign,
  ios: Smartphone,
  android: Smartphone,
  companions: Users,
  "grok-bot": Bot,
  tesla: Car,
  "grok-build": Blocks,
  "grok-cli": Terminal,
  api: Code2,
  console: LayoutDashboard,
  billing: CreditCard,
  safety: Shield,
  enterprise: Building2,
  other: MoreHorizontal,
};

const PLATFORM_FOR: Partial<Record<ProductId, PlatformId>> = {
  ios: "ios",
  companions: "ios",
  android: "android",
  tesla: "tesla",
  api: "api",
  console: "api",
  enterprise: "api",
  "grok-cli": "other",
};

function jump(anchor: string) {
  document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Desk() {
  const draft = useDeskStore((s) => s.draft);
  const drafts = useDeskStore((s) => s.drafts);
  const hydrated = useDeskStore((s) => s.hydrated);
  const setField = useDeskStore((s) => s.setField);
  const patchDraft = useDeskStore((s) => s.patchDraft);
  const reset = useDeskStore((s) => s.reset);
  const saveDraft = useDeskStore((s) => s.saveDraft);
  const loadDraft = useDeskStore((s) => s.loadDraft);
  const deleteDraft = useDeskStore((s) => s.deleteDraft);
  const captureSystem = useDeskStore((s) => s.captureSystem);
  const hydrate = useDeskStore((s) => s.hydrate);

  const [pane, setPane] = useState<"compose" | "preview">("compose");
  const { percent } = scoreReport(draft);
  const product = productById(draft.product);
  const share = parseShareLink(draft.shareLink);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    return useDeskStore.subscribe(() => persistDesk());
  }, [hydrated]);

  async function copyReport() {
    const text = formatReport(draft);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Report copied");
    } catch {
      toast.error("Could not copy. Select the preview and copy manually.");
    }
  }

  function downloadReport() {
    const text = formatReport(draft);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = (draft.title.trim() || "incident")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    a.href = url;
    a.download = `${slug || "incident"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded .txt");
  }

  function handleReset() {
    if (!isDraftBlank(draft) && !window.confirm("Clear this report?")) return;
    reset();
    toast.message("Started a new report");
  }

  function handleSave() {
    if (isDraftBlank(draft)) {
      toast.error("Nothing to save yet");
      return;
    }
    saveDraft();
    toast.success("Draft saved on this device");
  }

  function handleSuggestSeverity() {
    const text = [draft.title, draft.actual, draft.steps, draft.expected].join(" ");
    if (text.trim().length < 8) {
      toast.error("Write a short description first");
      jump("section-story");
      return;
    }
    const suggestion = suggestSeverity(text);
    setField("severity", suggestion.id);
    toast.message(`Suggested ${suggestion.label} — change it if that is wrong`);
  }

  function selectProduct(id: ProductId) {
    const item = productById(id);
    patchDraft({
      product: id,
      category: item?.categoryId ?? draft.category,
      platform: PLATFORM_FOR[id] ?? draft.platform,
    });
  }

  function handleJump(anchor: string) {
    setPane("compose");
    window.setTimeout(() => jump(anchor), 40);
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex size-9 items-center justify-center rounded-md bg-raised"
              aria-hidden
            >
              <span className="block h-5 w-1 rounded-full bg-fg" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display truncate text-lg font-semibold tracking-tight sm:text-xl">
                Grok Bug Reporter
              </h1>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-subtle">
                Prepare a paste-ready report for every Grok product, then submit
                through official channels
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={GROK_SKILLS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-md border border-border bg-fg px-3 text-xs text-bg sm:text-sm"
            >
              Add to Grok Chat
            </a>
            <CompletenessPill value={percent} />
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-md text-subtle hover:bg-raised hover:text-fg"
              aria-label="Open GitHub repository"
            >
              <Github className="size-4" />
            </a>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              onClick={handleReset}
              aria-label="New report"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <p className="min-w-[12rem] flex-1 text-sm text-muted">
            Independent desk. Prefer Grok ⋮ Report an issue. This app does not
            file a ticket. Discord is not a ticket.
          </p>
          <a
            href={SKILL_RAW}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-raised px-3 text-sm text-fg"
          >
            SKILL.md
          </a>
          <a
            href={FAQ_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-raised px-3 text-sm text-fg"
          >
            Official FAQ
          </a>
          <a
            href={DISCORD_GROK_COMMUNITY}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-raised px-3 text-sm text-fg"
          >
            Grok Community
          </a>
          <a
            href={DISCORD_XAI_API}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-md border border-border bg-raised px-3 text-sm text-fg"
          >
            xAI API Discord
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:hidden">
        <div className="grid grid-cols-2 rounded-xl border border-border bg-surface p-1">
          <PaneButton active={pane === "compose"} onClick={() => setPane("compose")}>
            Compose
          </PaneButton>
          <PaneButton active={pane === "preview"} onClick={() => setPane("preview")}>
            Preview
          </PaneButton>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 pb-28 sm:px-6 lg:grid-cols-12 lg:pb-10">
        <div
          className={cn(
            "stagger-in flex flex-col gap-6 lg:col-span-7",
            pane !== "compose" && "hidden lg:flex",
          )}
        >
          <Section id="section-product" n="01" title="What broke">
            <div className="flex flex-col gap-5">
              {PRODUCT_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="mb-2 text-xs font-medium tracking-wide text-subtle">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {productsInGroup(group.id).map((item) => {
                      const Icon = PRODUCT_ICONS[item.id];
                      const selected = draft.product === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => selectProduct(item.id)}
                          className={cn(
                            "flex min-h-11 flex-col items-start gap-2 rounded-md border px-3 py-3 text-left",
                            "transition-[background-color,border-color,color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                            "active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                            selected
                              ? "border-accent bg-accent text-accent-fg"
                              : "border-border bg-raised text-fg hover:border-fg/30",
                          )}
                        >
                          <Icon className="size-4" aria-hidden />
                          <span className="font-display text-sm font-semibold leading-tight">
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              "text-xs leading-snug",
                              selected ? "text-accent-fg/70" : "text-muted",
                            )}
                          >
                            {item.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {product ? (
              <p className="mt-3 text-sm text-muted">{product.tip}</p>
            ) : null}
            {draft.product === "grok-chat" ? (
              <p className="mt-2 text-sm text-muted">
                Word-salad replies are often a short generation glitch. A new chat
                usually clears it. Check{" "}
                <a
                  className="underline decoration-border underline-offset-4 hover:text-fg"
                  href={STATUS_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  status.x.ai
                </a>
                .
              </p>
            ) : null}
          </Section>

          <Section id="section-severity" n="02" title="How bad">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium tracking-wide text-subtle">
                Severity
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-11"
                onClick={handleSuggestSeverity}
              >
                <ScanSearch className="size-4" aria-hidden />
                Suggest from description
              </Button>
            </div>
            <ChipGroup>
              {SEVERITIES.map((item) => (
                <Chip
                  key={item.id}
                  selected={draft.severity === item.id}
                  onClick={() => setField("severity", item.id as SeverityId)}
                  tone={item.id}
                >
                  {item.label}
                  <span className="hidden sm:inline"> · {item.hint}</span>
                </Chip>
              ))}
            </ChipGroup>
            <p className="mt-4 mb-2 text-xs font-medium tracking-wide text-subtle">
              Category
            </p>
            <ChipGroup>
              {CATEGORIES.map((item) => (
                <Chip
                  key={item.id}
                  selected={draft.category === item.id}
                  onClick={() => setField("category", item.id as CategoryId)}
                >
                  {item.label}
                </Chip>
              ))}
            </ChipGroup>
            <p className="mt-4 mb-2 text-xs font-medium tracking-wide text-subtle">
              How often
            </p>
            <ChipGroup>
              {FREQUENCIES.map((item) => (
                <Chip
                  key={item.id}
                  selected={draft.frequency === item.id}
                  onClick={() => setField("frequency", item.id as FrequencyId)}
                >
                  {item.label}
                </Chip>
              ))}
            </ChipGroup>
          </Section>

          <Section id="section-where" n="03" title="Where">
            <ChipGroup>
              {PLATFORMS.map((item) => (
                <Chip
                  key={item.id}
                  selected={draft.platform === item.id}
                  onClick={() => setField("platform", item.id as PlatformId)}
                >
                  {item.label}
                </Chip>
              ))}
            </ChipGroup>
          </Section>

          <Section id="section-story" n="04" title="The story">
            <Field label="Summary" htmlFor="title">
              <Input
                id="title"
                value={draft.title}
                maxLength={140}
                placeholder="One line. What actually broke?"
                onChange={(e) => setField("title", e.target.value)}
              />
            </Field>
            <Field label="Steps to reproduce (preferred)" htmlFor="steps">
              <Textarea
                id="steps"
                value={draft.steps}
                placeholder={"1. Open Grok\n2. …\n3. See the failure"}
                onChange={(e) => setField("steps", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Expected" htmlFor="expected">
                <Textarea
                  id="expected"
                  value={draft.expected}
                  placeholder="What should have happened"
                  onChange={(e) => setField("expected", e.target.value)}
                />
              </Field>
              <Field label="What happened" htmlFor="actual">
                <Textarea
                  id="actual"
                  value={draft.actual}
                  placeholder="What you saw instead"
                  onChange={(e) => setField("actual", e.target.value)}
                />
              </Field>
            </div>

            {showsImagineFields(draft.product) ? (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium tracking-wide text-subtle">
                  Imagine job
                </p>
                <ChipGroup>
                  {IMAGINE_KINDS.map((item) => (
                    <Chip
                      key={item.id}
                      selected={draft.imagineKind === item.id}
                      onClick={() =>
                        setField("imagineKind", item.id as ImagineKindId)
                      }
                    >
                      {item.label}
                    </Chip>
                  ))}
                </ChipGroup>
                <div className="mt-4">
                  <Field label="Model (if you know it)" htmlFor="imagine-model">
                    <Input
                      id="imagine-model"
                      value={draft.model}
                      placeholder="e.g. grok-imagine-image-2.0"
                      onChange={(e) => setField("model", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            {showsApiFields(draft.product) ? (
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <Field label="Model" htmlFor="model">
                  <Input
                    id="model"
                    value={draft.model}
                    placeholder="e.g. grok-4.6"
                    onChange={(e) => setField("model", e.target.value)}
                  />
                </Field>
                <Field label="Request id" htmlFor="requestId">
                  <Input
                    id="requestId"
                    value={draft.requestId}
                    placeholder="Counts as evidence for API bugs"
                    onChange={(e) => setField("requestId", e.target.value)}
                  />
                </Field>
                <Field label="HTTP status" htmlFor="httpStatus">
                  <Input
                    id="httpStatus"
                    value={draft.httpStatus}
                    placeholder="e.g. 429, 500"
                    onChange={(e) => setField("httpStatus", e.target.value)}
                  />
                </Field>
                <Field label="Endpoint" htmlFor="endpoint">
                  <Input
                    id="endpoint"
                    value={draft.endpoint}
                    placeholder="e.g. /v1/chat/completions"
                    onChange={(e) => setField("endpoint", e.target.value)}
                  />
                </Field>
              </div>
            ) : null}

            {showsAppVersion(draft.product) ? (
              <div className="mt-2">
                <Field label="App / software version" htmlFor="appVersion">
                  <Input
                    id="appVersion"
                    value={draft.appVersion}
                    placeholder="Grok app, grok --version, or vehicle software"
                    onChange={(e) => setField("appVersion", e.target.value)}
                  />
                </Field>
              </div>
            ) : null}
          </Section>

          <Section id="section-you" n="05" title="You">
            <Field label="Account email" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={draft.contactEmail}
                placeholder="you@example.com"
                onChange={(e) => setField("contactEmail", e.target.value)}
              />
            </Field>
            <p className="mb-2 text-xs font-medium tracking-wide text-subtle">
              Subscription
            </p>
            <ChipGroup>
              {TIERS.map((item) => (
                <Chip
                  key={item.id}
                  selected={draft.subscription === item.id}
                  onClick={() => setField("subscription", item.id as TierId)}
                >
                  {item.label}
                </Chip>
              ))}
            </ChipGroup>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs font-medium tracking-wide text-subtle">
                System
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-11"
                onClick={() => {
                  captureSystem();
                  toast.success("System info refreshed");
                }}
              >
                <RefreshCw className="size-4" aria-hidden />
                Recapture
              </Button>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-2 rounded-lg border border-border bg-raised p-3 sm:grid-cols-2">
              <SysRow label="Browser" value={draft.browser} />
              <SysRow label="OS" value={draft.os} />
              <SysRow label="Device" value={draft.device} />
              <SysRow label="Screen" value={draft.screen} />
              <SysRow label="Viewport" value={draft.viewport} />
              <SysRow label="Language" value={draft.language} />
              <SysRow label="Timezone" value={draft.timezone} />
              <div className="sm:col-span-2">
                <SysRow label="User-Agent" value={draft.userAgent} />
              </div>
            </dl>
            <p className="mt-2 text-xs text-subtle">
              Captured from this browser. Recapture if you switched devices.
            </p>
          </Section>

          <Section id="section-extras" n="06" title="Extras">
            <Field label="Conversation share link" htmlFor="share">
              <Input
                id="share"
                value={draft.shareLink}
                placeholder="https://grok.com/share/…"
                onChange={(e) => setField("shareLink", e.target.value)}
              />
            </Field>
            {draft.shareLink.trim() ? (
              <p
                className={cn(
                  "mb-4 text-xs",
                  share.ok ? "text-ok" : "text-danger",
                )}
              >
                {share.ok
                  ? `Valid share id on ${share.host}`
                  : "Need a grok.com or x.com share URL with a nonempty id."}
              </p>
            ) : (
              <p className="mb-4 text-xs text-subtle">
                Evidence needs a share link with a nonempty id, a screenshot note,
                or — for API bugs — a request id.
              </p>
            )}

            <Field label="Invoice / receipt number (billing)" htmlFor="invoice">
              <Input
                id="invoice"
                value={draft.invoice}
                placeholder="Required for billing issues"
                onChange={(e) => setField("invoice", e.target.value)}
              />
            </Field>

            <Field label="Screenshot" htmlFor="screenshot">
              <Input
                id="screenshot"
                value={draft.screenshot}
                placeholder='e.g. "yes", "attached", or short description'
                onChange={(e) => setField("screenshot", e.target.value)}
              />
            </Field>

            <Field label="Workaround" htmlFor="workaround">
              <Textarea
                id="workaround"
                value={draft.workaround}
                placeholder="Any temporary fix or way around the problem"
                onChange={(e) => setField("workaround", e.target.value)}
              />
            </Field>

            <p className="mb-2 text-xs font-medium tracking-wide text-subtle">
              Reported from the chat where the bug occurred?
            </p>
            <ChipGroup>
              <Chip
                selected={draft.reportedFromChat === "yes"}
                onClick={() => setField("reportedFromChat", "yes")}
              >
                Yes
              </Chip>
              <Chip
                selected={draft.reportedFromChat === "no"}
                onClick={() => setField("reportedFromChat", "no")}
              >
                No
              </Chip>
            </ChipGroup>

            <div className="mt-4">
              <Field label="Additional notes" htmlFor="extra">
                <Textarea
                  id="extra"
                  value={draft.extra}
                  placeholder="Prompt, redacted logs, anything the snapshot missed. Never paste API keys."
                  onChange={(e) => setField("extra", e.target.value)}
                />
              </Field>
            </div>
          </Section>

          <Section n="07" title="Drafts on this device">
            {drafts.length === 0 ? (
              <p className="text-sm text-muted">
                Nothing saved yet. Drafts stay in this browser.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {drafts.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-raised p-2"
                  >
                    <button
                      type="button"
                      className="min-h-11 min-w-0 flex-1 rounded-md px-2 py-2 text-left hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                      onClick={() => {
                        loadDraft(item.id);
                        toast.message("Draft loaded");
                      }}
                    >
                      <p className="truncate text-sm font-medium">
                        {item.title.trim() || "Untitled incident"}
                      </p>
                      <p className="truncate font-mono text-xs text-subtle">
                        {productById(item.product)?.label ?? "No product"} ·{" "}
                        {new Date(item.savedAt).toLocaleString()}
                      </p>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-11 shrink-0"
                      aria-label="Delete draft"
                      onClick={() => deleteDraft(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleSave}>
                Save draft
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset}>
                New report
              </Button>
            </div>
          </Section>

          <footer className="px-1 pb-2 text-xs leading-relaxed text-subtle">
            Independent project — not affiliated with, endorsed by, or connected
            to xAI. Grok and xAI are trademarks of their owners. There is no
            public bug-submission API; you remain responsible for submitting
            through in-product Report an issue, a receipt email, or
            support@x.ai for API bugs.
          </footer>
        </div>

        <div
          className={cn(
            "lg:col-span-5 lg:sticky lg:top-6 lg:self-start",
            pane !== "preview" && "hidden lg:block",
          )}
        >
          <ReportPreview
            draft={draft}
            onCopy={copyReport}
            onDownload={downloadReport}
            onJump={handleJump}
          />
        </div>
      </main>

      <div className="dock fixed inset-x-0 bottom-0 border-t border-border bg-bg/95 p-3 lg:hidden">
        <div className="mx-auto flex max-w-6xl gap-2">
          <Button type="button" className="flex-1" onClick={copyReport}>
            Copy report
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setPane(pane === "preview" ? "compose" : "preview")}
          >
            {pane === "preview" ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  n,
  title,
  children,
  id,
}: {
  n: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 rounded-2xl border border-border bg-surface p-4 sm:p-5"
    >
      <header className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-xs tracking-widest text-subtle">{n}</span>
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <Label htmlFor={htmlFor} className="mb-2 block text-muted">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ChipGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function SysRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="font-mono text-xs break-words text-fg">{value || "—"}</dd>
    </div>
  );
}

function Chip({
  selected,
  onClick,
  children,
  tone,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center rounded-md border px-3 text-sm font-medium",
        "transition-[background-color,border-color,color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
        "active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        selected
          ? tone === "critical"
            ? "border-danger bg-danger text-fg"
            : tone === "high"
              ? "border-warn bg-warn text-accent-fg"
              : "border-accent bg-accent text-accent-fg"
          : "border-border bg-raised text-fg hover:border-fg/30",
      )}
    >
      {children}
    </button>
  );
}

function PaneButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-lg text-sm font-medium transition-[background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        active ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
