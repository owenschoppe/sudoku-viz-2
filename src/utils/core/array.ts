import { CellValue, Possibilities } from '../../types';
import { randomInt } from './numbers';

export const slice2d = <T>(
  arr: T[][],
  rowStart: number,
  colStart: number,
  rowEnd?: number,
  colEnd?: number,
) => arr.slice(rowStart, rowEnd).map((row) => row.slice(colStart, colEnd));

export const NNArray = (n: number, fill: any) =>
  Array(n)
    .fill(null)
    .map(() =>
      Array(n)
        .fill(null)
        .map(() => cloneDeep(fill)),
    );

/**
 * Convert index to coordinates
 * @param index 0-80 indexed number of a cell in 9x9 grid
 * @returns 0 indexed row, col coordinates
 */
export const indexToCoord = (index: number) => {
  const i = ~~(index / 9);
  const j = index % 9;
  return { i, j };
};

export const possibilitiesObjectToArray = (
  possibilities: Possibilities,
): CellValue[] =>
  Object.entries(possibilities).reduce((acc, [value, possible]) => {
    if (possible) {
      acc.push(Number(value));
    }
    return acc;
  }, []);

/**
 * Clone arbitarily nested objects and arrays and primitive values.
 * Does not support more complex classes like Map and Set
 * Consider using Object.getPrototypeOf(map) === Map.prototype to expand support
 * @param obj any[] | {}
 * @returns any[] | {}
 */
export const cloneDeep = (obj: any[] | {}) => {
  if (Array.isArray(obj)) {
    return obj.map(cloneDeep);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = cloneDeep(value);
      return acc;
    }, {});
  } else {
    return obj;
  }
};

export const shuffle = (arr: any[]) =>
  arr.reduce((acc, cur) => {
    const index = randomInt(acc.length);
    acc.splice(index, 0, cur);
    return acc;
  }, []);
