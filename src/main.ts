import './main.css';

import { Action, initializeSubscriptions } from './utils/subscribe.js';
import { Board, CellValue, State } from './types.js';
import { BoardLens } from './components';
import { possibilities } from './utils/sudoku';

const NNArray = (n: number, fill: any) =>
  Array(n)
    .fill(null)
    .map(() => Array(n).fill(fill));

/**
 * Reducer function to manage sudoku calculations
 * TODO: save state in local storage to avoid losing it on reload
 * TODO: add selected cell to state and add keyboard handler
 * @param state
 * @param action
 * @returns
 */
const reducer = (state: State, action: Action) => {
  let updatedState: State;
  switch (action.type) {
    case 'update':
      const { i, j, value, color } = action.data;
      state.board[i][j] = value;
      state.color = color;
      state.possibilities = possibilities(state.board);
      console.log(i, j, value, state);
      updatedState = state;
      break;
    default:
      updatedState = state;
  }
  window.localStorage.setItem('state', JSON.stringify(updatedState));
  return updatedState;
};

const initialBoard = NNArray(9, null);

const initialState = (savedBoard?: Board): State => {
  const board = savedBoard || initialBoard;
  return {
    board: board,
    possibilities: possibilities(board),
  };
};

(() => {
  const storedState = JSON.parse(window.localStorage.getItem('state'));

  initializeSubscriptions(initialState(storedState?.board), reducer);

  // Move this stuff to a web component so we can utilize templates
  document.body.innerHTML = `<div id="app">
      <div id="board"><sudoku-board class="main-board"/></div>
      <div id="viewer"></div>
    </div>`;

  const secondary = Array(9)
    .fill(null)
    .map((_, i) => new BoardLens((i + 1) as CellValue));
  secondary.forEach((board) => board.classList.add('secondary-board'));
  document.querySelector('#viewer').append(...secondary);

  // Add hot reloading in dev mode
  document.write(
    '<script src="http://' +
      (location.host || 'localhost').split(':')[0] +
      ':35729/livereload.js?snipver=1"></' +
      'script>',
  );
})();
