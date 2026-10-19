# Postprocessor API 2 preview

**Not supported in shipping browser `9b02ab40176298e97382880b466b764e91713809`.** Core integration is pinned to unmerged source `69b2514d5c7b569f68ec280e3d1855a7af5cf19b`. Matching browser WASM, native integration and all-platform packaging are not qualified by this SDK. Do not follow the API 1 installation guide expecting these packages to work in that release.

The canonical public packages are:

| Repository | Public main revision at this snapshot |
| --- | --- |
| [GRBL / LinuxCNC](https://github.com/macadamcad/post-grbl-linuxcnc) | [`809bc5bc739d87f6ee3458b265fec4e2c4e0a450`](https://github.com/macadamcad/post-grbl-linuxcnc/tree/809bc5bc739d87f6ee3458b265fec4e2c4e0a450) |
| [RepRapFirmware](https://github.com/macadamcad/post-reprapfirmware) | [`c3ec1f73edd625ff9805204a2cd3e1e7d0728986`](https://github.com/macadamcad/post-reprapfirmware/tree/c3ec1f73edd625ff9805204a2cd3e1e7d0728986) |

Those public revision references were supplied by the release coordinator. The declarations here were extracted from the pinned core source, not independently compared with those public trees. [PROVENANCE.json](../PROVENANCE.json) records both facts.

## Authoring contract

[postprocessor-api.d.ts](types/postprocessor-api.d.ts) is the exact MIT public contract extracted from the preview source. A package still declares package `apiVersion: '1'`; it requests the additional preview capability `cam:postprocess`. During `activate(host)`, it calls `host.registerPostProcessor(definition)`. Each definition declares postprocessor `apiVersion: '2'`.

A definition is serializable controller data: identity, extension, MIME type, declared capabilities and typed event templates. It is not a callback per move. The Macadam host owns prepared operations, semantic events, validation, numeric formatting and final export. JavaScript constructs/registers the data once and does not run inside export.

| Contract | Meaning |
| --- | --- |
| `PostEventProfile` | Units, axes, arc support, tool-change policy and event blocks |
| `PostEventToken` | Literal text or a typed value with precision/prefix/suffix; labels are confined to escaped comments |
| `PostProgramEvent` | The semantic event stream described by the shared host contract; not a new plugin callback API |
| `PostExportConfiguration` | Export selection/settings; large tool slot numbers cross JSON as canonical decimal strings |
| `PostprocessorHost` | Registration host with `apiVersion: '1'` and `registerPostProcessor` |

Preview post event positions, offsets, clearances and feeds use **millimetres and millimetres per minute**. Rotary angles use degrees. This differs from local command parameter actions, whose length/angle values use metres/radians. A profile's `units` selects the formatter's output conversion; do not preconvert input events. A tool slot is an integer identity, never a floating-point coordinate.

Required event keys are `programStart`, `operationStart`, `operationEnd`, `rapid`, `linear`, `retractRapid`, `retractFeed`, and `programEnd`. Additional declared capabilities require their matching templates. Motion templates must serialize every X/Y/Z value; linear/feed-retract templates also serialize feed; arc templates add I/J. Program start serializes the selected work offset. Modal feed tokens must be optional because a repeated feed can be absent. Tool-change, spindle-stop, coolant and program-end hooks require executable output when present.

## Minimal example

[minimal-xyz-post](samples/minimal-xyz-post) is a new third-party-style authoring example for the preview host. It registers `com.example.minimal-xyz/default`: metric XYZ, straight-line motion, clockwise spindle and manual tool changes. It explicitly omits arcs, helices, full circles, indexed axes, automatic changes, reverse spindle and active coolant modes. Unsupported operation capabilities are rejected by the preview host; the example does not approximate or silently discard them.

The example has no host implementation, machine connection or generated motion. Its tool-change template stops the spindle and pauses; it does not manufacture a retract. It is an API authoring example, not a qualified controller post or machine-ready output. It received static contract review only and was not executed for this publication. Use the canonical controller-specific repositories as the maintained starting points for real postprocessor work.
