import { DropdownOption } from '../combobox/types';

type SelectCallback = (event: MouseEvent, item: ListItem) => void;

type HoverCallback = (event: MouseEvent, item: ListItem) => void;

export class ListItem {
  option: DropdownOption;
  element: HTMLLIElement;
  onSelect: SelectCallback;
  onHover: HoverCallback;

  _id: string;

  constructor(
    option: DropdownOption,
    onSelect: SelectCallback,
    onHover: HoverCallback,
  ) {
    this.onSelect = onSelect;
    this.onHover = onHover;
    this.option = option;

    this.element = document.createElement('li');
    this.element.classList.add('listbox-item', 'listbox__option');
    this.element.setAttribute('role', 'option');

    this.element.innerHTML = this.template();

    this.element.querySelector('.listbox__option-text').textContent =
      this.option.label;

    this.element.addEventListener(
      'mousedown',
      this.handleClick.bind(this),
      true,
    );
    this.element.addEventListener(
      'mouseover',
      this.handleHover.bind(this),
      true,
    );
  }

  handleClick(e: MouseEvent) {
    this.onSelect(e, this);
  }

  handleHover(e: MouseEvent) {
    this.onHover(e, this);
  }

  get id() {
    return this._id;
  }

  set id(_id: string) {
    this._id = _id;
    this.element.setAttribute('id', _id);
  }

  template = () => html` <span
    class="listbox__option-text listbox__option-text_entity"
  ></span>`;
}

const html = String.raw;
