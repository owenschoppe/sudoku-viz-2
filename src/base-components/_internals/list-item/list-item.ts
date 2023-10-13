import { DropdownOption } from '../../menu/types';
import { DropdownListTypes } from '../types';

type SelectCallback = (
  event: MouseEvent | KeyboardEvent,
  item: ListItem,
) => void;

type HoverCallback = (event: MouseEvent, item: ListItem) => void;

export class ListItem {
  element: HTMLLIElement;

  check?: HTMLDivElement;

  type: DropdownListTypes;

  onSelect: SelectCallback;

  onHover: HoverCallback;

  _option: DropdownOption;

  _id: string;

  constructor(
    option: DropdownOption,
    onSelect: SelectCallback,
    onHover: HoverCallback,
    type: DropdownListTypes,
  ) {
    this.onSelect = onSelect;
    this.onHover = onHover;
    this._option = option;
    this.type = type;

    this.element = document.createElement('li');
    this.element.classList.add('listbox-item', 'listbox__option');
    this.element.setAttribute('role', type);

    this.element.innerHTML = this.template();

    if (
      this.type === DropdownListTypes.menuitemcheckbox ||
      this.type === DropdownListTypes.menuitemradio
    ) {
      this.check = document.createElement('div');
      this.check.classList.add('check');

      this.element.prepend(this.check);
    }

    this.update();

    this.element.addEventListener('click', this.handleClick.bind(this), true);
    this.element.addEventListener('keydown', this.handleKey.bind(this), true);
    this.element.addEventListener(
      'mouseover',
      this.handleHover.bind(this),
      true,
    );
  }

  update() {
    this.element.querySelector('.listbox__option-text').textContent =
      this._option.label;

    if (this.check) {
      if (this._option.value) {
        this.element.setAttribute('aria-checked', 'true');
      } else {
        this.element.setAttribute('aria-checked', 'false');
      }
    }

    if (this._option.disabled) {
      this.element.setAttribute('aria-disabled', 'true');
    } else {
      this.element.setAttribute('aria-disabled', 'false');
    }
  }

  handleSelect(e: MouseEvent | KeyboardEvent) {
    if (!this._option.disabled) {
      this.onSelect(e, this);
    }
  }

  handleClick(e: MouseEvent) {
    this.handleSelect(e);
  }

  handleHover(e: MouseEvent) {
    this.onHover(e, this);
  }

  handleKey(e: KeyboardEvent) {
    switch (e.key) {
      case ' ':
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        this.handleSelect(e);
        break;
      case 'Enter':
        this.handleSelect(e);
        break;
      default:
    }
  }

  get id() {
    return this._id;
  }

  set id(_id: string) {
    this._id = _id;
    this.element.setAttribute('id', _id);
  }

  get option() {
    return this._option;
  }

  set option(_option: DropdownOption) {
    this._option = _option;
    this.update();
  }

  template = () => html` <span
    class="listbox__option-text listbox__option-text_entity"
  ></span>`;
}

const html = String.raw;
