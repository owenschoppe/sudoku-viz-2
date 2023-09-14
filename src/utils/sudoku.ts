// Old app the board data structure was [i][j][k]
// where k[0] is the cell value where 0 is empty
// and k[1-9] is the binary probability of that number being in that cell
// value of 0 means it can't be that value, value of 1 means it can be.

import { Board, Possibilities, PossibilitiesForBoard } from '../types';
import { justCellValues, slice2d, unique } from './core';

// boards: 201 one of the main challenges is undoing a board move. just because we remove a value from a cell doesn't mean it then becomes legal for all related cells

/**
 * Compute all the possible moves on the current state of the sudoku board
 * @param board
 * @returns { possibilities: { [1-9]: 0 || 1 }, possibilityCount: number, value: 0 | CellValue }[][] Where 0 means the cell can't be that value and 1 means it can be
 */
export const possibilitiesForBoard = (board: Board): PossibilitiesForBoard => {
  return board.map((row, i) =>
    row.map((_, j) => possibilitiesForCell(board, i, j)),
  );
};

/**
 * Get an object representing all the possibilities for a cell
 * TODO: catch the case when the possibility of a value is 0 for all other cells in row, col, or group. Chain of length 1?
 * @param board Sudoku board {1-9}[][]
 * @param i Row index
 * @param j Column index
 * @returns { possibilities: { [1-9]: 0 || 1 }, possibilityCount: number, value: 0 | CellValue } Where 0 means the cell can't be that value and 1 means it can be
 */
export const possibilitiesForCell = (board: Board, i: number, j: number) => {
  const basePossibilities = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1,
    9: 1,
  } as Possibilities;
  const taken = allValuesExcludingCell(board, i, j);
  const possibilities = taken.reduce((current, value) => {
    current[value] = 0;
    return current;
  }, basePossibilities);
  return {
    possibilities,
    possibilityCount: 9 - taken.length,
    value: board[i][j],
  };
};

/**
 * Efficient computation of which values are taken, excluding the current cell's value
 * @param board
 * @param i
 * @param j
 * @returns
 */
export const allValuesExcludingCell = (board: Board, i: number, j: number) => {
  return justCellValues(
    unique(
      [rowValExcluding, colValExcluding, grpValExcluding].flatMap((fn) =>
        fn(board, i, j),
      ),
    ),
  );
};

/**
 * Efficient computation of which values are taken
 * @param board
 * @param i
 * @param j
 * @returns number[] of unique values in rows, columns, groups
 */
export const allRelatedValues = (board: Board, i: number, j: number) =>
  justCellValues(
    unique(
      rowValues(board, i).concat(
        colValues(board, j),
        grpValues(board, cellToGroupIndex[i][j]),
      ),
    ),
  );
// Do we need to filter null?
// Should null be 0?

export const rowValExcluding = (board: Board, i: number, j: number) => {
  const values = rowValues(board, i);
  values.splice(j, 1);
  return values;
};

export const colValExcluding = (board: Board, i: number, j: number) => {
  const values = colValues(board, j);
  values.splice(i, 1);
  return values;
};

export const grpValExcluding = (board: Board, i: number, j: number) => {
  const values = grpValues(board, cellToGroupIndex[i][j]);
  const index = cellToGroupMemberIndex[i][j];
  values.splice(index, 1);
  return values;
};

export const rowValues = (board: Board, i: number) => board[i].slice();

export const colValues = (board: Board, j: number) =>
  board.map((row) => row[j]);

/**
 * should this take g or i,j?
 * @param board
 * @param g
 * @returns
 */
export const grpValues = (board: Board, g: number) => {
  const [rowStart, colStart] = groupStartCoords[g];
  return slice2d(board, rowStart, colStart, rowStart + 3, colStart + 3).flat();
};

const cellToGroupIndex = [
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [0, 0, 0, 1, 1, 1, 2, 2, 2],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [3, 3, 3, 4, 4, 4, 5, 5, 5],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
  [6, 6, 6, 7, 7, 7, 8, 8, 8],
];

const cellToGroupMemberIndex = [
  [0, 1, 2, 0, 1, 2, 0, 1, 2],
  [3, 4, 5, 3, 4, 5, 3, 4, 5],
  [6, 7, 8, 6, 7, 8, 6, 7, 8],
  [0, 1, 2, 0, 1, 2, 0, 1, 2],
  [3, 4, 5, 3, 4, 5, 3, 4, 5],
  [6, 7, 8, 6, 7, 8, 6, 7, 8],
  [0, 1, 2, 0, 1, 2, 0, 1, 2],
  [3, 4, 5, 3, 4, 5, 3, 4, 5],
  [6, 7, 8, 6, 7, 8, 6, 7, 8],
];

const groupStartCoords: [rowStart: number, colStart: number][] = [
  [0, 0],
  [0, 3],
  [0, 6],
  [3, 0],
  [3, 3],
  [3, 6],
  [6, 0],
  [6, 3],
  [6, 6],
];

export const isValidInput = (
  input: string | number,
  possibilities: Possibilities,
) => {
  return !!possibilities[Number(input)] ?? false;
};
