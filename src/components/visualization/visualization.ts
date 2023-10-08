//@ts-ignore
import css from './controls.css';

import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { CellValue, State } from '../../types';
import { BoardLens } from '../board-lens';
import { BoardLoops } from '../board-loops';
import { LoopType } from '../../utils/sudoku-loops';

export class Visualization extends ReactiveMixin(HTMLElement) {
  secondary: BoardLens[];

  tertiary: BoardLoops[];

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

    shadowRoot.innerHTML = this.template();

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.secondary = Array(9)
      .fill(null)
      .map((_, i) => new BoardLens((i + 1) as CellValue));
    this.secondary.forEach((board) => board.classList.add('secondary-board'));

    this.tertiary = ['row', 'column', 'group'].map(
      (type: LoopType) => new BoardLoops(type),
    );
    this.tertiary.forEach((board) => board.classList.add('secondary-board'));
  }

  render(state: State) {
    if (state.settings.possibilities.value) {
      document.querySelector('#viewer').append(...this.secondary);
    } else {
      this.secondary.forEach((board) => board.remove());
    }

    if (state.settings.connections.value) {
      document.querySelector('#loops').append(...this.tertiary);
    } else {
      this.tertiary.forEach((board) => board.remove());
    }
  }

  template = () => html`
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
  `;
}

const html = String.raw;

customElements.define('sudoku-visualization', Visualization);
