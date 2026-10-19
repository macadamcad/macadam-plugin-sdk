# Macadam Plugin SDK

Documentation, TypeScript declarations and local JavaScript plugin examples for [Macadam](https://macadamcad.com).

This is an authoring kit. Macadam supplies the plugin host; there is no SDK runtime, package installation step, build dependency or second geometry engine.

| Surface | Status in this SDK |
| --- | --- |
| Local package API 1: commands and declarative solid templates | Shipping browser contract, pinned to `9b02ab40176298e97382880b466b764e91713809`; shared Mac/web source contract |
| Postprocessor definition API 2 | **Preview, not shipped in that browser release.** Separate [preview documentation](preview/README.md) and declarations |
| JavaScript geometry evaluators, builder callbacks, custom panels, sketch/CAM feature builders | Not part of the supported local API 1 contract |

Start with [Getting started](docs/getting-started.md), then the [API reference](docs/api-reference.md). [Compatibility](docs/compatibility.md) records the release boundary and limitations. Exact extraction sources are in [PROVENANCE.json](PROVENANCE.json).

## Examples

Choose **Plugins → Install Folder…** in Macadam and select one example folder, after extracting the repository download if necessary.

| Folder | Contribution | Permissions |
| --- | --- | --- |
| [hello-command](samples/hello-command) | A command that displays a greeting | `command:run` |
| [document-report](samples/document-report) | Document summary and a command setting a 2 mm named allowance | `command:run`, `document:read`, `parameters:write` |
| [parametric-stock](samples/parametric-stock) | Editable stock feature, initially 104 × 64 × 22 mm | `feature:solid`, `kernel:build` |

The last two packages preserve the shipping example JavaScript, manifests and icons byte for byte. The greeting and preview examples are newly authored against the pinned contracts. This publication received source review; no new runtime qualification is implied.

Canonical public postprocessor examples are [GRBL / LinuxCNC](https://github.com/macadamcad/post-grbl-linuxcnc) and [RepRapFirmware](https://github.com/macadamcad/post-reprapfirmware). Their public availability does not mean API 2 is supported in the shipping browser.

Install code from authors you trust. The current local plugin runner has capability checks but has not been qualified as an adversarial JavaScript sandbox. See [the trust boundary](docs/api-reference.md#trust-boundary).

[MIT license](LICENSE).
