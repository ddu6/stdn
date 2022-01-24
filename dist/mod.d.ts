import type { STONObjectWithIndexValue, STONWithIndex } from 'ston';
export declare type STDNUnitOption = STDN | string | number | boolean;
export declare type STDNUnitOptionWithIndexValue = STDNWithIndexValue | string | number | boolean;
export interface STDNUnitOptions {
    [key: string]: STDNUnitOption | undefined;
}
export interface STDNUnitOptionsWithIndexValue extends STONObjectWithIndexValue {
    [key: string]: STONWithIndex<STDNUnitOptionWithIndexValue> | undefined;
}
export interface STDNUnit {
    tag: string;
    options: STDNUnitOptions;
    children: STDN;
}
export interface STDNUnitWithIndexValue extends STONObjectWithIndexValue {
    tag: STONWithIndex<string>;
    options: STONWithIndex<STDNUnitOptionsWithIndexValue>;
    children: STONWithIndex<STDNWithIndexValue>;
}
export declare type STDNLine = (STDNUnit | string)[];
export declare type STDNLineWithIndexValue = STONWithIndex<STDNUnitWithIndexValue | string>[];
export declare type STDN = STDNLine[];
export declare type STDNWithIndexValue = STONWithIndex<STDNLineWithIndexValue>[];
export declare type STDNUnitObject = {
    [key: string]: STDNArray | {
        __: STDNArray | string;
    } | string | number | boolean | undefined;
};
export declare type STDNInlineSTON = STDNUnitObject | string;
export declare type STDNLineSTON = STDNInlineSTON[] | STDNInlineSTON;
export declare type STDNArray = STDNLineSTON[];
export declare function parse(string: string): STDN | undefined;
export declare function parseWithIndex(string: string): STONWithIndex<STDNWithIndexValue> | undefined;
export declare function stringify(stdn: STDN | undefined): string;
export declare function format(string: string): string;
