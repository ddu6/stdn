import type { STONWithIndex } from 'ston';
import type { STDNWithIndexValue } from './parse-with-index';
export type STDNUnitWithIndexValueObject = {
    [key: string]: STONWithIndex<STDNWithIndexValueArray | STDNUnitWithIndexValueObject | string | number | boolean> | undefined;
};
export type STDNInlineWithIndexValueSTON = STDNUnitWithIndexValueObject | string;
export type STDNLineWithIndexValueSTON = STONWithIndex<STDNInlineWithIndexValueSTON>[] | STDNInlineWithIndexValueSTON;
export type STDNWithIndexValueArray = STONWithIndex<STDNLineWithIndexValueSTON>[];
export declare function stringifyWithComment(stdn: STONWithIndex<STDNWithIndexValue> | undefined): string;
