import { CellValue, State } from '../../types.js';
import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { isValidInput } from '../../utils/sudoku.js';
import { isCellValue } from '../../utils/index.js';

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
  value: CellValue | 0;
  css: string;
  input: HTMLInputElement;
  isEditable: boolean;

  constructor({ i, j, css }: { css?: string; i: number; j: number }) {
    super();
    this.attachShadow({ mode: 'open' });
    this.i = i;
    this.j = j;
    this.css = css;
    // this.value = this.state.board[i][j];
  }

  connectedCallback() {
    this.init();
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.input.removeEventListener('keydown', this.handleChange);
  }

  init() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = this.template();

    this.input = shadowRoot.querySelector('input');
    this.input.addEventListener('keydown', this.handleChange.bind(this));
    this.input.addEventListener('click', this.handleClick.bind(this));
  }

  render(state: State) {
    const value = state.board[this.i][this.j];
    this.isEditable = this.state.original[this.i][this.j] === 0;

    if (value !== this.value) {
      this.state = state;
      this.value = value;
      const displayValue = isCellValue(this.value) ? String(this.value) : '';
      this.input.value = displayValue;
    }
    const { i, j } = state.location;
    if (this.i === i && this.j === j) {
      this.input.classList.add('current');
      this.input.setAttribute('tabindex', '0');
      this.input.focus();
    } else {
      this.input.classList.remove('current');
      this.input.setAttribute('tabindex', '-1');
    }
    if (!this.isEditable) {
      this.input.classList.add('locked');
    } else {
      this.input.classList.remove('locked');
    }
  }

  handleClick() {
    this.dispatch({
      type: 'move',
      data: { location: { i: this.i, j: this.j } },
    });
  }

  handleChange(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      return;
    }
    event.preventDefault();
    if (
      isValidInput(
        event.key,
        this.state.possibilities[this.i][this.j].possibilities,
      ) &&
      Number(event.key) !== this.value &&
      this.isEditable
    ) {
      this.value = this.dispatch({
        type: 'update',
        data: {
          i: this.i,
          j: this.j,
          value: Number(event.key),
          // color: this.getColor(),
        },
      }).board[this.i][this.j];
    } else if (event.key === 'Backspace' && this.isEditable) {
      this.value = this.dispatch({
        type: 'update',
        data: {
          i: this.i,
          j: this.j,
          value: 0,
          // color: this.getColor(),
        },
      }).board[this.i][this.j];
    }
  }

  // getColor() {
  //   const step = 255 / 9;
  //   return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
  // }

  // Todo
  template = () => html`
    <!DOCTYPE html>
    <style>
      input {
        caret-color: transparent;
        color: var(--cell-text-color, black);
        cursor: pointer;
        border: none;
        background: var(--cell-background-color, white);
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        height: var(--cell-height, 100%);
        margin: 0;
        padding: 0;
        text-align: center;
        width: var(--cell-width, 100%);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      /* Hide numeric input buttons */
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      /* Firefox */
      input[type=number] {
        -moz-appearance: textfield;
      }
      input.current {
        outline: none;
        box-shadow: 0 0 0 2px inset hsl(196deg 76% 45% / 80%);
      }
      input:focus {
        outline: none;
        box-shadow: 0 0 0 4px inset hsl(196deg 76% 45% / 80%);
      }
      input.locked {
        color: #666;
        background-color: #f3f3f3;
      }
            ${this.css}
    </style>
    <input
      value="${isCellValue(this.value) ? String(this.value) : ''}"
      type="number"
    />
  `;
}

const html = String.raw;

customElements.define('board-cell', BoardCell);
