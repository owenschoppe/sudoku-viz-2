import './main.css';
import './base-components/global.css';

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
      updatedState = updatedState = updateBoardState(state, pI, pJ, pV);
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
  // TODO: move to app logic in new viz component
  window.localStorage.setItem('state', JSON.stringify(updatedState));
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
      connections: { label: 'Show Connctions', value: true },
      highlight: { label: 'Highlight Only Possibility', value: true },
    },
  };
};

(() => {
  const storedState = JSON.parse(window.localStorage.getItem('state'));

  initializeSubscriptions(storedState, reducer);

  // Move this stuff to a web component so we can utilize templates
  document.body.innerHTML = `
    <div id="app" class="dark">
      <sudoku-controls></sudoku-controls>
      <div id="viz">
        <div id="board">
          <h2>Board</h2>
          <sudoku-board class="main-board" />
        </div>
        <div>
          <h2>Possibilities</h2>
          <div id="viewer"></div>
        </div>
        <div>
          <h2>Connections</h2>
          <div id="loops"></div>
        </div>
      </div>
      <div id="solved" class="overflow-container hidden">
        <div class="shimmer"></div>
        <div class="flex center"><div class="shimmer-text">SOLVED!</div></div>
      </div>
    </div>
  `;

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
})();
