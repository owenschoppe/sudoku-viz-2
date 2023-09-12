//@ts-ignore
import css from './board.css';
//@ts-ignore
import html from './board.html';

import { ReactiveMixin } from '../../mixins/reactive-component-mixin';
import { BoardCell } from '../board-cell';

export class Board extends ReactiveMixin(HTMLElement) {
  cells: BoardCell[] = [];
  board: HTMLDivElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.init();
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  init() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = html;

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.cells = this.state.board
      .map((row, i) =>
        row.map(
          (_value, j) =>
            new BoardCell({
              i,
              j,
              css: `:host { grid-area: c${i}${j}; }`,
            }),
        ),
      )
      .flat();

    this.board = shadowRoot.querySelector('#board');
    this.board.append(...this.cells);
    this.board.setAttribute('style', `--cell-text-size: 24px;`);
    this.board.addEventListener('keydown', this.handleKey.bind(this));
  }

  handleKey(event: KeyboardEvent) {
    this.dispatch({
      type: 'arrow',
      data: event,
    });
  }

  render(_state) {
    // console.log('render board', state.board);
  }
}

customElements.define('sudoku-board', Board);
