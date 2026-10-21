# Postprocessors — staging preview

**Browser preview contract at `f372c6ad290018d1e9a59926d80588b5e1e5bb96`, present in staging
`886836a1dbf2704ffbbff8e10ba8393f3f5ba556`.** These additions are absent from production reference
`6058b429cf76544752374a7253036ba5187b665b`; they are not globally shipping. Native binary transport,
all-platform packaging and physical-controller qualification remain separate, open results.

A package requests `cam:postprocess` and synchronously calls `host.registerPostProcessor(definition)`
during activation. The manifest stays `apiVersion: '1'`. Definitions are serializable data, not per-move
JavaScript callbacks. The host owns prepared toolpaths, semantic events, validation, conversion,
formatting and export. Registration grants neither planner control nor a file/machine connection.

## API 1 legacy definitions

The post definition's own `apiVersion: '1'` selects `PostProfile` in
[local-plugin-api.d.ts](../types/local-plugin-api.d.ts). It declares `units: 'mm'`,
`axes: 'xyz-indexed-a'`, `arcs: 'xy-incremental'`, `comment: 'parentheses' | 'semicolon'`,
`headerLabel`, four `motion` words, `requireMappedTool`, and `programStart`, `toolChange`,
`spindleStart`, `spindleStop`, `rotaryIndex`, `programEnd` blocks.

Legacy blocks are arrays of token arrays. Tokens are `{ text: '...' }` or
`{ value: 'workOffset' | 'toolSlot' | 'rpm' | 'rotaryAngle', precision: 'integer' | 'coordinate' }`.
This shape is distinct from API 2; do not use legacy arrays for an event profile.

## API 2 event definitions

Use the [complete standalone minimal XYZ package](../preview/samples/minimal-xyz-post),
[walkthrough](../preview/authoring-walkthrough.md), and the exact MIT
[event declarations](../types/local-post-event-profile.d.ts). Its definition has local `id`,
`name`, `apiVersion: '2'`, a 1–12 ASCII letter/digit `extension` without a dot,
`mime: 'text/plain'`, optional `aliases`, and `profile`. The combined identity is
`<package-id>/<post-id>`; package IDs should use your own reverse-DNS namespace.

API 2 blocks are **objects**: `{ line: [...] }` or `{ comment: [...] }`. A linear block is:

```js
{ line: [
  { text: 'G1' },
  { value: 'x', prefix: ' X', precision: 'coordinate' },
  { value: 'y', prefix: ' Y', precision: 'coordinate' },
  { value: 'z', prefix: ' Z', precision: 'coordinate' },
  { value: 'feed', prefix: ' F', precision: 'coordinate', optional: true },
] }
```

The optional feed above requires `modalFeed: true` (the default); repeated feeds can be absent.
With `modalFeed: false`, omit `optional` so every feed motion emits effective feed.

| Event | Numeric values | Escaped comment labels |
| --- | --- | --- |
| `programStart` | `workOffset` | None |
| `operationStart`, `operationEnd` | `operationIndex` | `operationName`, `operationId` |
| `toolChangeAutomatic`, `toolChangeManual` | `toolSlot`, `safeZ` | `toolName` |
| `unmappedTool` | None | `toolName`; low-level compatibility only, normal app export never emits it |
| `spindleCW`, `spindleCCW` | `rpm` | None |
| `rotaryIndex` | `angle` | None |
| `rapid`, `retractRapid` | `x`, `y`, `z` | None |
| `linear`, `retractFeed` | `x`, `y`, `z`, `feed` | None |
| `arcCW`, `arcCCW` | `x`, `y`, `z`, `i`, `j`, `feed` | None |
| `spindleStop`, `coolantOff`, `coolantFlood`, `coolantMist`, `programEnd` | None | None |

Required event keys are `programStart`, `operationStart`, `operationEnd`, `rapid`, `linear`,
`retractRapid`, `retractFeed`, `programEnd`. Declared capabilities require their matching templates.
Motion lines must serialize all XYZ; arcs also IJ; feed motions also feed. Program start serializes
the selected `workOffset` rather than hardcoding G54. Integer identities use `precision: 'integer'`.
Only modal feed and a manual tool slot may be optional. Labels belong in allowed escaped comments,
not executable lines. See the walkthrough for the full event/validation rules.

`profile` also declares output `units: 'mm' | 'inch'`, `axes: 'xyz' | 'xyz-indexed-a'`,
`arcs: 'none' | 'xy-incremental'`, `helices`, `fullCircles`, `defaultToolChange`, comment delimiters
and optional `modalFeed`. Omit unsupported capabilities. An unsupported axis/tool/arc request rejects
export; it is not silently approximated or flattened.

Prepared events use canonical **millimetres and millimetres per minute**, angles in degrees.
Output conversion follows `profile.units`; do not preconvert events. This differs from command
parameter actions, which use metres/radians. Tool slots cross JSON as canonical decimal strings,
never floating-point identities. `PostProgramEvent` and `PostExportConfiguration` describe host
contracts; they do not add methods, event subscriptions or a callable export API to plugin code.

## Bundled and custom profiles

The staging host includes protected `com.macadam.posts.grbl-linuxcnc` and
`com.macadam.posts.reprapfirmware` packages. `com.macadam.posts` and its descendants are host-owned;
a local package cannot replace, persist over or uninstall them. Customize with your own package ID.
The GRBL/LinuxCNC package uses the `grblLinuxCNC` alias and `.nc` output extension. Public maintained
sources are [GRBL/LinuxCNC](https://github.com/macadamcad/post-grbl-linuxcnc) and
[RepRapFirmware](https://github.com/macadamcad/post-reprapfirmware).

The browser and macOS sources integrate profiles through different host transports. This SDK does
not assert native runtime parity. In particular, `PostExportConfiguration.operations` is a declared
per-operation contract, not a promise that every native UI/transport exposes per-operation settings.
Non-macOS native export must be qualified separately. Presence of a bundled profile or passing structural
validation is not controller/process qualification.

## Limits

Profiles format prepared operations. They cannot create CAM setups, tools, paths, clearance moves,
simulation or arbitrary geometry. Do not add a safety move the planner did not prepare. Registration
and callbacks stay synchronous; no network, arbitrary files or machine connection is provided.
The example and this SDK update received source review only; no example execution, native build,
exported-program simulation or machine validation is claimed. Keep controller validation results
separate and state the exact compatible host revision in every distributed package.
