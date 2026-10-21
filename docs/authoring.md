# Document authoring — staging preview

**Preview browser contract at `f372c6ad290018d1e9a59926d80588b5e1e5bb96`, present in staging
`886836a1dbf2704ffbbff8e10ba8393f3f5ba556`.** It is absent from production reference
`6058b429cf76544752374a7253036ba5187b665b`. Read [compatibility](compatibility.md) first.
This page and its example received source review only; native binary parity is unqualified.

A synchronous command may return `{ type: 'author', program }` to create ordinary editable document
content in one undoable host transaction. The plugin receives copied summaries, never the application
object, geometry handles or a modelling evaluator. General `KernelBuilder`/`defineFeature` callbacks
are planned and unavailable.

## Permissions and program

A registered command needs `command:run`. Every author action needs **both** `document:author` and
`kernel:build`. Each `parameter` step additionally needs **`parameters:write`**. `document:read` is
optional for authoring but needed by the sample to detect name collisions. These grants do not expose
additional methods or private APIs.

`PluginAuthoringProgram` is `{ version: '1', label, steps }`: nonblank label at most 160 UTF-8 bytes,
1–256 ordered steps, at most 256 KiB encoded JSON. Unknown fields and invalid shapes reject the program.

| Step | Required fields | Behavior |
| --- | --- | --- |
| `parameter` | `name`, `kind: 'length' \| 'angle' \| 'scalar'`, finite numeric `value` | Creates a named document parameter. Existing names reject the whole program; no update or formula replacement. Values use metres/radians/unitless scalars. |
| `sketch` | `key`, `name`, `plane: 'xy' \| 'xz' \| 'yz'`; optional `path` | Creates a sketch on a world plane; exposes a typed profile source. |
| `feature` | `key`, `name`, `command`, `fields`; optional `path` | Uses an existing ordinary feature factory and its active reflected fields; no UI command dispatch. |

Keys begin with a lowercase ASCII letter, contain only ASCII letters/digits/underscore/hyphen,
and are at most 64 bytes. Keys must be unique within the program. Names are nonblank display labels.
`path` defaults to `[]` (root) and contains earlier local container keys, e.g. `['outline']` for an
operation inside the sketch. It is not an existing-document path, UUID list or current selection.

A selection value is `{ $feature: 'earlierKey' }`, or an array of these when the field accepts many.
References must resolve in the consumer's own or enclosing scope. Use the sketch step's key for a
profile reference; a generic feature result does not itself expose a typed profile source in this
revision. Raw topology IDs, summary feature IDs, forward references and arbitrary owner/path payloads
are unavailable. The host creates durable native IDs; local keys are only program bindings.

## Complete standalone example

Copy all three files from [author-plate](../samples/author-plate). Its manifest includes
`command:run`, `document:read`, `document:author`, `kernel:build`, and `parameters:write`.
The package creates two parameters, one XY sketch, a four-sided polygon inside that sketch and
one extrusion of the whole sketch. It detects duplicate parameter names before returning its program.

```js
// STAGING PREVIEW: an editable four-sided plate, one document Undo entry.
// No hole is created. This example received source review only.
function activate(host) {
  host.registerCommand({
    id: 'plate', name: 'Author a square plate (preview)',
    run(context) {
      const names = ['examplePlateRadius', 'examplePlateDepth'];
      const parameters = context.document && context.document.parameters;
      if (!parameters) return { type: 'message', text: 'This example requires document:read.' };
      if (parameters.some(p => names.includes(p.name))) {
        return { type: 'message', text: 'Example plate parameters already exist. Use a new document or Undo the previous plate.' };
      }
      return { type: 'author', program: {
        version: '1', label: 'Create square plate', steps: [
          { op: 'parameter', name: 'examplePlateRadius', kind: 'length', value: 0.01 },
          { op: 'parameter', name: 'examplePlateDepth', kind: 'length', value: 0.02 },
          { op: 'sketch', key: 'outline', name: 'Plate Outline', plane: 'xy' },
          { op: 'feature', key: 'polygon', name: 'Editable Square', command: 'sketch.polygon',
            path: ['outline'], fields: {
              'spec.kind.ngon.sides': '4', 'spec.kind.ngon.radius': 'examplePlateRadius',
            } },
          { op: 'feature', key: 'solid', name: 'Plate', command: 'solid.extrude', fields: {
            sketchFeatureID: { $feature: 'outline' }, depth: 'examplePlateDepth',
          } },
        ],
      } };
    },
  });
}
module.exports = { activate };
```

The shape's radius is 10 mm and extrusion depth 20 mm. Expression-valued fields take native
expression strings such as `'10mm'`, `'45deg'`, `'4'` or a named parameter; do not add embedded
quote characters such as `'"10 mm"'`. Numeric document parameter values use SI separately.

## Field and command discovery limits

The package host exposes **no command/schema discovery method**. `context.document` contains summaries,
not command fields. The following is the complete field contract used by the example, not an exhaustive
catalogue of authorable commands:

| Command | Placement and explicit fields used here |
| --- | --- |
| `sketch.polygon` | `path: ['outline']`; default ngon variant; `spec.kind.ngon.sides` is a count expression string, `spec.kind.ngon.radius` a length expression string. |
| `solid.extrude` | Root `path: []`; `sketchFeatureID: { $feature: 'outline' }` selects the sketch profile; `depth` is a length expression string. |

An ordinary factory is necessary but not sufficient: some reflected selections require adapters that
this author protocol does not expose. Palette commands can be interactive operations rather than
factories. `sketch.rectangle` is such an operation; `sketch.circleCenter` is not an authorable command
ID. Do not guess fields such as `width`, `profile` or `profiles` from UI labels. Other commands require
an explicit published compatible field schema. A complete public discovery/catalogue surface is still
missing; extending this example to all modelling features without private source is not yet documented.

## Application, Undo and stale documents

Planning uses a separate host probe. Invalid permissions, duplicate parameter names, unresolved keys,
inactive fields or unsupported selections reject the program before it changes the live document.
The host commits the result as one Undo entry. Native records remain editable without the package's
JavaScript evaluator; these are ordinary features, unlike saved `registerFeature` plugin-template nodes.

The browser records document JSON and boundary generation before command execution. If either changes
before an author result is applied, it reports **Document changed while the plugin planned its authoring
action. Run the command again.** It also rejects unloaded/replaced packages. This stale-document check is
browser behavior; it is not a verified native parity claim. Without `document:read`, authoring still
checks staleness but the plugin did not inspect a summary.

`run` must return exactly one synchronous JSON-serializable action. No Promise, action arrays, async
work, progress callback or post-application result callback is exposed. The authoring path does not
create CAM setups/toolpaths or provide a general geometry callback. Keep programs bounded; package
permissions are not hostile-code isolation. See [security](security.md).
