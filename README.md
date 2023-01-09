# HTMX Request/Response Headers

This is a environment-agnostic backend for [HTMX](https://htmx.org/). It simply
generates the HTMX response headers and provides a state object that contains
information about the HTMX request.

## Usage

```ts
import { HXHeaders } from "https://deno.land/x/backend_htmx/main.ts";

const reqHeaders = { "HX-Request": "true" };
const resHeaders = {};

const hx = new HXHeaders(reqHeaders, resHeaders);
console.log(hx.isHTMX); // true

hx.location("/new/url");
console.log(resHeaders); // { "HX-Location": "/new/url" }
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
hx.location("/new/url");
// => { "HX-Location": "/new/url" }
```

### `hx.pushUrl(hxPushUrl: string)`

The `HX-Push-Url` header is used to tell the client to push a new URL to the
history stack.

```ts
hx.pushUrl("/new/url");
// => { "HX-Push-Url": "/new/url" }
```

### `hx.replaceUrl(hxReplaceUrl: string)`

The `HX-Replace-URL` header is used to tell the client to replace the current
URL in the history stack.

```ts
hx.replaceUrl("/new/url");
// => { "HX-Replace-URL": "/new/url" }
```

### `hx.redirect(hxRedirect: string)`

The `HX-Redirect` header is used to tell the client to redirect to a new URL.

```ts
hx.redirect("/new/url");
// => { "HX-Redirect": "/new/url" }
```

### `hx.refresh(hxRefresh: string)`

The `HX-Refresh` header is used to tell the client to refresh the current page.

```ts
hx.refresh();
// => { "HX-Refresh": "true" }
```

### `hx.reswap(...modifiers: HTMXSwapModifiers)`

Allows you to specify how the response will be swapped. See hx-swap for possible
values

See [HX-Reswap](https://htmx.org/reference/#response_headers) for more
information.

```ts
hx.reswap("innerHTML");
// => { "HX-Reswap": "innerHTML" }
```

### `hx.retarget(selector: string)`

A CSS selector that updates the target of the content update to a different
element on the page.

See [HX-Retarget](https://htmx.org/reference/#response_headers) for more
information.

```ts
hx.retarget("#my-element");
// => { "HX-Retarget": "#my-element" }
```

### `hx.trigger(event: string, mode: "aftersettle" | "afterswap" | null = null)`

The `HX-Trigger` header is used to tell the client to trigger an event on the
current page.

Trigger an event on the current page.

```ts
hx.trigger({ "my-event": "my message" });
// => { "HX-Trigger": '{"my-event": "my message"}' }
```

Trigger an event on the current page after the page has settled.

```ts
hx.trigger({ "my-event": "my message" }, "afterswap");
// => { "HX-Trigger-After-Swap": '{"my-event": "my message"}' }
```

Trigger an event on the current page after the page has settled.

```ts
hx.trigger({ "my-event": "my message" }, "aftersettle");
// => { "HX-Trigger-After-Settle": '{"my-event": "my message"}' }
```

## License

BSD-2

## Author

- [Mario Stöcklein](https://github.com/mstoecklein)
