# Compatibility and qualification

Snapshot date: 2026-10-19.

| Layer | Source/release boundary |
| --- | --- |
| Shipping browser | `9b02ab40176298e97382880b466b764e91713809` |
| Shipping Rust component supplied with that browser | `b880` (short release identifier) |
| Local package API 1 declarations and shipping examples | Extracted from browser-source revision `9b02ab40176298e97382880b466b764e91713809` |
| Shared Mac host | Documented from source at that same revision; this SDK publication does not newly qualify native packaging |
| Postprocessor API 2 core integration | Preview source `69b2514d5c7b569f68ec280e3d1855a7af5cf19b`; unmerged and unshipped at this snapshot |

Package `apiVersion: '1'` describes the activation/registration host protocol. A preview postprocessor definition has its own `apiVersion: '2'`; those numbers describe different layers. An API 1 host does not gain postprocessor support merely because a package manifest says `"1"`.

The preview integration has component-level evidence, but matching browser WASM, native host and all-platform packaging are not qualified here. The shipping browser rejects `cam:postprocess`. Public postprocessor repositories are available for source review and future integration, not as evidence of shipping support.

The supported local API 1 surface is commands and numeric declarative solid templates. General `KernelBuilder`/SSA evaluators, rich parameter schemas, selections/previews, arbitrary panels and sketch/CAM feature callbacks remain outside this supported surface. Their presence in broader design declarations would not make them implemented.

This source-only publication adds no CI workflow, host implementation, third-party dependency or automated test runner. Existing report/stock code is copied exactly; new examples received static contract review and were not executed for this publication. Validate an edited package interactively in the appropriate Macadam build before relying on its behavior.
