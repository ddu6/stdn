export declare type STDNChar = string;
export declare type STDNUnitOptions = {
    [key: string]: STDN | string | number | boolean | undefined;
};
export interface STDNUnit {
    tag: string;
    children: STDN;
    options: STDNUnitOptions;
}
export declare type STDNInline = STDNUnit | STDNChar;
export declare type STDNLine = STDNInline[];
export declare type STDN = STDNLine[];
export declare type STDNUnitObject = {
    [key: string]: STDNArray | {
        __: STDNArray | string;
    } | string | number | boolean | undefined;
};
export declare type STDNInlineSTON = STDNUnitObject | string;
export declare type STDNLineSTON = STDNInlineSTON[] | STDNInlineSTON;
export declare type STDNArray = STDNLineSTON[];
export declare function parse(string: string): STDN | undefined;
export declare function stringify(stdn: STDN | undefined): string;
export declare function format(string: string): string;
