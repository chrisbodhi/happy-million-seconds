/* tslint:disable */
/* eslint-disable */
export function calculate_seconds_diff(birth_date: string, birth_time: string, birth_timezone: string, current_date: string, current_time: string, current_timezone: string): SecondsDiff;
export function format_milestone_date(birth_date: string, birth_time: string, birth_timezone: string, seconds_to_add: bigint, output_timezone: string): string;
export function get_all_timezones(): any;
export class SecondsDiff {
  private constructor();
  free(): void;
  readonly million: bigint;
  readonly billion: bigint;
  readonly trillion: bigint;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_secondsdiff_free: (a: number, b: number) => void;
  readonly secondsdiff_million: (a: number) => bigint;
  readonly secondsdiff_billion: (a: number) => bigint;
  readonly secondsdiff_trillion: (a: number) => bigint;
  readonly calculate_seconds_diff: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => [number, number, number];
  readonly format_milestone_date: (a: number, b: number, c: number, d: number, e: number, f: number, g: bigint, h: number, i: number) => [number, number, number, number];
  readonly get_all_timezones: () => any;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
