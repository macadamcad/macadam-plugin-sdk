# Local package API 1 reference

This page lists the entire supported plugin call surface. [TypeScript declarations](../types/local-plugin-api.d.ts) describe the data shapes; the guides explain how to use them. Types are documentation/editor assistance, not a runtime or an extra library to import.

## Entry point

```ts
function activate(host: LocalPluginHost): void
```

The entry script may define `activate`, assign `module.exports = activate`, or assign `module.exports.activate = activate`. The host calls it synchronously in a restricted, disposable JavaScript realm. Register contributions before it returns. Activation may occur more than once during installation and again on every command invocation. Do not depend on activation count or retained state.

| Host member | Result | Requirement |
| --- | --- | --- |
| `host.apiVersion` | String `'1'` | Read-only protocol identifier |
| `host.registerCommand(command)` | `void` | `command:run`; activation must still be open |
| `host.registerFeature(feature)` | `void` | Both `feature:solid` and `kernel:build`; activation must still be open |

Registration errors throw JavaScript `Error`s. A failed registration prevents installation. There is no `onDeactivate`, async activation, evaluator registration, subscription, file API or `host.macadam` property.

## `registerCommand(command)`

| Field | Type / default | Validation and meaning |
| --- | --- | --- |
| `id` | `string`, required | `^[a-z][a-zA-Z0-9_-]{0,63}$`; stable and unique within this package's command registry |
| `name` | `string`, required | Nonblank palette/UI name |
| `run` | `(context) => PluginAction`, required | Synchronous function; returns exactly one plain-data action |
| `icon` | `string`, default `'plugin'` | Shared icon name using the local ID grammar. A well-formed name is not proof an icon exists. Use `plugin` for a portable default. |
| `shortcut` | `string`, absent by default | Zero or more `ctrl+`, `alt+`, `shift+`, `cmd+` prefixes, then one lowercase letter/digit, `return` or `space`; e.g. `shift+cmd+r` |
| `actsOn` | enum, default `'none'` | `none`, `edge`, `face`, `loop`, `body`, `sketch`, `profile`; palette ranking metadata, **not selection access or a permission** |

Duplicate command IDs fail. A feature ID and command ID occupy separate registries. Command names are labels; use IDs rather than names for identity.

Registered palette IDs are `plugin.<package-id>.command.<command-id>`. The host's feature-creation contribution uses `plugin.<package-id>.feature.<feature-id>` and the title **Add <feature name>**. Packages cannot invoke these commands through the API 1 host.

## Command context

Without `document:read`, the callback gets `{}`. With it:

```ts
{
  document: {
    features: Array<{
      id: string; name: string; kind: string; path: string[];
    }>;
    parameters: Array<{
      name: string;
      kind: 'length' | 'angle' | 'scalar' | 'bool';
      value: number | boolean | null;
      expression: string | null;
      resolved: boolean;
      unresolved?: { reason: string; detail: string };
    }>;
  };
}
```

The actual context and nested objects are copied and recursively frozen. Features are in depth-first timeline order, including nested children; `path` contains the containing feature IDs (`[]` at the document root). A feature `id` is an uppercase UUID string, not a body handle. `kind` is an open string classification; do not use it to infer an available object API.

Parameters are sorted by name. Numeric values use canonical **metres**, **radians**, or unitless scalars. Boolean parameter values are booleans. A non-finite numeric value can appear as `null`. An unresolved parameter is still listed with its last available value and `resolved: false`; inspect `unresolved` and do not silently use that value as live input. `expression` is display source, or `null` for a literal parameter. A summary contains neither full feature recipes nor evaluated geometry.

## Command results

```ts
type PluginAction =
  | { type: 'message'; text: string }
  | { type: 'setParameter'; name: string;
      kind: 'length' | 'angle' | 'scalar'; value: number };
```

| Action | Checks | Effect |
| --- | --- | --- |
| `message` | String `text`, maximum 8192 JavaScript string code units | Displays transient app text; no document edit |
| `setParameter` | `parameters:write`; nonblank name; one of the three kinds above; finite numeric `value` | Host creates or changes a named literal parameter through normal document commands/undo |

`setParameter` cannot write a boolean, set a formula, delete a parameter, edit an arbitrary feature or target a parameter by UUID. A formula-defined destination rejects this literal write. A supplied name is a document name, not scoped plugin storage. Use a distinctive name and inspect existing parameters before replacing a value.

The result is JSON-copied before validation. Promises, action arrays, `undefined`, functions, circular structures and live handles are not valid results. Non-finite numbers do not survive as valid parameter values. A thrown exception, invalid action or browser watchdog failure applies no command action. Once a valid edit is applied, use the app's Undo to reverse it; there is no plugin cancel callback.

## `registerFeature(feature)`

| Field | Contract |
| --- | --- |
| `id`, `name` | Local ID grammar above; unique among package feature definitions; nonblank display name |
| `surface` | Exactly `'solid'` |
| `params` | Map of local parameter IDs to `{ kind, label, default }`; at most 128 parameters |
| `params.*.kind` | `'length'`, `'angle'`, `'scalar'`, `'count'` |
| `params.*.label` | Nonempty UI label |
| `params.*.default` | Nonempty expression string; e.g. `'20mm'`, `'45deg'`, `'6'` |
| `template` | Exactly one `{ primitive: PrimitiveTemplate }` recipe |

At most 128 feature definitions per package. A numeric field has no custom validator, enum choices, checkbox, grouping, custom UI or min/max metadata in this API. Parameter definitions are sorted by ID during registration; do not rely on object insertion order for inspector ordering.

`PrimitiveTemplate` requires `kind`, the exact `dims` map for that kind, and `dx`, `dy`, `dz` expression strings. `rx`, `ry`, `rz` angle expressions and `anchor: 'center' | 'base'` are optional. See the [complete catalogue](primitive-catalogue.md) for the 15 accepted kinds, exact dimension keys and geometry constraints.

`${parameterID}` inside any template expression inserts the corresponding stored expression in parentheses. It does not evaluate JavaScript. Unknown placeholders, missing/unknown stored parameters and invalid template keys fail. There is no `evaluate` callback: providing one is rejected. There is no boolean, sketch, compound-body or CAM template.

Use [feature authoring](feature-authoring.md) for placement, expression examples and saved document/version semantics.

## Package and error references

- [Manifest schema, limits, module resolution and integrity](packaging.md)
- [Permission enforcement and security gaps](security.md)
- [Install, reload, update, uninstall, storage and cancellation](platforms-and-lifecycle.md)
- [Common error messages and corrections](troubleshooting.md)

Package/runtime errors are surfaced as text. API 1 does **not** specify a stable structured error code, stack-trace format or cross-platform exception class. Do not parse message text to drive model decisions. An error from a returned document edit may be produced after the plugin callback has returned; catching an error inside `run` cannot catch that later host failure.
