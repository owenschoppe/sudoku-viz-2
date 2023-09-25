// Loops/Chains (Groups of cells with possibilities that are linked together)
// Two (N) cells in a row/col/group that share the same two (N) possibilities
// ex: [0,0]:[1,2]=>[0,3]:[1:2] end (two cells, two values)
// 1:[[0,0],[0,3]] 2:[[0,0],[0,3]] simple case, cell lists are the same.
// ex: [0,0]:[1,2]=>[0,3]:[1:3]=>[0,4]:[2,3] end (three values, three cells) but only 2 for each value.
// 1:[[0,0],[0,3]] 2:[[0,0],[0,4]] 3:[[0,3],[0,4]]
// 4 or more? cells that are linked by row/col/group possibilities
// ex: [0,0]:[1,2]=>[0,3]:[2:4]=>[1,5]:[4:5]=>[1,0]:[1:5] end (4 cells, 4 values)
// Let's solve the simpler cases first and see how we can generalize.
// For row, for values 1-9, collect possible cells. Sort by cell list length.
// For for each cell in list for value, if possible value > cell list length then abort.??
// Otherwise, run the loop. cell 0 of value 1 has two options; 1 and 2.
// We're on 1, so take 2. Recursively call function on value 2.
// What do we return?
// How do we exit?
// Pass in the chain of cells and values, if found start (or any subpart?), return steps. else walk possibilities. else return false deadend.
// if if found start OR if all cells are contained in the current cell chain array?

import {
  CellAddress,
  CellValue,
  CellsPerValue,
  PossibilitiesForBoard,
  PossibilitiesForCell,
} from '../types';
import { NNArray, cloneDeep, indexToCoord, keyBy, memoize } from './core';
import {
  AddressToMemberFn,
  MemberToAddressFn,
  addressToColumnMember,
  addressToGroupMember,
  addressToRowMember,
  colMemberIndexToCell,
  colValues,
  groupMemberIndexToCell,
  grpValues,
  rowMemberIndexToCell,
  rowValues,
} from './sudoku';

const cellString = (cell: CellAddress) => `${cell.i}-${cell.j}`;

/**
 * Get connected cells for the current cell.
 * Must be repeated for every unsearched cell in the row.
 * @param cell Current cell
 * @param possibilities
 * @param cellsPerValue
 * @param cellSteps Cells processed so far
 * @param valueSteps Values processed so far
 * @returns Will always only be a single array with 0-9 cells.
 */
export const getConnectedCells = (
  cell: CellAddress,
  possibilities: PossibilitiesForBoard,
  cellsPerValue: CellsPerValue,
  cellSteps: Record<string, CellAddress> = {}, // order doesn't matter
  valueSteps: Record<number, boolean> = {},
): CellAddress[] => {
  const possibleValues = possibilities[cell.i][cell.j].possibilities;
  const values = Object.keys(possibleValues) as unknown as CellValue[];
  const unmatchedValues = values.filter(
    (value) => possibleValues[value] && !valueSteps[possibleValues[value]],
  );
  const unmatchedValue = unmatchedValues.slice(-1)[0]; // ?

  return unmatchedValue
    ? getConnectedValues(
        unmatchedValue,
        possibilities,
        cellsPerValue,
        cellSteps,
        { ...valueSteps, [unmatchedValue]: true },
      )
    : Object.values(cellSteps);
};

/**
 *
 * @param value Current value
 * @param possibilities
 * @param cellsPerValue
 * @param cellSteps
 * @param valueSteps
 * @returns
 */
const getConnectedValues = (
  value: CellValue,
  possibilities: PossibilitiesForBoard,
  cellsPerValue: CellsPerValue,
  cellSteps: Record<string, CellAddress> = {}, // order doesn't matter
  valueSteps: Record<number, boolean> = {},
) => {
  const unmatchedCells = cellsPerValue[value].filter(
    (cell) => !cellSteps[cellString(cell)],
  );
  const unmatchedCell = unmatchedCells.slice(-1)[0]; // ?
  return unmatchedCell
    ? getConnectedCells(
        unmatchedCell,
        possibilities,
        cellsPerValue,
        { ...cellSteps, [cellString(unmatchedCell)]: unmatchedCell },
        valueSteps,
      )
    : Object.values(cellSteps);
};

export const cellsPerValueInRows = (
  boardPossibilities: PossibilitiesForBoard,
) => cellsPerValue(rowValues, rowMemberIndexToCell, boardPossibilities);

export const cellsPerValueInCols = (
  boardPossibilities: PossibilitiesForBoard,
) => cellsPerValue(colValues, colMemberIndexToCell, boardPossibilities);

export const cellsPerValueInGroups = (
  boardPossibilities: PossibilitiesForBoard,
) => cellsPerValue(grpValues, groupMemberIndexToCell(), boardPossibilities);

export const cellsPerValue = (
  valuesFn: typeof rowValues | typeof colValues | typeof grpValues,
  addressFn: MemberToAddressFn,
  boardPossibilities: PossibilitiesForBoard,
): CellsPerValue[] => {
  return Array(9)
    .fill(0)
    .map((_, index) => {
      const possibilities = valuesFn(boardPossibilities, index);
      return possibilities.reduce(
        (
          values: CellsPerValue,
          cellPossibilities: PossibilitiesForCell,
          member: number,
        ) => {
          const address = addressFn(index, member);
          return Object.entries(cellPossibilities.possibilities).reduce(
            (acc, [value, possible]) => {
              if (possible) acc[value].push(address);
              return acc;
            },
            values,
          );
        },
        cloneDeep(baseCellsPerValue),
      );
    });
};

// Bad
export const cellsPerValueInBoard = (possibilities: PossibilitiesForBoard) => {
  return possibilities
    .flat()
    .reduce(
      (
        values: CellsPerValue,
        cellPossibilities: PossibilitiesForCell,
        index: number,
      ) => {
        const { i, j } = indexToCoord(index);
        return Object.entries(cellPossibilities.possibilities).reduce(
          (acc, [value, possible]) => {
            if (possible) acc[value].push({ i, j });
            return acc;
          },
          values,
        );
      },
      cloneDeep(baseCellsPerValue),
    );
};

const baseCellsPerValue = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
} as CellsPerValue;

type CellsPerValueFn =
  | typeof cellsPerValueInRows
  | typeof cellsPerValueInCols
  | typeof cellsPerValueInGroups;

export type Loop = CellAddress[];

export type LoopType = 'row' | 'column' | 'group';

export type LoopObj = {
  loop: Loop;
  id: string;
  color?: string;
};

type LoopFns = {
  addressToSliceFn: AddressToMemberFn;
  cellsPerValueFn: CellsPerValueFn;
};

const loopFns = {
  row: {
    addressToSliceFn: addressToRowMember,
    cellsPerValueFn: cellsPerValueInRows,
  } as LoopFns,
  column: {
    addressToSliceFn: addressToColumnMember,
    cellsPerValueFn: cellsPerValueInCols,
  } as LoopFns,
  group: {
    addressToSliceFn: addressToGroupMember,
    cellsPerValueFn: cellsPerValueInGroups,
  } as LoopFns,
};

/**
 * Get all loops for the board by row, column, or group.
 * Uses the board as a cache to avoid rework and to allow easy visualization.
 * How might we link these loops together?
 * Would it be better to get a flat array of loops and then generate a board with loop ids?
 * @param boardP
 * @param addressToSliceFn
 * @param cellsPerValueFn
 * @returns
 */
export const getLoopsForBoardByType = (
  boardP: PossibilitiesForBoard,
  type: keyof typeof loopFns,
): LoopObj[][] => {
  const getLoopId = nextId();
  const { addressToSliceFn, cellsPerValueFn } = loopFns[type];
  const memoizedCPV = memoize(cellsPerValueFn);
  return boardP.reduce((cache, row, i) => {
    row.forEach((_, j) => {
      if (!cache[i][j]) {
        const { slice } = addressToSliceFn({ i, j });
        const cPV = memoizedCPV(boardP)[slice];
        const loop = getConnectedCells({ i, j }, boardP, cPV);
        if (loop.length > 1) {
          const id = getLoopId();
          loop.forEach(({ i: m, j: n }) => {
            // add color, index, or name of loop?
            cache[m][n] = { loop, id };
          });
        }
      }
    });
    return cache;
  }, NNArray(9, null));
};

export const nextId = (init = 0) => {
  let next = init;
  return () => {
    return intToLetters(next++);
  };
};

export const intToLetters = (int: number, str = '', place = 1) => {
  const letter = String.fromCharCode((int % 26) + 65) + str;
  if (int < 26 * place) {
    return letter;
  } else {
    return intToLetters(int - 26 * place, letter, place * 26);
  }
};

// export const getLoopsForBoard2 = (
//   boardP: PossibilitiesForBoard,
//   addressToSliceFn: AddressToMemberFn,
//   cellsPerValueFn: CellsPerValueFn,
// ): Loop[][][] => {
//   const memoizedCPV = memoize(cellsPerValueFn);
//   const cache = NNArray(9, []);
//   for(let index = 0; index < 81; index++){
//     const { i, j } = indexToCoord(index);
//     if (!cache[i][j].length) {
//         const { slice } = addressToSliceFn({ i, j });
//         const cPV = memoizedCPV(boardP)[slice];
//         const loop = getConnectedCells({ i, j }, boardP, cPV);
//         if (loop.length > 1) {
//           loop.forEach(({ i: m, j: n }) => {
//             // add color, index, or name of loop?
//             cache[m][n].push(loop);
//           });
//         }
//       }
//   }
//   return cache;
// };

// For each cell we want to check for loops in all three directions and then merge and continue to spider out
// We could have three versions of this function but it is then difficult to merge the data
// Could be ok, if we just want to visualize the different loops
export const searchAllRows = (
  boardPossibilities: PossibilitiesForBoard,
): CellAddress[][] => {
  let foundCells = {}; // memo for cell addresses
  const memoizedCellsPerValueInRow = memoize(cellsPerValueInRows);
  let results = [];
  for (let index = 0; index < 81; index++) {
    const { i, j } = indexToCoord(index);
    const address = { i, j };
    const key = cellString(address);
    if (!foundCells[key]) {
      const cellsPerValue = memoizedCellsPerValueInRow(boardPossibilities)[i];
      // Also search columns and groups?
      const rowLoops = getConnectedCells(
        address,
        boardPossibilities,
        cellsPerValue,
      );
      if (rowLoops.length > 1) {
        results.push(rowLoops);
      }
      foundCells = { ...foundCells, ...keyBy(rowLoops, cellString) };
    }
  }
  return results;
};
