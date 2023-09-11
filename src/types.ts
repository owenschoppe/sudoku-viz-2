export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CellAddress = { i: number; j: number };

export type Board = (CellValue | 0)[][];

export type Possibilities = { [K in CellValue]: 0 | 1 };

export type PossibilitiesForCell = {
  possibilities: Possibilities;
  possibilityCount: number;
  value: 0 | CellValue;
};

export type PossibilitiesForBoard = PossibilitiesForCell[][];

export type CellsPerValue = Record<CellValue, CellAddress[]>;

export type State = {
  board: Board;
  possibilities: PossibilitiesForBoard;
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
