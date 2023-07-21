import { memoize } from './memoize';

describe('memoize', () => {
  it('should memoize string argument', () => {
    const mock = jest.fn().mockReturnValue('bar');
    const memoized = memoize(mock);
    const result = memoized('foo');
    const result2 = memoized('baz');
    const result3 = memoized('foo');
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });

  it('should memoize boolean argument', () => {
    const mock = jest.fn().mockReturnValue('bar');
    const memoized = memoize(mock);
    const result = memoized(true);
    const result2 = memoized(false);
    const result3 = memoized(true);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });

  it('should memoize object argument', () => {
    const mock = jest.fn().mockReturnValue('bar');
    const memoized = memoize(mock);
    const data = { bar: 'foo' };
    const result = memoized(data);
    const result2 = memoized({ bar: 'baz' });
    const result3 = memoized(data);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });

  it('should memoize array argument', () => {
    const mock = jest.fn().mockReturnValue('bar');
    const memoized = memoize(mock);
    const data = ['foo'];
    const result = memoized(data);
    const result2 = memoized(['baz']);
    const result3 = memoized(data);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });

  it('should memoize similar array arguments', () => {
    const mock = jest.fn().mockReturnValue('bar');
    const memoized = memoize(mock, JSON.stringify);
    const result = memoized(['foo']);
    const result2 = memoized(['baz']);
    const result3 = memoized(['foo']);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });

  it('should memoize string argument with custom cache', () => {
    const mock = jest.fn().mockReturnValue('bar');
    memoize.Cache = Map; //Can't be WeakMap
    const memoized = memoize(mock);
    const data = 'foo';
    const result = memoized(data);
    const result2 = memoized(['baz']);
    const result3 = memoized(data);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });

  it('should memoize array argument with custom cache', () => {
    const mock = jest.fn().mockReturnValue('bar');
    memoize.Cache = WeakMap;
    const memoized = memoize(mock);
    const data = ['foo'];
    const result = memoized(data);
    const result2 = memoized(['baz']);
    const result3 = memoized(data);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });

  it('should memoize object argument with custom cache', () => {
    const mock = jest.fn().mockReturnValue('bar');
    memoize.Cache = WeakMap;
    const memoized = memoize(mock);
    const data = { bar: 'foo' };
    const result = memoized(data);
    const result2 = memoized({ bar: 'baz' });
    const result3 = memoized(data);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
    expect(result2).toBe('bar');
    expect(result3).toBe('bar');
  });
});
