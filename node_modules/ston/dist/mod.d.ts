export declare type STONObject = {
    [key: string]: STON;
};
export declare type STONObjectValueWithIndex = {
    [key: string]: STONWithIndex;
};
export declare type STONArray = STON[];
export declare type STONArrayValueWithIndex = STONWithIndex[];
export declare type STON = STONObject | STONArray | string | number | boolean;
export declare type STONValueWithIndex = STONObjectValueWithIndex | STONArrayValueWithIndex | string | number | boolean;
export declare type STONWithIndex = {
    value: STONValueWithIndex;
    index: number;
};
export declare function parseWithIndex(string: string, index?: number): STONWithIndex | undefined;
export declare function parse(string: string): STON | undefined;
export interface BeautifyOptions {
    indentTarget?: 'none' | 'all' | 'array' | 'object' | 'arrayInObject' | 'arrayInObjectAndThis';
    indentLevel?: number;
    addDecorativeComma?: 'never' | 'always' | 'inObject';
}
export declare function stringify(ston: STON | undefined, beautifyOptions?: BeautifyOptions): string;
