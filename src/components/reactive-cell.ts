import { Dispatch, Register, State, Unregister } from '../types';
import Cell from './cell';

// type Constructor = new (...args: any[]) => {};

// Generic Contructor with constraints
type GConstructor<T = {}> = new (...args: any[]) => T;

// Define properties that the extended class must have.
export type Renderable = GConstructor<{
  connectedCallback(): void;
  render(state: State): void;
}>;

export const ReactiveMixin = <T extends Renderable>(Base: T) => {
  class Reactive extends Base {
    state: State;
    dispatch: Dispatch;
    unregister: Unregister;
    register: Register;

    constructor(...args: any[]) {
      super(...args);
    }

    init(register: Register) {
      this.register = register;
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.register) return;
      const { unregister, dispatch, state } = this.register(super.render);
      this.state = state;
      this.dispatch = dispatch;
      this.unregister = unregister;
    }

    disconnectedCallback() {
      this.unregister(super.render); // Will this work? Are we sending the prototype method or the instance?
    }
  }
  return Reactive;
};

export const ReactiveCell = ReactiveMixin(Cell);

customElements.define('reactive-cell', ReactiveCell);
