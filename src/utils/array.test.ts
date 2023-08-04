import { slice2d } from './array';

const array2d = [
  [0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 1],
  [0, 0, 1, 0, 0, 0],
  [1, 0, 1, 0, 0, 0],
];

const array2dResult = [
  [1, 1, 0],
  [1, 0, 1],
  [1, 0, 0],
];

describe('slice2d', () => {
  it('should return 2d slice of array', () => {
    const result = slice2d(array2d, 1, 2, 4, 5);
    expect(result).toStrictEqual(array2dResult);
  });

  it('should return 2d slice of array to end', () => {
    const result = slice2d(array2d, 1, 2);
    expect(result).toStrictEqual([
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 0, 0, 1],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
    ]);
  });

  it('should return 2d slice of array to end if end is out of bounds', () => {
    const result = slice2d(array2d, 1, 2, 8, 8);
    expect(result).toStrictEqual([
      [1, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 0, 0, 1],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
    ]);
  });

  it('should return identity', () => {
    const result = slice2d(array2d, 0, 0);
    expect(result).toStrictEqual(array2d);
  });

  it('should return empty array', () => {
    const result = slice2d([], 3, 3);
    expect(result).toStrictEqual([]);
  });

  it('should return empty array if start is out of bounds', () => {
    const result = slice2d([[1, 2, 3, 4, 5]], 3, 3);
    expect(result).toStrictEqual([]);
  });
});
