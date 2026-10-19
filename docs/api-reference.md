# Local package API 1 reference

The authoring contract is [types/local-plugin-api.d.ts](../types/local-plugin-api.d.ts). It is the implemented local-package excerpt from the pinned Macadam source. Planned general builder declarations are deliberately excluded. This repository supplies declarations and examples; Macadam supplies execution and validation.

## Package

A package is a UTF-8 folder with `plugin.json`, a JavaScript entry, and optional local JavaScript/SVG/text files. Install the package folder itself. ZIP files must be extracted first.

```json
{
  "id": "com.example.hello",
  "name": "Hello Plugin",
  "version": "1.0.0",
  "apiVersion": "1",
  "entry": "index.js",
  "capabilities": ["command:run"]
}
```

| Field | Contract |
| --- | --- |
| `id` | Reverse DNS identifier matching `^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$` |
| `name` | Nonblank, 1–100 characters |
| `version` | Three numeric components, optionally a prerelease suffix; for example `1.0.0` or `1.0.0-alpha.1` |
| `apiVersion` | Package host protocol string `"1"` |
| `entry` | Included `.js` file; at most 256 KiB |
| `capabilities` | Unique entries from the supported vocabulary below; unknown entries fail |
| `icon` | Optional path to an included `.svg` |
| `integrity` | Optional `sha256-` followed by 64 lowercase hexadecimal characters |

At most 64 files and 4 MiB of UTF-8 text are supported. Paths have at most 180 characters, use `/`, are relative, and contain segments matching `[a-zA-Z0-9_][a-zA-Z0-9_.-]*`. Parent traversal and backslashes are rejected. Folder readers exclude hidden metadata. Binary files, including custom WASM, are unsupported.

## Lifecycle and modules

The entry defines `activate(host)`, exports it as `module.exports.activate`, or exports the function directly. Macadam invokes it to register contributions. Registration closes after activation returns; register synchronously. Each command invocation uses a fresh activation. Do not use retained mutable state for persistence. There is no public deactivation callback.

`require('./lib/helper.js')` supports package-local CommonJS modules with explicit `.js` extensions, including normalized `./` and `../` paths that remain inside the package. Bare names, URLs, absolute paths, missing modules, escapes and dependency cycles fail. ES module imports and npm module resolution are unsupported. A folder can be authored without any npm project or build step.

The host's `apiVersion` is `"1"`. It provides `registerCommand` and `registerFeature` for this shipping contract. Plugins do not receive the editor's `macadam` object.

## Capabilities

| Capability | Effect |
| --- | --- |
| `command:run` | Register and run commands |
| `document:read` | Receive a copied document snapshot when a command runs |
| `parameters:write` | Return a numeric named-parameter action |
| `feature:solid` and `kernel:build` | Both are required to register a declarative solid primitive template |

Permissions are host-owned. Listing `kernel:build` does not expose a kernel object or enable arbitrary JavaScript geometry evaluation. `cam:postprocess` belongs to the [unshipped preview](../preview/README.md); API 1 shipping packages reject it.

## Commands

`registerCommand(command)` accepts `id`, `name`, `run(context)` and optional palette metadata:

| Field | Meaning |
| --- | --- |
| `id` | Stable identifier matching `^[a-z][a-zA-Z0-9_-]{0,63}$`; unique among this package's commands |
| `name` | Nonblank display name |
| `icon` | Shared palette icon name; defaults to `plugin` |
| `shortcut` | Optional portable spelling such as `shift+cmd+r`; modifiers are `ctrl`, `alt`, `shift`, `cmd`, and keys are a lowercase letter, digit, `return` or `space` |
| `actsOn` | Palette ranking hint: `none`, `edge`, `face`, `loop`, `body`, `sketch` or `profile`; defaults to `none` |
| `run` | Synchronous callback returning exactly one action |

`actsOn` does not provide a selection object. Custom UI, direct selection access and arbitrary editor mutations are outside this contract.

With `document:read`, `context.document` contains copied `features` (`id`, `name`, `kind`) and `parameters` (`name`, `kind`, numeric `value`, `resolved`). The context is frozen. Without that capability the context has no document property. Feature IDs are identifiers, not native object handles.

| Returned action | Required values |
| --- | --- |
| `{ type: 'message', text }` | A string of at most 8192 JavaScript characters |
| `{ type: 'setParameter', name, kind, value }` | Nonblank parameter name; kind `length`, `angle` or `scalar`; finite numeric value; requires `parameters:write` |

Command parameter actions use canonical SI values: **metres** for length, **radians** for angle, and unitless scalars. The host applies the action through its normal document mutation and undo path. Commands cannot return an action array, promise, live object or arbitrary executable host call.

## Solid feature templates

`registerFeature(feature)` requires both solid capabilities. The supported feature has `id`, `name`, `surface: 'solid'`, `params` and `template`. An `evaluate` callback is rejected.

Each parameter descriptor has only `kind`, `label`, and `default`. Supported kinds are `length`, `angle`, `scalar`, `count`. Defaults are expression strings, for example `100mm`. IDs use the same stable local identifier grammar as commands. The numeric descriptors drive the existing inspector.

`template.primitive` contains a native primitive `kind`, a `dims` expression map, and `dx`, `dy`, `dz` expressions. Rotation expressions `rx`, `ry`, `rz` and `anchor` are optional. The host validates the native primitive and its exact dimension keys. Start from the demonstrated `box` recipe with `width`, `depth`, `height`; the declaration's broad string fields are not a guarantee that any arbitrary primitive or dimension exists.

`${parameter}` expands to the stored expression wrapped in parentheses. For example `${width} + 2 * ${allowance}` preserves editable expressions. Expansion and native evaluation occur through Macadam's shared feature engine, without plugin callbacks in the dependency graph. The document persists plugin identity, required version and authored parameters; installing a package is separate local application state.

## Editor invocation

Registered commands appear under Plugins and in the shared command palette. Their palette IDs are `plugin.<package-id>.command.<command-id>`. Registered features contribute **Add <feature name>**, with palette IDs `plugin.<package-id>.feature.<feature-id>`. Optional command metadata is consumed by that shared palette.

An editor console script, outside the plugin realm, can create an already installed template with:

```js
macadam.plugins.createFeature('com.macadam.examples.stock', 'stock');
```

That is an editor API call, not a method available to plugin code. Package installation should use **Install Folder…**, which validates the source and permissions.

## Integrity

For a package containing exactly one `.js` file, SHA-256 hashes the entry's UTF-8 bytes. For multiple `.js` files, sort their package paths lexically, then concatenate one record per file:

```text
<path UTF-8 byte count>\n<path><source UTF-8 byte count>\n<source>
```

Hash that concatenation with no extra separators. The manifest value is `sha256-<lowercase hex>`. Non-JavaScript assets are outside this digest. Changing source requires updating or removing the optional digest before reinstalling. The copied report and stock examples preserve their original source and digest.

## Trust boundary

Install deliberately trusted local code. The browser runs packages in a disposable Worker; the Mac source uses fresh JavaScriptCore contexts. Host-owned permissions, immutable copied snapshots and validated actions limit host calls. Ambient APIs such as network access, timing, randomness and WebAssembly are restricted.

This is not a claim of hostile-code isolation. Complete isolation of dynamic imports, storage and cross-context channels, plus a counted native execution budget, remain unqualified. Do not rely on this API to safely execute arbitrary untrusted JavaScript. Packages have no supported filesystem, machine-control, networking or live document/kernel access.
