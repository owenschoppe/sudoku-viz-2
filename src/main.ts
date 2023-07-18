import { component } from './component.js';
import './main.css';

import './components';
import MyContainer from './components/my-container/my-container';
import MyButton from './components/my-button.js';
import { Action, ReactiveElement, State } from './types.js';

const children: ReactiveElement[] = [];

(() => {
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'update':
        const { i, j, value, color } = action.data;
        state.board[i][j] = value;
        state.color = color;
        console.log(i, j, value, state);
        return state;
      default:
        return state;
    }
  };

  const dispatch = (action: Action) => {
    state = reducer(state, action);
    children.forEach((child) => child.render(state));
    return state;
  };

  let state: State = {
    board: Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
  };

  // const data = Array(9).fill(Array(9).fill(null));

  document.querySelector('body').appendChild(component('cora'));

  // const el = document.createElement('my-container') as MyContainer;
  const el = new MyContainer({ dispatch, state });
  children.push(el);
  document.querySelector('body').appendChild(el);

  const le = new MyButton();
  document.querySelector('body').appendChild(le);

  // Add hot reloading in dev mo
  document.write(
    '<script src="http://' +
      (location.host || 'localhost').split(':')[0] +
      ':35729/livereload.js?snipver=1"></' +
      'script>',
  );
})();
