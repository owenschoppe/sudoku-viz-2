import { Direction, ListMixin } from '../../../mixins/list-mixin';
import {
  ChangeCallback,
  DropdownOption,
  NavigateCallback,
} from '../../combobox/types';
import { ListItem } from '../list-item';
import { DropdownListTypes } from '../types';

export class DropdownListbox extends ListMixin(Array) {
  dropdown: HTMLUListElement;

  currentItem: ListItem;

  _options: DropdownOption[];

  onChange: ChangeCallback;
  onNavigate: NavigateCallback;

  type: DropdownListTypes;

  constructor(
    options: DropdownOption[],
    onChange: ChangeCallback,
    onNavigate: NavigateCallback,
    type: DropdownListTypes,
  ) {
    super();

    this.onChange = onChange;
    this.onNavigate = onNavigate;

    this.type = type;

    this.dropdown = document.createElement('ul');
    this.dropdown.setAttribute('role', 'presentation');
    this.dropdown.classList.add('listbox', 'listbox_vertical');

    this.updateOptions(options);

    this.updateCurrent();
  }

  get options() {
    return this._options;
  }

  set options(options) {
    this.updateOptions(options);
  }

  selectItem(e: MouseEvent | KeyboardEvent, listItem: ListItem) {
    e.preventDefault();
    if (listItem && this.onChange) {
      this.onChange(listItem.option);
    }
  }

  nextItem(e: KeyboardEvent, dir: Direction) {
    e.preventDefault();
    var index = this.items.indexOf(this.currentItem);
    var next = this.nextIndex(index, dir, true);
    this.updateCurrent(next);
  }

  hoverItem(e: MouseEvent, listItem: ListItem) {
    e.preventDefault();
    this.currentItem = listItem;
    var index = this.items.indexOf(this.currentItem);
    this.updateCurrent(index);
  }

  render() {
    return this.dropdown;
  }

  updateOptions(options: DropdownOption[]) {
    this._options = options;
    this.items = [];
    this.options.forEach(this.addItem.bind(this));
  }

  updateCurrent(index?: number) {
    if (index === -1) {
      return;
    }
    index = index || 0;
    this.items.forEach((item: ListItem, i) => {
      if (i == index) {
        // Todo: abstract this into a setter on the item class.
        item.element.setAttribute('aria-selected', 'true');
        item.element.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
        item.element.setAttribute('tabindex', '0');
        item.element.focus();
        this.currentItem = item;
        this.onNavigate?.(item.id, item.option);
      } else {
        item.element.setAttribute('aria-selected', 'false');
        item.element.setAttribute('tabindex', '-1');
      }
    });
  }

  addItem(option: DropdownOption, i: number) {
    var item = new ListItem(
      option,
      this.selectItem.bind(this),
      this.hoverItem.bind(this),
      this.type,
    );
    item.id = `option-${i}`;
    this.items.push(item);
    this.dropdown.appendChild(item.element);
  }
}
