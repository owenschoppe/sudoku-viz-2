import { CellValue, State } from '../types';
import { Dispatch } from '../utils/subscribe';
import { isValidInput } from '../utils/sudoku';
import { Renderable } from './types';

export const HandleInputMixin = <T extends Renderable>(Base: T) =>
  class HandleInput extends Base {
    button: HTMLButtonElement;
    dispatch: Dispatch;
    i: number;
    j: number;
    isEditable: boolean;
    state: State;
    value: CellValue | 0;

    constructor(...args: any[]) {
      debugger;
      super(...args);
    }

    connectedCallback() {
      this.button?.addEventListener(
        'keydown',
        this.handleChange.bind(this),
        true,
      );

      super.connectedCallback();
    }

    disconnectedCallback() {
      this.button?.removeEventListener(
        'keydown',
        this.handleChange.bind(this),
        true,
      );

      super.disconnectedCallback();
    }

    handleChange(event: KeyboardEvent) {
      switch (event.key) {
        case 'Backspace':
          event.preventDefault();
          if (this.isEditable) {
            this.value = this.dispatch({
              type: 'update',
              data: {
                i: this.i,
                j: this.j,
                value: 0,
              },
            }).board[this.i][this.j];
          }
          break;
        default:
          event.preventDefault();
          if (
            isValidInput(
              event.key,
              this.state.possibilities[this.i][this.j].possibilities,
            ) &&
            Number(event.key) !== this.value &&
            this.isEditable
          ) {
            this.value = this.dispatch({
              type: 'update',
              data: {
                i: this.i,
                j: this.j,
                value: Number(event.key),
              },
            }).board[this.i][this.j];
          }
      }
    }
  };
