//@ts-ignore
import css from '../board/board.css';
//@ts-ignore
import html from '../board/board.html';

import { CellValue } from '../../types';
import { ReactiveMixin } from '../../mixins/reactive-component-mixin';
import { BoardLensCell } from '../board-lens-cell';

export class BoardLens extends ReactiveMixin(HTMLElement) {
  cells: BoardLensCell[] = [];
  board: HTMLDivElement;
  lens: CellValue = null;

  constructor(lens?: CellValue) {
    super();
    this.attachShadow({ mode: 'open' });
    this.lens = lens;
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
            new BoardLensCell({
              i,
              j,
              css: `:host { grid-area: c${i}${j}; }`,
              lens: this.lens,
            }),
        ),
      )
      .flat();

    this.board = shadowRoot.querySelector('#board');
    this.board.append(...this.cells);

    const color = `${hue[this.lens]} ${saturation}% ${brightness}%`;
    const background = `hsl(${color})`;
    const possibility = `hsl(${color} / 50%)`;

    this.board.setAttribute(
      'style',
      `--cell-text-color: black; 
      --cell-background-color: ${background}; 
      --cell-background-possibility-color: ${possibility};`,
    );
  }
}

const hue = {
  1: 40,
  2: 80,
  3: 120,
  4: 160,
  5: 200,
  6: 240,
  7: 280,
  8: 320,
  9: 360,
};
const saturation = 90;
const brightness = 75;

customElements.define('sudoku-board-lens', BoardLens);
