import { State } from '../types';
import { cloneDeep } from '../utils';
import { Dispatch, Unsubscribe, subscribe } from '../utils/subscribe';
import { GConstructor } from './types';

export interface ReactiveProps {
  state: State;
  dispatch: Dispatch;
  unsubscribe: Unsubscribe;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(state: State): void;
}

export const ReactiveMixin = <T extends GConstructor>(
  Base: T,
): GConstructor<ReactiveProps> & T =>
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

    connectedCallback(): void {
      this.render(this.state);
    }

    disconnectedCallback(): void {
      this.unsubscribe();
    }

    render(_state: State): void {}
  };
