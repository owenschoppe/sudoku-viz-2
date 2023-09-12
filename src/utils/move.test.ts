import { down, left, right, up } from './move';

describe('move', () => {
  describe('up', () => {
    it('should move up one row', () => {
      const result = up({ i: 1, j: 3 });
      expect(result).toStrictEqual({ i: 0, j: 3 });
    });

    it('should move wrap around', () => {
      const result = up({ i: 0, j: 3 });
      expect(result).toStrictEqual({ i: 8, j: 3 });
    });
  });

  describe('down', () => {
    it('should move up one row', () => {
      const result = down({ i: 1, j: 3 });
      expect(result).toStrictEqual({ i: 2, j: 3 });
    });

    it('should move wrap around', () => {
      const result = down({ i: 8, j: 3 });
      expect(result).toStrictEqual({ i: 0, j: 3 });
    });
  });

  describe('left', () => {
    it('should move up one row', () => {
      const result = left({ i: 1, j: 3 });
      expect(result).toStrictEqual({ i: 1, j: 2 });
    });

    it('should move wrap around', () => {
      const result = left({ i: 1, j: 0 });
      expect(result).toStrictEqual({ i: 1, j: 8 });
    });
  });

  describe('right', () => {
    it('should move up one row', () => {
      const result = right({ i: 1, j: 3 });
      expect(result).toStrictEqual({ i: 1, j: 4 });
    });

    it('should move wrap around', () => {
      const result = right({ i: 1, j: 8 });
      expect(result).toStrictEqual({ i: 1, j: 0 });
    });
  });
});
