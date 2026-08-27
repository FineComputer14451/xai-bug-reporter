import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  emptyDraft,
  formatReport,
  hasShareId,
  mailtoHref,
  parseShareLink,
  scoreReport,
  suggestSeverity,
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

  it("routes console and enterprise to the API inbox", () => {
    assert.equal(submitPath(filled({ product: "console" })), "api-email");
    assert.equal(submitPath(filled({ product: "enterprise" })), "api-email");
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

  it("accepts an API request id as evidence", () => {
    const api = filled({
      product: "api",
      screenshot: "",
      shareLink: "",
      requestId: "req_123",
    });
    assert.equal(scoreReport(api).ready, true);
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

  it("folds model and request id into the description", () => {
    const text = formatReport(
      filled({ product: "api", model: "grok-4.5", requestId: "req_9" }),
    );
    assert.match(text, /Model: grok-4\.5/);
    assert.match(text, /Request id: req_9/);
  });

  it("parses share links structurally", () => {
    assert.equal(parseShareLink("https://grok.com/share/abc-1").ok, true);
    assert.equal(parseShareLink("https://x.com/i/grok/share/xyz").ok, true);
    assert.equal(parseShareLink("https://grok.com/share/").ok, false);
    assert.equal(parseShareLink("https://example.com/share/abc").ok, false);
  });

  it("suggests severity from keywords without locking it", () => {
    assert.equal(suggestSeverity("the app freezes every time").id, "high");
    assert.equal(suggestSeverity("complete data loss and security leak").id, "critical");
    assert.equal(suggestSeverity("minor typo in the settings label").id, "low");
  });
});
