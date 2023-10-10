export const debounce = (fn: (...args: any) => void, ms: number) => {
  let timeout = null;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
};

export const debouncedSearch = (
  options: string[],
  callback: (i: number) => void,
) => {
  let query: string = '';

  const debouncedQueryReset = debounce(() => {
    query = '';
  }, 500);

  return (e: KeyboardEvent) => {
    if (ignoreKeys[e.key]) return;
    query += e.key;
    debouncedQueryReset();
    callback(
      options.reduceRight((found, current, i) => {
        if (current.toLowerCase().startsWith(`${query}`.toLowerCase())) {
          found = i;
        }
        return found;
      }, -1),
    );
  };
};

const ignoreKeys = {
  Alt: true,
  Shift: true,
  Meta: true,
  Control: true,
  Tab: true,
  Backspace: true,
  Enter: true,
  ArrowLeft: true,
  ArrowRight: true,
  ArrowUp: true,
  ArrowDown: true,
};
