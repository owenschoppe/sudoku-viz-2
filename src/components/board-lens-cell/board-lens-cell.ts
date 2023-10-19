//@ts-ignore
import css from './board-lens-cell.css';
import { CellValue, State } from '../../types.js';
import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { isValidInput } from '../../utils/sudoku.js';
import { cellToLabel } from '../../utils/labels';
// import { HandleInputMixin } from '../../mixins/handle-input-mixin';

/**
 * Cell element that implements the dispatch pattern.
 * Each WC class is responsible for tracking the child elements it creates
 * and updating their properties or calling their render methods during render.
 *
 * CSS Custom Properties
 * @property --cell-text-color black
 * @property --cell-background-color #f3f3f3
 * @param i
 * @param j
 * @param value
 */
export class BoardLensCell extends ReactiveMixin(HTMLElement) {
  button: HTMLButtonElement;
  i: number;
  j: number;
  lens: CellValue | 0;
  value: CellValue | 0 = 0;
  css: string;
  button: HTMLButtonElement;

  constructor({
    i,
    j,
    css,
    lens,
  }: {
    css?: string;
    i: number;
    j: number;
    lens?: CellValue;
  }) {
    super();
    this.attachShadow({ mode: 'open' });
    this.i = i;
    this.j = j;
    this.css = css;
    this.lens = lens;
  }

  connectedCallback() {
    this.init();
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot
      .querySelector('button')
      .removeEventListener('click', this.handleClick);
  }

  init() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = this.template();

    this.button = shadowRoot.querySelector('button');
    this.button.addEventListener('click', this.handleClick.bind(this));
  }

  render(state: State) {
    this.state = state;
    this.value = state.board[this.i][this.j];
    const possibility =
      state.possibilities[this.i][this.j].possibilities[this.lens];
    const selected = this.value === this.lens;
    const displayValue = selected || possibility ? this.lens : null;
    this.button.textContent = String(displayValue || '');
    this.updateClass();
    const { i, j } = state.location;
    if (this.i === i && this.j === j) {
      this.button.classList.add('current');
    } else {
      this.button.classList.remove('current');
    }
  }

  updateClass() {
    const { possibilities, possibilityCount } =
      this.state.possibilities[this.i][this.j];
    this.button.classList.remove('selected', 'only', 'possibility');
    if (this.value === this.lens) {
      this.button.classList.add('selected');
    } else if (
      possibilityCount === 1 &&
      possibilities[this.lens] &&
      this.state.settings?.highlight?.value
    ) {
      this.button.classList.add('only');
    } else if (possibilities[this.lens]) {
      this.button.classList.add('possibility');
    }
  }

  handleClick(_event: MouseEvent) {
    const { possibilities, possibilityCount } =
      this.state.possibilities[this.i][this.j];

    if (
      possibilityCount === 1 &&
      isValidInput(this.lens, possibilities) &&
      this.state.settings.highlight?.value
    ) {
      this.value = this.dispatch({
        type: 'update',
        data: {
          i: this.i,
          j: this.j,
          value: this.lens,
        },
      }).board[this.i][this.j];
    }

    this.dispatch({
      type: 'move',
      data: { location: { i: this.i, j: this.j } },
    });
  }

  // }

  template = () => html`
    <!DOCTYPE html>
    <style>
      ${css}
      ${this.css}
    </style>
    <button part="button" tabindex="-1" title="${cellToLabel(this)}">
      ${this.value ?? ``}
    </button>
  `;
}

const html = String.raw;

customElements.define('board-lens-cell', BoardLensCell);
