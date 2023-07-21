import { CellValue, State } from '../../types.js';
import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';

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
export class BoardCellLens extends ReactiveMixin(HTMLElement) {
  i: number;
  j: number;
  lens: CellValue | null;
  value: CellValue | null = null;
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
    const value = state.board[this.i][this.j];
    const displayValue = value === this.lens ? value : null;
    if (displayValue !== this.value) {
      this.state = state;
      this.value = displayValue;
      this.button.textContent = String(this.value || '');
    }
  }

  handleClick(_event: MouseEvent) {
    // console.log('click', this.i, this.j, this.value, event);
    this.value = this.dispatch({
      type: 'update',
      data: {
        i: this.i,
        j: this.j,
        value: this.lens,
        color: this.getColor(),
      },
    }).board[this.i][this.j];
  }

  getColor() {
    const step = 255 / 9;
    return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
  }

  // Todo
  template = () => html`
    <!DOCTYPE html>
    <style>
      button {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        background: var(--cell-background-color, #f3f3f3);
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
      }
      ${this.css}
    </style>
    <button part="button">${this.value ?? ``}</button>
  `;
}

const html = String.raw;

customElements.define('board-cell-lens', BoardCellLens);
