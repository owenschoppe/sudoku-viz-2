export const slice2d = <T>(
  arr: T[][],
  rowStart: number,
  colStart: number,
  rowEnd?: number,
  colEnd?: number,
) => arr.slice(rowStart, rowEnd).map((row) => row.slice(colStart, colEnd));
