//@ts-ignore
import css from './controls.css';
//@ts-ignore
import html from './controls.html';

import { ReactiveMixin } from '../../mixins/reactive-component-mixin.js';
import { difficultyLevel } from '../../utils/sudoku-solver.js';
import { Menu } from '../../base-components/menu';
import { Button } from '../../base-components/button';
import { DropdownListTypes } from '../../base-components/_internals/types';
import { Settings, State } from '../../types';
import { DropdownOption } from '../../base-components/menu/types';

export class Controls extends ReactiveMixin(HTMLElement) {
  newButton: HTMLButtonElement;

  menu: Menu;

  settings: Menu;

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
        { id: 'hard', label: 'Hard', value: difficultyLevel.HARD },
        { id: 'med', label: 'Medium', value: difficultyLevel.MED },
        { id: 'easy', label: 'Easy', value: difficultyLevel.EASY },
        { id: 'blank', label: 'Blank', value: 'blank' },
      ],
      onChange: ([{ value }]) => {
        this.dispatch({ type: 'new', data: { difficulty: value } });
      },
      type: DropdownListTypes.menuitem,
    });
    this.shadowRoot.querySelector('#controls').append(this.menu);

    const undo = new Button({
      label: 'Undo',
      onClick: () => {
        this.dispatch({ type: 'undo', data: {} });
      },
    });
    undo.classList.add('secondary');
    this.shadowRoot.querySelector('#controls').append(undo);

    this.settings = new Menu({
      label: 'Settings',
      options: [],
      onChange: (values) => {
        this.dispatch({
          type: 'settings',
          data: {
            settings: handleConditionalSettings(optionsToSettings(values)),
          },
        });
      },
      type: DropdownListTypes.menuitemcheckbox,
    });
    this.settings.classList.add('bumpRight');
    this.shadowRoot.querySelector('#controls').append(this.settings);
    this.settings.dropdown.element.classList.add('dropdown_left');
  }

  render(state: State) {
    this.settings.options = settingsToOptions(state.settings);
  }
}

const handleConditionalSettings = (settings: Settings) => {
  settings.highlight.disabled = !settings.possibilities.value;
  return settings;
};

const settingsToOptions = (settings: Settings): DropdownOption[] =>
  Object.entries(settings || {}).map(([id, option]) => ({ ...option, id }));

const optionsToSettings = (options: DropdownOption[]): Settings =>
  options?.reduce((settings, { id, ...rest }) => {
    settings[id] = rest;
    return settings;
  }, {} as Settings);

customElements.define('sudoku-controls', Controls);
