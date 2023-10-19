import { intToLetters } from './sudoku-loops';

export const cellToLabel = ({ i, j }: { i: number; j: number }) => {
  return `Cell ${intToLetters(i)}${j + 1}`;
};
