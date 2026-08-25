import {
  AtSign,
  Car,
  Code2,
  CreditCard,
  Github,
  ImageIcon,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Shield,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { CompletenessPill, ReportPreview } from "@/components/reporter/preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FREQUENCIES,
  PLATFORMS,
  PRODUCTS,
  SEVERITIES,
  TIERS,
  formatReport,
  isDraftBlank,
  productById,
  scoreReport,
  type FrequencyId,
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
  "grok-x": AtSign,
  api: Code2,
  ios: Smartphone,
  android: Smartphone,
  voice: Mic,
  tesla: Car,
  billing: CreditCard,
  safety: Shield,
  other: MoreHorizontal,
};

export function Desk() {
  const draft = useDeskStore((s) => s.draft);
  const drafts = useDeskStore((s) => s.drafts);
  const hydrated = useDeskStore((s) => s.hydrated);
  const setField = useDeskStore((s) => s.setField);
  const reset = useDeskStore((s) => s.reset);
  const saveDraft = useDeskStore((s) => s.saveDraft);
  const loadDraft = useDeskStore((s) => s.loadDraft);
  const deleteDraft = useDeskStore((s) => s.deleteDraft);
  const captureSystem = useDeskStore((s) => s.captureSystem);
  const hydrate = useDeskStore((s) => s.hydrate);

  const [pane, setPane] = useState<"compose" | "preview">("compose");
  const { percent } = scoreReport(draft);
  const product = productById(draft.product);

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
    a.download = `${slug}.txt`;
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

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex size-9 items-center justify-center rounded-md bg-raised"
              aria-hidden
            >
              <span className="block h-5 w-1 rounded-full bg-fg" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display truncate text-lg font-semibold tracking-tight sm:text-xl">
                xAI Bug Reporter
              </h1>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-subtle">
                Grok skill for official xAI bug reporting — triage, share-link
                validation, platform collection, and paste-ready Report an
                issue packages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CompletenessPill value={percent} />
            <a
              href="https://github.com/FineComputer14451/xai-bug-reporter"
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
          <Section n="01" title="What broke">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRODUCTS.map((item) => {
                const Icon = PRODUCT_ICONS[item.id];
                const selected = draft.product === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setField("product", item.id)}
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
            {product ? (
              <p className="mt-3 text-sm text-muted">{product.tip}</p>
            ) : null}
            {draft.product === "grok-chat" ? (
              <p className="mt-2 text-sm text-muted">
                Word-salad replies are often a short generation glitch. A new chat
                usually clears it. Check{" "}
                <a
                  className="underline decoration-border underline-offset-4 hover:text-fg"
                  href="https://status.x.ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  status.x.ai
                </a>
                .
              </p>
            ) : null}
          </Section>

          <Section n="02" title="How bad">
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

          <Section n="03" title="Where">
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

          <Section n="04" title="The story">
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
                placeholder="1. Open Grok&#10;2. …&#10;3. See the failure"
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
          </Section>

          <Section n="05" title="You">
            <Field label="Email" htmlFor="email">
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
              Captured from this browser. Edit nothing here — recapture if you
              switched devices.
            </p>
          </Section>

          <Section n="06" title="Extras">
            <Field label="Share link or request id" htmlFor="share">
              <Input
                id="share"
                value={draft.shareLink}
                placeholder="Conversation link, request id, invoice number"
                onChange={(e) => setField("shareLink", e.target.value)}
              />
            </Field>
            <Field label="Notes" htmlFor="extra">
              <Textarea
                id="extra"
                value={draft.extra}
                placeholder="App version, anything the snapshot missed"
                onChange={(e) => setField("extra", e.target.value)}
              />
            </Field>
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
                      className="min-w-0 flex-1 rounded-md px-2 py-2 text-left hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
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
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
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
