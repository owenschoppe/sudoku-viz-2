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
  Board,
  CellAddress,
  CellValue,
  CellsPerValue,
  PossibilitiesForBoard,
  PossibilitiesForCell,
} from '../types';
import { cloneDeep, indexToCoord } from './array';

// Generator = Solver and then subtract more or less values.
// Solver should use dynamic programming to find solution

export const loops = (
  board: Board,
  possibilities: PossibilitiesForBoard,
  cellsPerValue: CellsPerValue,
) => {
  console.log(board, possibilities, cellsPerValue);

  return;
};

export const getConnectedCellsInRow = (
  cell: CellAddress,
  cellSteps: Record<string, CellAddress>, // order doesn't matter
  valueSteps: Record<number, boolean>,
  possibilities: PossibilitiesForBoard,
  cellsPerValue: CellsPerValue,
) => {
  let unmatchedValue: CellValue = undefined;
  const possibleValues = possibilities[cell.i][cell.j].possibilities;
  const values = Object.keys(possibleValues) as unknown as CellValue[];
  for (const value of values) {
    if (possibleValues[value] && !valueSteps[possibleValues[value]]) {
      // there could be multiple unmatched values... how do we know if we collected them all since we only iterate on the first one?
      unmatchedValue = value;
      // exiting the loop early breaks the method.
      // Perhaps this is how the method insures we find all the values...
      // We check everything everytime so if anything is missing we add it?
      // break;
    }
  }
  if (unmatchedValue) {
    // add our current position and go deeper
    return getConnectedValuesInRow(
      unmatchedValue,
      cellSteps,
      { ...valueSteps, [unmatchedValue]: true },
      possibilities,
      cellsPerValue,
    );
  } else {
    // return cell steps as the loop
    return Object.values(cellSteps);
  }
};

//
const getConnectedValuesInRow = (
  value: CellValue,
  cellSteps: Record<string, CellAddress>, // order doesn't matter
  valueSteps: Record<number, boolean>,
  possibilities: PossibilitiesForBoard,
  cellsPerValue: CellsPerValue,
) => {
  let unmatchedCell: CellAddress = undefined;
  for (const cell of cellsPerValue[value]) {
    if (!cellSteps[cellString(cell)]) {
      // found unmatched cell, go deeper
      unmatchedCell = cell;
    }
  }
  if (unmatchedCell) {
    // return the results of the next iteration deeper
    return getConnectedCellsInRow(
      unmatchedCell,
      { ...cellSteps, [cellString(unmatchedCell)]: unmatchedCell },
      valueSteps,
      possibilities,
      cellsPerValue,
    );
  } else {
    // return cellSteps as the loop
    return Object.values(cellSteps);
  }
};

const cellString = (cell: CellAddress) => `${cell.i}-${cell.j}`;

export const cellsPerValueInRow = (
  i: number,
  possibilities: PossibilitiesForCell[],
) => {
  return possibilities.reduce(
    (
      values: CellsPerValue,
      cellPossibilities: PossibilitiesForCell,
      j: number,
    ) => {
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
