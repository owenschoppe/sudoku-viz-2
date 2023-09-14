import { Board } from '../types';
import { cloneDeep, possibilitiesObjectToArray } from './core';
import { possibilitiesForBoard, possibilitiesForCell } from './sudoku';
import {
  searchAllCells,
  cellsPerValueInBoard,
  cellsPerValueInRow,
  getConnectedCellsInRow,
} from './sudoku-loops';

const simpleLoop: Board = [
  [2, 0, 4, 5, 6, 7, 0, 8, 9],
  [0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 3, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 3],
  [1, 0, 0, 0, 3, 0, 0, 0, 0],
];

const complexLoop: Board = [
  [0, 0, 4, 5, 6, 7, 0, 8, 9],
  [0, 2, 0, 4, 0, 0, 1, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0],
  [3, 0, 8, 9, 5, 0, 0, 6, 7],
  [0, 0, 0, 0, 0, 3, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 3],
  [1, 0, 0, 0, 3, 0, 0, 0, 0],
];

const fourCellLoop: Board = [
  [8, 9, 4, 2, 7, 6, 5, 3, 1],
  [6, 2, 7, 3, 5, 1, 8, 9, 4],
  [3, 5, 1, 8, 9, 4, 7, 6, 2],
  [4, 7, 5, 6, 0, 8, 9, 0, 3],
  [9, 8, 6, 5, 0, 3, 4, 0, 7],
  [2, 1, 3, 9, 4, 7, 6, 8, 5],
  [5, 6, 9, 7, 3, 2, 1, 4, 8],
  [7, 4, 2, 1, 8, 9, 3, 5, 6],
  [1, 3, 8, 4, 6, 5, 2, 7, 9],
];

describe('possibilities', () => {
  it('should have specified possibilites', () => {
    // select 4 cells and ensure that they have the defined possibilities in order to build the board
    // then test loops on the board, pass all possibilities
    const cell1 = possibilitiesForCell(complexLoop, 0, 1);
    const cell2 = possibilitiesForCell(complexLoop, 0, 6);
    const cell3 = possibilitiesForCell(complexLoop, 3, 1);
    const cell4 = possibilitiesForCell(complexLoop, 3, 6);
    expect(possibilitiesObjectToArray(cell1.possibilities)).toStrictEqual([
      1, 3,
    ]);
    expect(possibilitiesObjectToArray(cell2.possibilities)).toStrictEqual([
      2, 3,
    ]);
    expect(possibilitiesObjectToArray(cell3.possibilities)).toStrictEqual([
      1, 4,
    ]);
    expect(possibilitiesObjectToArray(cell4.possibilities)).toStrictEqual([
      2, 4,
    ]);
  });

  it('should have possibilites 1,2', () => {
    // select 4 cells and ensure that they have the defined possibilities in order to build the board
    // then test loops on the board, pass all possibilities
    const cell1 = possibilitiesForCell(fourCellLoop, 3, 4);
    const cell2 = possibilitiesForCell(fourCellLoop, 4, 4);
    const cell3 = possibilitiesForCell(fourCellLoop, 3, 7);
    const cell4 = possibilitiesForCell(fourCellLoop, 4, 7);
    expect(possibilitiesObjectToArray(cell1.possibilities)).toStrictEqual([
      1, 2,
    ]);
    expect(possibilitiesObjectToArray(cell2.possibilities)).toStrictEqual([
      1, 2,
    ]);
    expect(possibilitiesObjectToArray(cell3.possibilities)).toStrictEqual([
      1, 2,
    ]);
    expect(possibilitiesObjectToArray(cell4.possibilities)).toStrictEqual([
      1, 2,
    ]);
  });
});

describe('cellsPerValueInRow', () => {
  it('should return cells', () => {
    const boardPossibilities = possibilitiesForBoard(simpleLoop);
    const cellsPerValue = {
      1: [
        { i: 0, j: 1 },
        { i: 0, j: 6 },
      ],
      2: [{ i: 0, j: 0 }],
      3: [
        { i: 0, j: 1 },
        { i: 0, j: 6 },
      ],
      4: [{ i: 0, j: 2 }],
      5: [{ i: 0, j: 3 }],
      6: [{ i: 0, j: 4 }],
      7: [{ i: 0, j: 5 }],
      8: [{ i: 0, j: 7 }],
      9: [{ i: 0, j: 8 }],
    };
    const result = cellsPerValueInRow(0, boardPossibilities[0]);
    expect(result).toStrictEqual(cellsPerValue);
  });
});

describe('cellsPerValueInBoard', () => {
  xit('should return cells', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(complexLoop));
    const cellsPerValue = {
      1: [
        { i: 0, j: 1 },
        { i: 0, j: 6 },
      ],
      2: [{ i: 0, j: 0 }],
      3: [
        { i: 0, j: 1 },
        { i: 0, j: 6 },
      ],
      4: [{ i: 0, j: 2 }],
      5: [{ i: 0, j: 3 }],
      6: [{ i: 0, j: 4 }],
      7: [{ i: 0, j: 5 }],
      8: [{ i: 0, j: 7 }],
      9: [{ i: 0, j: 8 }],
    };
    const result = cellsPerValueInBoard(boardPossibilities);
    expect(result).toStrictEqual(cellsPerValue);
  });

  it('should return extra cells 3,4 4,4 3,7 4,7', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(fourCellLoop));
    const result = cellsPerValueInBoard(boardPossibilities);
    expect(result).toStrictEqual(fourCellLoopCellsPerValue);
  });
});

describe('getConnectedCellsInRow', () => {
  it('should return loop in row', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(simpleLoop));
    const cellsPerValue = cellsPerValueInRow(0, boardPossibilities[0]);
    expect(
      getConnectedCellsInRow(
        { i: 0, j: 1 },
        {},
        {},
        boardPossibilities,
        cellsPerValue,
      ),
    ).toStrictEqual([
      { i: 0, j: 6 },
      { i: 0, j: 1 },
    ]);
  });

  it('should return loop in fourCell row 3', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(fourCellLoop));
    const cellsPerValue = cellsPerValueInRow(3, boardPossibilities[3]);
    expect(
      getConnectedCellsInRow(
        { i: 3, j: 4 },
        {},
        {},
        boardPossibilities,
        cellsPerValue,
      ),
    ).toStrictEqual([
      {
        i: 3,
        j: 7,
      },
      {
        i: 3,
        j: 4,
      },
    ]);
  });

  it('should return loop in fourCell row 4', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(fourCellLoop));
    const cellsPerValue = cellsPerValueInRow(4, boardPossibilities[4]);
    expect(
      getConnectedCellsInRow(
        { i: 4, j: 4 },
        {},
        {},
        boardPossibilities,
        cellsPerValue,
      ),
    ).toStrictEqual([
      {
        i: 4,
        j: 7,
      },
      {
        i: 4,
        j: 4,
      },
    ]);
  });

  it('should return loop in fourCell row 4', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(fourCellLoop));
    const cellsPerValue = cellsPerValueInRow(4, boardPossibilities[4]);
    expect(
      getConnectedCellsInRow(
        { i: 4, j: 4 },
        {},
        {},
        boardPossibilities,
        cellsPerValue,
      ),
    ).toStrictEqual([
      {
        i: 4,
        j: 7,
      },
      {
        i: 4,
        j: 4,
      },
    ]);
  });

  // add more complex test cases
  // three pairwise cells
  // three cells, mutually three values
});

describe('searchAllCells', () => {
  it('should return all loops in both rows', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(fourCellLoop));
    expect(searchAllCells(boardPossibilities)).toStrictEqual([
      [
        {
          i: 3,
          j: 7,
        },
        {
          i: 3,
          j: 4,
        },
      ],
      [
        {
          i: 4,
          j: 7,
        },
        {
          i: 4,
          j: 4,
        },
      ],
    ]);
  });
});

describe('getConnectedCellsInBoard', () => {
  // doesn't work
  xit('should return loop in board', () => {
    const boardPossibilities = possibilitiesForBoard(cloneDeep(fourCellLoop));
    const cellsPerValue = cellsPerValueInBoard(boardPossibilities);
    expect(
      getConnectedCellsInRow(
        { i: 3, j: 4 },
        {},
        {},
        boardPossibilities,
        cellsPerValue,
      ),
    ).toStrictEqual([]);
  });
});

const fourCellLoopCellsPerValue = {
  '1': [
    { i: 0, j: 8 },
    { i: 1, j: 5 },
    { i: 2, j: 2 },
    { i: 3, j: 4 },
    { i: 3, j: 7 },
    { i: 4, j: 4 },
    { i: 4, j: 7 },
    { i: 5, j: 1 },
    { i: 6, j: 6 },
    { i: 7, j: 3 },
    { i: 8, j: 0 },
  ],
  '2': [
    { i: 0, j: 3 },
    { i: 1, j: 1 },
    { i: 2, j: 8 },
    { i: 3, j: 4 },
    { i: 3, j: 7 },
    { i: 4, j: 4 },
    { i: 4, j: 7 },
    { i: 5, j: 0 },
    { i: 6, j: 5 },
    { i: 7, j: 2 },
    { i: 8, j: 6 },
  ],
  '3': [
    { i: 0, j: 7 },
    { i: 1, j: 3 },
    { i: 2, j: 0 },
    { i: 3, j: 8 },
    { i: 4, j: 5 },
    { i: 5, j: 2 },
    { i: 6, j: 4 },
    { i: 7, j: 6 },
    { i: 8, j: 1 },
  ],
  '4': [
    { i: 0, j: 2 },
    { i: 1, j: 8 },
    { i: 2, j: 5 },
    { i: 3, j: 0 },
    { i: 4, j: 6 },
    { i: 5, j: 4 },
    { i: 6, j: 7 },
    { i: 7, j: 1 },
    { i: 8, j: 3 },
  ],
  '5': [
    { i: 0, j: 6 },
    { i: 1, j: 4 },
    { i: 2, j: 1 },
    { i: 3, j: 2 },
    { i: 4, j: 3 },
    { i: 5, j: 8 },
    { i: 6, j: 0 },
    { i: 7, j: 7 },
    { i: 8, j: 5 },
  ],
  '6': [
    { i: 0, j: 5 },
    { i: 1, j: 0 },
    { i: 2, j: 7 },
    { i: 3, j: 3 },
    { i: 4, j: 2 },
    { i: 5, j: 6 },
    { i: 6, j: 1 },
    { i: 7, j: 8 },
    { i: 8, j: 4 },
  ],
  '7': [
    { i: 0, j: 4 },
    { i: 1, j: 2 },
    { i: 2, j: 6 },
    { i: 3, j: 1 },
    { i: 4, j: 8 },
    { i: 5, j: 5 },
    { i: 6, j: 3 },
    { i: 7, j: 0 },
    { i: 8, j: 7 },
  ],
  '8': [
    { i: 0, j: 0 },
    { i: 1, j: 6 },
    { i: 2, j: 3 },
    { i: 3, j: 5 },
    { i: 4, j: 1 },
    { i: 5, j: 7 },
    { i: 6, j: 8 },
    { i: 7, j: 4 },
    { i: 8, j: 2 },
  ],
  '9': [
    { i: 0, j: 1 },
    { i: 1, j: 7 },
    { i: 2, j: 4 },
    { i: 3, j: 6 },
    { i: 4, j: 0 },
    { i: 5, j: 3 },
    { i: 6, j: 2 },
    { i: 7, j: 5 },
    { i: 8, j: 8 },
  ],
};
