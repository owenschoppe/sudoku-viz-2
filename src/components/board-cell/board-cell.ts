// @ts-ignore
import css from './board-cell.css';
import { CellValue, State } from '../../types.js';
import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { isValidInput } from '../../utils/sudoku.js';
import { cloneDeep, isCellValue } from '../../utils/index.js';
import { cellToLabel } from '../../utils/labels';

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
  cell: HTMLDivElement;
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

    this.cell = shadowRoot.querySelector('#cell');
    this.input = shadowRoot.querySelector('input');
    this.input.addEventListener('keydown', this.handleChange.bind(this), true);
    this.input.addEventListener('click', this.handleClick.bind(this));
  }

  render(state: State) {
    const value = state.board[this.i][this.j];
    this.isEditable = state.original[this.i][this.j] === 0;
    const { i, j } = state.location;
    if (this.i === i && this.j === j) {
      this.cell.classList.add('current');
      this.input.setAttribute('tabindex', '0');

      const { i: previousI, j: previousJ } = this.state.location;
      const locationMoved = i !== previousI || j !== previousJ;
      const isUndo = state.moves.length < this.state.moves.length;
      if (locationMoved && !isUndo) {
        this.input.focus();
      }
    } else {
      this.cell.classList.remove('current');
      this.input.setAttribute('tabindex', '-1');
    }
    if (!this.isEditable) {
      this.cell.classList.add('locked');
    } else {
      this.cell.classList.remove('locked');
    }
    if (value !== this.value) {
      this.value = value;
      const displayValue = isCellValue(this.value) ? String(this.value) : '';
      this.input.value = displayValue;
      this.cell.textContent = displayValue;
    }
    this.state = cloneDeep(state);
  }

  handleClick() {
    this.dispatch({
      type: 'move',
      data: { location: { i: this.i, j: this.j } },
    });
  }

  handleChange(event: KeyboardEvent) {
    switch (event.key) {
      case 'Tab':
        break;
      case 'ArrowUp':
      case 'ArrowUp':
      case 'ArrowUp':
      case 'ArrowUp':
        event.preventDefault();
        break;
      case 'Backspace':
        event.preventDefault();
        if (this.isEditable) {
          this.value = this.dispatch({
            type: 'update',
            data: {
              i: this.i,
              j: this.j,
              value: 0,
            },
          }).board[this.i][this.j];
        }
        break;
      default:
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
            },
          }).board[this.i][this.j];
        }
    }
  }

  template = () => html`
    <!DOCTYPE html>
    <style>
      ${css}
      ${this.css}
    </style>
    <label class="cell-container">
      <span class="visually-hidden">${cellToLabel(this)}</span>
      <div id="cell" class="cell" title="${cellToLabel(this)}">
        <!-- cell value -->
      </div>
      <input
        class="visually-hidden"
        value="${isCellValue(this.value) ? String(this.value) : ''}"
        type="number"
        inputmode="numeric"
        min="0"
        max="9"
        pattern="[0-9]*"
      />
    </label>
  `;
}

const html = String.raw;

customElements.define('board-cell', BoardCell);
