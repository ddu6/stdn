import type { STONObject } from 'ston';
export declare type STDNUnitOption = STDNUnit | string | number | boolean;
export interface STDNUnitOptions {
    [key: string]: STDNUnitOption | undefined;
}
export interface STDNUnit extends STONObject {
    tag: string;
    options: STDNUnitOptions;
    children: STDN;
}
export declare type STDNLine = (STDNUnit | string)[];
export declare type STDN = STDNLine[];
export declare function parse(string: string): STDN | undefined;
