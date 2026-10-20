# Parametric spacer blank

A complete API 1 geometry package. Install this folder, then run **Add Solid Spacer Blank**. No npm project or compile step is needed.

Expected initial geometry: one cylinder, radius 6 mm and height 12 mm, base centre at X=20 mm/Y=0/Z=0. Edit radius/height/position in the feature's ordinary inspector. Setting **Tilt about Y** to 90 degrees should orient its axis along +X while keeping the base anchor at the specified position. Inspect the actual result on your target release.

The package requests `feature:solid` and `kernel:build`, and nothing else. The six parameter expressions are saved with the feature; the installed package definition is separate. Save/reopen requires this exact package/version installed. Reinstalling a different version intentionally requires version/migration care.

This is a **solid blank**, not a hollow spacer. API 1 does not expose a subtract/boolean or arbitrary profile builder. To make a bore, use Macadam's normal modelling tools after creating the feature.

Source review only for this documentation update; no runtime or manufacturing qualification. See [feature authoring](../../docs/feature-authoring.md), [catalogue](../../docs/primitive-catalogue.md) and [release checklist](../../docs/conformance-checklist.md).
