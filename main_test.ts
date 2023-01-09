import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { HXHeaders } from "./main.ts";

Deno.test("HTMX exists", () => {
  const hx = new HXHeaders([["HX-Request", "true"]]);
  assertEquals(hx.isHTMX, true);
});

Deno.test("HTMX does not exist", () => {
  const hx = new HXHeaders([]);
  assertEquals(hx.isHTMX, false);
});

Deno.test("Request has ajax boost", () => {
  const hx = new HXHeaders([["HX-Request", "true"]]);
  assertEquals(hx.isHTMX, true);
  assertEquals(hx.boosted, false);
});

Deno.test("Request has restore history", () => {
  const hx = new HXHeaders([
    ["HX-Request", "true"],
    ["HX-History-Restore-Request", "true"],
  ]);
  assertEquals(hx.isHTMX, true);
  assertEquals(hx.historyRestoreRequest, true);
});

Deno.test("Request has Prompt", () => {
  const hx = new HXHeaders([
    ["HX-Request", "true"],
    ["HX-Prompt", "test"],
  ]);
  assertEquals(hx.isHTMX, true);
  assertEquals(hx.prompt, "test");
});

Deno.test("Request has Current URL", () => {
  const hx = new HXHeaders([
    ["HX-Request", "true"],
    ["HX-Current-Url", "/test"],
  ]);
  assertEquals(hx.isHTMX, true);
  assertEquals(hx.currentUrl, "/test");
});

Deno.test("Request has target ID", () => {
  const hx = new HXHeaders([
    ["HX-Request", "true"],
    ["HX-Target", "test"],
  ]);
  assertEquals(hx.isHTMX, true);
  assertEquals(hx.targetId, "test");
});

Deno.test("Request has Trigger Name", () => {
  const hx = new HXHeaders([
    ["HX-Request", "true"],
    ["HX-Trigger-Name", "test"],
  ]);
  assertEquals(hx.isHTMX, true);
  assertEquals(hx.triggerName, "test");
});

Deno.test("Request has Trigger ID", () => {
  const hx = new HXHeaders([
    ["HX-Request", "true"],
    ["HX-Trigger", "test"],
  ]);
  assertEquals(hx.isHTMX, true);
  assertEquals(hx.triggerId, "test");
});

Deno.test("Respond with location string", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.location("/test");
  assertEquals(headers["HX-Location"], "/test");
});
Deno.test("Respond with location object (only path)", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.location({ path: "/test" });
  assertEquals(headers["HX-Location"], "/test");
});

Deno.test("Respond with location object", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.location({ path: "/test", event: "test" });
  assertEquals(
    headers["HX-Location"],
    '{"path":"/test","event":"test"}',
  );
});

Deno.test("Respond with push URL", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.pushUrl("/test");
  assertEquals(headers["HX-Push-Url"], "/test");
});

Deno.test("Respond with push URL disabled", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.pushUrl(false);
  assertEquals(headers["HX-Push-Url"], "false");
});

Deno.test("Respond with replace URL", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.replaceUrl("/test");
  assertEquals(headers["HX-Replace-Url"], "/test");
});

Deno.test("Respond with replace URL disabled", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.replaceUrl(false);
  assertEquals(headers["HX-Replace-Url"], "false");
});

Deno.test("Respond with redirect", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.redirect("/test");
  assertEquals(headers["HX-Redirect"], "/test");
});

Deno.test("Respond with refresh", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.refresh(true);
  assertEquals(headers["HX-Refresh"], "true");
});

Deno.test("Respond with single reswap", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.reswap("innerHTML");
  assertEquals(headers["HX-Reswap"], "innerHTML");
});

Deno.test("Respond with reswap [innerHTML scroll:top swap:1s]", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.reswap("innerHTML", "scroll:top", "swap:1s");
  assertEquals(
    headers["HX-Reswap"],
    "innerHTML scroll:top swap:1s",
  );
});

Deno.test("Respond with Retarget CSS Selector", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.retarget("div");
  assertEquals(headers["HX-Retarget"], "div");
});

Deno.test("Respond with trigger event", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.trigger({ "my-event": "my-value" });
  assertEquals(
    headers["HX-Trigger"],
    '{"my-event":"my-value"}',
  );
});

Deno.test("Respond with trigger event with multiple values", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.trigger({ "my-event": ["my-value", "my-value2"] });
  assertEquals(
    headers["HX-Trigger"],
    '{"my-event":["my-value","my-value2"]}',
  );
});

Deno.test("Respond with trigger event with multiple values and multiple events", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.trigger({
    "my-event": { prop: "value" },
    "my-event2": "my-value3",
  });
  assertEquals(
    headers["HX-Trigger"],
    '{"my-event":{"prop":"value"},"my-event2":"my-value3"}',
  );
});

Deno.test("Respond with trigger after settle", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.trigger({ "my-event": "my-value" }, "aftersettle");
  assertEquals(
    headers["HX-Trigger-After-Settle"],
    '{"my-event":"my-value"}',
  );
});

Deno.test("Respond with trigger after swap", () => {
  const headers: Record<string, string> = {};
  const hx = new HXHeaders([["HX-Request", "true"]], headers);
  hx.trigger({ "my-event": "my-value" }, "afterswap");
  assertEquals(
    headers["HX-Trigger-After-Swap"],
    '{"my-event":"my-value"}',
  );
});
