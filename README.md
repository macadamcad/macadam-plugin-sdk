# Macadam Plugin SDK

Write a local JavaScript package that adds commands or editable parametric solids to [Macadam](https://macadamcad.com). This repository contains the complete **shipping local package API 1** contract, examples and authoring guides. You do not need access to Macadam's application source or a second geometry engine.

**The current plugin API is deliberately small.** Your entry receives a registration host with two methods: `registerCommand` and `registerFeature`. A command can read a limited document summary and return a message or one numeric parameter change. A feature is a declarative template for one supported solid primitive. Plugins do **not** receive the application's `macadam` object, live geometry, selection, a kernel, arbitrary panels, or general modelling commands. See [what you can build](docs/capabilities.md) before choosing this API.

## Start here

1. [Build and install your first command](docs/getting-started.md) — two text files, no npm or compiler.
2. [Add an editable solid](docs/feature-authoring.md) — parameters, expressions, all primitive kinds and saved-document behaviour.
3. [Read document parameters and return an action](docs/command-authoring.md).
4. [Understand permissions and trust](docs/security.md) before installing or distributing code.

[Documentation index](docs/README.md) · [Complete API reference](docs/api-reference.md) · [TypeScript declarations](types/local-plugin-api.d.ts) · [Troubleshooting](docs/troubleshooting.md)

## What ships

| Interface | Availability |
| --- | --- |
| Package API 1, commands and primitive feature templates | Documented shipping browser contract; reference snapshot `6058b429cf76544752374a7253036ba5187b665b`. The reviewed Mac host implements the same package contract; see [platform limits](docs/platforms-and-lifecycle.md). |
| Postprocessor definition API 2 | **Unshipped preview.** Kept under [preview/](preview/README.md); requires a host that explicitly supports it. |
| Arbitrary geometry callbacks, sketches, booleans, CAM operations, panels, files or networking | **Not exposed to API 1 packages.** Broader editor scripting is a different execution surface. |

`apiVersion` is a protocol identifier, not the application version. Installing a package that requests more permissions does not enable an unimplemented API.

## Examples you can copy

Install an individual example folder using **Settings → Plugins → Install Folder…**; the Mac app also has a Plugins menu. Extract a ZIP before selecting the folder.

| Example | Teaches | Result |
| --- | --- | --- |
| [hello-command](samples/hello-command) | Smallest package and synchronous command | Greeting in the app |
| [document-report](samples/document-report) | Package-local modules and document summary | Counts and a 2 mm allowance command |
| [parametric-stock](samples/parametric-stock) | Expression-preserving feature template | Editable oversize box |
| [parametric-spacer](samples/parametric-spacer) | Geometry, units, placement and rotation | Editable cylinder; no implicit hole or boolean |
| [machining-allowance](samples/machining-allowance) | Safe, CAM-adjacent parameter workflow | Validated allowance/report commands; **no toolpath creation** |

These examples received source review for this documentation update. **They were not executed as part of this update.** Follow the [conformance checklist](docs/conformance-checklist.md) on your target app release before distributing a plugin.

## Distribution and trust

Distribute a folder of UTF-8 text containing `plugin.json` and JavaScript. Macadam copies the selected files; editing the original folder does not update the installed copy. Reinstall the edited folder to update it. Installation is local to the browser origin/profile or Mac user, not synced with documents.

The runner checks host capabilities, copies data and restricts several ambient APIs. **It is not a security boundary for hostile JavaScript. Install code only from authors you trust.** See the [exact enforced checks and limitations](docs/security.md), including the absence of a counted native execution budget.

Public postprocessor projects: [GRBL / LinuxCNC](https://github.com/macadamcad/post-grbl-linuxcnc) and [RepRapFirmware](https://github.com/macadamcad/post-reprapfirmware). They document preview controller profiles; public availability does not make them installable in the shipping API 1 host.

[MIT license](LICENSE) · [Release and review scope](PROVENANCE.json)
