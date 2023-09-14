export const keyBy = <T>(
  array: T[],
  fn: (item: T, index: number) => string,
): { [key: string]: T } => {
  return array.reduce((acc, cur, index) => {
    acc[fn(cur, index)] = cur;
    return acc;
  }, {});
};
