# Primitive template catalogue

These are the complete primitive `kind` tokens accepted by the reference API 1 host. Keys are case-sensitive. `dims` must contain **exactly** the listed keys, each mapped to an expression string; this is not an arbitrary dictionary of optional dimensions.

| `kind` | Required `dims` keys | Meaning and valid input |
| --- | --- | --- |
| `'box'` | `width`, `depth`, `height` | Full X/Y/Z extents; each positive |
| `'sphere'` | `radius` | Analytic sphere; positive radius |
| `'cylinder'` | `radius`, `height` | Cylinder along +Z; both positive |
| `'cone'` | `radius`, `height` | Full cone; positive base radius and height |
| `'frustum'` | `radius`, `topRadius`, `height` | Truncated cone; positive base radius and height; top radius may be zero or positive |
| `'torus'` | `radius`, `ringRadius` | `radius` is tube radius; `ringRadius` is tube-centre to axis; both positive and ring radius must exceed tube radius |
| `'prism'` | `radius`, `height`, `sides` | Regular polygon prism; positive circumradius/height, integer side count ≥3 |
| `'pyramid'` | `radius`, `height`, `sides` | Right regular polygon pyramid; positive base circumradius/height, integer side count ≥3 |
| `'cube'` | `radius` | Regular cube sized by circumradius to a vertex, **not edge length**; positive |
| `'icosphere'` | `radius`, `frequency` | Icosahedron subdivision projected to a sphere; positive vertex radius, integer frequency ≥1 |
| `'geodesic'` | `radius`, `frequency` | Planar-faced dual of the icosphere; radius to tangent faces, integer frequency ≥1 |
| `'uvSphere'` | `radius`, `sides`, `rings` | Latitude/longitude faceting; positive radius, integer longitude segments ≥3 and latitude bands ≥2 |
| `'cubeSphere'` | `radius`, `frequency` | Subdivided cube projected to a sphere; positive radius, integer frequency ≥1 |
| `'octasphere'` | `radius`, `frequency` | Octahedron subdivision; positive radius, integer frequency ≥1 |
| `'tetrasphere'` | `radius`, `frequency` | Tetrahedron subdivision; positive radius, integer frequency ≥1 |

Length dimensions are expressions such as `'10mm'`. `sides`, `frequency` and `rings` are counts such as `'6'`, not lengths. Declare matching local field kinds. Author whole positive counts; do not rely on evaluator rounding or fallback for fractional/invalid counts. Large subdivision counts can produce expensive geometry; no package cost estimator is exposed.

`frequency` means subdivisions along an original edge, not recursion depth. A `cube` uses circumradius; to make a cube with a 20 mm edge, use radius `17.32050807568877mm` (20 × √3 / 2). A box with equal `width`, `depth`, `height` is often clearer for a dimensioned cube.

There is no `radiusToFace` template key in API 1. The geodesic primitive uses its native face-tangent radius convention; do not add an unsupported toggle copied from another modelling interface.

## Cylinder recipe

```js
template: { primitive: {
  kind: 'cylinder',
  dims: { radius: '${radius}', height: '${height}' },
  dx: '0mm', dy: '0mm', dz: '0mm',
  rx: '0deg', ry: '0deg', rz: '0deg',
  anchor: 'base',
} }
```

This is the same native geometry kind the host evaluates, not a faceted mesh created by JavaScript. A closed primitive still needs sensible dimensions and a supported target app version. Registration success is not proof the user's later expressions are valid.

## Placement fields

| Field | Required | Value |
| --- | --- | --- |
| `kind` | Yes | One token above |
| `dims` | Yes | Exact dimension-key map above |
| `dx`, `dy`, `dz` | Yes | Length expression strings positioning the anchor |
| `rx`, `ry`, `rz` | No | Angle expression strings for native placement rotation |
| `anchor` | No | `'base'` or `'center'`; [defaults and examples](feature-authoring.md#geometry-and-placement) |

No other primitive fields are accepted by the API 1 package validator. Keep descriptor IDs independent of dimension keys: a local field named `thickness` may legitimately feed the primitive's `height` expression.
