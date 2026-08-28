import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      suppressHydrationWarning
      className={cn(
        "flex min-h-28 w-full resize-y rounded-md border border-border bg-raised px-3 py-3 text-sm text-fg placeholder:text-subtle",
        "transition-[border-color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        "disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
