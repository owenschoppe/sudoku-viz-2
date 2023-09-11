import { Board } from '../types';
import { cloneDeep, possibilitiesObjectToArray } from './array';
import { possibilitiesForBoard, possibilitiesForCell } from './sudoku';
import {
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
    const boardPossibilities = possibilitiesForBoard(cloneDeep(simpleLoop));
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

  // add more complex test cases
  // three pairwise cells
  // three cells, mutually three values
});
