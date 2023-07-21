export type Subscribe = <State>(render: Render<State>) => {
  dispatch: Dispatch;
  state: State;
  unsubscribe: Unsubscribe;
};

export type Unsubscribe = () => void;

export type Action = {
  type: string;
  data: any;
};

export type Dispatch = (action?: Action) => any;

export type Reducer<State> = (state: State, action: Action) => State;

export type Render<State> = (state: State) => void;

const subscribers = new Set<Render<any>>();

/**
 * Subscriber function for the module singleton.
 * TODO: add dependency array param and update state to use `new Proxy` and only call render when dependency changes.
 *
 * @param render Render function that will be called with State with every change to state.
 * @returns { dispatch, unsubscribe } Dispatch can be called with an Action to update state and call subscribed render fns. Unsubscribe has the subscriber bound to it and will unsubscribe the function.
 */
export const subscribe: Subscribe = <State extends any>(
  render: Render<State>,
) => {
  subscribers.add(render);
  // render(getState<State>()); // ???? Depends on whether we call this from the connectedCallback or from the constructor. Better to let the component decide?

  const unsubscribe =
    (render: Render<State>): Unsubscribe =>
    () => {
      return subscribers.delete(render);
    };

  const dispatch = (action?: Action) => {
    setState(reducer<State>(getState<State>(), action));
    console.log(getState(), action);
    subscribers.forEach((renderFn) => renderFn(getState<State>()));
    return getState<State>();
  };

  return { dispatch, state, unsubscribe: unsubscribe(render) };
};

export const initializeSubscriptions = <State>(
  initialState: State,
  reduce?: Reducer<State>,
) => {
  setState(initialState);
  if (reduce) {
    reducer<State> = reduce;
  }
};

// let state: State = {
//   board: Array(9)
//     .fill(null)
//     .map(() => Array(9).fill(null)),
// };

let state: any = {};

const getState = <State>() => state as State;

const setState = <State>(s: State) => (state = s);

let reducer = <State>(state: State, action?: Action) => {
  console.log(state, action);
  switch (action?.type) {
    // case 'update':
    //   const { i, j, value, color } = action.data;
    //   state.board[i][j] = value;
    //   state.color = color;
    //   console.log(i, j, value, state);
    //   return state;
    default:
      return state;
  }
};
