import { Board } from '../types';
import {
  colValues,
  grpValues,
  allRelatedValues,
  rowValues,
  allValuesExcludingCell,
  grpValExcluding,
  colValExcluding,
  rowValExcluding,
  possibilitiesForCell,
  possibilities,
  isValidInput,
} from './sudoku';

const board: Board = [
  [null, 7, 1, null, null, null, null, null, 1],
  [3, null, 1, 1, null, null, null, null, null],
  [null, null, 1, null, 1, null, null, null, null],
  [null, null, 1, null, null, 1, null, null, null],
  [null, 9, 1, null, null, null, null, null, null],
  [1, null, 1, null, 5, 9, null, null, null],
  [null, null, 1, null, null, 1, 1, 8, 4],
  [null, null, 1, null, null, null, 1, null, null],
  [1, 8, 1, null, null, null, 1, null, null],
];

describe('grpValues', () => {
  it('should return first group', () => {
    const result = grpValues(board, 0);
    expect(result).toStrictEqual([null, 7, 1, 3, null, 1, null, null, 1]);
  });

  it('should return last group', () => {
    const result = grpValues(board, 8);
    expect(result).toStrictEqual([1, 8, 4, 1, null, null, 1, null, null]);
  });

  it('should return middle group', () => {
    const result = grpValues(board, 4);
    expect(result).toStrictEqual([null, null, 1, null, null, null, null, 5, 9]);
  });
});

describe('colValues', () => {
  it('should return first column', () => {
    const result = colValues(board, 0);
    expect(result).toStrictEqual([null, 3, null, null, null, 1, null, null, 1]);
  });

  it('should return last column', () => {
    const result = colValues(board, 8);
    expect(result).toStrictEqual([
      1,
      null,
      null,
      null,
      null,
      null,
      4,
      null,
      null,
    ]);
  });

  it('should return middle column', () => {
    const result = colValues(board, 4);
    expect(result).toStrictEqual([
      null,
      null,
      1,
      null,
      null,
      5,
      null,
      null,
      null,
    ]);
  });
});

describe('rowValues', () => {
  it('should return first row', () => {
    const result = rowValues(board, 0);
    expect(result).toStrictEqual([null, 7, 1, null, null, null, null, null, 1]);
  });

  it('should return last row', () => {
    const result = rowValues(board, 8);
    expect(result).toStrictEqual([1, 8, 1, null, null, null, 1, null, null]);
  });

  it('should return middle row', () => {
    const result = rowValues(board, 4);
    expect(result).toStrictEqual([
      null,
      9,
      1,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  });
});

describe('grpValuesExcluding', () => {
  it('should return first group', () => {
    const result = grpValExcluding(board, 0, 1);
    expect(result).toStrictEqual([null, 1, 3, null, 1, null, null, 1]);
    expect(grpValues(board, 0)).toStrictEqual([
      null,
      7,
      1,
      3,
      null,
      1,
      null,
      null,
      1,
    ]);
  });

  it('should return last group', () => {
    const result = grpValExcluding(board, 6, 7);
    expect(result).toStrictEqual([1, 4, 1, null, null, 1, null, null]);
    expect(grpValues(board, 8)).toStrictEqual([
      1,
      8,
      4,
      1,
      null,
      null,
      1,
      null,
      null,
    ]);
  });

  it('should return middle group', () => {
    const result = grpValExcluding(board, 5, 5);
    expect(result).toStrictEqual([null, null, 1, null, null, null, null, 5]);
    expect(grpValues(board, 4)).toStrictEqual([
      null,
      null,
      1,
      null,
      null,
      null,
      null,
      5,
      9,
    ]);
  });
});

describe('colValuesExcluding', () => {
  it('should return first column', () => {
    const result = colValExcluding(board, 1, 0);
    expect(result).toStrictEqual([null, null, null, null, 1, null, null, 1]);
    expect(colValues(board, 0)).toStrictEqual([
      null,
      3,
      null,
      null,
      null,
      1,
      null,
      null,
      1,
    ]);
  });

  it('should return last column', () => {
    const result = colValExcluding(board, 6, 8);
    expect(result).toStrictEqual([1, null, null, null, null, null, null, null]);
    expect(colValues(board, 8)).toStrictEqual([
      1,
      null,
      null,
      null,
      null,
      null,
      4,
      null,
      null,
    ]);
  });

  it('should return middle column', () => {
    const result = colValExcluding(board, 5, 4);
    expect(result).toStrictEqual([null, null, 1, null, null, null, null, null]);
    expect(colValues(board, 4)).toStrictEqual([
      null,
      null,
      1,
      null,
      null,
      5,
      null,
      null,
      null,
    ]);
  });
});

describe('rowValuesExcluding', () => {
  it('should return first row', () => {
    const result = rowValExcluding(board, 0, 1);
    expect(result).toStrictEqual([null, 1, null, null, null, null, null, 1]);
    expect(board[0]).toHaveLength(9);
    expect(board[0]).toStrictEqual([
      null,
      7,
      1,
      null,
      null,
      null,
      null,
      null,
      1,
    ]);
  });

  it('should return last row', () => {
    const result = rowValExcluding(board, 8, 1);
    expect(result).toStrictEqual([1, 1, null, null, null, 1, null, null]);
    expect(board[8]).toHaveLength(9);
    expect(board[8]).toStrictEqual([1, 8, 1, null, null, null, 1, null, null]);
  });

  it('should return middle row', () => {
    const result = rowValExcluding(board, 4, 1);
    expect(result).toStrictEqual([null, 1, null, null, null, null, null, null]);
    expect(board[4]).toHaveLength(9);
    expect(board[4]).toStrictEqual([
      null,
      9,
      1,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  });
});

const sudoku: Board = [
  [null, null, 5, null, null, null, null, null, null],
  [2, 4, 1, null, null, null, 3, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [9, null, null, null, null, null, null, null, null],
];
describe('allRelatedValues', () => {
  it('should return taken values for cell', () => {
    const result = allRelatedValues(sudoku, 1, 0);
    expect(result).toStrictEqual([2, 4, 1, 3, 9, 5]);
  });
});

describe('allValuesExcludingCell', () => {
  it('should return taken values for cell excluding cell', () => {
    const result = allValuesExcludingCell(sudoku, 1, 0);
    expect(result).toStrictEqual([4, 1, 3, 9, 5]);
  });
});

describe('possibilitiesForCell', () => {
  it('should return possibilities for cell', () => {
    const result = possibilitiesForCell(sudoku, 1, 0);
    expect(result.possibilities).toStrictEqual({
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 1,
      8: 1,
      9: 0,
    });
    expect(result.possibilityCount).toEqual(4);
    expect(result.value).toEqual(2);
  });

  it('should return possibilities for cell with no related values', () => {
    const result = possibilitiesForCell(sudoku, 7, 7);
    expect(result.possibilities).toStrictEqual({
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
    });
    expect(result.possibilityCount).toEqual(9);
    expect(result.value).toEqual(null);
  });
});

describe('possibilities', () => {
  it('should return possibility matrix', () => {
    const result = possibilities(sudoku);
    expect(result[1][0].possibilities).toEqual({
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 1,
      8: 1,
      9: 0,
    });
    expect(result[1][0].possibilityCount).toEqual(4);
    expect(result[1][0].value).toEqual(2);
  });
});

describe('isValidInput', () => {
  it('should return true', () => {
    const result = isValidInput('2', {
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 1,
      8: 1,
      9: 0,
    });
    expect(result).toBeTruthy();
  });

  it('should return false for taken value', () => {
    const result = isValidInput('3', {
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 1,
      8: 1,
      9: 0,
    });
    expect(result).toBeFalsy();
  });

  it('should return false for 0', () => {
    const result = isValidInput('0', {
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 1,
      8: 1,
      9: 0,
    });
    expect(result).toBeFalsy();
  });

  it('should return false for non-numeric', () => {
    const result = isValidInput('z', {
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 1,
      7: 1,
      8: 1,
      9: 0,
    });
    expect(result).toBeFalsy();
  });
});
