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

export type DropdownOption = { label: string; value: string };

export type ChangeCallback = (option: DropdownOption) => void;
export type NavigateCallback = (id: string, option: DropdownOption) => void;
