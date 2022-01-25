import type { STDN } from './parse';
export declare type STDNUnitObject = {
    [key: string]: STDNArray | {
        __: STDNArray | string;
    } | string | number | boolean | undefined;
};
export declare type STDNInlineSTON = STDNUnitObject | string;
export declare type STDNLineSTON = STDNInlineSTON[] | STDNInlineSTON;
export declare type STDNArray = STDNLineSTON[];
export declare function stringify(stdn: STDN | undefined): string;
