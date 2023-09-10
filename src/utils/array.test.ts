import {
  cloneDeep,
  indexToCoord,
  possibilitiesObjectToArray,
  shuffle,
  slice2d,
} from './array';

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

describe('possibilitiesObjectToArray', () => {
  it('should return possibilities', () => {
    const result = possibilitiesObjectToArray({
      1: 1,
      2: 0,
      3: 1,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    });
    expect(result).toStrictEqual([1, 3]);
  });

  it('should return empty array', () => {
    const result = possibilitiesObjectToArray({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    });
    expect(result).toStrictEqual([]);
  });
});

describe('shuffle', () => {
  it('should return identity', () => {
    const result = shuffle([1]);
    expect(result).toEqual([1]);
  });

  it('should return shuffled array by 1', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
    const result = shuffle([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should return shuffled array by 0', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const result = shuffle([1, 2, 3]);
    expect(result).toEqual([3, 2, 1]);
  });

  it('should return shuffled array by 0', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    const result = shuffle([1, 2, 3]);
    expect(result).toEqual([2, 3, 1]);
  });
});

describe('cloneDeep', () => {
  it('should clone child arrays', () => {
    const arr = [[1]];
    const result = cloneDeep(arr);
    expect(result).toStrictEqual(arr);
    expect(result).not.toBe(arr);
    result[0][0] = 2;
    expect(result).not.toStrictEqual(arr);
  });

  it('should not clone child arrays', () => {
    const arr = [[1]];
    const result = [...arr];
    expect(result).toStrictEqual(arr);
    expect(result).not.toBe(arr);
    result[0][0] = 2;
    expect(result).toStrictEqual(arr);
  });

  it('should not clone array', () => {
    const arr = [[1]];
    const result = arr;
    expect(result).toStrictEqual(arr);
    expect(result).toBe(arr);
    result[0][0] = 2;
    expect(result).toStrictEqual(arr);
  });
});

describe('indexToCoord', () => {
  it('should return coord for middle cell', () => {
    const { i, j } = indexToCoord(24);
    expect(i).toBe(2);
    expect(j).toBe(6);
  });

  it('should return coord for start', () => {
    const { i, j } = indexToCoord(0);
    expect(i).toBe(0);
    expect(j).toBe(0);
  });

  it('should return coord for start', () => {
    const { i, j } = indexToCoord(1);
    expect(i).toBe(0);
    expect(j).toBe(1);
  });

  it('should return coord for start', () => {
    const { i, j } = indexToCoord(9);
    expect(i).toBe(1);
    expect(j).toBe(0);
  });

  it('should return coord for end', () => {
    const { i, j } = indexToCoord(80);
    expect(i).toBe(8);
    expect(j).toBe(8);
  });
});
