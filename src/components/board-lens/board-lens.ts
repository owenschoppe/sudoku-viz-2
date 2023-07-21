import { CellValue } from '../../types';
import { Board } from '../board';
import { BoardCellLens } from '../board-cell-lens';

export class BoardLens extends Board {
  lens: CellValue = null;

  constructor(lens?: CellValue) {
    super();
    this.lens = lens;
  }

  init() {
    const { shadowRoot } = this;
    super.init();

    this.cells = this.state.board
      .map((row, i) =>
        row.map(
          (_value, j) =>
            new BoardCellLens({
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
  }
}

customElements.define('sudoku-board-lens', BoardLens);
