import type { STDN } from './parse';
export type STDNUnitObject = {
    [key: string]: STDNArray | STDNUnitObject | string | number | boolean | undefined;
};
export type STDNInlineSTON = STDNUnitObject | string;
export type STDNLineSTON = STDNInlineSTON[] | STDNInlineSTON;
export type STDNArray = STDNLineSTON[];
export declare function stringify(stdn: STDN | undefined): string;
