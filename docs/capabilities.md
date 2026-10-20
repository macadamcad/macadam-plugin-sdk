# What a plugin can do

API 1 has two contribution types: synchronous commands and declarative solid templates. Permissions allow specific host interactions; they do not expose private application modules.

| Goal | API 1 support | Interface and limit |
| --- | --- | --- |
| Add a named command | Yes | `host.registerCommand`; appears in the shared palette and Plugins UI |
| Give a command a shortcut/icon | Yes, metadata | Portable key chord and shared icon name; no custom toolbar placement or conflict resolution guarantee |
| Report feature names/counts | Yes | `context.document.features`; copied IDs/names/kinds/container paths, no feature recipes or evaluated geometry |
| Inspect named parameters | Yes | Copied values, kinds, formula text and resolution status |
| Create/update a numeric named parameter | Yes | Return one `setParameter` action; metres/radians/unitless; existing formula parameters reject literal writes |
| Display text | Yes | Return one `message` action, at most 8192 JavaScript string code units |
| Define an editable box, cylinder or other supported primitive | Yes | `host.registerFeature` with typed numeric parameters and one primitive expression template |
| Recompute geometry after editing its parameters | Yes | Macadam expands expressions and runs its native geometry evaluator; no plugin callback during replay |
| Combine command and feature contributions in one package | Yes | Request the union of their capabilities; each contribution still has the same limits |
| Read the selected body, face or point | No | `actsOn` ranks a palette command; it does not deliver selection data or enforce a selection requirement |
| Query bodies, topology, meshes, volume or bounding boxes | No | No body/kernel/query object is passed to a package |
| Run Extrude, Boolean, Fillet or arbitrary modelling commands | No | No arbitrary command-dispatch or mutation action |
| Make sketches, constraints, curves, assemblies or joints | No | No builder callbacks or recipe templates for these surfaces in API 1 |
| Add arbitrary panels, forms, viewport overlays or custom inspectors | No | Only host-generated command UI and numeric feature fields |
| Add a file importer/exporter or write files | No | No supported file API or file-export action |
| Send HTTP requests or connect a machine | No | No supported network/machine API; do not depend on ambient JavaScript escape paths |
| Create CAM setups, tool definitions, operations or simulations | No | A command may set an agreed document parameter, but it cannot produce a toolpath |
| Add a controller postprocessor | Preview only | [API 2](../preview/README.md), not accepted by the shipping API 1 host |
| Store persistent plugin state or run background jobs | No | Fresh activation per invocation; no settings/storage/event-loop API |

## Exactly which internal API can a package access?

None directly. Macadam exposes this narrow public registration object:

```ts
interface LocalPluginHost {
  readonly apiVersion: '1';
  registerCommand(command: LocalPluginCommand): void;
  registerFeature(feature: LocalPluginFeature): void;
}
```

During a command, Macadam passes a frozen plain-data context. The only supported path from a command back into the document is its single returned action. `kernel:build` is the permission to register a native primitive template; it is **not** a JavaScript kernel handle.

Names such as `macadam.doc`, `macadam.bodies`, `engine`, `window.macadam` or an editor scripting API may appear in other Macadam material. They belong to other execution contexts and are not part of `activate(host)` or `run(context)`. Do not import application files or use undocumented globals to reach them.

## Design your plugin around the available boundary

A stock-sizing plugin is a good fit: declare stock dimensions and allowance as expressions, let the host create the solid, and let the user edit its numeric inspector fields. A manufacturing-policy helper is also a fit if it only reports parameter values or returns one agreed allowance value.

A tool that selects a face, computes a pocket and runs a simulation is not currently implementable as a local API 1 package. It needs additional supported host capabilities. This documentation does not make that missing functionality available and does not substitute a baked mesh for editable history.
