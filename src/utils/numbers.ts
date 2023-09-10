export const isNumber = (value) => typeof value === 'number';

export const justNumbers = <T>(arr: T[]) => arr.filter(isNumber);

export const randomInt = (max: number) => Math.floor(Math.random() * max);
