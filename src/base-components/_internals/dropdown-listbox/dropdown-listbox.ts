import { Direction, ListMixin } from '../../../mixins/list-mixin';
import { ChangeCallback, NavigateCallback } from '../../combobox/types';
import { DropdownOption } from '../../menu/types';
import { ListItem } from '../list-item';
import { DropdownListTypes } from '../types';

export class DropdownListbox extends ListMixin(Array) {
  element: HTMLUListElement;

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

    this.element = document.createElement('ul');
    this.element.setAttribute('role', 'presentation');
    this.element.classList.add('listbox', 'listbox_vertical');

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
      this.onChange(getReturnValue(this.type, this.items, listItem));
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
    return this.element;
  }

  // // doesn't work
  // positionDropdown({ scrollHeight, scrollWidth }) {
  //   const { x, y, width, height } = this.dropdown.getBoundingClientRect();

  //   if (x + width > scrollWidth) {
  //     this.dropdown.classList.add('dropdown_left');
  //   } else {
  //     this.dropdown.classList.remove('dropdown_left');
  //   }

  //   if (y + height > scrollHeight) {
  //     this.dropdown.classList.add('dropdown_top');
  //   } else {
  //     this.dropdown.classList.remove('dropdown_top');
  //   }
  // }

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

  updateOptions(options: DropdownOption[]) {
    this._options = options;
    const items: ListItem[] = this.options.map(this.addItem.bind(this));

    // // remove unused items
    // this.items.forEach((item) => {
    //   if (!items.find((i) => i === item)) {
    //     item.element.remove();
    //   }
    // });

    this.items = items;

    return this.items.map((item: ListItem) => item.element);
  }

  addItem(option: DropdownOption): ListItem {
    const item = this.items.find(({ id }) => id === option.id); // just iterate over index...
    if (item) {
      item.option = option; // updates option in the item
      return item as ListItem;
    } else {
      const newItem = new ListItem(
        option,
        this.selectItem.bind(this),
        this.hoverItem.bind(this),
        this.type,
      );
      newItem.id = `${option.id}`;
      console.log('append', newItem);
      this.element.append(newItem.element);
      return newItem;
    }
  }
}

export const getReturnValue = (
  type: DropdownListTypes,
  items: ListItem[],
  currentItem: ListItem,
) => {
  switch (type) {
    case DropdownListTypes.menuitemcheckbox:
      return [
        ...items.map((item: ListItem) => {
          if (item === currentItem) {
            currentItem.option = {
              ...currentItem.option,
              value: !currentItem.option.value,
            };
          }
          return item.option;
        }),
      ];
    case DropdownListTypes.menuitem:
    case DropdownListTypes.menuitemradio:
    case DropdownListTypes.option:
    default:
      return [currentItem.option];
  }
};
