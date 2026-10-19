// MIT — Copyright (c) 2026 Macadam contributors. See LICENSE.
// Implemented local API 1 declarations only; no host implementation is distributed.
// Extraction: 9b02ab40176298e97382880b466b764e91713809:web/plugin-api.ts

/** Implemented local-package surface. The general evaluator/builder contract above is planned. */
export interface LocalPluginManifest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly apiVersion: '1';
  readonly entry: string;
  readonly icon?: string;
  /** sha256- digest of the entry for single-file packages, or the documented canonical JS bundle for multi-file packages. */
  readonly integrity?: string;
  readonly capabilities: readonly ('command:run' | 'document:read' | 'parameters:write' | 'feature:solid' | 'kernel:build')[];
}
export type PluginAction =
  | { readonly type: 'message'; readonly text: string }
  | { readonly type: 'setParameter'; readonly name: string; readonly kind: 'length' | 'angle' | 'scalar'; readonly value: number };
export interface LocalPluginCommand {
  readonly id: string;
  readonly name: string;
  /** Shared palette icon name. Defaults to the generic plugin glyph. */
  readonly icon?: string;
  /** Portable key spelling such as shift+cmd+r. Omit when the host should not bind a key. */
  readonly shortcut?: string;
  /** Selection capability used by the shared palette ranker. */
  readonly actsOn?: 'none' | 'edge' | 'face' | 'loop' | 'body' | 'sketch' | 'profile';
  run(context: { readonly document?: {
    readonly features: readonly { readonly id: string; readonly name: string; readonly kind: string }[];
    readonly parameters: readonly { readonly name: string; readonly kind: string; readonly value: number; readonly resolved: boolean }[];
  } }): PluginAction;
}
export interface LocalPluginFeature {
  readonly id: string;
  readonly name: string;
  readonly surface: 'solid';
  readonly params: Readonly<Record<string, { readonly kind: 'length' | 'angle' | 'scalar' | 'count'; readonly label: string; readonly default: string }>>;
  /** The native primitive body encoding; ${parameter} expands to the stored expression. */
  readonly template: { readonly primitive: {
    readonly kind: string;
    readonly dims: Readonly<Record<string, string>>;
    readonly dx: string; readonly dy: string; readonly dz: string;
    readonly rx?: string; readonly ry?: string; readonly rz?: string;
    readonly anchor?: string;
  } };
}
export interface LocalPluginHost {
  readonly apiVersion: '1';
  registerCommand(command: LocalPluginCommand): void;
  registerFeature(feature: LocalPluginFeature): void;
}
