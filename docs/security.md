# Permissions and trust

**Install only deliberately trusted local JavaScript. API 1 is a restricted host-call interface, not a qualified sandbox for hostile code.** The permission list describes supported host operations; it does not prove every JavaScript language/platform escape or denial-of-service path is contained.

## What the host actually checks

| Boundary | Enforced behaviour in the reference host |
| --- | --- |
| Package format | Valid manifest, allowed fields at native registration, text/file/size/path limits, supported API version and known capability vocabulary |
| Installation consent | Folder chooser and trust/permission confirmation before package activation through the normal installation UI |
| Integrity | Optional JavaScript digest verified before activation; no publisher signature |
| Registration authority | Validated manifest identity/permissions retained by the host rather than trusted from plugin-returned metadata |
| Commands | `command:run` required at registration and invocation; stable contribution IDs and validated metadata |
| Document reads | `document:read` controls whether copied summary data is present; context is recursively frozen |
| Parameter writes | `parameters:write` required; only one finite length/angle/scalar action; document host checks the edit again |
| Geometry | `feature:solid` plus `kernel:build`; template schema validated in native code; only supported primitive recipes |
| Replay | No JavaScript callback in the geometry dependency graph; native expression/template expansion |
| Registration consistency | Two fresh activations must describe identical contributions before installation completes |
| Browser command reply | Host waits for the private reply channel and validates the action; Worker is discarded afterwards |
| Browser availability | 3-second Worker watchdog; failure applies no command action |

`actsOn`, the package's display name, a custom icon and the claimed version are **metadata**, not security grants. A claimed `kernel:build` permission does not provide arbitrary native execution. A snapshot feature ID does not allow mutation by ID.

## Staging preview grants

`document:author` plus `kernel:build` permits one author transaction; parameter steps additionally
require `parameters:write` and cannot replace existing names. The host validates all steps and native
references. The browser rejects an author action when document content/boundary generation or package
registration changed during execution. This is not a verified native stale-document guarantee.
`cam:postprocess` permits serializable profile registration, not CAM planning, callback-per-move
execution, arbitrary output files or a machine connection. These grants exist only in the explicitly
listed [staging preview](compatibility.md); the production reference fails closed on them.

## Realm restrictions

The browser uses a disposable Worker. The reviewed Mac implementation uses fresh JavaScriptCore contexts and does not endow them with a native filesystem, document or kernel bridge. Supported communication is plain copied data and the registration/result protocol.

The runner replaces these global properties with unavailable values:

```text
Date, crypto, performance, fetch, XMLHttpRequest, WebSocket, EventSource,
Worker, SharedWorker, importScripts, indexedDB, caches, navigator,
WebAssembly, postMessage, onmessage, close, BroadcastChannel, MessageChannel
```

`Math.random()` throws and `Math` is frozen. This discourages nondeterministic registration and removes several direct ambient APIs. It does **not** constitute a complete JavaScript capability audit. `Function`/JavaScript evaluation is used by the package loader; do not describe this host as a no-eval environment.

The list is an implementation boundary, not a supported plugin API. An API missing from that list is not automatically available or approved. A prototype, dynamic-import or browser global that happens to work is not a supported networking/storage/filesystem channel.

## Limitations that matter

- **No adversarial isolation claim.** The host has not established complete containment of dynamic imports, prototype-reachable platform APIs, storage or cross-context channels. Do not execute arbitrary uploaded code or market it as safe because a manifest requests few permissions.
- **Native execution has no counted budget.** A long or infinite native activation/command can block the host. The native plugin manager invokes the JavaScript synchronously; browser timeout protection is not native protection.
- **Size limits are not compute/memory limits.** A small script can allocate or loop heavily. Feature subdivisions can also produce costly native geometry. No per-plugin heap quota or geometry budget is exposed.
- **Document read is broad within its summary.** A plugin with `document:read` sees all listed feature labels/IDs and named parameter information, not only a current selection. Treat these as potentially sensitive design metadata.
- **Parameter write is broad by name.** There is no per-parameter allowlist, per-edit approval dialog or plugin-owned namespace enforced by the host. A trusted writer can target any permitted named literal parameter. Prefix your names and inspect existing definitions.
- **No signature, publisher identity or automatic update trust chain.** Package IDs are user-supplied identifiers. Integrity is consistency checking, not authenticity.
- **No secret-storage service.** Do not include tokens, passwords or private keys in packages, parameter names/values or transient messages. Installed files are copied to local application/browser storage, not encrypted secret storage.
- **No filesystem/network/machine contract.** Installation reads only the chosen folder through host UI. Packages have no supported arbitrary file access, network calls, machine control or service API. This is a supported-interface statement, not proof against every escape from trusted JavaScript.

## Guidance for authors and users

Read the code of small plugins, request the smallest capability set, install from a trusted distribution and keep a copy of the exact package version used by a project. A read-only report should not request parameter or geometry permissions. Feature-only packages need no command or document-read permissions.

Author deterministic, bounded functions; validate units and resolution state; avoid mutable globals and hidden side effects. Never copy secrets into an example or use a live machine/controller to validate a documentation sample. A preview postprocessor is not certification of safe manufacturing output.

If your product must accept untrusted third-party code, this runner is not a sufficient security design. That requires a separate, explicitly qualified isolation and resource-control boundary rather than additional manifest wording.
