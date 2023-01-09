export interface HXHeaderLocation {
  path: string;
  source?: string;
  event?: string;
  target?: string;
  swap?: string;
  values?: string;
  headers?: string;
}

export interface HXHeaderRequestInfo {
  boosted: boolean;
  historyRestoreRequest: boolean;
  currentUrl: string | null;
  prompt: string | null;
  targetId: string | null;
  triggerId: string | null;
  triggerName: string | null;
}

export type HXSwapBaseModifiers =
  | "outerHTML"
  | "innerHTML"
  | "beforebegin"
  | "afterbegin"
  | "beforeend"
  | "afterend"
  | "delete"
  | "none";

export type HXSwapTimingModifier =
  | `swap:${number}${"ms" | "s" | "m"}`
  | `settle:${number}${"ms" | "s" | "m"}`;
export type HXSwapScrollingModifier =
  | `scroll:${"top" | "bottom" | string}`
  | `show:${"top" | "bottom" | string}`
  | `focus-scroll:${boolean}`;

export type HXSwapModifiers =
  | HXSwapBaseModifiers
  | HXSwapTimingModifier
  | HXSwapScrollingModifier;

export type HTTPHeaders = Headers | Record<string, string> | [string, string][];

export class HXHeaders {
  #state: HXHeaderRequestInfo | null = null;
  #responseHeaders!: HTTPHeaders;
  get responseHeaders() {
    return this.#responseHeaders;
  }

  get boosted() {
    return this.#state?.boosted;
  }
  get historyRestoreRequest() {
    return this.#state?.historyRestoreRequest;
  }
  get currentUrl() {
    return this.#state?.currentUrl;
  }
  get prompt() {
    return this.#state?.prompt;
  }
  get targetId() {
    return this.#state?.targetId;
  }
  get triggerId() {
    return this.#state?.triggerId;
  }
  get triggerName() {
    return this.#state?.triggerName;
  }

  get state() {
    return this.#state;
  }

  #isHTMX = false;
  get isHTMX() {
    return this.#isHTMX;
  }

  constructor(reqHeaders?: HTTPHeaders, resHeaders?: HTTPHeaders) {
    if (reqHeaders) {
      this.setRequestHeaders(reqHeaders);
    }
    if (resHeaders) {
      this.setResponseHeaders(resHeaders);
    }
  }

  setRequestHeaders(reqHeaders: HTTPHeaders) {
    reqHeaders = new Headers(reqHeaders);
    this.#isHTMX = reqHeaders.get("HX-Request") === "true";
    if (this.#isHTMX) {
      this.#state = {
        boosted: reqHeaders.get("HX-Boosted") === "true",
        historyRestoreRequest:
          reqHeaders.get("HX-History-Restore-Request") === "true",
        currentUrl: reqHeaders.get("HX-Current-URL"),
        prompt: reqHeaders.get("HX-Prompt"),
        targetId: reqHeaders.get("HX-Target"),
        triggerName: reqHeaders.get("HX-Trigger-Name"),
        triggerId: reqHeaders.get("HX-Trigger"),
      };
    }
  }

  setResponseHeaders(resHeaders: HTTPHeaders) {
    this.#responseHeaders = resHeaders;
  }

  /**
   * This response header can be used to trigger a client side redirection without reloading
   * the whole page. Instead of changing the page's location it will act like following a
   * hx-boost link, creating a new history entry, issuing an ajax request to the value of the
   * header and pushing the path into history.
   *
   * A sample response would be:
   *
   * ```
   * HX-Location: /test
   * ```
   *
   * Which would push the client to test as if the user had clicked on
   * `<a href="/test" hx-boost="true">`
   *
   * If you want to redirect to a specific target on the page rather
   * than the default of document.body, you can pass more details along
   * with the event, by using JSON for the value of the header:
   *
   * ```
   * HX-Location: {"path":"/test2", "target":"#testdiv"}
   * ```
   *
   * Path is required and is url to load the response from. The rest of the data mirrors the
   * ajax api context, which is:
   * - source - the source element of the request
   * - event - an event that "triggered" the request
   * - handler - a callback that will handle the response HTML
   * - target - the target to swap the response into
   * - swap - how the response will be swapped in relative to the target
   * - values - values to submit with the request
   * - headers - headers to submit with the request
   * @see https://htmx.org/headers/hx-location/
   */
  location(value: HXHeaderLocation | string) {
    if (this.#isHTMX) {
      if (typeof value === "object" && value !== null) {
        // convert the object into a map
        const map = new Map<string, string>(Object.entries(value));
        if (!map.has("path")) {
          throw new Error("path is required");
        }
        if (map.size === 1 && map.has("path")) {
          // only path is provided
          value = map.get("path")!;
        }
      }
      this.insertIntoResponeHeaders("HX-Location", value);
    }
  }

  /**
   * The HX-Push-Url header allows you to push a URL into the browser location history. This
   * creates a new history entry, allowing navigation with the browser’s back and forward
   * buttons. This is similar to the hx-push-url attribute.
   *
   * If present, this header overrides any behavior defined with attributes.
   *
   * The possible values for this header are:
   *
   * 1. A URL to be pushed into the location bar. This may be relative or absolute,
   *    as per history.pushState().
   * 2. false, which prevents the browser’s history from being updated.
   * @see https://htmx.org/headers/hx-push-url/
   */
  pushUrl(url: string | false) {
    if (this.#isHTMX) {
      this.insertIntoResponeHeaders("HX-Push-Url", url ? url : "false");
    }
  }

  /**
   * The HX-Replace-Url header allows you to replace the current URL in the browser location
   * history. This does not create a new history entry; in effect, it removes the previous
   * current URL from the browser’s history. This is similar to the hx-replace-url attribute.
   * If present, this header overrides any behavior defined with attributes.
   *
   * The possible values for this header are:
   * 1. A URL to replace the current URL in the location bar. This may be relative or absolute,
   * as per history.replaceState(), but must have the same origin as the current URL.
   * 2. false, which prevents the browser’s current URL from being updated.
   *
   * @see https://htmx.org/headers/hx-replace-url/
   */
  replaceUrl(url: string | false) {
    if (this.#isHTMX) {
      this.insertIntoResponeHeaders("HX-Replace-Url", url ? url : "false");
    }
  }

  /**
   * Can be used to do a client-side redirect to a new location
   * @see https://htmx.org/reference/#response_headers
   */
  redirect(url: string) {
    if (this.#isHTMX) {
      this.insertIntoResponeHeaders("HX-Redirect", url);
    }
  }

  /**
   * If set to "true" the client side will do a a full refresh of the page.
   * @see https://htmx.org/reference/#response_headers
   */
  refresh() {
    if (this.#isHTMX) {
      this.insertIntoResponeHeaders("HX-Refresh", "true");
    }
  }

  /**
   * Allows you to specify how the response will be swapped.
   * See hx-swap for possible values.
   * @see https://htmx.org/attributes/hx-swap/
   */
  reswap(...modifiers: Array<HXSwapModifiers>) {
    if (this.#isHTMX) {
      const modifiersSet = new Set<HXSwapModifiers>(modifiers);
      this.insertIntoResponeHeaders("HX-Reswap", [...modifiersSet].join(" "));
    }
  }

  /**
   * A CSS selector that updates the target of the content update to a different
   * element on the page.
   * @see https://htmx.org/reference/#response_headers
   */
  retarget(selector: string) {
    if (this.#isHTMX) {
      this.insertIntoResponeHeaders("HX-Retarget", selector);
    }
  }

  /**
   * The HX-Trigger header allows you to trigger events on the client side after the response
   * has been processed. This is similar to the hx-trigger attribute.
   * @see https://htmx.org/reference/#response_headers
   * @see https://htmx.org/headers/hx-trigger/
   */
  trigger(
    events: Record<string, unknown>,
    mode: "aftersettle" | "afterswap" | null = null,
  ) {
    if (this.#isHTMX) {
      let header = "HX-Trigger";
      switch (mode?.toLowerCase()) {
        case "aftersettle":
          header = "HX-Trigger-After-Settle";
          break;
        case "afterswap":
          header = "HX-Trigger-After-Swap";
          break;
      }
      this.insertIntoResponeHeaders(header, events);
    }
  }

  /**
   * Sets the response header.
   */
  insertIntoResponeHeaders(header: string, value: unknown) {
    const headerValue = typeof value === "string"
      ? value
      : JSON.stringify(value);
    if (this.#responseHeaders instanceof Headers) {
      this.#responseHeaders.set(header, headerValue);
    } else if (Array.isArray(this.#responseHeaders)) {
      this.#responseHeaders.push([header, headerValue]);
    } else {
      this.#responseHeaders[header] = headerValue;
    }
  }
}
