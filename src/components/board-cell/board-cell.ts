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
export class BoardCell extends ReactiveMixin(HTMLElement) {
  i: number;
  j: number;
  value: CellValue | null;
  css: string;
  // button: HTMLButtonElement;
  input: HTMLInputElement;

  constructor({ i, j, css }: { css?: string; i: number; j: number }) {
    super();
    this.attachShadow({ mode: 'open' });
    this.i = i;
    this.j = j;
    this.css = css;
    this.value = this.state.board[i][j];
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

    // this.button = shadowRoot.querySelector('button');
    // this.button.addEventListener('click', this.handleClick.bind(this));

    this.input = shadowRoot.querySelector('input');
    this.input.addEventListener('keydown', this.handleChange.bind(this));
  }

  render(state: State) {
    const value = state.board[this.i][this.j];
    if (value !== this.value) {
      this.state = state;
      this.value = value;
      // this.button.textContent = String(this.value || '');
      this.input.value = String(this.value ?? '');
    }
  }

  // handleClick(_event: MouseEvent) {
  //   // console.log('click', this.i, this.j, this.value, event);
  //   this.value = this.dispatch({
  //     type: 'update',
  //     data: {
  //       i: this.i,
  //       j: this.j,
  //       value: this.value ? (this.value % 9) + 1 : 1,
  //       color: this.getColor(),
  //     },
  //   }).board[this.i][this.j];
  // }

  handleChange(event: KeyboardEvent) {
    event.preventDefault();
    if (
      isValidInput(
        event.key,
        this.state.possibilities[this.i][this.j].possibilities,
      ) &&
      Number(event.key) !== this.value
    ) {
      this.value = this.dispatch({
        type: 'update',
        data: {
          i: this.i,
          j: this.j,
          value: Number(event.key),
          color: this.getColor(),
        },
      }).board[this.i][this.j];
    }
  }

  getColor() {
    const step = 255 / 9;
    return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
  }

  // Todo
  template = () => html`
    <!DOCTYPE html>
    <style>
      button, input {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        background: var(--cell-background-color, #f3f3f3);
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
        text-align: center;
      }
      ${this.css}
    </style>
    <!-- <button part="button">${this.value ?? ``}</button> -->
    <input value="${String(this.value ?? '')}" />
  `;
}

const html = String.raw;

customElements.define('board-cell', BoardCell);
