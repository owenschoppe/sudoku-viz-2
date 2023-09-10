import { Board } from '../types';
import { possibilitiesForBoard } from './sudoku';
import { cellsPerValueInRow, getConnectedCellsInRow } from './sudoku-loops';

const simpleLoop: Board = [
  [2, null, 4, 5, 6, 7, null, 8, 9],
  [null, null, null, 1, null, null, null, null, null],
  [null, null, null, 3, null, null, null, null, null],
  [3, null, null, null, null, 1, null, null, null],
  [null, null, null, null, null, 3, null, 1, null],
  [null, null, 1, null, null, null, null, 3, null],
  [null, null, 3, null, null, null, null, null, 1],
  [null, null, null, null, 1, null, null, null, 3],
  [1, null, null, null, 3, null, null, null, null],
];

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

describe('getConnectedCellsInRow', () => {
  it('should return loop in row', () => {
    const boardPossibilities = possibilitiesForBoard(simpleLoop);
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
