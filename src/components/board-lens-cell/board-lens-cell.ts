import { CellValue, State } from '../../types.js';
import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { isValidInput } from '../../utils/sudoku.js';

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
    } else if (possibilityCount === 1 && possibilities[this.lens]) {
      this.button.classList.add('only');
    } else if (possibilities[this.lens]) {
      this.button.classList.add('possibility');
    }
  }

  handleClick(_event: MouseEvent) {
    const { possibilities, possibilityCount } =
      this.state.possibilities[this.i][this.j];

    if (possibilityCount === 1 && isValidInput(this.lens, possibilities)) {
      this.value = this.dispatch({
        type: 'update',
        data: {
          i: this.i,
          j: this.j,
          value: this.lens,
          // color: this.getColor(),
        },
      }).board[this.i][this.j];
    }

    this.dispatch({
      type: 'move',
      data: { location: { i: this.i, j: this.j } },
    });
  }

  // getColor() {
  //   const step = 255 / 9;
  //   return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
  // }

  // Todo
  template = () => html`
    <!DOCTYPE html>
    <style>
      button {
        color: var(--cell-text-color, black);
        cursor: pointer;
        border: none;
        /* background: var(--cell-background-color, #f3f3f3); */
        background: rgba(255, 255, 255, 0.1);
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        height: var(--cell-height, 100%);
        margin: 0;
        /* opacity: 0.1; */
        padding: 0;
        width: var(--cell-width, 100%);
      }
      button.selected {
        background: var(--cell-background-color, #f3f3f3);
        /* opacity: 1; */
      }
      button.only {
        background: white;
        /* opacity: 1; */
      }
      button.possibility {
        background: var(--cell-background-possibility-color, #f3f3f3);
        /* opacity: 0.5; */
      }
      button.current {
        box-shadow: 0 0 0 1px white;
      }
      :host{
        display: block;
      }
      ${this.css}
    </style>
    <button part="button" tabindex="-1">${this.value ?? ``}</button>
  `;
}

const html = String.raw;

customElements.define('board-lens-cell', BoardLensCell);
