//@ts-ignore
import css from './menu.css';
//@ts-ignore
import gcss from '../global.css';

import {
  DropdownListbox,
  // getReturnValue,
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

  handleSearch: (e: KeyboardEvent) => void;

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

    this.handleSearch = debouncedSearch(
      this.dropdown.options.map((option) => option.label),
      (index: number) => {
        this.dropdown.updateCurrent(index);
        this.showDropdown();
      },
    );

    this.trigger.addEventListener('keydown', this.handleKey.bind(this), false);
    this.trigger.addEventListener('input', this.handleSearch.bind(this), true);
    this.trigger.addEventListener('focusout', this.handleBlur.bind(this), true);
    this.button.addEventListener('click', this.toggleDropdown.bind(this), true);
  }

  disconnectedCallback() {
    this.trigger.removeEventListener(
      'keydown',
      this.handleKey.bind(this),
      true,
    );
    this.trigger.removeEventListener('input', this.handleSearch.bind(this));
    this.trigger.removeEventListener('focusout', this.handleBlur.bind(this));
    this.button.removeEventListener('click', this.toggleDropdown.bind(this));
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
    if (
      this.type === DropdownListTypes.menuitem ||
      this.type === DropdownListTypes.option
    ) {
      this.button.focus();
      this.hideDropdown();
    } else {
      this.dropdown.currentItem.element.focus();
    }
  }

  handleNavigate(id: string, _option: DropdownOption) {
    this.button.setAttribute('aria-activedescendant', id);
  }

  handleBlur(e: FocusEvent) {
    if (
      e.relatedTarget instanceof Element &&
      !this.trigger.contains(e.relatedTarget)
    ) {
      this.hideDropdown();
    } else if (e.relatedTarget === null) {
      this.hideDropdown();
    }
  }

  handleKey(e: KeyboardEvent) {
    const isOpen = this.trigger.classList.contains('is-open');
    switch (e.key) {
      case ' ':
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        if (isOpen) {
          if (e.target === this.button) {
            this.hideDropdown();
          }
        } else {
          this.showDropdown();
        }
        break;
      case 'Enter':
        e.stopPropagation();
        e.preventDefault();
        if (isOpen) {
          this.hideDropdown();
          this.button.focus();
        } else {
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
          this.dropdown.nextItem(e, -1);
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        // Arrow through the list box
        // Show the dropdown and move
        e.stopPropagation();
        e.preventDefault();
        if (isOpen) {
          if (
            this.shadowRoot
              .querySelector('#listbox')
              .contains(this.shadowRoot.activeElement)
          ) {
            this.dropdown.nextItem(e, 1);
          } else {
            this.dropdown.updateCurrent(0);
          }
        } else {
          this.showDropdown();
          this.dropdown.updateCurrent(0);
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
          this.handleSearch(e);
        }
        break;
    }
  }

  template = (label: string) => html`
    <div class="dropdown-trigger dropdown-trigger_click">
      <button
        id="button"
        part="button"
        class="button"
        aria-haspopup="true"
        title="${label}"
      >
        <span>${label}</span>
      </button>
      <div
        id="listbox"
        part="dropdown"
        class="dropdown dropdown-small"
        role="menu"
      >
        <!-- ListBox -->
      </div>
    </div>
  `;
}

const html = String.raw;

customElements.define('o-menu', Menu);
