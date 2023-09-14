import { CellAddress } from '../types';

export const up = (addr: CellAddress): CellAddress => ({
  ...addr,
  i: decrement(addr.i),
});
export const down = (addr: CellAddress): CellAddress => ({
  ...addr,
  i: increment(addr.i),
});
export const left = (addr: CellAddress): CellAddress => ({
  ...addr,
  j: decrement(addr.j),
});
export const right = (addr: CellAddress): CellAddress => ({
  ...addr,
  j: increment(addr.j),
});

const increment = (start: number) => move(start, +1, 9);
const decrement = (start: number) => move(start, -1, 9);

const move = (start: number, delta: number, modulo: number) =>
  (start + delta + modulo) % modulo;
