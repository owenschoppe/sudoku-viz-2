//@ts-ignore
import css from './controls.css';
//@ts-ignore
import html from './controls.html';

import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { difficultyLevel } from '../../utils/sudoku-solver.js';

export class Controls extends ReactiveMixin(HTMLElement) {
  newButton: HTMLButtonElement;

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
    this.newButton = this.shadowRoot.querySelector('#new');
    this.newButton.removeEventListener('click', this.handleNewButton);
  }

  init() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = html;

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.newButton = shadowRoot.querySelector('#new');
    this.newButton.addEventListener('click', this.handleNewButton.bind(this));
  }

  render(_state) {
    // console.log('render board', state.board);
  }

  handleNewButton() {
    this.dispatch({
      type: 'new',
      data: {
        difficulty: difficultyLevel.EASY,
      },
    });
  }
}

customElements.define('sudoku-controls', Controls);
