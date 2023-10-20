import { CellValue, State } from '../types';
import { isValidInput } from '../utils/sudoku';
import { ReactiveProps } from './reactive-component-mixin';
import { GConstructor } from './types';

interface HandleInputProps {
  input: HTMLButtonElement | HTMLInputElement;
  i: number;
  j: number;
  value: CellValue | 0;
  connectedCallback(): void;
  disconnectedCallback(): void;
  handleChange(event: KeyboardEvent): void;
}

/**
 * Add keyboard handling to ReactiveMixin.
 * Extending class must implement button, i, j, value, id
 * @param Base extends ReactiveMixin
 * @returns
 */
export const HandleInputMixin = <T extends GConstructor<ReactiveProps>>(
  Base: T,
): GConstructor<HandleInputProps> & T =>
  class HandleInput extends Base {
    declare input: HTMLButtonElement | HTMLInputElement;
    declare i: number;
    declare j: number;
    declare id: string;
    declare value: CellValue | 0;

    constructor(...args: any[]) {
      super(...args);
    }

    connectedCallback(): void {
      this.input?.addEventListener(
        'keydown',
        this.handleChange.bind(this),
        true,
      );

      super.connectedCallback();
    }

    disconnectedCallback(): void {
      this.input?.removeEventListener(
        'keydown',
        this.handleChange.bind(this),
        true,
      );

      super.disconnectedCallback();
    }

    handleChange(event: KeyboardEvent): void {
      const isEditable = this.state.original[this.i][this.j] === 0;

      switch (event.key) {
        case 'Tab':
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          this.dispatch({
            type: 'arrow',
            data: Object.assign(event, { id: this.id }),
          });
          break;
        case 'Backspace':
          event.preventDefault();
          if (isEditable) {
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
            isEditable
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

    render(state: State) {
      const { i, j } = state.location;
      if (this.i === i && this.j === j) {
        this.input.classList.add('current');
        this.input.setAttribute('tabindex', '0');

        const { i: previousI, j: previousJ } = this.state.location;
        const locationMoved = i !== previousI || j !== previousJ;
        const isUndo = state.moves.length < this.state.moves.length;
        if (locationMoved && !isUndo && this.id === state.focusBoardId) {
          this.input.focus();
        }
      } else {
        this.input.classList.remove('current');
        this.input.setAttribute('tabindex', '-1');
      }
      super.render(state);
    }
  };
