import type { STONWithIndex } from 'ston';
import type { STDNWithIndexValue } from './parse-with-index';
export declare type STDNUnitWithIndexValueObject = {
    [key: string]: STONWithIndex<STDNWithIndexValueArray | STDNUnitWithIndexValueObject | string | number | boolean> | undefined;
};
export declare type STDNInlineWithIndexValueSTON = STDNUnitWithIndexValueObject | string;
export declare type STDNLineWithIndexValueSTON = STONWithIndex<STDNInlineWithIndexValueSTON>[] | STDNInlineWithIndexValueSTON;
export declare type STDNWithIndexValueArray = STONWithIndex<STDNLineWithIndexValueSTON>[];
export declare function stringifyWithComment(stdn: STONWithIndex<STDNWithIndexValue> | undefined): string;
