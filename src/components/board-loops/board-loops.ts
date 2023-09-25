//@ts-ignore
import css from '../board/board.css';
//@ts-ignore
import html from '../board/board.html';

import { ReactiveMixin } from '../../mixins/reactive-component-mixin';
import { LoopType } from '../../utils/sudoku-loops';
import { BoardLoopsCell } from '../board-loops-cell';

export class BoardLoops extends ReactiveMixin(HTMLElement) {
  cells: BoardLoopsCell[] = [];
  board: HTMLDivElement;
  type: LoopType = null;

  constructor(type?: LoopType) {
    super();
    this.attachShadow({ mode: 'open' });
    this.type = type;
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

    this.cells = this.state.loops[this.type]
      .map((row, i) =>
        row.map(
          (_value, j) =>
            new BoardLoopsCell({
              i,
              j,
              css: `:host { grid-area: c${i}${j}; }`,
              type: this.type,
            }),
        ),
      )
      .flat();

    this.board = shadowRoot.querySelector('#board');
    this.board.append(...this.cells);
  }
}

customElements.define('sudoku-board-loops', BoardLoops);
