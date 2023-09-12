import { CellAddress } from '../types';

export const up = (location: CellAddress): CellAddress => {
  return Object.assign({ ...location, i: move(location.i, -1, 9) });
};
export const down = (location: CellAddress): CellAddress => {
  return Object.assign({ ...location, i: move(location.i, +1, 9) });
};
export const left = (location: CellAddress): CellAddress => {
  return Object.assign({ ...location, j: move(location.j, -1, 9) });
};
export const right = (location: CellAddress): CellAddress => {
  return Object.assign({ ...location, j: move(location.j, +1, 9) });
};
const move = (start: number, delta: number, modulo = 9) =>
  (start + delta + modulo) % modulo;
