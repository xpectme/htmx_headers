import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { BackendHTMX } from "./main.ts";

Deno.test("HTMX exists", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  assertEquals(backend.isHTMX, true);
});

Deno.test("HTMX does not exist", () => {
  const backend = new BackendHTMX(new Headers());
  assertEquals(backend.isHTMX, false);
});

Deno.test("Request has ajax boost", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  assertEquals(backend.isHTMX, true);
  assertEquals(backend.boosted, false);
});

Deno.test("Request has restore history", () => {
  const backend = new BackendHTMX(
    new Headers([["HX-Request", "true"], [
      "HX-History-Restore-Request",
      "true",
    ]]),
  );
  assertEquals(backend.isHTMX, true);
  assertEquals(backend.historyRestoreRequest, true);
});

Deno.test("Request has Prompt", () => {
  const backend = new BackendHTMX(
    new Headers([["HX-Request", "true"], ["HX-Prompt", "test"]]),
  );
  assertEquals(backend.isHTMX, true);
  assertEquals(backend.prompt, "test");
});

Deno.test("Request has Current URL", () => {
  const backend = new BackendHTMX(
    new Headers([["HX-Request", "true"], ["HX-Current-URL", "/test"]]),
  );
  assertEquals(backend.isHTMX, true);
  assertEquals(backend.currentUrl, "/test");
});

Deno.test("Request has target ID", () => {
  const backend = new BackendHTMX(
    new Headers([["HX-Request", "true"], ["HX-Target", "test"]]),
  );
  assertEquals(backend.isHTMX, true);
  assertEquals(backend.targetId, "test");
});

Deno.test("Request has Trigger Name", () => {
  const backend = new BackendHTMX(
    new Headers([["HX-Request", "true"], ["HX-Trigger-Name", "test"]]),
  );
  assertEquals(backend.isHTMX, true);
  assertEquals(backend.triggerName, "test");
});

Deno.test("Request has Trigger ID", () => {
  const backend = new BackendHTMX(
    new Headers([["HX-Request", "true"], ["HX-Trigger", "test"]]),
  );
  assertEquals(backend.isHTMX, true);
  assertEquals(backend.triggerId, "test");
});

Deno.test("Respond with location string", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.location("/test");
  assertEquals(response?.headers?.["HX-Location"], "/test");
});
Deno.test("Respond with location object (only path)", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.location({ path: "/test" });
  assertEquals(response?.headers?.["HX-Location"], "/test");
});

Deno.test("Respond with location object", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.location({ path: "/test", event: "test" });
  assertEquals(
    response?.headers?.["HX-Location"],
    '{"path":"/test","event":"test"}',
  );
});

Deno.test("Respond with push URL", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.pushUrl("/test");
  assertEquals(response?.headers?.["HX-Push-Url"], "/test");
});

Deno.test("Respond with push URL disabled", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.pushUrl(false);
  assertEquals(response?.headers?.["HX-Push-Url"], "false");
});

Deno.test("Respond with replace URL", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.replaceUrl("/test");
  assertEquals(response?.headers?.["HX-Replace-Url"], "/test");
});

Deno.test("Respond with replace URL disabled", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.replaceUrl(false);
  assertEquals(response?.headers?.["HX-Replace-Url"], "false");
});

Deno.test("Respond with redirect", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.redirect("/test");
  assertEquals(response?.headers?.["HX-Redirect"], "/test");
});

Deno.test("Respond with redirect without HX-Request", () => {
  const backend = new BackendHTMX(new Headers());
  const response = backend.redirect("/test");
  assertEquals(response?.headers?.["Location"], "/test");
  assertEquals(response?.status, 303);
});

Deno.test("Respond with refresh", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.refresh();
  assertEquals(response?.headers?.["HX-Refresh"], "true");
});

Deno.test("Respond with single reswap", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.reswap("innerHTML");
  assertEquals(response?.headers?.["HX-Reswap"], "innerHTML");
});

Deno.test("Respond with reswap [innerHTML scroll:top swap:1s]", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.reswap("innerHTML", "scroll:top", "swap:1s");
  assertEquals(
    response?.headers?.["HX-Reswap"],
    "innerHTML scroll:top swap:1s",
  );
});

Deno.test("Respond with Retarget CSS Selector", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.retarget("div");
  assertEquals(response?.headers?.["HX-Retarget"], "div");
});

Deno.test("Respond with trigger event", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.trigger({ "my-event": "my-value" });
  assertEquals(
    response?.headers?.["HX-Trigger"],
    '{"my-event":"my-value"}',
  );
});

Deno.test("Respond with trigger event with multiple values", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.trigger({ "my-event": ["my-value", "my-value2"] });
  assertEquals(
    response?.headers?.["HX-Trigger"],
    '{"my-event":["my-value","my-value2"]}',
  );
});

Deno.test("Respond with trigger event with multiple values and multiple events", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.trigger({
    "my-event": { prop: "value" },
    "my-event2": "my-value3",
  });
  assertEquals(
    response?.headers?.["HX-Trigger"],
    '{"my-event":{"prop":"value"},"my-event2":"my-value3"}',
  );
});

Deno.test("Respond with trigger after settle", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.trigger({ "my-event": "my-value" }, "aftersettle");
  assertEquals(
    response?.headers?.["HX-Trigger-After-Settle"],
    '{"my-event":"my-value"}',
  );
});

Deno.test("Respond with trigger after swap", () => {
  const backend = new BackendHTMX(new Headers([["HX-Request", "true"]]));
  const response = backend.trigger({ "my-event": "my-value" }, "afterswap");
  assertEquals(
    response?.headers?.["HX-Trigger-After-Swap"],
    '{"my-event":"my-value"}',
  );
});
