export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Board = CellValue[][];

export type State = {
  board: Board;
  color?: string;
};

export type Action = {
  type: string;
  data: any;
};

export type Dispatch = (action: Action) => State;

export type Render = (state: State) => void;

export type Register = (render: Render) => {
  dispatch: Dispatch;
  state: State;
  unregister: Unregister;
};

export type Unregister = (render: Render) => void;

export type ReactiveElement = { render(state: State): void };
