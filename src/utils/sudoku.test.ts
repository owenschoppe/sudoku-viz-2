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
  possibilitiesForBoard,
  isValidInput,
} from './sudoku';

const board: Board = [
  [0, 7, 1, 0, 0, 0, 0, 0, 1],
  [3, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 9, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 5, 9, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 8, 4],
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [1, 8, 1, 0, 0, 0, 1, 0, 0],
];

describe('grpValues', () => {
  it('should return first group', () => {
    const result = grpValues(board, 0);
    expect(result).toStrictEqual([0, 7, 1, 3, 0, 1, 0, 0, 1]);
  });

  it('should return last group', () => {
    const result = grpValues(board, 8);
    expect(result).toStrictEqual([1, 8, 4, 1, 0, 0, 1, 0, 0]);
  });

  it('should return middle group', () => {
    const result = grpValues(board, 4);
    expect(result).toStrictEqual([0, 0, 1, 0, 0, 0, 0, 5, 9]);
  });
});

describe('colValues', () => {
  it('should return first column', () => {
    const result = colValues(board, 0);
    expect(result).toStrictEqual([0, 3, 0, 0, 0, 1, 0, 0, 1]);
  });

  it('should return last column', () => {
    const result = colValues(board, 8);
    expect(result).toStrictEqual([1, 0, 0, 0, 0, 0, 4, 0, 0]);
  });

  it('should return middle column', () => {
    const result = colValues(board, 4);
    expect(result).toStrictEqual([0, 0, 1, 0, 0, 5, 0, 0, 0]);
  });
});

describe('rowValues', () => {
  it('should return first row', () => {
    const result = rowValues(board, 0);
    expect(result).toStrictEqual([0, 7, 1, 0, 0, 0, 0, 0, 1]);
  });

  it('should return last row', () => {
    const result = rowValues(board, 8);
    expect(result).toStrictEqual([1, 8, 1, 0, 0, 0, 1, 0, 0]);
  });

  it('should return middle row', () => {
    const result = rowValues(board, 4);
    expect(result).toStrictEqual([0, 9, 1, 0, 0, 0, 0, 0, 0]);
  });
});

describe('grpValuesExcluding', () => {
  it('should return first group', () => {
    const result = grpValExcluding(board, 0, 1);
    expect(result).toStrictEqual([0, 1, 3, 0, 1, 0, 0, 1]);
    expect(grpValues(board, 0)).toStrictEqual([0, 7, 1, 3, 0, 1, 0, 0, 1]);
  });

  it('should return last group', () => {
    const result = grpValExcluding(board, 6, 7);
    expect(result).toStrictEqual([1, 4, 1, 0, 0, 1, 0, 0]);
    expect(grpValues(board, 8)).toStrictEqual([1, 8, 4, 1, 0, 0, 1, 0, 0]);
  });

  it('should return middle group', () => {
    const result = grpValExcluding(board, 5, 5);
    expect(result).toStrictEqual([0, 0, 1, 0, 0, 0, 0, 5]);
    expect(grpValues(board, 4)).toStrictEqual([0, 0, 1, 0, 0, 0, 0, 5, 9]);
  });
});

describe('colValuesExcluding', () => {
  it('should return first column', () => {
    const result = colValExcluding(board, 1, 0);
    expect(result).toStrictEqual([0, 0, 0, 0, 1, 0, 0, 1]);
    expect(colValues(board, 0)).toStrictEqual([0, 3, 0, 0, 0, 1, 0, 0, 1]);
  });

  it('should return last column', () => {
    const result = colValExcluding(board, 6, 8);
    expect(result).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0]);
    expect(colValues(board, 8)).toStrictEqual([1, 0, 0, 0, 0, 0, 4, 0, 0]);
  });

  it('should return middle column', () => {
    const result = colValExcluding(board, 5, 4);
    expect(result).toStrictEqual([0, 0, 1, 0, 0, 0, 0, 0]);
    expect(colValues(board, 4)).toStrictEqual([0, 0, 1, 0, 0, 5, 0, 0, 0]);
  });
});

describe('rowValuesExcluding', () => {
  it('should return first row', () => {
    const result = rowValExcluding(board, 0, 1);
    expect(result).toStrictEqual([0, 1, 0, 0, 0, 0, 0, 1]);
    expect(board[0]).toHaveLength(9);
    expect(board[0]).toStrictEqual([0, 7, 1, 0, 0, 0, 0, 0, 1]);
  });

  it('should return last row', () => {
    const result = rowValExcluding(board, 8, 1);
    expect(result).toStrictEqual([1, 1, 0, 0, 0, 1, 0, 0]);
    expect(board[8]).toHaveLength(9);
    expect(board[8]).toStrictEqual([1, 8, 1, 0, 0, 0, 1, 0, 0]);
  });

  it('should return middle row', () => {
    const result = rowValExcluding(board, 4, 1);
    expect(result).toStrictEqual([0, 1, 0, 0, 0, 0, 0, 0]);
    expect(board[4]).toHaveLength(9);
    expect(board[4]).toStrictEqual([0, 9, 1, 0, 0, 0, 0, 0, 0]);
  });
});

const sudoku: Board = [
  [0, 0, 5, 0, 0, 0, 0, 0, 0],
  [2, 4, 1, 0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [9, 0, 0, 0, 0, 0, 0, 0, 0],
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

const badBoard: Board = [
  [3, 1, 6, 5, 7, 8, 4, 9, 2],
  [2, 4, 5, 1, 3, 6, 8, 8, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

describe('possibilitiesForCell', () => {
  it('should return possibilities for cell', () => {
    const result = possibilitiesForCell(sudoku, 1, 0);
    expect(result.possibilities).toStrictEqual({
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
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
    expect(result.value).toEqual(0);
  });

  it('should return mismatched possibility and value', () => {
    const result = possibilitiesForCell(badBoard, 1, 7);
    expect(result.possibilities).toStrictEqual({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 1,
      8: 0,
      9: 0,
    });
    expect(result.possibilityCount).toEqual(1);
    expect(result.value).toEqual(8);
  });
});

describe('possibilitiesForBoard', () => {
  it('should return possibility matrix', () => {
    const result = possibilitiesForBoard(sudoku);
    expect(result[1][0].possibilities).toEqual({
      1: 0,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
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
