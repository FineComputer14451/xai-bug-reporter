import { Copy, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatReport,
  mailtoHref,
  productById,
  scoreReport,
  type ReportDraft,
} from "@/lib/report";
import { cn } from "@/lib/utils";

type PreviewProps = {
  draft: ReportDraft;
  onCopy: () => void;
  onDownload: () => void;
};

export function ReportPreview({ draft, onCopy, onDownload }: PreviewProps) {
  const { percent, missing, ready } = scoreReport(draft);
  const product = productById(draft.product);
  const text = formatReport(draft);

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-subtle uppercase">
            Live report
          </p>
          <h2 className="font-display mt-1 text-lg font-semibold tracking-tight">
            {ready ? "Ready to file" : "Still assembling"}
          </h2>
        </div>
        <CompletenessRing value={percent} />
      </div>

      {missing.length > 0 ? (
        <p className="text-sm text-muted">
          Add {missing.join(", ").replace(/, ([^,]*)$/, " and $1")}.
        </p>
      ) : (
        <p className="text-sm text-muted">
          Routes to {product?.inbox ?? "support@x.ai"}. Copy it, or open a mail
          draft.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Button type="button" onClick={onCopy} className="col-span-2 sm:col-span-1">
          <Copy className="size-4" aria-hidden />
          Copy
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href={mailtoHref(draft)}>
            <Mail className="size-4" aria-hidden />
            Email
          </a>
        </Button>
        <Button type="button" variant="subtle" onClick={onDownload}>
          <Download className="size-4" aria-hidden />
          .txt
        </Button>
      </div>

      <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-bg p-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-fg">
        {text}
      </pre>
    </aside>
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
          strokeDashoffset={offset}
          strokeLinecap="round"
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
