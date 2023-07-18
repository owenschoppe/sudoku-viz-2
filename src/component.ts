export const component = (name = 'world') => {
  const div = document.createElement('div');
  div.textContent = `hello ${name}`;
  return div;
};
