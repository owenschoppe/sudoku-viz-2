//@ts-ignore
import css from './controls.css';
//@ts-ignore
import html from './controls.html';

import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { difficultyLevel } from '../../utils/sudoku-solver.js';
import { Menu } from '../../base-components/menu';
import { MenuTypes } from '../../base-components/menu/types';

export class Controls extends ReactiveMixin(HTMLElement) {
  newButton: HTMLButtonElement;

  menu: Menu;

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

    shadowRoot.innerHTML = html;

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.menu = new Menu({
      label: 'New',
      options: [
        { label: 'Hard', value: difficultyLevel.HARD },
        { label: 'Medium', value: difficultyLevel.MED },
        { label: 'Easy', value: difficultyLevel.EASY },
        { label: 'Blank', value: 'blank' },
      ],
      onChange: ({ value }) => {
        this.dispatch({ type: 'new', data: { difficulty: value } });
      },
      type: MenuTypes.menu,
    });
    this.shadowRoot.querySelector('#controls').append(this.menu);
  }
}

customElements.define('sudoku-controls', Controls);
