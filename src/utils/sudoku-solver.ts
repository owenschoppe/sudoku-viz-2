import { randomInt } from 'crypto';
import {
  NNArray,
  cloneDeep,
  indexToCoord,
  possibilitiesObjectToArray,
  shuffle,
} from './array';
import { possibilitiesForCell } from './sudoku';
import { Board } from '../types';

export enum difficultyLevel {
  HARD,
  MED,
  EASY,
}

/**
 * Evidently boards with more blank values are easier to solve than boards with fewer.
 * Perhaps this is due to the increasing number of possible solutions.
 */
const difficultyLevelValues = {
  [difficultyLevel.HARD]: [23, 24, 25, 26, 27],
  [difficultyLevel.MED]: [28, 29, 30, 31, 32],
  [difficultyLevel.EASY]: [33, 34, 35, 36, 37],
};

/**
 * Generate a board for the given difficulty level
 * @param difficulty difficultyLevel.EASY, difficultyLevel.MED, difficultyLevel.HARD
 * @returns
 */
export const generateBoard = (
  difficulty: difficultyLevel = difficultyLevel.EASY,
) =>
  removeValues(
    solve(generateSeed(), 9),
    difficultyLevelValues[difficulty][randomInt(5)],
  );

export const generateSeed = (): Board => [
  shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  ...NNArray(9, 0).slice(1),
];

export const removeValues = (board: Board, values: number) => {
  while (values) {
    const i = randomInt(9);
    const j = randomInt(9);
    if (board[i][j]) {
      board[i][j] = 0;
      values -= 1;
    }
  }
  return board;
};

/**
 * Uses depth first search to solve the board starting from index
 * @param board Partial sudoku board to solve
 * @param index Optional starting index 0-80. Will be converted to i,j coordinates.
 * @returns Solved sudoku board
 */
export const solve = (board: Board, index = 0) => {
  const { i, j } = indexToCoord(index);
  const possibilities = possibilitiesForCell(board, i, j);
  const possibleValues = possibilitiesObjectToArray(
    possibilities.possibilities,
  );
  let result: Board | false = false;
  if (index == 80) {
    // last cell, solved?
    board[i][j] = possibilities.value || possibleValues[0];
    result = board;
  } else if (index < 80 && possibilities.value) {
    // skip this cell
    result = solve(board, index + 1);
  } else if (!possibilities.value) {
    // select an option and explore that path
    result = exploreOptions(
      solve,
      updateBoardTemp,
      (result: Board | false) => !!result,
      shuffle(possibleValues),
      board,
      index,
    );
  }
  return result;
};

export const updateBoardTemp = (option, board, index) => {
  const { i, j } = indexToCoord(index);
  const newBoard = cloneDeep(board);
  newBoard[i][j] = option;
  return [newBoard, index + 1];
};

/**
 * Depth First Search utility function
 * @param exploreFn Recursive function that uses this util
 * @param exploreParams Function to generate the params for the explore function based on the selected option
 * @param successFn Function to determine if the returned result is a success
 * @param options Array of options to explore at this level/node
 * @param args Any additional arguments that need to be passed to the exploreParams function
 * @returns Successful result or False
 */
export const exploreOptions = (
  exploreFn: (...any) => any,
  exploreParams: (...any) => any[],
  successFn: (any) => boolean,
  options: any[],
  ...args: any
) => {
  for (const option of options) {
    const result = exploreFn(...exploreParams(option, ...args));
    if (successFn(result)) {
      return result;
    }
  }
  return false;
};
