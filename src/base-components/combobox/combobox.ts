//@ts-ignore
import css from './combobox.css';

import { DropdownListbox } from '../_internals/dropdown-listbox';
import { ChangeCallback, ComboboxParams, ComboboxTypes } from './types';
import { DropdownListTypes } from '../_internals/types';
import { DropdownOption } from '../menu/types';

export class Combobox extends HTMLElement {
  combobox: HTMLDivElement | HTMLInputElement;

  trigger: HTMLDivElement;

  dropdown: DropdownListbox;

  label: string;

  value: string;

  placeholder: string;

  _options: DropdownOption[];

  onChange: ChangeCallback;

  type: ComboboxTypes;

  showLabel: boolean;

  constructor({
    label,
    placeholder,
    options,
    onChange,
    type = ComboboxTypes.readonly,
    showLabel = true,
  }: ComboboxParams) {
    super();
    this.attachShadow({ mode: 'open' });

    this.label = label;
    this.showLabel = showLabel;
    this.placeholder = placeholder;
    this._options = options;
    this.onChange = onChange;
    this.type = type;
  }

  connectedCallback() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = this.template(
      this.type,
      this.label,
      this.placeholder,
      this.showLabel,
    );

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.combobox = shadowRoot.querySelector('[role=combobox]');
    this.trigger = shadowRoot.querySelector('.dropdown-trigger');

    this.dropdown = new DropdownListbox(
      this.options,
      this.handleChange.bind(this),
      this.handleNavigate,
      DropdownListTypes.option,
    );
    shadowRoot.querySelector('[role=listbox]').append(this.dropdown.render());

    this.combobox.addEventListener(
      'keydown',
      this.handlePress.bind(this),
      true,
    );
    this.combobox.addEventListener(
      'input',
      this.searchOptions.bind(this, true),
    );
    this.combobox.addEventListener(
      'click',
      this.searchOptions.bind(this, true),
    );
    this.combobox.addEventListener('blur', this.handleBlur.bind(this), false);
  }

  disconnectedCallback() {
    this.combobox.removeEventListener(
      'keydown',
      this.handlePress.bind(this),
      true,
    );
    this.combobox.removeEventListener('input', this.searchOptions.bind(this));
    this.combobox.removeEventListener('click', this.searchOptions.bind(this));
    this.combobox.removeEventListener(
      'blur',
      this.handleBlur.bind(this),
      false,
    );
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
    this.combobox.setAttribute('aria-expanded', 'true');
    this.combobox.setAttribute(
      'aria-activedescendant',
      this.dropdown.currentItem.id,
    );
  }

  hideDropdown() {
    this.trigger.classList.remove('is-open');
    this.combobox.setAttribute('aria-expanded', 'false');
    this.combobox.removeAttribute('aria-activedescendant');
  }

  handleChange(options: DropdownOption[]) {
    this.onChange(options);
    this.value = options[0].label; // value or label? label. but we callback with the whole option.
    if (this.combobox instanceof HTMLInputElement) {
      this.combobox.value = this.value;
    } else {
      this.combobox.children[0].textContent = this.value;
    }
  }

  handleNavigate(_id: string, _option: DropdownOption) {}

  handleBlur(_e: FocusEvent) {
    // if (e.target.value.trim().length > 0) {
    //   //To increase discoverability of the feature, if someone leaves the field with data in it, treat it like a tag.
    //   // this.pillList.addPill(e.target.value, e.target);
    // }
    this.hideDropdown();
  }

  handleFocus(_e: FocusEvent) {
    this.showDropdown();
  }

  handlePress(e: KeyboardEvent) {
    const { key } = e;
    switch (key) {
      case 'Enter':
        e.stopPropagation();
        e.preventDefault();

        if (this.trigger.classList.contains('is-open')) {
          // Hide the dropdown and submit if open
          this.hideDropdown();
          this.onChange([this.dropdown.currentItem.option]);
        } else {
          // Show the dropdown if closed
          this.showDropdown();
        }

        break;
      case 'ArrowUp':
        // Arrow through the list box
        // Show the dropdown and move
        e.stopPropagation();
        e.preventDefault();
        this.showDropdown();
        this.dropdown.nextItem(e, -1);
        break;
      case 'ArrowDown':
        // Arrow through the list box
        // Show the dropdown and move
        e.stopPropagation();
        e.preventDefault();
        this.showDropdown();
        this.dropdown.nextItem(e, 1);
        break;
      case 'Escape':
        if (this.combobox.getAttribute('aria-expanded') == 'true') {
          e.stopPropagation();
          e.preventDefault();
          this.hideDropdown();
        }
        break;
      default:
        this.searchOptions(e);
        break;
    }
  }

  searchOptions(e: Event) {
    //Should we only search if e.target.value.length > 2?
    const target = e.target as HTMLInputElement;
    if (this.type === ComboboxTypes.autocomplete && target) {
      const results = this.options.filter((option) => {
        return option.label.toLowerCase().includes(target.value.toLowerCase()); // && (this.pillList.items.map(i => i.value).indexOf(option) == -1)
      });
      this.dropdown.updateOptions(results);
    }
    this.showDropdown();
  }

  buttonTemplate = (placeholder: string = 'Select an Option…') => html`
    <div
      role="combobox"
      tabindex="0"
      class="input combobox__input readonly"
      id="combobox"
      aria-labelledby="label"
      aria-controls="listbox"
      aria-expanded="false"
      aria-haspopup="listbox"
      role="combobox"
    >
      <span class="slds-truncate" id="combobox-value">${placeholder}</span>
    </div>
  `;

  inputTemplate = (placeholder?: string) => html`
    <input
      type="text"
      class="input combobox__input"
      id="combobox"
      disabled=""
      placeholder="${placeholder}"
      autocomplete="off"
      aria-autocomplete="list"
      aria-controls="listbox"
      aria-expanded="false"
      aria-haspopup="listbox"
      role="combobox"
    />
  `;

  template = (
    type: ComboboxTypes,
    label: string,
    placeholder?: string,
    showLabel?: boolean,
  ) => html`<div class="form-element">
    <label
      class="form-element__label ${showLabel ? '' : 'visuallyhidden'}"
      for="combobox"
      id="label"
      >${label}</label
    >
    <div class="form-element__control">
      <div class="combobox_container has-selection">
        <div class="combobox dropdown-trigger dropdown-trigger_click">
          <div
            class="combobox__form-element input-has-icon input-has-icon_right"
            role="none"
          >
            ${type === ComboboxTypes.readonly
              ? this.buttonTemplate(placeholder)
              : this.inputTemplate(placeholder)}
          </div>
          <div
            id="listbox"
            class="dropdown dropdown_length-with-icon-7 dropdown_fluid"
            role="listbox"
          >
            <!-- ListBox -->
          </div>
        </div>
      </div>
      <!-- <div class="listbox_selection-group"> -->
      <!-- Pills -->
      <!-- </div> -->
    </div>
  </div>`;
}

const html = String.raw;

customElements.define('o-combobox', Combobox);
