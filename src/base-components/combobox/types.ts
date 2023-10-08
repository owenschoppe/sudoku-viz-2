import { DropdownOption } from '../menu/types';

export type ComboboxParams = {
  label: string;
  options: DropdownOption[];
  placeholder: string;
  onChange: ChangeCallback;
  type?: ComboboxTypes;
  showLabel?: boolean;
};

export enum ComboboxTypes {
  readonly,
  autocomplete,
}

export type ChangeCallback = (option: DropdownOption[]) => void;
export type NavigateCallback = (id: string, option: DropdownOption) => void;
