import type { STONWithIndex } from 'ston';
import type { STDNLineWithIndexValue, STDNUnitWithIndexValue, STDNWithIndexValue } from './parse-with-index';
import type { STDNPosition } from './position';
export declare function posiitonToUnitOrLinesWithIndex(position: STDNPosition, stdn: STONWithIndex<STDNWithIndexValue>, offset?: number): STONWithIndex<STDNUnitWithIndexValue | STDNLineWithIndexValue>[];
