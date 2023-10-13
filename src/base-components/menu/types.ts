import { DropdownListTypes } from '../_internals/types';

export type MenuParams = {
  label: string;
  options: DropdownOption[];
  onChange: ChangeCallback;
  type?: DropdownListTypes;
};

// export enum MenuTypes {
//   menu,
//   checkboxmenu,
//   radiomenu,
// }

export type DropdownOption = {
  id: string;
  label: string;
  value: string | boolean;
  disabled?: boolean;
};

export type ChangeCallback = (option: DropdownOption[]) => void;
export type NavigateCallback = (id: string, option: DropdownOption) => void;
