export type MenuParams = {
  label: string;
  options: DropdownOption[];
  onChange: ChangeCallback;
  type?: MenuTypes;
};

export enum MenuTypes {
  menu,
  checkboxmenu,
  radiomenu,
}

export type DropdownOption = { label: string; value: string };

export type ChangeCallback = (option: DropdownOption) => void;
export type NavigateCallback = (id: string, option: DropdownOption) => void;
