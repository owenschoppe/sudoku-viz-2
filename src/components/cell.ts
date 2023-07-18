import { CellValue, Dispatch, State } from '../types';

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
export default class Cell extends HTMLElement {
  i: number;
  j: number;
  value: CellValue | null;
  css: string;
  state: State;
  dispatch: Dispatch;
  button: HTMLButtonElement;

  constructor({
    i,
    j,
    css,
    dispatch,
    state,
  }: {
    css?: string;
    i: number;
    j: number;
    value?: CellValue | null;
    dispatch: Dispatch;
    state: State;
  }) {
    super();
    this.attachShadow({ mode: 'open' });
    this.i = i;
    this.j = j;
    this.value = state.board[i][j];
    this.css = css;
    this.state = state;
    this.dispatch = dispatch;
  }

  connectedCallback() {
    this.init();
    this.render(this.state);
  }

  disconnectedCallback() {
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

  // Render method
  // Can diff current state against stored state to decide whether to render.
  render(state: State) {
    this.state = state;
    this.value = state.board[this.i][this.j];
    this.button.textContent = String(this.value || '');
    if (this.state.color)
      this.button.setAttribute(
        'style',
        `background-color: ${this.state.color}`,
      );
  }

  handleClick(_event: MouseEvent) {
    // console.log('click', this.i, this.j, this.value, event);
    this.value = this.dispatch({
      type: 'update',
      data: {
        i: this.i,
        j: this.j,
        value: this.value ? this.value + 1 : 1,
        color: this.getColor(),
      },
    }).board[this.i][this.j];
  }

  getColor() {
    const step = 255 / 9;
    return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
  }

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

customElements.define('board-cell', Cell);
