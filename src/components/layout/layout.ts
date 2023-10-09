//@ts-ignore
import css from './layout.css';

import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { CellValue, State } from '../../types.js';
import { BoardLens } from '../board-lens/index.js';
import { BoardLoops } from '../board-loops/index.js';
import { LoopType } from '../../utils/sudoku-loops.js';

export class Layout extends ReactiveMixin(HTMLElement) {
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

    shadowRoot.innerHTML = this.template;

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.secondary = Array(9)
      .fill(null)
      .map((_, i) => new BoardLens((i + 1) as CellValue));
    this.secondary.forEach((board) => board.classList.add('secondary-board'));
    this.shadowRoot.querySelector('#viewer').append(...this.secondary);

    this.tertiary = ['row', 'column', 'group'].map(
      (type: LoopType) => new BoardLoops(type),
    );
    this.tertiary.forEach((board) => board.classList.add('secondary-board'));
    this.shadowRoot.querySelector('#loops').append(...this.tertiary);
  }

  render(state: State) {
    if (state.settings.possibilities.value) {
      this.shadowRoot
        .querySelector('#viewer-container')
        .classList.remove('hidden');
    } else {
      this.shadowRoot
        .querySelector('#viewer-container')
        .classList.add('hidden');
    }

    if (state.settings.connections.value) {
      this.shadowRoot
        .querySelector('#loops-container')
        .classList.remove('hidden');
    } else {
      this.shadowRoot.querySelector('#loops-container').classList.add('hidden');
    }
  }

  template = html`
    <div id="viz">
      <div id="board">
        <h2>Board</h2>
        <sudoku-board class="main-board" />
      </div>
      <div id="viewer-container">
        <h2>Possibilities</h2>
        <div id="viewer"></div>
      </div>
      <div id="loops-container">
        <h2>Connections</h2>
        <div id="loops"></div>
      </div>
    </div>
  `;
}

const html = String.raw;

customElements.define('sudoku-layout', Layout);
