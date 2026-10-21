// MIT — Copyright (c) 2026 Macadam contributors. See LICENSE.
/** API2 consumes typed events and never runs plugin callbacks during export. */
export type PostValue = 'workOffset' | 'operationIndex' | 'toolSlot' | 'safeZ' | 'rpm' | 'angle' | 'x' | 'y' | 'z' | 'i' | 'j' | 'feed';
export type PostEventToken<V extends PostValue> = { readonly text: string } | {
  readonly value: V; readonly precision: 'integer' | 'coordinate';
  readonly prefix?: string; readonly suffix?: string; readonly optional?: boolean;
};
export type PostEventBlocks<V extends PostValue = never, L extends string = never> = readonly (
  | { readonly line: readonly PostEventToken<V>[] }
  | { readonly comment: readonly (PostEventToken<V> | { readonly label: L })[] }
)[];
export interface PostEventProfile {
  readonly units: 'mm' | 'inch';
  /** Defaults true; false emits an effective feed on every nonrapid motion. */
  readonly modalFeed?: boolean;
  readonly axes: 'xyz' | 'xyz-indexed-a';
  readonly arcs: 'none' | 'xy-incremental';
  readonly helices: boolean; readonly fullCircles: boolean;
  readonly defaultToolChange: 'manual' | 'automatic' | 'reject';
  readonly comment: { readonly prefix: string; readonly suffix: string };
  readonly events: {
    readonly programStart: PostEventBlocks<'workOffset'>;
    readonly operationStart: PostEventBlocks<'operationIndex', 'operationName' | 'operationId'>;
    readonly operationEnd: PostEventBlocks<'operationIndex', 'operationName' | 'operationId'>;
    readonly toolChangeAutomatic?: PostEventBlocks<'toolSlot' | 'safeZ', 'toolName'>;
    readonly toolChangeManual?: PostEventBlocks<'toolSlot' | 'safeZ', 'toolName'>;
    /** Low-level compatibility only; application export never uses this event. */
    readonly unmappedTool?: PostEventBlocks<never, 'toolName'>;
    readonly spindleCW?: PostEventBlocks<'rpm'>; readonly spindleCCW?: PostEventBlocks<'rpm'>;
    readonly spindleStop?: PostEventBlocks;
    readonly coolantOff?: PostEventBlocks; readonly coolantFlood?: PostEventBlocks; readonly coolantMist?: PostEventBlocks;
    readonly rotaryIndex?: PostEventBlocks<'angle'>;
    readonly rapid: PostEventBlocks<'x' | 'y' | 'z'>;
    readonly linear: PostEventBlocks<'x' | 'y' | 'z' | 'feed'>;
    readonly arcCW?: PostEventBlocks<'x' | 'y' | 'z' | 'i' | 'j' | 'feed'>;
    readonly arcCCW?: PostEventBlocks<'x' | 'y' | 'z' | 'i' | 'j' | 'feed'>;
    readonly retractRapid: PostEventBlocks<'x' | 'y' | 'z'>;
    readonly retractFeed: PostEventBlocks<'x' | 'y' | 'z' | 'feed'>;
    readonly programEnd: PostEventBlocks;
  };
}
export interface EventLocalPostProcessor {
  readonly id: string; readonly name: string; readonly apiVersion: '2';
  readonly extension: string; readonly mime: 'text/plain'; readonly aliases?: readonly string[];
  readonly profile: PostEventProfile;
}
/** Event fields use canonical millimetres/mm per minute and decimal-string tool slots.
 * Shared Rust lowers prepared operations, validates the complete stream and formats API2 output.
 * These event declarations describe that typed contract; JS does not receive per-move callbacks.
 */
export type PostProgramEvent =
  | { readonly type: 'programStart'; readonly units: 'mm' | 'inch'; readonly workOffset: 54 | 55 | 56 | 57 | 58 | 59 }
  | { readonly type: 'operationStart'; readonly id: string; readonly name: string; readonly index: number }
  | { readonly type: 'toolChange'; readonly mode: 'manual' | 'automatic'; readonly slot?: string; readonly toolName: string; readonly safeZ: number }
  | { readonly type: 'spindleStart'; readonly direction: 'cw' | 'ccw'; readonly rpm: number }
  | { readonly type: 'spindleStop' | 'operationEnd' | 'programEnd' }
  | { readonly type: 'coolant'; readonly mode: 'off' | 'flood' | 'mist' }
  | { readonly type: 'rotaryIndex'; readonly degrees: number }
  | { readonly type: 'motion'; readonly kind: 'rapid' | 'linear' | 'arcCW' | 'arcCCW'; readonly to: readonly [number, number, number]; readonly offset?: readonly [number, number]; readonly feed?: number; readonly moveIndex: number }
  | { readonly type: 'retract'; readonly rapid: boolean; readonly to: readonly [number, number, number]; readonly feed?: number; readonly moveIndex: number };
export interface PostOperationSettings { readonly spindleDirection?: 'cw' | 'ccw'; readonly coolant?: 'off' | 'flood' | 'mist' }
/** Implemented export options. Large tool slots MUST cross JSON as canonical decimal strings. */
export interface PostExportConfiguration {
  readonly postId: string;
  readonly postDefinition?: EventLocalPostProcessor;
  readonly units?: 'mm' | 'inch'; readonly toolChange?: 'manual' | 'automatic' | 'reject';
  readonly spindleDirection?: 'cw' | 'ccw'; readonly coolant?: 'off' | 'flood' | 'mist';
  readonly operations?: Readonly<Record<string, PostOperationSettings>>;
  readonly workOffset?: 54 | 55 | 56 | 57 | 58 | 59;
  readonly decimals?: number;
  readonly spindleRPM?: number;
  readonly defaultFeeds?: { readonly cutting: number; readonly plunge: number; readonly entry?: number };
  readonly toolSet?: { readonly name: string; readonly slots: readonly {
    readonly number: string; readonly entryID: string;
  }[] };
}
export type Postprocessor = EventLocalPostProcessor;
export interface PostprocessorHost { readonly apiVersion: '1'; registerPostProcessor(post: Postprocessor): void; }
