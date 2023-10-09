import { State } from '../types';
import { Dispatch, Unsubscribe, subscribe } from '../utils/subscribe';

type Constructor = new (...args: any[]) => {};

// // Generic Contructor with constraints
// type GConstructor<T = {}> = new (...args: any[]) => T;

// // Define properties that the extended class must have.
// type Renderable = GConstructor<{ render: (state: State) => void }>

export const ReactiveMixin = <T extends Constructor>(Base: T) =>
  class Reactive extends Base {
    state: State;
    dispatch: Dispatch;
    unsubscribe: Unsubscribe;

    constructor(...args: any[]) {
      super(...args);
      const { unsubscribe, dispatch, state } = subscribe(
        this.render.bind(this),
      );
      this.state = state as State;
      this.dispatch = dispatch;
      this.unsubscribe = unsubscribe;
    }

    connectedCallback() {
      this.render(this.state);
    }

    disconnectedCallback() {
      this.unsubscribe();
    }

    render(_state: State) {}
  };
