import { CellValue, State } from '../../types.js';
import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
// import { isValidInput } from '../../utils/sudoku.js';
import { LoopType } from '../../utils/sudoku-loops.js';

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
export class BoardLoopsCell extends ReactiveMixin(HTMLElement) {
  i: number;
  j: number;
  type: LoopType;
  value: CellValue | 0 = null;
  css: string;
  button: HTMLButtonElement;

  constructor({
    i,
    j,
    css,
    type,
  }: {
    css?: string;
    i: number;
    j: number;
    type?: LoopType;
  }) {
    super();
    this.attachShadow({ mode: 'open' });
    this.i = i;
    this.j = j;
    this.css = css;
    this.type = type;
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
    const loopObj = state.loops[this.type][this.i][this.j];

    const { id, loop } = loopObj || { id: null, loop: null };

    if (id && loop) {
      const { i: _m, j: n } = loop[0];
      const color = `${hue[n]} ${saturation}% ${brightness}%`;
      const background = `hsl(${color})`;

      this.shadowRoot.host.setAttribute(
        'style',
        `--cell-text-color: black; --cell-background-color: ${background};`,
      );
      this.button.classList.add('selected');
    } else {
      this.button.classList.remove('selected');
    }

    this.button.textContent = String(id || '');

    const { i, j } = state.location;
    if (this.i === i && this.j === j) {
      this.button.classList.add('current');
    } else {
      this.button.classList.remove('current');
    }
  }

  handleClick(_event: MouseEvent) {
    this.dispatch({
      type: 'move',
      data: { location: { i: this.i, j: this.j } },
    });
  }

  template = () => html`
    <!DOCTYPE html>
    <style>
      button {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        background: rgba(255, 255, 255, 0.1);
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
      }
      button.selected {
        background: var(--cell-background-color, #f3f3f3);
      }
      button.only {
        background: white;
      }
      button.possibility {
        background: var(--cell-background-possibility-color, #f3f3f3);
      }
      button.current {
        box-shadow: 0 0 0 1px white;
      }
      :host{
        display: block;
      }
      ${this.css}
    </style>
    <button part="button">${this.value ?? ``}</button>
  `;
}

const hue = {
  1: 40,
  2: 80,
  3: 120,
  4: 160,
  5: 200,
  6: 240,
  7: 280,
  8: 320,
  9: 360,
};
const saturation = 90;
const brightness = 75;

const html = String.raw;

customElements.define('board-loops-cell', BoardLoopsCell);
