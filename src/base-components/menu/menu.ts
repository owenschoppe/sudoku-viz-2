//@ts-ignore
import css from './menu.css';

import {
  DropdownListbox,
  getReturnValue,
} from '../_internals/dropdown-listbox/index.js';
import { ChangeCallback, DropdownOption, MenuParams } from './types.js';
import { DropdownListTypes } from '../_internals/types.js';
import { debouncedSearch } from '../../utils/core/debounce';

export class Menu extends HTMLElement {
  button: HTMLButtonElement;

  trigger: HTMLDivElement;

  dropdown: DropdownListbox;

  label: string;

  _options: DropdownOption[];

  onChange: ChangeCallback;

  type: DropdownListTypes;

  searchOptions: (e: KeyboardEvent) => void;

  constructor({
    label,
    options,
    onChange,
    type = DropdownListTypes.menuitem,
  }: MenuParams) {
    super();
    this.attachShadow({ mode: 'open' });

    this.label = label;
    this._options = options;
    this.onChange = onChange;
    this.type = type;
  }

  connectedCallback() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = this.template(this.label);

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.button = shadowRoot.querySelector('#button');
    this.trigger = shadowRoot.querySelector('.dropdown-trigger');

    this.dropdown = new DropdownListbox(
      this.options,
      this.handleChange.bind(this),
      this.handleNavigate.bind(this),
      this.type,
    );
    shadowRoot.querySelector('[role=menu]').append(this.dropdown.render());

    this.searchOptions = debouncedSearch(
      this.dropdown.options.map((option) => option.label),
      (index: number) => {
        this.dropdown.updateCurrent(index);
        this.showDropdown();
      },
    );

    this.trigger.addEventListener('keydown', this.handlePress.bind(this), true);
    this.trigger.addEventListener('input', this.searchOptions.bind(this), true);
    this.button.addEventListener('click', this.toggleDropdown.bind(this), true);
    document.body.addEventListener('focus', this.handleBlur.bind(this), true);
    document.body.addEventListener('click', this.handleBlur.bind(this), true);
  }

  disconnectedCallback() {
    this.trigger.removeEventListener(
      'keydown',
      this.handlePress.bind(this),
      true,
    );
    this.trigger.removeEventListener('input', this.searchOptions.bind(this));
    this.button.removeEventListener('click', this.toggleDropdown.bind(this));
    document.body.removeEventListener('focus', this.handleBlur.bind(this));
  }

  get options() {
    return this._options;
  }

  set options(options) {
    this._options = options;
    this.dropdown.updateOptions(options);
  }

  showDropdown() {
    this.trigger.classList.add('is-open');
    this.button.setAttribute('aria-expanded', 'true');
    this.button.setAttribute(
      'aria-activedescendant',
      this.dropdown.currentItem?.id,
    );
  }

  hideDropdown() {
    this.trigger.classList.remove('is-open');
    this.button.setAttribute('aria-expanded', 'false');
    this.button.removeAttribute('aria-activedescendant');
    this.dropdown.updateCurrent(0);
  }

  toggleDropdown() {
    if (this.trigger.classList.contains('is-open')) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  private;

  handleChange(options: DropdownOption[]) {
    this.onChange(options);
  }

  handleNavigate(id: string, _option: DropdownOption) {
    this.button.setAttribute('aria-activedescendant', id);
  }

  handleBlur(_e?: FocusEvent) {
    if (!this.trigger.contains(this.shadowRoot.activeElement)) {
      this.hideDropdown();
    }
  }

  handleFocus(_e: FocusEvent) {
    this.showDropdown();
  }

  handlePress(e: KeyboardEvent) {
    const isOpen = this.trigger.classList.contains('is-open');
    const { key } = e;
    switch (key) {
      case 'Enter':
      case ' ':
        e.stopPropagation();
        e.preventDefault();
        if (isOpen) {
          // Hide the dropdown and submit if open
          this.hideDropdown();

          // TODO: move all of the keyboard handling to dropdownlist so that this can make use of the same onchange logic.
          // this.onChange([this.dropdown.currentItem.option]);
          this.onChange(
            getReturnValue(
              this.type,
              this.dropdown.items,
              this.dropdown.currentItem,
            ),
          );
        } else {
          // Show the dropdown if closed
          this.showDropdown();
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        // Arrow through the list box
        // Show the dropdown and move
        e.stopPropagation();
        e.preventDefault();
        if (isOpen) {
          this.dropdown.nextItem(e, -1);
        } else {
          this.showDropdown();
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        // Arrow through the list box
        // Show the dropdown and move
        e.stopPropagation();
        e.preventDefault();
        if (isOpen) {
          this.dropdown.nextItem(e, 1);
        } else {
          this.showDropdown();
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.stopPropagation();
          e.preventDefault();
          this.hideDropdown();
          this.button.focus();
        }
        break;
      default:
        if (isOpen) {
          this.searchOptions(e);
        }
        break;
    }
  }

  template = (label: string) => html`
    <div class="dropdown-trigger dropdown-trigger_click">
      <button id="button" class="button" aria-haspopup="true" title="${label}">
        <span>${label}</span>
      </button>
      <div id="listbox" class="dropdown dropdown-small" role="menu">
        <!-- ListBox -->
      </div>
    </div>
  `;
}

const html = String.raw;

customElements.define('o-menu', Menu);
