import type { STONObject } from 'ston';
export type STDNUnitOption = STDNUnit | string | number | boolean;
export interface STDNUnitOptions {
    [key: string]: STDNUnitOption | undefined;
}
export interface STDNUnit extends STONObject {
    tag: string;
    options: STDNUnitOptions;
    children: STDN;
}
export type STDNLine = (STDNUnit | string)[];
export type STDN = STDNLine[];
export declare function parse(string: string): STDN | undefined;
