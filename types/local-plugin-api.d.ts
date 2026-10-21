// MIT — Copyright (c) 2026 Macadam contributors. See LICENSE.
// Public local package API 1 plus STAGING PREVIEW additions at f372c6ad.
// document:author, cam:postprocess, author actions and post registration are absent
// from production reference 6058b429. See docs/compatibility.md before installing.
// Editor assistance only; the app supplies the runtime.
// The general typed builder/evaluator contract (KernelBuilder, defineFeature, typed selection
// refs, EvaluateContext) exists in the engine source marked PLANNED and is deliberately excluded
// here — it is not a shipping capability.

export type LocalCapability =
  | 'command:run' | 'document:read' | 'parameters:write' | 'feature:solid' | 'kernel:build'
  | 'cam:postprocess' | 'document:author';

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

/**
 * An authoring reference points at the result of an earlier step of the same author program.
 * It preserves exact native feature identity and scope — plugin code never invents raw IDs.
 */
export interface LocalAuthoringReference { readonly $feature: string }
// Local keys: lowercase first ASCII character, then letters/digits/_/-, at most 64 bytes.
// path contains earlier local container keys, never existing-document UUIDs.
// Only sketch steps currently expose a typed profile source for profile selections.

export type PluginAuthoringStep =
  | { readonly op: 'parameter'; readonly name: string;
      readonly kind: 'length' | 'angle' | 'scalar';
      /** Create-only; requires parameters:write. Existing names reject the program. SI units. */
      readonly value: number }
  | { readonly op: 'sketch'; readonly key: string; readonly name: string;
      readonly plane: 'xy' | 'xz' | 'yz'; readonly path?: readonly string[] }
  | { readonly op: 'feature'; readonly key: string; readonly name: string;
      /** Existing shared registry command with an ordinary feature factory. */
      readonly command: string;
      /** Reflected field keys. Selection values use LocalAuthoringReference, never raw topology IDs. */
      readonly fields: Readonly<Record<string, string | number | boolean | LocalAuthoringReference | readonly LocalAuthoringReference[]>>;
      readonly path?: readonly string[] };

// PREVIEW limits: 256 KiB encoded JSON; nonblank label <=160 bytes; 1..256 steps.
export interface PluginAuthoringProgram {
  readonly version: '1';
  readonly label: string;
  readonly steps: readonly PluginAuthoringStep[];
}

/** Exactly one synchronous, JSON-serializable action. No Promise, action array or arbitrary host call. */
export type PluginAction =
  | { readonly type: 'message'; readonly text: string }
  | { readonly type: 'setParameter'; readonly name: string;
      readonly kind: 'length' | 'angle' | 'scalar'; readonly value: number }
  /** Requires BOTH document:author and kernel:build. Applied as one undoable host change. */
  | { readonly type: 'author'; readonly program: PluginAuthoringProgram };

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

export type PrimitiveTemplate = {
  readonly dx: string; readonly dy: string; readonly dz: string;
  readonly rx?: string; readonly ry?: string; readonly rz?: string;
  readonly anchor?: string;
  readonly kind: string;
  readonly dims: Readonly<Record<string, string>>;
};

export interface LocalPluginFeature {
  readonly id: string;
  readonly name: string;
  readonly surface: 'solid';
  readonly params: Readonly<Record<string, NumericPluginParameter>>;
  /** The native primitive body encoding; ${parameter} expands to the stored expression. */
  readonly template: { readonly primitive: PrimitiveTemplate };
  /** Deliberately unavailable: the host rejects JavaScript geometry callbacks. */
  readonly evaluate?: never;
}

// ── Postprocessors (cam:postprocess) ──────────────────────────────────────────────────────────────

export type PostToken = { readonly text: string } | {
  readonly value: 'workOffset' | 'toolSlot' | 'rpm' | 'rotaryAngle';
  readonly precision: 'integer' | 'coordinate';
};
export type PostBlocks = readonly (readonly PostToken[])[];

export interface PostProfile {
  readonly units: 'mm';
  readonly axes: 'xyz-indexed-a';
  readonly arcs: 'xy-incremental';
  readonly comment: 'parentheses' | 'semicolon';
  readonly headerLabel: string;
  readonly motion: { readonly rapid: string; readonly linear: string; readonly cwArc: string; readonly ccwArc: string };
  readonly requireMappedTool: boolean;
  readonly programStart: PostBlocks;
  readonly toolChange: PostBlocks;
  readonly spindleStart: PostBlocks;
  readonly spindleStop: PostBlocks;
  readonly rotaryIndex: PostBlocks;
  readonly programEnd: PostBlocks;
}

/** Legacy profile shape (the post's own apiVersion '1'). */
export interface LegacyLocalPostProcessor {
  readonly id: string;
  readonly name: string;
  readonly apiVersion: '1';
  readonly extension: string;
  readonly mime: 'text/plain';
  readonly aliases?: readonly string[];
  readonly profile: PostProfile;
}

/**
 * STAGING PREVIEW event profile (post apiVersion 2). The full MIT contract is
 * in ./local-post-event-profile.d.ts. This type does not provide an export call.
 */
export type LocalPostProcessor = LegacyLocalPostProcessor | EventLocalPostProcessor;

export interface EventLocalPostProcessor {
  readonly id: string;
  readonly name: string;
  readonly apiVersion: '2';
  readonly extension: string;
  readonly mime: 'text/plain';
  readonly aliases?: readonly string[];
  readonly profile: import('./local-post-event-profile').PostEventProfile;
}

/** The complete package API 1 host, not the broader editor scripting object. */
export interface LocalPluginHost {
  readonly apiVersion: '1';
  registerCommand(command: LocalPluginCommand): void;
  registerFeature(feature: LocalPluginFeature): void;
  /** STAGING PREVIEW only; requires cam:postprocess. */
  registerPostProcessor(post: LocalPostProcessor): void;
}

// Event and export shapes are documentation, not new callable host methods.
export type { PostValue, PostEventToken, PostEventBlocks, PostEventProfile,
  PostProgramEvent, PostOperationSettings, PostExportConfiguration, Postprocessor,
  PostprocessorHost } from './local-post-event-profile';

export type ActivatePlugin = (host: LocalPluginHost) => void;
