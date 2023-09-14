export const isNumber = (value) => typeof value === 'number';

export const justNumbers = <T>(arr: T[]) => arr.filter(isNumber);

const cellValues = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
};

export const isCellValue = (value) => !!cellValues[value];

export const justCellValues = <T>(arr: T[]) => arr.filter(isCellValue);

export const randomInt = (max: number) => Math.floor(Math.random() * max);
