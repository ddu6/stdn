import type { STONObjectWithIndexValue, STONWithIndex } from 'ston';
export type STDNUnitOptionWithIndexValue = STDNUnitWithIndexValue | string | number | boolean;
export interface STDNUnitOptionsWithIndexValue {
    [key: string]: STONWithIndex<STDNUnitOptionWithIndexValue> | undefined;
}
export interface STDNUnitWithIndexValue extends STONObjectWithIndexValue {
    tag: STONWithIndex<string>;
    options: STONWithIndex<STDNUnitOptionsWithIndexValue>;
    children: STONWithIndex<STDNWithIndexValue>;
}
export type STDNLineWithIndexValue = STONWithIndex<STDNUnitWithIndexValue | string>[];
export type STDNWithIndexValue = STONWithIndex<STDNLineWithIndexValue>[];
export declare function parseWithIndex(string: string): STONWithIndex<STDNWithIndexValue> | undefined;
