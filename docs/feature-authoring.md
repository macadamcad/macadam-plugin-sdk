# Editable solid features

An API 1 geometry plugin describes a parameterized primitive. Macadam stores the user's expressions and evaluates the native solid. Your JavaScript registers the definition; it does not run during geometry evaluation.

## Complete feature example

Create `plugin.json`:

```json
{
  "id": "com.example.stock",
  "name": "My Stock",
  "version": "1.0.0",
  "apiVersion": "1",
  "entry": "index.js",
  "capabilities": ["feature:solid", "kernel:build"]
}
```

Create `index.js`:

```js
function activate(host) {
  host.registerFeature({
    id: 'stock',
    name: 'Oversize Stock',
    surface: 'solid',
    params: {
      width:     { kind: 'length', label: 'Finished width', default: '100mm' },
      depth:     { kind: 'length', label: 'Finished depth', default: '60mm' },
      thickness: { kind: 'length', label: 'Finished thickness', default: '18mm' },
      allowance: { kind: 'length', label: 'Allowance per side', default: '2mm' },
    },
    template: { primitive: {
      kind: 'box',
      dims: {
        width: '${width} + 2 * ${allowance}',
        depth: '${depth} + 2 * ${allowance}',
        height: '${thickness} + 2 * ${allowance}',
      },
      dx: '0mm', dy: '0mm', dz: '0mm',
      anchor: 'base',
    } },
  });
}
```

Install the folder and run **Add Oversize Stock** in the command palette or Plugins settings. The intended initial result is a **104 × 64 × 22 mm** box, with its base centre at the origin. Select its timeline feature to edit the host-generated numeric fields. Change allowance from 2 mm to 3 mm: the intended extents become **106 × 66 × 24 mm**.

These are expected results for author verification, not a claim that this documentation update ran the example.

## Expressions preserve intent

`${width}` is a template placeholder, not a JavaScript template literal. Keep it inside an ordinary quoted string as above. The host substitutes the stored user expression in parentheses. If width is `80mm + 20mm`, the resulting dimension is `(80mm + 20mm) + 2 * (2mm)`, preserving its meaning.

A field's `default` is an expression string. Length examples: `'20mm'`, `'2cm'`, `'width * 2'` when `width` is an existing named document parameter. Angles can use `'45deg'`; scalar/count values use strings such as `'1.5'` or `'6'`. Use explicit length/angle units, including zeros (`'0mm'`, `'0deg'`), instead of relying on bare-number interpretation.

Placeholders refer to this feature's declared parameter IDs. Named document parameters are ordinary identifiers in the expressions; `${documentName}` does not access a document parameter unless you declared that local parameter too. Local parameters are substituted textually; use `${allowance}` explicitly when you mean the local field, rather than assuming a JavaScript variable or automatic local expression namespace.

Supported arithmetic includes `+`, `-`, `*`, `/`, scalar `^`, parentheses and dimension-aware functions such as `abs`, `min`, `max`, `sin`, `cos`, `tan` and scalar `sqrt`. A valid expression still has to have the dimension required by the target native field. For example, multiplying a length by a scalar is valid; adding a length to an angle is not.

There is no custom JavaScript field validation callback. A malformed/unresolvable expression or invalid primitive dimension is reported by the host evaluator. Installation validates template structure and placeholders; it does not prove every future user-entered expression produces valid geometry. In the current reference host, invalid placement/rotation expressions may fall back to zero. Do not rely on that fallback to validate your package; use well-formed explicit expressions and verify placement visibly.

## Geometry and placement

`template` has exactly one `primitive` member. Select one of the [15 native kinds](primitive-catalogue.md) and provide exactly its documented dimension keys. Extra or missing dimensions reject registration. A template cannot call boolean, extrude, sketch or arbitrary feature recipes, and a package cannot supply a mesh or callback as a substitute.

All primitive axes are defined in the native frame with **+Z as the axis/up direction**. `dx`, `dy`, `dz` position the selected anchor in document space. `rx`, `ry`, `rz` are optional angle expressions for native placement rotation, applied about that anchor. This contract does not expose a general transform API or user-picked coordinate frame. Prefer a single nonzero rotation axis unless you have verified the host's multi-axis rotation convention for your release.

`anchor` has two values:

| Value | Point placed at `(dx, dy, dz)` |
| --- | --- |
| `'base'` | Centre of the primitive's bottom along its axis |
| `'center'` | Centre along the primitive's axis and height |

For a 20 mm cylinder at `dz: '10mm'`, base anchoring places its Z span at 10–30 mm; centre anchoring places it at 0–20 mm. The XY centre stays on the primitive axis. The default is base for box/cylinder/cone/frustum/prism/pyramid, and centre for sphere/torus/cube/faceted sphere families. Specify it explicitly for clear authoring intent.

The [spacer example](../samples/parametric-spacer) demonstrates cylinder dimensions, displacement and a single-axis rotation. Despite its name, it is a solid cylinder: API 1 cannot subtract a hole.

## Saved models, dependencies and missing packages

The document stores the package ID, package version, feature type ID and the feature's parameter expressions. It does **not** embed the JavaScript implementation or the whole plugin folder. The same package and required version must be installed on another machine/browser profile before that node can evaluate.

Updating or uninstalling a plugin does not delete existing feature nodes. If the package, feature definition or exact required version is unavailable, evaluation reports **Plugin feature unavailable** and preserves the stored parameters. Do not promise an unavailable plugin still renders from a permanent baked geometry cache. Downstream modelling may depend on that feature and can be affected.

The host evaluates the expanded native recipe through its normal dependency system. There is no plugin-controlled scheduler, cache hook, native body reference or background evaluation callback. Keep feature IDs and parameter IDs stable, and read [version migration](compatibility.md) before releasing a new package version.

## Practical limits

- One native primitive per feature definition; many definitions may be registered, up to 128 per package.
- Up to 128 numeric parameter descriptors per definition. No custom inspector controls, parameter enums, booleans or arrays.
- Feature and parameter IDs use `^[a-z][a-zA-Z0-9_-]{0,63}$`; label text is for people, IDs are for saved identity.
- Stored parameter expressions must be nonempty and at most 8192 bytes. Template expressions are bounded at 65536 bytes; expanded expressions at 262144 bytes.
- No `evaluate` function, native module, custom WASM or arbitrary JSON recipe injection. Unknown definition/template fields are rejected by native validation.
- A feature definition registers UI creation and replay data. It is not a callable method that a package command can use to create geometry.
