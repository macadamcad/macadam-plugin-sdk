# Troubleshooting

Start with the package name/version listed in Plugins, the exact folder selected and the visible error. The following text reflects the reference implementation; message wording and UI presentation are not a stable machine-readable API.

| Symptom or error | Meaning | Correction |
| --- | --- | --- |
| `plugin.json is missing or invalid JSON` | Wrong selected folder, filename or malformed JSON | Choose the folder that directly contains the manifest; remove comments/trailing commas from JSON |
| `id must be reverse DNS` | Invalid package ID | Use `com.example.my-plugin`; local command/feature IDs have a different grammar |
| `unsupported API version` | Wrong type/value/protocol | Package manifest must use string `"1"` |
| `unknown or duplicate capability` | Requested permission not in the closed API 1 set | Remove duplicates; `cam:postprocess` and `document:author` require the documented staging preview |
| `unsupported field ...` | Extra manifest/definition/template fields | Use only the documented schema; `dependencies`, arbitrary permissions and custom builder keys are not accepted |
| `entry must name an included JavaScript file` | Wrong path/case/extension | Include the `.js` entry under the exact manifest path |
| Folder exceeds 64 files / 4 MiB | Wrong folder or oversized package | Remove generated files, binaries, node_modules and irrelevant documents from the distribution folder |
| Invalid UTF-8 file | Binary or wrongly encoded text in package | Save text as UTF-8; use SVG rather than binary artwork |
| Unsafe path / symbolic links | Package path escapes or invalid filename/symlink | Use safe relative text files; no symlinks; no hidden required modules |
| `Plugin source integrity mismatch` | JavaScript/path/newline bytes changed | Recompute the exact documented digest or remove the optional field for development |
| `Entry must define activate(host)` | No supported export | Define `function activate(host)` or CommonJS `module.exports.activate`/function export |
| Syntax error near `import`/`export` | ES module source given to script loader | Use CommonJS package-local `require` or distribute a compliant bundle |
| `module not found` / `escapes the package` / `module cycle` | Unsupported module path or dependency graph | Include explicit `.js` local paths; keep them in-package and acyclic |
| `requires command:run` / other capability | Attempted host operation lacks permission | Request the minimum correct capability in manifest, then reinstall |
| `Registration is closed` | Contribution added after activation | Register synchronously inside `activate`, not after a timer/Promise |
| `Duplicate registration ...` | Same local ID registered twice in one registry | Use stable unique command IDs and feature IDs |
| `Plugin registration is not deterministic` | Two activations described different contributions | Remove random/time/environment-dependent registration and mutable cross-invocation assumptions |
| `A command must return one message or setParameter action` | Wrong result shape, `Promise`, array or no return | Return one synchronous plain-data action exactly as documented |
| `setParameter requires ... a finite canonical value` | Invalid name/kind/number | Length/angle/scalar only; numeric metres/radians; reject `NaN`/infinity |
| Formula-defined parameter refuses a write | Literal setter would destroy authored formula intent | Preserve it; report the issue and let the user change its definition in Parameters |
| `Plugin did not finish. No command action was applied.` | Browser activation/execution exceeded watchdog | Remove loops/heavy work; no asynchronous computation protocol exists |
| `macadam is not defined` / missing `window`, `fetch`, `engine` | Broader editor/platform APIs are not plugin capabilities | Redesign around host registration and result actions; do not reach through private globals |
| `evaluate callbacks are not supported` | Tried to supply a JS geometry evaluator | Use a declarative primitive template; arbitrary modelling callbacks are unavailable |
| `primitive ... requires dimensions ...` | Wrong/missing `dims` keys | Use the exact [catalogue](primitive-catalogue.md); e.g. box needs width/depth/height |
| Geometry is unavailable after update/reopen | Missing package, feature ID or exact saved version | Install the original required package/version; do not relabel a different implementation |
| Edited source is ignored after Reload | Reload uses installed copy | Install the edited folder again |
| Plugin exists on staging but not production/Mac | Install state is local to each origin/profile/app | Install the trusted folder separately on each target |

## Installed but not visible

Open Settings → Plugins. If the package is listed, use its command/**Add …** buttons or search its contribution name in the command palette. `actsOn` is a ranking hint; do not expect it to create a toolbar or custom panel. A custom icon string may be syntactically valid but not correspond to a known host icon; remove it to use the default `plugin` glyph.

If a browser cannot select folders, check that browser's directory-selection support. The SDK has no remote-install URL or file-drop replacement protocol. Native Windows/Linux plugin management is not established by the browser API.

## Geometry has the wrong size or position

Check units first: command length values are **metres**; feature expressions should include units such as `'20mm'`. Counts are unitless, not length expressions. `cube.radius` is a circumradius, not its side length. The torus has tube and ring radii. `anchor: 'base'` and `'center'` position different points.

Confirm exact dimension keys, valid positive dimensions and expression resolution. Inspect the actual rendered/evaluated result; successful registration alone proves no geometry dimensions. The reference host can fall back to zero on invalid placement/rotation expressions, so malformed displacement input can look like an unexplained origin placement.

## Staging authoring failures

| Failure | Correction |
| --- | --- |
| `parameter step requires parameters:write` | Add the capability and reinstall; author grants alone do not authorize parameter creation. |
| `parameter ... already exists` | Use fresh names or an empty document; parameter steps are create-only. |
| `... no feature factory` | A palette command is not necessarily authorable; use only published factory schemas. |
| `... not an active reflected field` | Match the documented variant's schema; UI labels are not necessarily keys. |
| `unknown/forward local feature` or scope refusal | Put producers first; use local keys and container paths, not document UUIDs. |
| `Document changed while the plugin planned its authoring action` | Rerun against the current document; the browser did not apply the stale program. |

See [the complete example and discovery limits](authoring.md). Native parity is unqualified.

## Report a host/API gap

Include the smallest package folder, its manifest/version, exact app/browser version, target platform, steps, expected result and actual visible error. Remove private design names, tokens and credentials. Distinguish installation failure, callback failure, a rejected document action and native geometry failure. Do not describe an unsupported capability as working based on a private source module or a console-only API.
