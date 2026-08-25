import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  emptyDraft,
  formatReport,
  hasShareId,
  mailtoHref,
  scoreReport,
  submitPath,
  type ReportDraft,
} from "./report.ts";

function filled(partial: Partial<ReportDraft>): ReportDraft {
  return {
    ...emptyDraft(),
    product: "grok-chat",
    severity: "high",
    platform: "web",
    subscription: "super-grok",
    contactEmail: "user@example.com",
    title: "Share menu freezes the app",
    actual: "The share menu freezes for ten seconds.",
    browser: "Chrome 120",
    os: "Android 15",
    screenshot: "yes",
    ...partial,
  };
}

describe("companion report", () => {
  it("does not mail support@x.ai for Grok Chat", () => {
    assert.equal(submitPath(filled({})), "report-an-issue");
    assert.equal(mailtoHref(filled({})), "");
    assert.equal(formatReport(filled({})).includes("support@x.ai"), false);
  });

  it("mails support@x.ai only for API bugs", () => {
    const api = filled({ product: "api" });
    assert.equal(submitPath(api), "api-email");
    assert.match(mailtoHref(api), /^mailto:support@x\.ai\?/);
    assert.match(mailtoHref(api), /API%20Bug%20Report/);
  });

  it("requires evidence (share id or screenshot) before READY", () => {
    const none = filled({ screenshot: "", shareLink: "" });
    assert.equal(scoreReport(none).ready, false);
    assert.ok(scoreReport(none).missing.includes("Evidence"));
    const share = filled({
      screenshot: "",
      shareLink: "https://grok.com/share/abc123",
    });
    assert.equal(scoreReport(share).ready, true);
    assert.equal(hasShareId("https://grok.com/share/"), false);
  });

  it("requires invoice for billing", () => {
    const bill = filled({ product: "billing", invoice: "" });
    assert.equal(scoreReport(bill).ready, false);
    assert.ok(scoreReport(bill).missing.includes("Invoice / receipt number"));
    assert.equal(scoreReport(filled({ product: "billing", invoice: "INV-1" })).ready, true);
  });

  it("emits the skill paste template", () => {
    const text = formatReport(filled({}));
    assert.match(text, /^-----BEGIN REPORT-----/);
    assert.match(text, /Status: READY/);
    assert.match(text, /=== PREFERRED ===/);
    assert.match(text, /=== BILLING \(if applicable\) ===/);
    assert.match(text, /Reported from inside the chat where the bug occurred:/);
  });
});
