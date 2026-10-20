# Author release checklist

This is a manual acceptance checklist for plugin authors. The documentation update did not execute it. Record actual pass/fail/unsupported results against an exact app release; do not substitute a typecheck or successful installation for model behaviour.

## Package and interface

- [ ] Folder has `plugin.json` directly at its root; no binaries, node_modules, secrets or unrelated documents.
- [ ] Stable reverse-DNS package ID, stable local contribution IDs, deliberate package version and string protocol `'1'`.
- [ ] Capabilities are minimal. Removing each required capability produces the expected refusal; no undeclared host access is assumed.
- [ ] Installation, restore and reinstallation use the same registration metadata. Module paths work on a case-sensitive host and remain package-local.
- [ ] Optional integrity covers exact source bytes and helper paths; a changed source is refused until the digest is updated.
- [ ] Package works from a downloaded/extracted clean folder, without a private Macadam checkout or an npm install.

## Commands

- [ ] Each command returns one synchronous supported action, including the empty/missing-input path.
- [ ] No document-read permission means no `context.document`; the command does not assume otherwise.
- [ ] Numeric input checks kind, `resolved`, finite numeric value and the distinction between a formula and literal.
- [ ] Units verified: 20 mm → `0.02` numeric length; 90° → `Math.PI / 2` numeric angle.
- [ ] Existing formulas/different-kind parameters are preserved by the plugin's intended policy.
- [ ] User sees the intended message/action through palette and Plugins UI; metadata does not masquerade as selection access.
- [ ] A real parameter edit updates intended dependencies; Undo restores the original document. Failure/invalid action applies no edit.
- [ ] Empty documents, nested feature summaries and unresolved parameter rows are handled without fake success.
- [ ] Execution is bounded on browser and native hosts; no background/async persistence assumptions.

## Solid features

- [ ] Every `dims` map exactly matches the chosen primitive token; descriptor units/count kinds are correct.
- [ ] **Add <name>** creates real intended geometry with expected dimensions and placement, not just a timeline row.
- [ ] At least one inspector edit changes dependent dimensions as expected; authored expressions remain editable.
- [ ] Base/centre anchor and any nonzero rotation visibly match intent. Invalid placement expressions are not silently accepted by the package's own authoring process.
- [ ] Save/reopen with the exact installed version preserves feature IDs/parameters and evaluates the intended solid.
- [ ] Uninstall or a version mismatch reports unavailable feature data without deleting the saved parameter data. Reinstalling the correct version restores its definition.
- [ ] Package upgrade behaviour and the absence of automatic saved-node migration are documented for users.

## Distribution and security

- [ ] README states target app/platform versions and unsupported capabilities honestly; source review, sample execution and controller qualification are reported separately.
- [ ] No promise of hostile-code isolation, a native execution timeout, filesystem/network access or a publisher signature.
- [ ] Private project metadata is not transmitted, logged externally or embedded in examples. No secret is stored as a parameter.
- [ ] Only licensed public material is distributed; copied example attribution/MIT notice is preserved.
- [ ] Preview postprocessors remain separately labelled; no sample is advertised as machine-ready output without controller/process qualification.

Use the browser and Mac application versions your users will actually run. Native Windows/Linux installation support is a separate host question; browser support does not establish it.
