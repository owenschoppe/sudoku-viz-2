import { justCellValues } from './numbers';

describe('justCellValues', () => {
  it('should return just cell values', () => {
    const result = justCellValues([
      'a',
      1,
      2,
      0,
      null,
      undefined,
      false,
      true,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      11,
      12,
      13,
    ]);
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
