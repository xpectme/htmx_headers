# HTMX Middleware

This is a environment-agnostic backend for [HTMX](https://htmx.org/). It simply
generates the HTMX response headers and provides a state object that contains
information about the HTMX request.

## Usage

```ts
import { HXHeaders } from "https://deno.land/x/backend_htmx/main.ts";

const hx = new HXHeaders({ "HX-Request": "true" });
console.log(hx.isHTMX); // true

const res = hx.location("/new/url");
console.log(res.headers); // { "HX-Location": "/new/url" }
```

## `hx` properties

### `hx.isHTMX`

A boolean that is `true` if the request is an HTMX request.

### `hx.boosted`

Indicates that the request is via an element using hx-boost

### `hx.historyRestoreRequest`

`true` if the request is for history restoration after a miss in the local
history cache

### `hx.currentUrl`

The current URL of the browser

### `hx.prompt`

The user response to a `HX-Prompt` header

### `hx.targetId`

The ID of the element that is the target of the request

### `hx.triggerId`

The ID of the element that triggered the request

### `hx.triggerName`

The name of the element that triggered the request

## `hx` methods

### `hx.location(hxLocation: string | Partial<HTMXLocation>)`

The `HX-Location` header is used to tell the client to navigate to a new URL.

```ts
const httpRes = hx.location("/new/url");
// => { headers: { "HX-Location": "/new/url" } }
```

### `hx.pushUrl(hxPushUrl: string)`

The `HX-Push-Url` header is used to tell the client to push a new URL to the
history stack.

```ts
const httpRes = hx.pushUrl("/new/url");
// => { headers: { "HX-Push-Url": "/new/url" } }
```

### `hx.replaceUrl(hxReplaceUrl: string)`

The `HX-Replace-URL` header is used to tell the client to replace the current
URL in the history stack.

```ts
const httpRes = hx.replaceUrl("/new/url");
// => { headers: { "HX-Replace-URL": "/new/url" } }
```

### `hx.redirect(hxRedirect: string)`

The `HX-Redirect` header is used to tell the client to redirect to a new URL.

```ts
const httpRes = hx.redirect("/new/url");
// => { headers: { "HX-Redirect": "/new/url" } }
```

If `isHTMX` is `false` the `HX-Redirect` header will be ignored and the client
will be redirected to the new URL.

```ts
const hx = new HXHeaders({});
const httpRes = hx.redirect("/new/url");
// => { status: 303, headers: { Location: "/new/url" } }
```

The second parameter `handleHttpRedirect` can be toggled to `false` to disable
the automatic redirect.

```ts
const hx = new HXHeaders({});
const httpRes = hx.redirect("/new/url", false);
// => undefined
```

### `hx.refresh(hxRefresh: string)`

The `HX-Refresh` header is used to tell the client to refresh the current page.

```ts
const httpRes = hx.refresh();
// => { headers: { "HX-Refresh": "true" } }
```

### `hx.reswap(...modifiers: HTMXSwapModifiers)`

Allows you to specify how the response will be swapped. See hx-swap for possible
values

See [HX-Reswap](https://htmx.org/reference/#response_headers) for more
information.

```ts
const httpRes = hx.reswap("innerHTML");
// => { headers: { "HX-Reswap": "innerHTML" } }
```

### `hx.retarget(selector: string)`

A CSS selector that updates the target of the content update to a different
element on the page.

See [HX-Retarget](https://htmx.org/reference/#response_headers) for more
information.

```ts
const httpRes = hx.retarget("#my-element");
// => { headers: { "HX-Retarget": "#my-element" } }
```

### `hx.trigger(event: string, mode: "aftersettle" | "afterswap" | null = null)`

The `HX-Trigger` header is used to tell the client to trigger an event on the
current page.

Trigger an event on the current page.

```ts
const httpRes = hx.trigger({ "my-event": "my message" });
// => { headers: { "HX-Trigger": '{"my-event": "my message"}' } }
```

Trigger an event on the current page after the page has settled.

```ts
const httpRes = hx.trigger({ "my-event": "my message" }, "afterswap");
// => { headers: { "HX-Trigger-After-Swap": '{"my-event": "my message"}' } }
```

Trigger an event on the current page after the page has settled.

```ts
const httpRes = hx.trigger({ "my-event": "my message" }, "aftersettle");
// => { headers: { "HX-Trigger-After-Settle": '{"my-event": "my message"}' } }
```

## License

BSD-2

## Author

- [Mario Stöcklein](https://github.com/mstoecklein)
