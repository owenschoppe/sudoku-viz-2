import { State } from '../types';
import { cloneDeep } from '../utils';
import { Dispatch, Unsubscribe, subscribe } from '../utils/subscribe';
import { Constructor } from './types';

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
      this.state = cloneDeep(state) as State;
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
