import { Board } from '../types';
import {
  difficultyLevel,
  exploreOptions,
  generateBoard,
  solve,
} from './sudoku-solver';

const puzzleStart: Board = [
  [3, null, 6, 5, null, 8, 4, null, null],
  [5, 2, null, null, null, null, null, null, null],
  [null, 8, 7, null, null, null, null, 3, 1],
  [null, null, 3, null, 1, null, null, 8, null],
  [9, null, null, 8, 6, 3, null, null, 5],
  [null, 5, null, null, 9, null, 6, null, null],
  [1, 3, null, null, null, null, 2, 5, null],
  [null, null, null, null, null, null, null, 7, 4],
  [null, null, 5, 2, null, 6, 3, null, null],
];

// Can have many many solutions.
const generatorStart: Board = [
  [3, 1, 6, 5, 7, 8, 4, 9, 2],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
];

const solution: Board = [
  [3, 1, 6, 5, 7, 8, 4, 9, 2],
  [5, 2, 9, 1, 3, 4, 7, 6, 8],
  [4, 8, 7, 6, 2, 9, 5, 3, 1],
  [2, 6, 3, 4, 1, 5, 9, 8, 7],
  [9, 7, 4, 8, 6, 3, 1, 2, 5],
  [8, 5, 1, 7, 9, 2, 6, 4, 3],
  [1, 3, 8, 9, 4, 7, 2, 5, 6],
  [6, 9, 2, 3, 5, 1, 8, 7, 4],
  [7, 4, 5, 2, 8, 6, 3, 1, 9],
];

const solution2: Board = [
  [3, 1, 6, 5, 7, 8, 4, 9, 2],
  [2, 4, 5, 1, 3, 9, 6, 7, 8],
  [7, 8, 9, 2, 4, 6, 1, 3, 5],
  [1, 2, 3, 4, 5, 7, 8, 6, 9],
  [4, 5, 8, 6, 9, 1, 3, 2, 7],
  [6, 9, 7, 3, 8, 2, 5, 1, 4],
  [5, 3, 1, 7, 2, 4, 9, 8, 6],
  [8, 6, 2, 9, 1, 5, 7, 4, 3],
  [9, 7, 4, 8, 6, 3, 2, 5, 1],
];

const almostFinalBoard: Board = [
  [3, 1, 6, 5, 7, 8, 4, 9, 2],
  [2, 4, 5, 1, 3, 9, 6, 7, 8],
  [7, 8, 9, 2, 4, 6, 1, 3, 5],
  [1, 2, 3, 4, 5, 7, 8, 6, 9],
  [4, 5, 8, 6, 9, 1, 3, 2, 7],
  [6, 9, 7, 3, 8, 2, 5, 1, 4],
  [5, 3, 1, 7, 2, 4, 9, 8, 6],
  [8, 6, 2, 9, 1, 5, 7, 4, 3],
  [9, 7, 4, 8, 6, 3, 2, 5, null],
];

describe('solver', () => {
  it('should generate board', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
    let result = solve(generatorStart, 0);
    expect(result).toStrictEqual(solution2);
  });

  it('should finish board', () => {
    let result = solve(almostFinalBoard, 80);
    expect(result).toStrictEqual(solution2);
  });

  it('should solve puzzle', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
    let result = solve(puzzleStart, 0);
    expect(result).toStrictEqual(solution);
  });
});

describe('exploreOptions', () => {
  it('should return first option', () => {
    const mockExplore = jest.fn().mockImplementation((option) => option);
    const mockParams = jest.fn().mockImplementation((option) => [option]);
    const mockSuccess = jest.fn().mockImplementation((x) => !!x);
    const result = exploreOptions(
      mockExplore,
      mockParams,
      mockSuccess,
      [true, true, true],
      'foo',
    );
    expect(result).toBeTruthy();
    expect(mockExplore).toHaveBeenCalledTimes(1);
    expect(mockParams).toHaveBeenCalledTimes(1);
    expect(mockParams).toHaveBeenCalledWith(true, 'foo');
  });

  it('should return third option', () => {
    const mockExplore = jest.fn().mockImplementation((option) => option);
    const mockParams = jest.fn().mockImplementation((option) => [option]);
    const mockSuccess = jest.fn().mockImplementation((x) => !!x);
    const result = exploreOptions(
      mockExplore,
      mockParams,
      mockSuccess,
      [false, false, true],
      'foo',
    );
    expect(result).toBeTruthy();
    expect(mockExplore).toHaveBeenCalledTimes(3);
    expect(mockParams).toHaveBeenCalledTimes(3);
    expect(mockParams.mock.calls).toEqual([
      [false, 'foo'],
      [false, 'foo'],
      [true, 'foo'],
    ]);
  });

  it('should return false', () => {
    const mockExplore = jest.fn().mockImplementation((option) => option);
    const mockParams = jest.fn().mockImplementation((option) => [option]);
    const mockSuccess = jest.fn().mockImplementation((x) => x);
    const result = exploreOptions(
      mockExplore,
      mockParams,
      mockSuccess,
      [],
      'foo',
    );
    expect(result).toBeFalsy();
    expect(mockExplore).toHaveBeenCalledTimes(0);
    expect(mockParams).toHaveBeenCalledTimes(0);
  });
});

describe('generateBoard', () => {
  it('should generate easy board', () => {
    const result = generateBoard(difficultyLevel.EASY);
    console.log(result);
    expect(result.flat()).toHaveLength(81);
    const emptyCells = result
      .flat()
      .map((x) => x === null)
      .filter(Boolean).length;
    expect(emptyCells).toBeGreaterThanOrEqual(33);
    expect(emptyCells).toBeLessThanOrEqual(37);
  });

  it('should generate med board', () => {
    const result = generateBoard(difficultyLevel.MED);
    expect(result.flat()).toHaveLength(81);
    const emptyCells = result
      .flat()
      .map((x) => x === null)
      .filter(Boolean).length;
    expect(emptyCells).toBeGreaterThanOrEqual(28);
    expect(emptyCells).toBeLessThanOrEqual(32);
  });

  it('should generate hard board', () => {
    const result = generateBoard(difficultyLevel.HARD);
    expect(result.flat()).toHaveLength(81);
    const emptyCells = result
      .flat()
      .map((x) => x === null)
      .filter(Boolean).length;
    expect(emptyCells).toBeGreaterThanOrEqual(23);
    expect(emptyCells).toBeLessThanOrEqual(27);
  });
});
