// MIT — Copyright (c) 2026 Macadam contributors. See LICENSE.
// Public local package API 1. Declarations/editor assistance only; the app supplies the runtime.

export type LocalCapability =
  | 'command:run' | 'document:read' | 'parameters:write' | 'feature:solid' | 'kernel:build';

export interface LocalPluginManifest {
  /** Stable reverse-DNS ID, e.g. com.example.stock. Reinstalling the same ID replaces the package. */
  readonly id: string;
  readonly name: string;
  /** Three numeric components and optional prerelease suffix; exact-match requirement for saved features. */
  readonly version: string;
  readonly apiVersion: '1';
  /** Included .js path, at most 256 KiB UTF-8 source. */
  readonly entry: string;
  readonly icon?: string;
  /** sha256- plus lowercase hex. Consistency check, not a publisher signature. See docs/packaging.md. */
  readonly integrity?: string;
  readonly capabilities: readonly LocalCapability[];
}

/** Summary only: not a native object, body handle, feature recipe or mutation target. */
export interface FeatureSummary {
  readonly id: string;
  readonly name: string;
  readonly kind: string;
  readonly path: readonly string[];
}

/** Numeric values are metres/radians/unitless; bool parameters are boolean; invalid numeric data can be null. */
export interface ParameterSummary {
  readonly name: string;
  readonly kind: 'length' | 'angle' | 'scalar' | 'bool';
  readonly value: number | boolean | null;
  readonly expression: string | null;
  readonly resolved: boolean;
  readonly unresolved?: { readonly reason: string; readonly detail: string };
}

export interface DocumentSummary {
  /** Depth-first timeline order; includes nested children. */
  readonly features: readonly FeatureSummary[];
  /** Sorted by name. Unresolved rows retain a previous value; check resolved before using it. */
  readonly parameters: readonly ParameterSummary[];
}

export interface PluginCommandContext {
  /** Present only with document:read. Recursively frozen plain data. */
  readonly document?: DocumentSummary;
}

/** Exactly one synchronous, JSON-serializable action. No Promise, action array or arbitrary host call. */
export type PluginAction =
  | { readonly type: 'message'; readonly text: string }
  | { readonly type: 'setParameter'; readonly name: string;
      readonly kind: 'length' | 'angle' | 'scalar'; readonly value: number };

export interface LocalPluginCommand {
  readonly id: string;
  readonly name: string;
  /** Shared icon name; use plugin for the portable default. Not a path to an SVG. */
  readonly icon?: string;
  /** e.g. shift+cmd+r. Optional metadata; no conflict-negotiation callback. */
  readonly shortcut?: string;
  /** Palette ranking only; no selection object or selection requirement is provided. */
  readonly actsOn?: 'none' | 'edge' | 'face' | 'loop' | 'body' | 'sketch' | 'profile';
  run(context: PluginCommandContext): PluginAction;
}

export interface NumericPluginParameter {
  readonly kind: 'length' | 'angle' | 'scalar' | 'count';
  readonly label: string;
  /** Native expression source, e.g. 20mm, 45deg, 6. Use explicit length/angle units. */
  readonly default: string;
}

export interface PrimitivePlacement {
  readonly dx: string; readonly dy: string; readonly dz: string;
  readonly rx?: string; readonly ry?: string; readonly rz?: string;
  readonly anchor?: 'center' | 'base';
}

/** Exact required dimension maps. Expressions are strings; ${id} inserts a stored local parameter expression. */
export type PrimitiveTemplate = PrimitivePlacement & (
  | { readonly kind: 'box'; readonly dims: { readonly width: string; readonly depth: string; readonly height: string } }
  | { readonly kind: 'sphere' | 'cube'; readonly dims: { readonly radius: string } }
  | { readonly kind: 'cylinder' | 'cone'; readonly dims: { readonly radius: string; readonly height: string } }
  | { readonly kind: 'frustum'; readonly dims: { readonly radius: string; readonly topRadius: string; readonly height: string } }
  | { readonly kind: 'torus'; readonly dims: { readonly radius: string; readonly ringRadius: string } }
  | { readonly kind: 'prism' | 'pyramid'; readonly dims: { readonly radius: string; readonly height: string; readonly sides: string } }
  | { readonly kind: 'uvSphere'; readonly dims: { readonly radius: string; readonly sides: string; readonly rings: string } }
  | { readonly kind: 'icosphere' | 'geodesic' | 'cubeSphere' | 'octasphere' | 'tetrasphere';
      readonly dims: { readonly radius: string; readonly frequency: string } }
);

export interface LocalPluginFeature {
  readonly id: string;
  readonly name: string;
  readonly surface: 'solid';
  readonly params: Readonly<Record<string, NumericPluginParameter>>;
  readonly template: { readonly primitive: PrimitiveTemplate };
  /** Deliberately unavailable: the host rejects JavaScript geometry callbacks. */
  readonly evaluate?: never;
}

/** The complete package API 1 host, not the broader editor scripting object. */
export interface LocalPluginHost {
  readonly apiVersion: '1';
  registerCommand(command: LocalPluginCommand): void;
  registerFeature(feature: LocalPluginFeature): void;
}

export type ActivatePlugin = (host: LocalPluginHost) => void;
