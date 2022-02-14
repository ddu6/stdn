import type { STONObjectWithIndexValue, STONWithIndex } from 'ston';
export declare type STDNUnitOptionWithIndexValue = STDNUnitWithIndexValue | string | number | boolean;
export interface STDNUnitOptionsWithIndexValue {
    [key: string]: STONWithIndex<STDNUnitOptionWithIndexValue> | undefined;
}
export interface STDNUnitWithIndexValue extends STONObjectWithIndexValue {
    tag: STONWithIndex<string>;
    options: STONWithIndex<STDNUnitOptionsWithIndexValue>;
    children: STONWithIndex<STDNWithIndexValue>;
}
export declare type STDNLineWithIndexValue = STONWithIndex<STDNUnitWithIndexValue | string>[];
export declare type STDNWithIndexValue = STONWithIndex<STDNLineWithIndexValue>[];
export declare function parseWithIndex(string: string): STONWithIndex<STDNWithIndexValue> | undefined;
