# Write a declarative CAM postprocessor — preview only

**This cannot be installed in the reference shipping API 1 host.** It is a complete authoring guide for the published API 2 preview contract, not a statement that matching app/WASM/native integration is released. Check that your target host explicitly supports `cam:postprocess` and `registerPostProcessor` before proceeding.

## What the post can and cannot do

A post registers data describing how a prepared semantic toolpath becomes controller text. Macadam owns the operations, machine-neutral events, validation, unit conversion, numeric formatting and export. Your JavaScript does not get per-move callbacks, planner control, arbitrary file output or a machine connection.

A profile cannot create a machining setup, cutter, toolpath, retract or stock simulation. It must not approximate away unsupported arcs/axes/tool policies or inject a new safety move. A controller-specific exporter still needs real controller/process qualification; a successful registration or a plausible G-code file is insufficient.

## Folder and entry

Copy [minimal-xyz-post](samples/minimal-xyz-post), which contains all three required files:

```text
minimal-xyz-post/
  plugin.json
  index.js
  post.js
```

The manifest uses package `apiVersion: '1'` and requests `capabilities: ['cam:postprocess']`. This is an additional preview host permission, not a shipping permission. The entry loads package-local data and calls:

```js
const post = require('./post.js');
function activate(host) {
  host.registerPostProcessor(post);
}
```

The definition in `post.js` declares its own `apiVersion: '2'`. Its `id` is local to the package; the combined identity is `<package-id>/<post-id>`, e.g. `com.example.minimal-xyz/default`. Use a filename extension without a dot (1–12 ASCII letters/digits), `mime: 'text/plain'`, and the typed `profile` from [postprocessor-api.d.ts](types/postprocessor-api.d.ts).

## Profile decisions

| Field | Meaning |
| --- | --- |
| `units` | Formatter output `'mm'` or `'inch'` |
| `modalFeed` | Defaults true; repeated feed can be absent. Use false for a feed on every nonrapid motion. |
| `axes` | `'xyz'` or `'xyz-indexed-a'`; no simultaneous arbitrary multi-axis callback |
| `arcs` | `'none'` or `'xy-incremental'` |
| `helices`, `fullCircles` | Explicit support booleans; do not claim support the controller/profile lacks |
| `defaultToolChange` | `'manual'`, `'automatic'` or `'reject'`, with matching templates when supported |
| `comment` | Escaped comment delimiters, e.g. `(` and `)` |
| `events` | Typed block arrays described below |

The minimal example chooses metric XYZ, no arcs/helices/full circles, nonmodal feed and manual changes. It uses `M5` then `M0` for a manual change and outputs a tool-name comment. It does not generate a retract; the prepared path owns clearance moves.

## Event templates

A block is exactly `{ line: [...] }` or `{ comment: [...] }`. A token is literal text, a typed numeric value with formatting, or an allowed escaped label inside a comment:

```js
{ line: [
  { text: 'G1' },
  { value: 'x', prefix: ' X', precision: 'coordinate' },
  { value: 'y', prefix: ' Y', precision: 'coordinate' },
  { value: 'z', prefix: ' Z', precision: 'coordinate' },
  { value: 'feed', prefix: ' F', precision: 'coordinate', optional: true },
] }
```

The optional feed token above is for `modalFeed: true`. In the provided minimal example `modalFeed: false`, so feed is required and the token omits `optional`.

| Event | Available numeric values | Available comment labels |
| --- | --- | --- |
| `programStart` | `workOffset` | None |
| `operationStart`, `operationEnd` | `operationIndex` | `operationName`, `operationId` |
| `toolChangeAutomatic`, `toolChangeManual` | `toolSlot`, `safeZ` | `toolName` |
| `unmappedTool` | None; compatibility-only, not normal app export | `toolName` |
| `spindleCW`, `spindleCCW` | `rpm` | None |
| `rotaryIndex` | `angle` | None |
| `rapid`, `retractRapid` | `x`, `y`, `z` | None |
| `linear`, `retractFeed` | `x`, `y`, `z`, `feed` | None |
| `arcCW`, `arcCCW` | `x`, `y`, `z`, `i`, `j`, `feed` | None |
| `spindleStop`, coolant events, `programEnd` | None | None |

Required keys are `programStart`, `operationStart`, `operationEnd`, `rapid`, `linear`, `retractRapid`, `retractFeed`, `programEnd`. Declared arc/index/tool-change support requires its matching event templates. Motion blocks must serialize all XYZ in executable lines; arcs also IJ; feed motions also feed. Program start must serialize the selected work offset. An automatic tool change must serialize its integer slot.

Identity values (`workOffset`, `operationIndex`, `toolSlot`) use `precision: 'integer'`. Coordinates can use `precision: 'coordinate'`; the host's selected decimals determine formatting. Only modal feed and a manual tool slot may be optional. A label such as tool name belongs only in its permitted escaped comment event, not executable code.

## Units and identities

Prepared event positions, offsets, clearance and feeds are canonical **millimetres/mm per minute**; rotary angles are degrees. The formatter applies output-unit conversion once. Do not preconvert the incoming conceptual event values when `profile.units` selects inches. These units differ from API 1 command `setParameter` actions, which use metres/radians.

Tool slots cross the JSON export configuration as canonical decimal strings to avoid floating-point identity loss. Use `'1'`, not a float masquerading as a tool identity. The published `PostProgramEvent` union describes the host's event contract; it is not a callback interface your plugin subscribes to.

## Author validation

Review the complete type contract and the provided example before extending a profile. Explicitly omit unsupported capabilities and verify the host rejects them rather than silently discarding motion. Check work offset, start/end state, units, feed formatting, every used axis, tool mapping/policy, spindle/coolant, comments and controller-specific commands on representative prepared operations.

Neither the SDK update nor the minimal example has been executed or qualified for a physical controller. Keep preview host validation, exported-text review, simulator checks and real-machine acceptance as separate results. For a controller-maintained starting point, use the public [GRBL/LinuxCNC](https://github.com/macadamcad/post-grbl-linuxcnc) or [RepRapFirmware](https://github.com/macadamcad/post-reprapfirmware) repository and its stated supported host version.
