(function () {
    'use strict';

    const subscribers = new Set();
    /**
     * Subscriber function for the module singleton.
     * TODO: add dependency array param and update state to use `new Proxy` and only call render when dependency changes.
     * This will be useful when using arrow keys to navigate the board. Updates state but doesn't require rerendering.
     *
     * @param render Render function that will be called with State with every change to state.
     * @returns { dispatch, unsubscribe } Dispatch can be called with an Action to update state and call subscribed render fns. Unsubscribe has the subscriber bound to it and will unsubscribe the function.
     */
    const subscribe = (render) => {
        subscribers.add(render);
        // render(getState<State>()); // ???? Depends on whether we call this from the connectedCallback or from the constructor. Better to let the component decide?
        const unsubscribe = (render) => () => {
            return subscribers.delete(render);
        };
        const dispatch = (action) => {
            setState(reducer$1(getState(), action));
            // console.log(getState(), action);
            subscribers.forEach((renderFn) => renderFn(getState()));
            return getState();
        };
        return { dispatch, state, unsubscribe: unsubscribe(render) };
    };
    const initializeSubscriptions = (initialState, reduce) => {
        setState(initialState);
        if (reduce) {
            (reducer$1) = reduce;
        }
    };
    // let state: State = {
    //   board: Array(9)
    //     .fill(null)
    //     .map(() => Array(9).fill(null)),
    // };
    let state = {};
    const getState = () => state;
    const setState = (s) => (state = s);
    let reducer$1 = (state, action) => {
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

    var css$1 = ":host {\n  /* --my-button-color-public: var(--my-button-color-public, blue); */\n  --board-size: var(--public-board-size, 240px);\n  --board-cell-gap: var(--public-board-gap, 2px);\n  --board-group-gap: var(--public-board-gap, 4px);\n}\n\n/* ::part(button) {\n  color: darkgreen;\n} */\n\n.grid {\n  display: grid;\n  grid-template-rows:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-columns:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-areas:\n    'c00 c01 c02 . c03 c04 c05 . c06 c07 c08'\n    'c10 c11 c12 . c13 c14 c15 . c16 c17 c18'\n    'c20 c21 c22 . c23 c24 c25 . c26 c27 c28'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c30 c31 c32 . c33 c34 c35 . c36 c37 c38'\n    'c40 c41 c42 . c43 c44 c45 . c46 c47 c48'\n    'c50 c51 c52 . c53 c54 c55 . c56 c57 c58'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c60 c61 c62 . c63 c64 c65 . c66 c67 c68'\n    'c70 c71 c72 . c73 c74 c75 . c76 c77 c78'\n    'c80 c81 c82 . c83 c84 c85 . c86 c87 c88';\n  height: var(--board-size);\n  width: var(--board-size);\n  row-gap: var(--board-cell-gap);\n  column-gap: var(--board-cell-gap);\n  line-height: 0;\n}\n";

    var html$4 = "<div id=\"board\" class=\"grid\"></div>\n";

    // // Generic Contructor with constraints
    // type GConstructor<T = {}> = new (...args: any[]) => T;
    // // Define properties that the extended class must have.
    // type Renderable = GConstructor<{ render: (state: State) => void }>
    const ReactiveMixin = (Base) => class Reactive extends Base {
        state;
        dispatch;
        unsubscribe;
        constructor(...args) {
            super(...args);
            // console.log('subscribe', this.render);
            const { unsubscribe, dispatch, state } = subscribe(this.render.bind(this));
            this.state = state;
            this.dispatch = dispatch;
            this.unsubscribe = unsubscribe;
        }
        connectedCallback() {
            this.render(this.state);
        }
        disconnectedCallback() {
            this.unsubscribe();
        }
        render(_state) { }
    };

    const cellValues = {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
    };
    const isCellValue = (value) => !!cellValues[value];
    const justCellValues = (arr) => arr.filter(isCellValue);
    const randomInt = (max) => Math.floor(Math.random() * max);

    const slice2d = (arr, rowStart, colStart, rowEnd, colEnd) => arr.slice(rowStart, rowEnd).map((row) => row.slice(colStart, colEnd));
    const NNArray = (n, fill) => Array(n)
        .fill(null)
        .map(() => Array(n)
        .fill(null)
        .map(() => cloneDeep(fill)));
    /**
     * Convert index to coordinates
     * @param index 0-80 indexed number of a cell in 9x9 grid
     * @returns 0 indexed row, col coordinates
     */
    const indexToCoord = (index) => {
        const i = ~~(index / 9);
        const j = index % 9;
        return { i, j };
    };
    const possibilitiesObjectToArray = (possibilities) => Object.entries(possibilities).reduce((acc, [value, possible]) => {
        if (possible) {
            acc.push(Number(value));
        }
        return acc;
    }, []);
    /**
     * Clone arbitarily nested objects and arrays and primitive values.
     * Does not support more complex classes like Map and Set
     * Consider using Object.getPrototypeOf(map) === Map.prototype to expand support
     * @param obj any[] | {}
     * @returns any[] | {}
     */
    const cloneDeep = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(cloneDeep);
        }
        else if (typeof obj === 'object' && obj !== null) {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                acc[key] = cloneDeep(value);
                return acc;
            }, {});
        }
        else {
            return obj;
        }
    };
    const shuffle = (arr) => arr.reduce((acc, cur) => {
        const index = randomInt(acc.length);
        acc.splice(index, 0, cur);
        return acc;
    }, []);

    /**
     * Memoizes the output of a function to improve performance.
     * @param fn Function to memoize
     * @param resolver Custom function that returns a key for the args. By default the first arg is used. arg[0]
     * @returns memoized function
     *
     * Customize the cache by updating `memoize.Cache` to be Map or WeakMap.
     * WeakMap is preferred for object and array args because it allows old data to be garbage collected.
     */
    const memoize = (fn, resolver) => {
        if (typeof fn != 'function' ||
            (resolver != null && typeof resolver != 'function')) {
            throw new TypeError('Arguments are not of correct type');
        }
        const memoized = (...args) => {
            const cache = memoized.cache;
            const key = resolver ? resolver(args) : args[0];
            const cached = cache.get(key);
            if (cached !== undefined) {
                return cached;
            }
            const result = fn(...args);
            cache.set(key, result);
            return result;
        };
        memoized.cache = new (memoize.Cache || Map)();
        return memoized;
    };
    memoize.Cache = Map;

    const unique = (arr) => [...new Set(arr)];

    // Old app the board data structure was [i][j][k]
    // where k[0] is the cell value where 0 is empty
    // and k[1-9] is the binary probability of that number being in that cell
    // value of 0 means it can't be that value, value of 1 means it can be.
    // boards: 201 one of the main challenges is undoing a board move. just because we remove a value from a cell doesn't mean it then becomes legal for all related cells
    /**
     * Compute all the possible moves on the current state of the sudoku board
     * @param board
     * @returns { possibilities: { [1-9]: 0 || 1 }, possibilityCount: number, value: 0 | CellValue }[][] Where 0 means the cell can't be that value and 1 means it can be
     */
    const possibilitiesForBoard = (board) => {
        return board.map((row, i) => row.map((_, j) => possibilitiesForCell(board, i, j)));
    };
    /**
     * Get an object representing all the possibilities for a cell
     * TODO: catch the case when the possibility of a value is 0 for all other cells in row, col, or group. Chain of length 1?
     * @param board Sudoku board {1-9}[][]
     * @param i Row index
     * @param j Column index
     * @returns { possibilities: { [1-9]: 0 || 1 }, possibilityCount: number, value: 0 | CellValue } Where 0 means the cell can't be that value and 1 means it can be
     */
    const possibilitiesForCell = (board, i, j) => {
        const basePossibilities = {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
        };
        const taken = allValuesExcludingCell(board, i, j);
        const possibilities = taken.reduce((current, value) => {
            current[value] = 0;
            return current;
        }, basePossibilities);
        return {
            possibilities,
            possibilityCount: 9 - taken.length,
            value: board[i][j],
        };
    };
    /**
     * Efficient computation of which values are taken, excluding the current cell's value
     * @param board
     * @param i
     * @param j
     * @returns
     */
    const allValuesExcludingCell = (board, i, j) => {
        return justCellValues(unique([rowValExcluding, colValExcluding, grpValExcluding].flatMap((fn) => fn(board, i, j))));
    };
    // Do we need to filter null?
    // Should null be 0?
    const rowValExcluding = (board, i, j) => {
        const values = rowValues(board, i);
        values.splice(j, 1);
        return values;
    };
    const colValExcluding = (board, i, j) => {
        const values = colValues(board, j);
        values.splice(i, 1);
        return values;
    };
    const grpValExcluding = (board, i, j) => {
        const values = grpValues(board, cellToGroupIndex[i][j]);
        const index = cellToGroupMemberIndex[i][j];
        values.splice(index, 1);
        return values;
    };
    const rowValues = (board, i) => board[i].slice();
    const colValues = (board, j) => board.map((row) => row[j]);
    /**
     * should this take g or i,j?
     * @param board
     * @param g
     * @returns
     */
    const grpValues = (board, g) => {
        const [rowStart, colStart] = groupStartCoords[g];
        return slice2d(board, rowStart, colStart, rowStart + 3, colStart + 3).flat();
    };
    const cellToGroupIndex = [
        [0, 0, 0, 1, 1, 1, 2, 2, 2],
        [0, 0, 0, 1, 1, 1, 2, 2, 2],
        [0, 0, 0, 1, 1, 1, 2, 2, 2],
        [3, 3, 3, 4, 4, 4, 5, 5, 5],
        [3, 3, 3, 4, 4, 4, 5, 5, 5],
        [3, 3, 3, 4, 4, 4, 5, 5, 5],
        [6, 6, 6, 7, 7, 7, 8, 8, 8],
        [6, 6, 6, 7, 7, 7, 8, 8, 8],
        [6, 6, 6, 7, 7, 7, 8, 8, 8],
    ];
    const cellToGroupMemberIndex = [
        [0, 1, 2, 0, 1, 2, 0, 1, 2],
        [3, 4, 5, 3, 4, 5, 3, 4, 5],
        [6, 7, 8, 6, 7, 8, 6, 7, 8],
        [0, 1, 2, 0, 1, 2, 0, 1, 2],
        [3, 4, 5, 3, 4, 5, 3, 4, 5],
        [6, 7, 8, 6, 7, 8, 6, 7, 8],
        [0, 1, 2, 0, 1, 2, 0, 1, 2],
        [3, 4, 5, 3, 4, 5, 3, 4, 5],
        [6, 7, 8, 6, 7, 8, 6, 7, 8],
    ];
    const groupMemberIndexToCell = () => {
        const result = NNArray(9, null);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const groupIndex = cellToGroupIndex[i][j];
                const memberIndex = cellToGroupMemberIndex[i][j];
                result[groupIndex][memberIndex] = { i, j };
            }
        }
        return (groupIndex, memberIndex) => result[groupIndex][memberIndex];
    };
    const colMemberIndexToCell = (j, i) => ({
        i,
        j,
    });
    const rowMemberIndexToCell = (i, j) => ({
        i,
        j,
    });
    const addressToGroupMember = ({ i, j }) => ({
        slice: cellToGroupIndex[i][j],
        member: cellToGroupMemberIndex[i][j],
    });
    const addressToColumnMember = ({ i, j }) => ({
        slice: j,
        member: i,
    });
    const addressToRowMember = ({ i, j }) => ({
        slice: i,
        member: j,
    });
    const groupStartCoords = [
        [0, 0],
        [0, 3],
        [0, 6],
        [3, 0],
        [3, 3],
        [3, 6],
        [6, 0],
        [6, 3],
        [6, 6],
    ];
    const isValidInput = (input, possibilities) => {
        return !!possibilities[Number(input)] ?? false;
    };

    /**
     * Cell element that implements the dispatch pattern.
     * Each WC class is responsible for tracking the child elements it creates
     * and updating their properties or calling their render methods during render.
     *
     * CSS Custom Properties
     * @property --cell-text-color black
     * @property --cell-background-color #f3f3f3
     * @param i
     * @param j
     * @param value
     */
    class BoardCell extends ReactiveMixin(HTMLElement) {
        i;
        j;
        value;
        css;
        input;
        constructor({ i, j, css }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.i = i;
            this.j = j;
            this.css = css;
            this.value = this.state.board[i][j];
        }
        connectedCallback() {
            this.init();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.input.removeEventListener('keydown', this.handleChange);
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = this.template();
            this.input = shadowRoot.querySelector('input');
            this.input.addEventListener('keydown', this.handleChange.bind(this));
            this.input.addEventListener('click', this.handleClick.bind(this));
        }
        render(state) {
            const value = state.board[this.i][this.j];
            if (value !== this.value) {
                this.state = state;
                this.value = value;
                const displayValue = isCellValue(this.value) ? String(this.value) : '';
                this.input.value = displayValue;
            }
            const { i, j } = state.location;
            if (this.i === i && this.j === j) {
                this.input.classList.add('current');
                this.input.focus();
            }
            else {
                this.input.classList.remove('current');
            }
        }
        handleClick() {
            this.dispatch({
                type: 'move',
                data: { location: { i: this.i, j: this.j } },
            });
        }
        handleChange(event) {
            event.preventDefault();
            if (isValidInput(event.key, this.state.possibilities[this.i][this.j].possibilities) &&
                Number(event.key) !== this.value) {
                this.value = this.dispatch({
                    type: 'update',
                    data: {
                        i: this.i,
                        j: this.j,
                        value: Number(event.key),
                        // color: this.getColor(),
                    },
                }).board[this.i][this.j];
            }
            else if (event.key === 'Backspace') {
                this.value = this.dispatch({
                    type: 'update',
                    data: {
                        i: this.i,
                        j: this.j,
                        value: 0,
                        // color: this.getColor(),
                    },
                }).board[this.i][this.j];
            }
        }
        // getColor() {
        //   const step = 255 / 9;
        //   return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
        // }
        // Todo
        template = () => html$3 `
    <!DOCTYPE html>
    <style>
      input {
        caret-color: transparent;
        color: var(--cell-text-color, black);
        border: none;
        background: var(--cell-background-color, #f3f3f3);
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        height: var(--cell-height, 100%);
        margin: 0;
        padding: 0;
        text-align: center;
        width: var(--cell-width, 100%);
      }
      /* Hide numeric input buttons */
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      /* Firefox */
      input[type=number] {
        -moz-appearance: textfield;
      }
      input.current, input:focus {
        outline: none;
        box-shadow: 0 0 0 4px inset hsl(196deg 76% 45% / 80%);
      }
            ${this.css}
    </style>
    <input
      value="${isCellValue(this.value) ? String(this.value) : ''}"
      type="number"
    />
  `;
    }
    const html$3 = String.raw;
    customElements.define('board-cell', BoardCell);

    //@ts-ignore
    class Board extends ReactiveMixin(HTMLElement) {
        cells = [];
        board;
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            this.init();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = html$4;
            const style = document.createElement('style');
            style.innerHTML = css$1;
            shadowRoot.prepend(style);
            this.cells = this.state.board
                .map((row, i) => row.map((_value, j) => new BoardCell({
                i,
                j,
                css: `:host { grid-area: c${i}${j}; }`,
            })))
                .flat();
            this.board = shadowRoot.querySelector('#board');
            this.board.append(...this.cells);
            this.board.setAttribute('style', `--cell-text-size: 24px;`);
            this.board.addEventListener('keydown', this.handleKey.bind(this));
        }
        handleKey(event) {
            this.dispatch({
                type: 'arrow',
                data: event,
            });
        }
        render(_state) {
            // console.log('render board', state.board);
        }
    }
    customElements.define('sudoku-board', Board);

    /**
     * Cell element that implements the dispatch pattern.
     * Each WC class is responsible for tracking the child elements it creates
     * and updating their properties or calling their render methods during render.
     *
     * CSS Custom Properties
     * @property --cell-text-color black
     * @property --cell-background-color #f3f3f3
     * @param i
     * @param j
     * @param value
     */
    class BoardLensCell extends ReactiveMixin(HTMLElement) {
        i;
        j;
        lens;
        value = 0;
        css;
        button;
        constructor({ i, j, css, lens, }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.i = i;
            this.j = j;
            this.css = css;
            this.lens = lens;
        }
        connectedCallback() {
            this.init();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.shadowRoot
                .querySelector('button')
                .removeEventListener('click', this.handleClick);
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = this.template();
            this.button = shadowRoot.querySelector('button');
            this.button.addEventListener('click', this.handleClick.bind(this));
        }
        render(state) {
            this.value = state.board[this.i][this.j];
            const possibility = state.possibilities[this.i][this.j].possibilities[this.lens];
            const selected = this.value === this.lens;
            const displayValue = selected || possibility ? this.lens : null;
            this.button.textContent = String(displayValue || '');
            this.updateClass();
            const { i, j } = state.location;
            if (this.i === i && this.j === j) {
                this.button.classList.add('current');
            }
            else {
                this.button.classList.remove('current');
            }
        }
        updateClass() {
            const { possibilities, possibilityCount } = this.state.possibilities[this.i][this.j];
            this.button.classList.remove('selected', 'only', 'possibility');
            if (this.value === this.lens) {
                this.button.classList.add('selected');
            }
            else if (possibilityCount === 1 && possibilities[this.lens]) {
                this.button.classList.add('only');
            }
            else if (possibilities[this.lens]) {
                this.button.classList.add('possibility');
            }
        }
        handleClick(_event) {
            const { possibilities, possibilityCount } = this.state.possibilities[this.i][this.j];
            if (possibilityCount === 1 && isValidInput(this.lens, possibilities)) {
                this.value = this.dispatch({
                    type: 'update',
                    data: {
                        i: this.i,
                        j: this.j,
                        value: this.lens,
                        // color: this.getColor(),
                    },
                }).board[this.i][this.j];
            }
            this.dispatch({
                type: 'move',
                data: { location: { i: this.i, j: this.j } },
            });
        }
        // getColor() {
        //   const step = 255 / 9;
        //   return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
        // }
        // Todo
        template = () => html$2 `
    <!DOCTYPE html>
    <style>
      button {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        /* background: var(--cell-background-color, #f3f3f3); */
        background: rgba(255, 255, 255, 0.1);
        /* opacity: 0.1; */
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
      }
      button.selected {
        background: var(--cell-background-color, #f3f3f3);
        /* opacity: 1; */
      }
      button.only {
        background: white;
        /* opacity: 1; */
      }
      button.possibility {
        background: var(--cell-background-possibility-color, #f3f3f3);
        /* opacity: 0.5; */
      }
      button.current {
        box-shadow: 0 0 0 1px white;
      }
      :host{
        display: block;
      }
      ${this.css}
    </style>
    <button part="button">${this.value ?? ``}</button>
  `;
    }
    const html$2 = String.raw;
    customElements.define('board-lens-cell', BoardLensCell);

    //@ts-ignore
    class BoardLens extends ReactiveMixin(HTMLElement) {
        cells = [];
        board;
        lens = null;
        constructor(lens) {
            super();
            this.attachShadow({ mode: 'open' });
            this.lens = lens;
        }
        connectedCallback() {
            this.init();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = html$4;
            const style = document.createElement('style');
            style.innerHTML = css$1;
            shadowRoot.prepend(style);
            this.cells = this.state.board
                .map((row, i) => row.map((_value, j) => new BoardLensCell({
                i,
                j,
                css: `:host { grid-area: c${i}${j}; }`,
                lens: this.lens,
            })))
                .flat();
            this.board = shadowRoot.querySelector('#board');
            this.board.append(...this.cells);
            const color = `${hue$1[this.lens]} ${saturation$1}% ${brightness$1}%`;
            const background = `hsl(${color})`;
            const possibility = `hsl(${color} / 50%)`;
            this.board.setAttribute('style', `--cell-text-color: black; --cell-background-color: ${background}; --cell-background-possibility-color: ${possibility};`);
        }
    }
    const hue$1 = {
        1: 40,
        2: 80,
        3: 120,
        4: 160,
        5: 200,
        6: 240,
        7: 280,
        8: 320,
        9: 360,
    };
    const saturation$1 = 90;
    const brightness$1 = 75;
    customElements.define('sudoku-board-lens', BoardLens);

    var css = ".flex {\n  height: 32px;\n  padding: 8px 0;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  gap: 8px;\n  align-content: center;\n  justify-content: flex-start;\n}\n\n.primary {\n  border: 0;\n  background: white;\n  color: black;\n}\n\n.primary:hover,\n.primary:focus {\n  border: 0;\n  background: white;\n  outline: none;\n  box-shadow: 0 0 0 3px inset chartreuse;\n  color: black;\n}\n\n.primary:active {\n  border: 0;\n  background: lavenderblush;\n  color: black;\n}\n";

    var html$1 = "<div class=\"flex\">\n  <button id=\"new\" class=\"primary\">New</button>\n</div>\n";

    var difficultyLevel;
    (function (difficultyLevel) {
        difficultyLevel[difficultyLevel["HARD"] = 0] = "HARD";
        difficultyLevel[difficultyLevel["MED"] = 1] = "MED";
        difficultyLevel[difficultyLevel["EASY"] = 2] = "EASY";
    })(difficultyLevel || (difficultyLevel = {}));
    /**
     * Evidently boards with more blank values are easier to solve than boards with fewer.
     * Perhaps this is due to the increasing number of possible solutions.
     */
    const difficultyLevelValues = {
        [difficultyLevel.HARD]: [23, 24, 25, 26, 27],
        [difficultyLevel.MED]: [28, 29, 30, 31, 32],
        [difficultyLevel.EASY]: [33, 34, 35, 36, 37],
    };
    /**
     * Generate a board for the given difficulty level
     * @param difficulty difficultyLevel.EASY, difficultyLevel.MED, difficultyLevel.HARD
     * @returns
     */
    const generateBoard = (difficulty = difficultyLevel.EASY) => removeValues(solve(generateSeed(), 9), difficultyLevelValues[difficulty][randomInt(5)]);
    const generateSeed = () => [
        shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        ...NNArray(9, 0).slice(1),
    ];
    const removeValues = (board, values) => {
        while (values) {
            const i = randomInt(9);
            const j = randomInt(9);
            if (board[i][j]) {
                board[i][j] = 0;
                values -= 1;
            }
        }
        return board;
    };
    /**
     * Uses depth first search to solve the board starting from index
     * @param board Partial sudoku board to solve
     * @param index Optional starting index 0-80. Will be converted to i,j coordinates.
     * @returns Solved sudoku board
     */
    const solve = (board, index = 0) => {
        const { i, j } = indexToCoord(index);
        const possibilities = possibilitiesForCell(board, i, j);
        const possibleValues = possibilitiesObjectToArray(possibilities.possibilities);
        let result = false;
        if (index == 80) {
            // last cell, solved?
            board[i][j] = possibilities.value || possibleValues[0];
            result = board;
        }
        else if (index < 80 && possibilities.value) {
            // skip this cell
            result = solve(board, index + 1);
        }
        else if (!possibilities.value) {
            // select an option and explore that path
            result = exploreOptions(solve, updateBoardTemp, (result) => !!result, shuffle(possibleValues), board, index);
        }
        return result;
    };
    const updateBoardTemp = (option, board, index) => {
        const { i, j } = indexToCoord(index);
        const newBoard = cloneDeep(board);
        newBoard[i][j] = option;
        return [newBoard, index + 1];
    };
    /**
     * Depth First Search utility function
     * @param exploreFn Recursive function that uses this util
     * @param exploreParams Function to generate the params for the explore function based on the selected option
     * @param successFn Function to determine if the returned result is a success
     * @param options Array of options to explore at this level/node
     * @param args Any additional arguments that need to be passed to the exploreParams function
     * @returns Successful result or False
     */
    const exploreOptions = (exploreFn, exploreParams, successFn, options, ...args) => {
        for (const option of options) {
            const result = exploreFn(...exploreParams(option, ...args));
            if (successFn(result)) {
                return result;
            }
        }
        return false;
    };

    //@ts-ignore
    class Controls extends ReactiveMixin(HTMLElement) {
        newButton;
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            this.init();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.newButton = this.shadowRoot.querySelector('#new');
            this.newButton.removeEventListener('click', this.handleNewButton);
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = html$1;
            const style = document.createElement('style');
            style.innerHTML = css;
            shadowRoot.prepend(style);
            this.newButton = shadowRoot.querySelector('#new');
            this.newButton.addEventListener('click', this.handleNewButton.bind(this));
        }
        render(_state) {
            // console.log('render board', state.board);
        }
        handleNewButton() {
            this.dispatch({
                type: 'new',
                data: {
                    difficulty: difficultyLevel.EASY,
                },
            });
        }
    }
    customElements.define('sudoku-controls', Controls);

    const up = (addr) => ({
        ...addr,
        i: decrement(addr.i),
    });
    const down = (addr) => ({
        ...addr,
        i: increment(addr.i),
    });
    const left = (addr) => ({
        ...addr,
        j: decrement(addr.j),
    });
    const right = (addr) => ({
        ...addr,
        j: increment(addr.j),
    });
    const increment = (start) => move(start, +1, 9);
    const decrement = (start) => move(start, -1, 9);
    const move = (start, delta, modulo) => (start + delta + modulo) % modulo;

    // Loops/Chains (Groups of cells with possibilities that are linked together)
    // Two (N) cells in a row/col/group that share the same two (N) possibilities
    // ex: [0,0]:[1,2]=>[0,3]:[1:2] end (two cells, two values)
    // 1:[[0,0],[0,3]] 2:[[0,0],[0,3]] simple case, cell lists are the same.
    // ex: [0,0]:[1,2]=>[0,3]:[1:3]=>[0,4]:[2,3] end (three values, three cells) but only 2 for each value.
    // 1:[[0,0],[0,3]] 2:[[0,0],[0,4]] 3:[[0,3],[0,4]]
    // 4 or more? cells that are linked by row/col/group possibilities
    // ex: [0,0]:[1,2]=>[0,3]:[2:4]=>[1,5]:[4:5]=>[1,0]:[1:5] end (4 cells, 4 values)
    // Let's solve the simpler cases first and see how we can generalize.
    // For row, for values 1-9, collect possible cells. Sort by cell list length.
    // For for each cell in list for value, if possible value > cell list length then abort.??
    // Otherwise, run the loop. cell 0 of value 1 has two options; 1 and 2.
    // We're on 1, so take 2. Recursively call function on value 2.
    // What do we return?
    // How do we exit?
    // Pass in the chain of cells and values, if found start (or any subpart?), return steps. else walk possibilities. else return false deadend.
    // if if found start OR if all cells are contained in the current cell chain array?
    const cellString = (cell) => `${cell.i}-${cell.j}`;
    /**
     * Get connected cells for the current cell.
     * Must be repeated for every unsearched cell in the row.
     * @param cell Current cell
     * @param possibilities
     * @param cellsPerValue
     * @param cellSteps Cells processed so far
     * @param valueSteps Values processed so far
     * @returns Will always only be a single array with 0-9 cells.
     */
    const getConnectedCells = (cell, possibilities, cellsPerValue, cellSteps = {}, // order doesn't matter
    valueSteps = {}) => {
        const possibleValues = possibilities[cell.i][cell.j].possibilities;
        const values = Object.keys(possibleValues);
        const unmatchedValues = values.filter((value) => possibleValues[value] && !valueSteps[possibleValues[value]]);
        const unmatchedValue = unmatchedValues.slice(-1)[0]; // ?
        return unmatchedValue
            ? getConnectedValues(unmatchedValue, possibilities, cellsPerValue, cellSteps, { ...valueSteps, [unmatchedValue]: true })
            : Object.values(cellSteps);
    };
    /**
     *
     * @param value Current value
     * @param possibilities
     * @param cellsPerValue
     * @param cellSteps
     * @param valueSteps
     * @returns
     */
    const getConnectedValues = (value, possibilities, cellsPerValue, cellSteps = {}, // order doesn't matter
    valueSteps = {}) => {
        const unmatchedCells = cellsPerValue[value].filter((cell) => !cellSteps[cellString(cell)]);
        const unmatchedCell = unmatchedCells.slice(-1)[0]; // ?
        return unmatchedCell
            ? getConnectedCells(unmatchedCell, possibilities, cellsPerValue, { ...cellSteps, [cellString(unmatchedCell)]: unmatchedCell }, valueSteps)
            : Object.values(cellSteps);
    };
    const cellsPerValueInRows = (boardPossibilities) => cellsPerValue(rowValues, rowMemberIndexToCell, boardPossibilities);
    const cellsPerValueInCols = (boardPossibilities) => cellsPerValue(colValues, colMemberIndexToCell, boardPossibilities);
    const cellsPerValueInGroups = (boardPossibilities) => cellsPerValue(grpValues, groupMemberIndexToCell(), boardPossibilities);
    const cellsPerValue = (valuesFn, addressFn, boardPossibilities) => {
        return Array(9)
            .fill(0)
            .map((_, index) => {
            const possibilities = valuesFn(boardPossibilities, index);
            return possibilities.reduce((values, cellPossibilities, member) => {
                const address = addressFn(index, member);
                return Object.entries(cellPossibilities.possibilities).reduce((acc, [value, possible]) => {
                    if (possible)
                        acc[value].push(address);
                    return acc;
                }, values);
            }, cloneDeep(baseCellsPerValue));
        });
    };
    const baseCellsPerValue = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
    };
    const loopFns = {
        row: {
            addressToSliceFn: addressToRowMember,
            cellsPerValueFn: cellsPerValueInRows,
        },
        column: {
            addressToSliceFn: addressToColumnMember,
            cellsPerValueFn: cellsPerValueInCols,
        },
        group: {
            addressToSliceFn: addressToGroupMember,
            cellsPerValueFn: cellsPerValueInGroups,
        },
    };
    /**
     * Get all loops for the board by row, column, or group.
     * Uses the board as a cache to avoid rework and to allow easy visualization.
     * How might we link these loops together?
     * Would it be better to get a flat array of loops and then generate a board with loop ids?
     * @param boardP
     * @param addressToSliceFn
     * @param cellsPerValueFn
     * @returns
     */
    const getLoopsForBoardByType = (boardP, type) => {
        const getLoopId = nextId();
        const { addressToSliceFn, cellsPerValueFn } = loopFns[type];
        const memoizedCPV = memoize(cellsPerValueFn);
        return boardP.reduce((cache, row, i) => {
            row.forEach((_, j) => {
                if (!cache[i][j]) {
                    const { slice } = addressToSliceFn({ i, j });
                    const cPV = memoizedCPV(boardP)[slice];
                    const loop = getConnectedCells({ i, j }, boardP, cPV);
                    if (loop.length > 1) {
                        const id = getLoopId();
                        loop.forEach(({ i: m, j: n }) => {
                            // add color, index, or name of loop?
                            cache[m][n] = { loop, id };
                        });
                    }
                }
            });
            return cache;
        }, NNArray(9, null));
    };
    const nextId = (init = 0) => {
        let next = init;
        return () => {
            return intToLetters(next++);
        };
    };
    const intToLetters = (int, str = '', place = 1) => {
        const letter = String.fromCharCode((int % 26) + 65) + str;
        if (int < 26 * place) {
            return letter;
        }
        else {
            return intToLetters(int - 26 * place, letter, place * 26);
        }
    };

    /**
     * Cell element that implements the dispatch pattern.
     * Each WC class is responsible for tracking the child elements it creates
     * and updating their properties or calling their render methods during render.
     *
     * CSS Custom Properties
     * @property --cell-text-color black
     * @property --cell-background-color #f3f3f3
     * @param i
     * @param j
     * @param value
     */
    class BoardLoopsCell extends ReactiveMixin(HTMLElement) {
        i;
        j;
        type;
        value = null;
        css;
        button;
        constructor({ i, j, css, type, }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.i = i;
            this.j = j;
            this.css = css;
            this.type = type;
        }
        connectedCallback() {
            this.init();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.shadowRoot
                .querySelector('button')
                .removeEventListener('click', this.handleClick);
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = this.template();
            this.button = shadowRoot.querySelector('button');
            this.button.addEventListener('click', this.handleClick.bind(this));
        }
        render(state) {
            const loopObj = state.loops[this.type][this.i][this.j];
            const { id, loop } = loopObj || { id: null, loop: null };
            if (id && loop) {
                const { i: _m, j: n } = loop[0];
                const color = `${hue[n]} ${saturation}% ${brightness}%`;
                const background = `hsl(${color})`;
                this.shadowRoot.host.setAttribute('style', `--cell-text-color: black; --cell-background-color: ${background};`);
                this.button.classList.add('selected');
            }
            else {
                this.button.classList.remove('selected');
            }
            this.button.textContent = String(id || '');
            const { i, j } = state.location;
            if (this.i === i && this.j === j) {
                this.button.classList.add('current');
            }
            else {
                this.button.classList.remove('current');
            }
        }
        handleClick(_event) {
            this.dispatch({
                type: 'move',
                data: { location: { i: this.i, j: this.j } },
            });
        }
        template = () => html `
    <!DOCTYPE html>
    <style>
      button {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        background: rgba(255, 255, 255, 0.1);
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
      }
      button.selected {
        background: var(--cell-background-color, #f3f3f3);
      }
      button.only {
        background: white;
      }
      button.possibility {
        background: var(--cell-background-possibility-color, #f3f3f3);
      }
      button.current {
        box-shadow: 0 0 0 1px white;
      }
      :host{
        display: block;
      }
      ${this.css}
    </style>
    <button part="button">${this.value ?? ``}</button>
  `;
    }
    const hue = {
        1: 40,
        2: 80,
        3: 120,
        4: 160,
        5: 200,
        6: 240,
        7: 280,
        8: 320,
        9: 360,
    };
    const saturation = 90;
    const brightness = 75;
    const html = String.raw;
    customElements.define('board-loops-cell', BoardLoopsCell);

    //@ts-ignore
    class BoardLoops extends ReactiveMixin(HTMLElement) {
        cells = [];
        board;
        type = null;
        constructor(type) {
            super();
            this.attachShadow({ mode: 'open' });
            this.type = type;
        }
        connectedCallback() {
            this.init();
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = html$4;
            const style = document.createElement('style');
            style.innerHTML = css$1;
            shadowRoot.prepend(style);
            this.cells = this.state.loops[this.type]
                .map((row, i) => row.map((_value, j) => new BoardLoopsCell({
                i,
                j,
                css: `:host { grid-area: c${i}${j}; }`,
                type: this.type,
            })))
                .flat();
            this.board = shadowRoot.querySelector('#board');
            this.board.append(...this.cells);
        }
    }
    customElements.define('sudoku-board-loops', BoardLoops);

    /**
     * Reducer function to manage sudoku calculations
     * TODO: save state in local storage to avoid losing it on reload
     * TODO: add selected cell to state and add keyboard handler
     * @param state
     * @param action
     * @returns
     */
    const reducer = (state, action) => {
        let updatedState;
        switch (action.type) {
            case 'update':
                const { i, j, value, color } = action.data;
                state.board[i][j] = value;
                state.color = color;
                state.possibilities = possibilitiesForBoard(state.board);
                state.loops = {
                    row: getLoopsForBoardByType(state.possibilities, 'row'),
                    column: getLoopsForBoardByType(state.possibilities, 'column'),
                    group: getLoopsForBoardByType(state.possibilities, 'group'),
                };
                // console.log(i, j, value, state);
                updatedState = state;
                break;
            case 'new':
                updatedState = initialState(generateBoard(action.data.difficulty));
                break;
            case 'move':
                state.location = action.data.location;
                updatedState = state;
                break;
            case 'arrow':
                const direction = {
                    ArrowLeft: left,
                    ArrowRight: right,
                    ArrowUp: up,
                    ArrowDown: down,
                };
                state.location =
                    direction[action.data.key]?.(state.location) || state.location;
                updatedState = state;
                break;
            default:
                updatedState = state;
        }
        window.localStorage.setItem('state', JSON.stringify(updatedState));
        return updatedState;
    };
    const initialBoard = NNArray(9, 0);
    const initialState = (savedBoard) => {
        const board = savedBoard || initialBoard;
        const possibilities = possibilitiesForBoard(board);
        return {
            board: board,
            possibilities,
            loops: {
                row: getLoopsForBoardByType(possibilities, 'row'),
                column: getLoopsForBoardByType(possibilities, 'column'),
                group: getLoopsForBoardByType(possibilities, 'group'),
            },
            location: { i: 0, j: 0 },
        };
    };
    (() => {
        const storedState = JSON.parse(window.localStorage.getItem('state'));
        initializeSubscriptions(initialState(storedState?.board), reducer);
        // Move this stuff to a web component so we can utilize templates
        document.body.innerHTML = `<sudoku-controls></sudoku-controls>
  <div id="app">
      <div id="board"><h2>Board</h2><sudoku-board class="main-board"/></div>
      <div><h2>Possibilities</h2><div id="viewer"></div></div>
      <div><h2>Connections</h2><div id="loops"></div></div>
    </div>`;
        const secondary = Array(9)
            .fill(null)
            .map((_, i) => new BoardLens((i + 1)));
        secondary.forEach((board) => board.classList.add('secondary-board'));
        document.querySelector('#viewer').append(...secondary);
        const tertiary = ['row', 'column', 'group'].map((type) => new BoardLoops(type));
        tertiary.forEach((board) => board.classList.add('secondary-board'));
        document.querySelector('#loops').append(...tertiary);
        // Add hot reloading in dev mode
        document.write('<script src="http://' +
            (location.host || 'localhost').split(':')[0] +
            ':35729/livereload.js?snipver=1"></' +
            'script>');
    })();

})();
//# sourceMappingURL=bundle.js.map
