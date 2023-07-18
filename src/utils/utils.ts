/**
 * Memoizes the output of a function to improve performance.
 * @param fn Function to memoize
 * @param resolver Custom function that returns a key for the args. By default the first arg is used. arg[0]
 * @returns memoized function
 *
 * Customize the cache by updating `memoize.Cache` to be Map or WeakMap.
 * WeakMap is preferred for object and array args because it allows old data to be garbage collected.
 */
export const memoize = <F extends Function, R extends Function>(
  fn: F,
  resolver?: R,
) => {
  if (
    typeof fn != 'function' ||
    (resolver != null && typeof resolver != 'function')
  ) {
    throw new TypeError('Arguments are not of correct type');
  }

  const memoized = (...args) => {
    const cache = memoized.cache;
    const key = resolver ? resolver(args) : args[0];
    const cached = cache.get(key);

    if (cached !== undefined) {
      return cached;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || Map)();
  return memoized;
};

memoize.Cache = Map as typeof Map | typeof WeakMap;
