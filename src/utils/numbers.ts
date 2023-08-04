export const isNumber = (value) => typeof value === 'number';

export const justNumbers = <T>(arr: T[]) => arr.filter(isNumber);
