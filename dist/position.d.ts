import type { STDN, STDNLine, STDNUnit } from './parse';
export declare type STDNPosition = (number | string)[];
export declare function parsePositionStr(string: string): (string | number)[];
export declare function stringifyPosition(position: STDNPosition): string;
export declare function positionToUnitOrLines(position: STDNPosition, stdn: STDN, offset?: number): (STDNUnit | STDNLine)[];
