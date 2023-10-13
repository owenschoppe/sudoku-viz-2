//@ts-ignore
import css from './menu.css';

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

    // TODO: something is odd because shift tabbing through the button opens the menu when it shouldn't

    this.trigger.addEventListener(
      'keydown',
      this.handlePress.bind(this),
      false,
    );
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
    console.log('show', this.trigger.classList, this.trigger);

    // const { scrollHeight, scrollWidth } = document.body;
    this.trigger.classList.add('is-open');
    this.button.setAttribute('aria-expanded', 'true');
    this.button.setAttribute(
      'aria-activedescendant',
      this.dropdown.currentItem?.id,
    );
    // this.dropdown.positionDropdown({ scrollHeight, scrollWidth });
  }

  hideDropdown() {
    console.log('hide', this.trigger.classList, this.trigger);

    // const { scrollHeight, scrollWidth } = document.body;
    this.trigger.classList.remove('is-open');
    this.button.setAttribute('aria-expanded', 'false');
    this.button.removeAttribute('aria-activedescendant');
    this.dropdown.updateCurrent(0);
    // this.dropdown.positionDropdown({ scrollHeight, scrollWidth });
  }

  toggleDropdown() {
    // debugger;
    if (this.trigger.classList.contains('is-open')) {
      console.log('toggle open=>closed', this.trigger.classList, this.trigger);
      this.hideDropdown();
    } else {
      console.log('toggle closed=>open', this.trigger.classList, this.trigger);
      this.showDropdown();
    }
  }

  private;

  handleChange(options: DropdownOption[]) {
    console.log('handleChange', options);
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

  handleBlur(e?: FocusEvent) {
    // e.preventDefault();
    // e.stopPropagation();
    console.log(
      'handleBlur',
      e.target,
      this.shadowRoot.activeElement,
      !this.trigger.contains(this.shadowRoot.activeElement),
    );
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
      case ' ':
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        // this.toggleDropdown();

        if (isOpen) {
          if (e.target === this.button) {
            this.hideDropdown();
          }
        } else {
          this.showDropdown();
        }
        break;
      case 'Enter':
        // case ' ':
        console.log('Enter/Space', e);
        // debugger;
        e.stopPropagation();
        e.preventDefault();
        if (isOpen) {
          // Hide the dropdown and submit if open
          // if (
          //   this.type === DropdownListTypes.menuitem ||
          //   this.type === DropdownListTypes.option
          // ) {
          this.hideDropdown();
          this.button.focus();
          // }

          // TODO: move all of the keyboard handling to dropdownlist so that this can make use of the same onchange logic.
          // this.onChange([this.dropdown.currentItem.option]);
          // this.onChange(
          //   getReturnValue(
          //     this.type,
          //     this.dropdown.items,
          //     this.dropdown.currentItem,
          //   ),
          // );
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
