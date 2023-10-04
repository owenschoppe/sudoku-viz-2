import './main.css';

import { Action, initializeSubscriptions } from './utils/subscribe.js';
import { Board, CellValue, State } from './types.js';
import { BoardLens } from './components';
import { NNArray, cloneDeep } from './utils';
import { possibilitiesForBoard } from './utils/sudoku';
import { generateBoard } from './utils/sudoku-solver';
import { down, left, right, up } from './utils/move';
import { LoopType, getLoopsForBoardByType } from './utils/sudoku-loops';
import { BoardLoops } from './components/board-loops';

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
      state.possibilities = possibilitiesForBoard(state.board);
      state.loops = {
        row: getLoopsForBoardByType(state.possibilities, 'row'),
        column: getLoopsForBoardByType(state.possibilities, 'column'),
        group: getLoopsForBoardByType(state.possibilities, 'group'),
      };
      // console.log(i, j, value, state);
      updatedState = state;
      break;
    case 'new':
      const { difficulty } = action.data;
      const board = difficulty === 'blank' ? null : generateBoard(difficulty);
      updatedState = initialState(board);
      break;
    case 'move':
      state.location = action.data.location;
      updatedState = state;
      break;
    case 'arrow':
      const direction = {
        ArrowLeft: left,
        ArrowRight: right,
        ArrowUp: up,
        ArrowDown: down,
      };
      state.location =
        direction[action.data.key]?.(state.location) || state.location;
      updatedState = state;
      break;
    default:
      updatedState = state;
  }
  window.localStorage.setItem('state', JSON.stringify(updatedState));
  if (updatedState.board.flat().every((value) => value > 0)) {
    document.querySelector('#solved').classList.remove('hidden');
  } else {
    document.querySelector('#solved').classList.add('hidden');
  }
  return updatedState;
};

const initialBoard = NNArray(9, 0);

const initialState = (savedBoard?: Board): State => {
  const board = savedBoard || cloneDeep(initialBoard);
  const possibilities = possibilitiesForBoard(board);
  return {
    board: board,
    original: cloneDeep(board),
    possibilities,
    loops: {
      row: getLoopsForBoardByType(possibilities, 'row'),
      column: getLoopsForBoardByType(possibilities, 'column'),
      group: getLoopsForBoardByType(possibilities, 'group'),
    },
    location: { i: 0, j: 0 },
  };
};

(() => {
  const storedState = JSON.parse(window.localStorage.getItem('state'));

  initializeSubscriptions(storedState, reducer);

  // Move this stuff to a web component so we can utilize templates
  document.body.innerHTML = `<sudoku-controls></sudoku-controls>
  
  <div id="app">
      <div id="board"><h2>Board</h2><sudoku-board class="main-board"/></div>
      <div><h2>Possibilities</h2><div id="viewer"></div></div>
      <div><h2>Connections</h2><div id="loops"></div></div>
    </div><div id="solved" class="overflow-container"><div class="shimmer"></div><div class="flex center"><div class="shimmer-text">SOLVED!</div></div></div>`;

  const secondary = Array(9)
    .fill(null)
    .map((_, i) => new BoardLens((i + 1) as CellValue));
  secondary.forEach((board) => board.classList.add('secondary-board'));
  document.querySelector('#viewer').append(...secondary);

  const tertiary = ['row', 'column', 'group'].map(
    (type: LoopType) => new BoardLoops(type),
  );
  tertiary.forEach((board) => board.classList.add('secondary-board'));
  document.querySelector('#loops').append(...tertiary);

  // Add hot reloading in dev mode
  document.write(
    '<script src="http://' +
      (location.host || 'localhost').split(':')[0] +
      ':35729/livereload.js?snipver=1"></' +
      'script>',
  );
})();
