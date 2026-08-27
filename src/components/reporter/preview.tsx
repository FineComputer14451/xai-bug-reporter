import { Copy, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DISCORD_GROK_COMMUNITY,
  DISCORD_XAI_API,
  REFUND_URL,
  formatReport,
  mailtoHref,
  scoreReport,
  submitPath,
  type MissingItem,
  type ReportDraft,
} from "@/lib/report";
import { cn } from "@/lib/utils";

type PreviewProps = {
  draft: ReportDraft;
  onCopy: () => void;
  onDownload: () => void;
  onJump: (anchor: string) => void;
};

export function ReportPreview({ draft, onCopy, onDownload, onJump }: PreviewProps) {
  const { percent, missingItems, missingPreferredItems, ready } = scoreReport(draft);
  const path = submitPath(draft);
  const text = formatReport(draft);
  const mail = mailtoHref(draft);

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-subtle uppercase">
            Live report
          </p>
          <h2 className="font-display mt-1 text-lg font-semibold tracking-tight">
            {ready ? "READY" : "INCOMPLETE"}
          </h2>
        </div>
        <CompletenessRing value={percent} />
      </div>

      {missingItems.length > 0 ? (
        <div className="text-sm text-muted">
          <p>Still missing required fields:</p>
          <ul className="mt-2 flex flex-col gap-1">
            {missingItems.map((item) => (
              <li key={item.label}>
                <MissingLink item={item} onJump={onJump} />
              </li>
            ))}
          </ul>
        </div>
      ) : missingPreferredItems.length > 0 ? (
        <p className="text-sm text-muted">
          Ready. Preferred still empty:{" "}
          {missingPreferredItems.map((item, i) => (
            <span key={item.label}>
              {i > 0 ? ", " : ""}
              <MissingLink item={item} onJump={onJump} />
            </span>
          ))}
          .
        </p>
      ) : (
        <p className="text-sm text-muted">
          Ready to submit via the official path below.
        </p>
      )}

      <div className="rounded-lg border border-border bg-bg p-3 text-sm text-muted">
        {path === "api-email" ? (
          <p>
            API / console / enterprise bugs: email{" "}
            <span className="text-fg">support@x.ai</span> with subject “API Bug
            Report”. Do not use that address for the Grok app.
          </p>
        ) : path === "billing-receipt" ? (
          <p>
            Billing: reply to your receipt email with this package and the invoice
            number. Refunds:{" "}
            <a
              className="underline decoration-border underline-offset-4 hover:text-fg"
              href={REFUND_URL}
              target="_blank"
              rel="noreferrer"
            >
              accounts.x.ai/refund
            </a>
            .
          </p>
        ) : (
          <ol className="list-decimal space-y-1 pl-5">
            <li>Stay in the Grok chat where it happened.</li>
            <li>Tap ⋮ → Report an issue / Report Issue.</li>
            <li>Paste this block. Attach a screenshot if you have one.</li>
            <li>Submit. This desk does not file a ticket.</li>
          </ol>
        )}
        <p className="mt-2 text-xs text-subtle">
          Hangouts (not a ticket):{" "}
          <a
            className="underline decoration-border underline-offset-4 hover:text-fg"
            href={DISCORD_GROK_COMMUNITY}
            target="_blank"
            rel="noreferrer"
          >
            Grok Community
          </a>
          {" · "}
          <a
            className="underline decoration-border underline-offset-4 hover:text-fg"
            href={DISCORD_XAI_API}
            target="_blank"
            rel="noreferrer"
          >
            xAI API Discord
          </a>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Button type="button" onClick={onCopy} className="col-span-2 sm:col-span-1">
          <Copy className="size-4" aria-hidden />
          Copy
        </Button>
        {mail ? (
          <Button type="button" variant="outline" asChild>
            <a href={mail}>
              <Mail className="size-4" aria-hidden />
              Email API
            </a>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled
            title="Email is only for xAI API bugs"
          >
            <Mail className="size-4" aria-hidden />
            Email
          </Button>
        )}
        <Button type="button" variant="subtle" onClick={onDownload}>
          <Download className="size-4" aria-hidden />
          .txt
        </Button>
      </div>

      <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-bg p-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-fg">
        {text}
      </pre>
    </aside>
  );
}

function MissingLink({
  item,
  onJump,
}: {
  item: MissingItem;
  onJump: (anchor: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onJump(item.anchor)}
      className="text-left text-fg underline decoration-border underline-offset-4 hover:decoration-fg"
    >
      {item.label}
    </button>
  );
}

function CompletenessRing({ value }: { value: number }) {
  const radius = 16;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - value / 100);
  return (
    <div className="flex items-center gap-2" aria-label={`Completeness ${value} percent`}>
      <svg className="size-10 -rotate-90" viewBox="0 0 40 40" aria-hidden>
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          className="stroke-border"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          className="stroke-accent"
          strokeWidth="3"
          strokeDasharray={circ}
          strokeLinecap="round"
          strokeDashoffset={offset}
        />
      </svg>
      <span className="font-mono text-sm tabular-nums text-muted">{value}%</span>
    </div>
  );
}

export function CompletenessPill({ value }: { value: number }) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md border border-border bg-raised px-3",
      )}
      aria-label={`Completeness ${value} percent`}
    >
      <span className="font-mono text-xs tracking-widest text-subtle uppercase">
        Complete
      </span>
      <span className="font-mono text-sm tabular-nums text-fg">{value}%</span>
    </div>
  );
}
