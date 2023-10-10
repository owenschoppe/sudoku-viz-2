import './main.css';
import './base-components/global.css';
import './components';

import { Action, initializeSubscriptions } from './utils/subscribe.js';
import { Board, State } from './types.js';
import { NNArray, cloneDeep } from './utils';
import { possibilitiesForBoard } from './utils/sudoku';
import { generateBoard } from './utils/sudoku-solver';
import { down, left, right, up } from './utils/move';
import { getLoopsForBoardByType } from './utils/sudoku-loops';

/**
 *  mutates state
 */
const updateBoardState = (state, i, j, value) => {
  state.board[i][j] = value;
  state.possibilities = possibilitiesForBoard(state.board);
  state.loops = {
    row: getLoopsForBoardByType(state.possibilities, 'row'),
    column: getLoopsForBoardByType(state.possibilities, 'column'),
    group: getLoopsForBoardByType(state.possibilities, 'group'),
  };
  return state;
};

/**
 * Reducer function to manage sudoku calculations
 * @param state
 * @param action
 * @returns
 */
const reducer = (state: State, action: Action) => {
  let updatedState: State;
  switch (action.type) {
    case 'update':
      const { i, j, value } = action.data;
      state.moves = state.moves || [];
      state.moves.push({
        i,
        j,
        priorValue: state.board[i][j],
      });
      updatedState = updateBoardState(state, i, j, value);
      break;
    case 'undo':
      const { i: pI, j: pJ, priorValue: pV } = state.moves.pop();
      updatedState = updateBoardState(state, pI, pJ, pV);
      updatedState.location = { i: pI, j: pJ };
      break;
    case 'new':
      const { difficulty } = action.data;
      const board = difficulty === 'blank' ? null : generateBoard(difficulty);
      updatedState = initialState(state, board);
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
    case 'settings':
      state.settings = action.data.settings;
      updatedState = state;
      break;
    default:
      updatedState = state;
  }
  window.localStorage.setItem('state', JSON.stringify(updatedState));

  // TODO: move to app logic in new viz component
  if (updatedState.board.flat().every((value) => value > 0)) {
    document.querySelector('#solved').classList.remove('hidden');
  } else {
    document.querySelector('#solved').classList.add('hidden');
  }

  return updatedState;
};

const initialBoard = NNArray(9, 0);

const initialState = (priorState?: State, savedBoard?: Board): State => {
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
    moves: [],
    // TODO: store settings in separate local storage object?
    settings: priorState?.settings || {
      possibilities: { label: 'Show Possibilities', value: true },
      connections: { label: 'Show Connections', value: true },
      highlight: { label: 'Highlight Only Possibility', value: true },
    },
  };
};

(() => {
  const storedState = JSON.parse(window.localStorage.getItem('state'));

  initializeSubscriptions(storedState, reducer);

  document.body.innerHTML = `
    <div id="app" class="dark">
      <sudoku-controls></sudoku-controls>
      <sudoku-layout></sudoku-layout>
      <div id="solved" class="overflow-container hidden">
        <div class="shimmer"></div>
        <div class="flex center"><div class="shimmer-text">SOLVED!</div></div>
      </div>
    </div>
  `;
})();
