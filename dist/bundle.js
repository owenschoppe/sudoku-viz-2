
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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

    var css$3 = ":host {\n  /* --my-button-color-public: var(--my-button-color-public, blue); */\n  --board-size: var(--public-board-size, 240px);\n  --board-cell-gap: var(--public-board-gap, 2px);\n  --board-group-gap: var(--public-board-gap, 4px);\n}\n\n/* ::part(button) {\n  color: darkgreen;\n} */\n\n.grid {\n  display: grid;\n  grid-template-rows:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-columns:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-areas:\n    'c00 c01 c02 . c03 c04 c05 . c06 c07 c08'\n    'c10 c11 c12 . c13 c14 c15 . c16 c17 c18'\n    'c20 c21 c22 . c23 c24 c25 . c26 c27 c28'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c30 c31 c32 . c33 c34 c35 . c36 c37 c38'\n    'c40 c41 c42 . c43 c44 c45 . c46 c47 c48'\n    'c50 c51 c52 . c53 c54 c55 . c56 c57 c58'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c60 c61 c62 . c63 c64 c65 . c66 c67 c68'\n    'c70 c71 c72 . c73 c74 c75 . c76 c77 c78'\n    'c80 c81 c82 . c83 c84 c85 . c86 c87 c88';\n  height: var(--board-size);\n  width: var(--board-size);\n  row-gap: var(--board-cell-gap);\n  column-gap: var(--board-cell-gap);\n  line-height: 0;\n}\n";

    var html$7 = "<div id=\"board\" class=\"grid\"></div>\n";

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
        const value = board[i][j];
        const singlePossibility = Object.keys(basePossibilities).reduce((possibilities, current) => {
            possibilities[current] = Number(current) === value ? 1 : 0;
            return possibilities;
        }, {});
        const taken = allValuesExcludingCell(board, i, j);
        const possibilities = taken.reduce((current, value) => {
            current[value] = 0;
            return current;
        }, basePossibilities);
        return {
            possibilities: value && possibilities[value] ? singlePossibility : possibilities,
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
        isEditable;
        constructor({ i, j, css }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.i = i;
            this.j = j;
            this.css = css;
            // this.value = this.state.board[i][j];
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
            this.isEditable = state.original[this.i][this.j] === 0;
            if (value !== this.value) {
                this.state = state;
                this.value = value;
                const displayValue = isCellValue(this.value) ? String(this.value) : '';
                this.input.value = displayValue;
            }
            const { i, j } = state.location;
            if (this.i === i && this.j === j) {
                this.input.classList.add('current');
                this.input.setAttribute('tabindex', '0');
                this.input.focus();
            }
            else {
                this.input.classList.remove('current');
                this.input.setAttribute('tabindex', '-1');
            }
            if (!this.isEditable) {
                this.input.classList.add('locked');
            }
            else {
                this.input.classList.remove('locked');
            }
        }
        handleClick() {
            this.dispatch({
                type: 'move',
                data: { location: { i: this.i, j: this.j } },
            });
        }
        handleChange(event) {
            if (event.key === 'Tab') {
                return;
            }
            event.preventDefault();
            if (isValidInput(event.key, this.state.possibilities[this.i][this.j].possibilities) &&
                Number(event.key) !== this.value &&
                this.isEditable) {
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
            else if (event.key === 'Backspace' && this.isEditable) {
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
        template = () => html$6 `
    <!DOCTYPE html>
    <style>
      input {
        caret-color: transparent;
        color: var(--cell-text-color, black);
        cursor: pointer;
        border: none;
        background: var(--cell-background-color, white);
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        height: var(--cell-height, 100%);
        margin: 0;
        padding: 0;
        text-align: center;
        width: var(--cell-width, 100%);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        box-shadow: 0 0 0 1px var(--g-13);
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
      input.current {
        outline: none;
        box-shadow: 0 0 0 2px inset var(--public-board-cell-focus, var(--highlight-color));
      }
      input:focus {
        outline: none;
        box-shadow: 0 0 0 4px inset var(--public-board-cell-focus, var(--highlight-color));
      }
      input.locked {
        color: #666;
        background-color: #f3f3f3;
      }
            ${this.css}
    </style>
    <input
      value="${isCellValue(this.value) ? String(this.value) : ''}"
      type="number"
    />
  `;
    }
    const html$6 = String.raw;
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
            shadowRoot.innerHTML = html$7;
            const style = document.createElement('style');
            style.innerHTML = css$3;
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
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.dispatch({
                        type: 'arrow',
                        data: event,
                    });
                    break;
                default:
                    console.log(event);
                    break;
            }
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
            this.state = state;
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
        template = () => html$5 `
    <!DOCTYPE html>
    <style>
      button {
        color: var(--cell-text-color, black);
        cursor: pointer;
        border: none;
        /* background: var(--cell-background-color, #f3f3f3); */
        background: rgba(255, 255, 255, 0.1);
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        height: var(--cell-height, 100%);
        margin: 0;
        /* opacity: 0.1; */
        padding: 0;
        width: var(--cell-width, 100%);
      }
      button.selected {
        background: var(--cell-background-color, #f3f3f3);
        /* opacity: 1; */
      }
      button.only {
        background: white;
        border-radius: 25%;
        /* opacity: 1; */
      }
      button.possibility {
        background: var(--cell-background-possibility-color, #f3f3f3);
        border-radius: 50%;
        /* opacity: 0.5; */
      }
      button.current {
        box-shadow: 0 0 0 1px white;
      }
      button.current.only {
        border-radius: 0;
        box-shadow: 0 0 0 2px var(--cell-focus-color, white)
      }
      :host{
        display: block;
      }
      ${this.css}
    </style>
    <button part="button" tabindex="-1">${this.value ?? ``}</button>
  `;
    }
    const html$5 = String.raw;
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
            shadowRoot.innerHTML = html$7;
            const style = document.createElement('style');
            style.innerHTML = css$3;
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

    var css$2 = "#controls {\n  padding: var(--xl);\n  margin: 0;\n}\n\n.flex {\n  height: 32px;\n  padding: 8px 0;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  gap: 8px;\n  align-content: center;\n  justify-content: flex-start;\n}\n\n.secondary {\n  --o-button-background: transparent;\n  --o-button-color: var(--g-a-13);\n  --o-button-border: 0;\n  --o-button-shadow: 0 0 0 3px inset var(--g-a-13);\n}\n\n.primary {\n  --o-button-background: var(--g-a-13);\n  --o-button-color: var(--g-a-1);\n  --o-button-border: 0;\n  --o-button-shadow: 0 0 0 3px inset var(--highlight-color);\n}\n";

    var html$4 = "<div class=\"flex\" id=\"controls\"></div>\n";

    var difficultyLevel;
    (function (difficultyLevel) {
        difficultyLevel["HARD"] = "hard";
        difficultyLevel["MED"] = "med";
        difficultyLevel["EASY"] = "easy";
    })(difficultyLevel || (difficultyLevel = {}));
    /**
     * Evidently boards with more blank values are easier to solve than boards with fewer.
     * Perhaps this is due to the increasing number of possible solutions.
     */
    const difficultyLevelValues = {
        [difficultyLevel.HARD]: [38, 39, 40, 41, 42],
        [difficultyLevel.MED]: [33, 34, 35, 36, 37],
        [difficultyLevel.EASY]: [28, 29, 30, 31, 32],
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

    var css$1 = "/* Combobox Container */\n.tag-input {\n  grid-area: tags;\n  flex: 1 1 100%;\n  font-size: var(--font-xsmall, 12px);\n}\n\n/* Trigger */\n\n.button {\n  width: 100%;\n  cursor: pointer;\n  height: 32px;\n  line-height: 32px;\n  padding: 0 8px;\n  border-radius: 0;\n  border: none;\n  display: block;\n  background: white;\n  font-size: 14px;\n}\n\n.button:focus {\n  outline: none;\n  box-shadow: 0 0 0 4px inset hsl(196deg 76% 45% / 80%);\n}\n\n/* Dropdown */\n\n.dropdown {\n  position: relative;\n  display: none;\n}\n\n.is-open .dropdown {\n  display: block;\n  visibility: visible;\n  opacity: 1;\n}\n\n.listbox_vertical {\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  /* width: 100%; */\n  position: absolute;\n  /* border: 1px solid var(--color-border, #ddd); */\n  box-shadow: 0 2px 8px var(--color-shadow, rgba(0, 0, 0, 0.25));\n  /* border-radius: 4px; */\n  overflow: hidden;\n  overflow-y: auto;\n  max-height: 216px;\n  margin: var(--space-xxsmall, 4px) 0;\n  z-index: 999;\n  background: var(--color-background, white);\n}\n\n.hidden {\n  display: none;\n}\n\n.listbox__option[aria-selected='true'] {\n  background: var(--color-background--select-hover, #f2f2f2);\n}\n\n.listbox__option:focus {\n  outline: none;\n  box-shadow: 4px 0 0 0 inset hsl(196deg 76% 45% / 80%);\n}\n\n.dropdown .listbox__option {\n  padding: var(--space-xsmall, 8px);\n}\n\n/* Pills */\n\n.listbox.listbox_horizontal {\n  width: 100%;\n  padding: 0;\n  display: flex;\n  flex-wrap: wrap;\n  margin: var(--space-xxxsmall, 2px) calc(-1 * var(--space-xxxsmall, 2px));\n}\n\n.listbox-item {\n  cursor: pointer;\n  list-style: none;\n  /* margin: var(--space-xxxsmall, 2px); */\n}\n\n.visuallyhidden {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n/* .pill {\n  display: flex;\n  padding: var(--space-xxsmall, 4px);\n  border-radius: var(--border-radius, 4px);\n  border: 1px solid var(--color-border, #ddd);\n  background: var(--color-background, #fff);\n}\n\n.pill:hover {\n  background: var(--color-background--select-hover, #f2f2f2);\n}\n\n.pill:focus {\n  outline: 0;\n  box-shadow: 0 0 0 2px var(--color-primary--tint-alt, #bfe1de);\n}\n\n.pill__label {\n  flex: 1 1 auto;\n  margin-right: var(--space-xxsmall, 4px);\n}\n\n.pill__remove {\n  width: 12px;\n  height: 12px;\n  content: '';\n  right: 0;\n  margin-left: auto;\n  flex: 0 0 auto;\n  position: relative;\n  display: flex;\n  cursor: pointer;\n}\n\n.pill__remove:before {\n  height: 2px;\n  width: 12px;\n  content: '';\n  display: block;\n  background: var(--g8, #666);\n  transform: rotate(45deg);\n  position: absolute;\n  right: 0;\n  top: 50%;\n  border-radius: 1px;\n}\n\n.pill__remove:after {\n  height: 2px;\n  width: 12px;\n  content: '';\n  display: block;\n  background: var(--g8, #666);\n  transform: rotate(-45deg);\n  position: absolute;\n  right: 0;\n  top: 50%;\n  border-radius: 1px;\n}\n\n.pill:hover .pill__remove:before,\n.pill:focus .pill__remove:before {\n  background: var(--g9, #333);\n}\n\n.pill:hover .pill__remove:after,\n.pill:focus .pill__remove:after {\n  background: var(--g9, #333);\n} */\n";

    const ListMixin = (Base) => class List extends Base {
        items = [];
        constructor(...args) {
            super(...args);
        }
        nextIndex(index, dir, loop) {
            if (loop) {
                return (index + dir + this.items.length) % this.items.length;
            }
            else {
                return Math.max(Math.min(index + dir, this.items.length - 1), 0);
            }
        }
    };

    var DropdownListTypes;
    (function (DropdownListTypes) {
        DropdownListTypes[DropdownListTypes["menu"] = 0] = "menu";
        DropdownListTypes[DropdownListTypes["listbox"] = 1] = "listbox";
    })(DropdownListTypes || (DropdownListTypes = {}));

    class ListItem {
        option;
        element;
        type;
        onSelect;
        onHover;
        _id;
        constructor(option, onSelect, onHover, type) {
            this.onSelect = onSelect;
            this.onHover = onHover;
            this.option = option;
            this.type = type;
            this.element = document.createElement('li');
            this.element.classList.add('listbox-item', 'listbox__option');
            this.element.setAttribute('role', this.role());
            this.element.innerHTML = this.template();
            this.element.querySelector('.listbox__option-text').textContent =
                this.option.label;
            this.element.addEventListener('mousedown', this.handleClick.bind(this), true);
            this.element.addEventListener('mouseover', this.handleHover.bind(this), true);
        }
        handleClick(e) {
            this.onSelect(e, this);
        }
        handleHover(e) {
            this.onHover(e, this);
        }
        get id() {
            return this._id;
        }
        set id(_id) {
            this._id = _id;
            this.element.setAttribute('id', _id);
        }
        role() {
            switch (this.type) {
                case DropdownListTypes.menu:
                    return 'menuitem';
                case DropdownListTypes.listbox:
                default:
                    return 'option';
            }
        }
        template = () => html$3 ` <span
    class="listbox__option-text listbox__option-text_entity"
  ></span>`;
    }
    const html$3 = String.raw;

    class DropdownListbox extends ListMixin(Array) {
        dropdown;
        currentItem;
        _options;
        onChange;
        onNavigate;
        type;
        constructor(options, onChange, onNavigate, type) {
            super();
            this.onChange = onChange;
            this.onNavigate = onNavigate;
            this.type = type;
            this.dropdown = document.createElement('ul');
            this.dropdown.setAttribute('role', 'presentation');
            this.dropdown.classList.add('listbox', 'listbox_vertical');
            this.updateOptions(options);
            this.updateCurrent();
        }
        get options() {
            return this._options;
        }
        set options(options) {
            this.updateOptions(options);
        }
        selectItem(e, listItem) {
            e.preventDefault();
            if (listItem && this.onChange) {
                this.onChange(listItem.option);
            }
        }
        nextItem(e, dir) {
            e.preventDefault();
            var index = this.items.indexOf(this.currentItem);
            var next = this.nextIndex(index, dir, true);
            this.updateCurrent(next);
        }
        hoverItem(e, listItem) {
            e.preventDefault();
            this.currentItem = listItem;
            var index = this.items.indexOf(this.currentItem);
            this.updateCurrent(index);
        }
        render() {
            return this.dropdown;
        }
        updateOptions(options) {
            this._options = options;
            this.items = [];
            this.options.forEach(this.addItem.bind(this));
        }
        updateCurrent(index) {
            if (index === -1) {
                return;
            }
            index = index || 0;
            this.items.forEach((item, i) => {
                if (i == index) {
                    // Todo: abstract this into a setter on the item class.
                    item.element.setAttribute('aria-selected', 'true');
                    item.element.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                    });
                    item.element.setAttribute('tabindex', '0');
                    item.element.focus();
                    this.currentItem = item;
                    this.onNavigate?.(item.id, item.option);
                }
                else {
                    item.element.setAttribute('aria-selected', 'false');
                    item.element.setAttribute('tabindex', '-1');
                }
            });
        }
        addItem(option, i) {
            var item = new ListItem(option, this.selectItem.bind(this), this.hoverItem.bind(this), this.type);
            item.id = `option-${i}`;
            this.items.push(item);
            this.dropdown.appendChild(item.element);
        }
    }

    var MenuTypes;
    (function (MenuTypes) {
        MenuTypes[MenuTypes["menu"] = 0] = "menu";
        MenuTypes[MenuTypes["checkboxmenu"] = 1] = "checkboxmenu";
        MenuTypes[MenuTypes["radiomenu"] = 2] = "radiomenu";
    })(MenuTypes || (MenuTypes = {}));

    const debounce = (fn, ms) => {
        let timeout = null;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), ms);
        };
    };
    const debouncedSearch = (options, callback) => {
        let query = '';
        const debouncedQueryReset = debounce(() => {
            query = '';
        }, 500);
        return (e) => {
            query += e.key;
            debouncedQueryReset();
            callback(options.reduceRight((found, current, i) => {
                if (current.toLowerCase().startsWith(`${query}`.toLowerCase())) {
                    found = i;
                }
                return found;
            }, -1));
        };
    };

    //@ts-ignore
    class Menu extends HTMLElement {
        button;
        trigger;
        dropdown;
        label;
        _options;
        onChange;
        type;
        constructor({ label, options, onChange, type = MenuTypes.menu }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.label = label;
            this._options = options;
            this.onChange = onChange;
            this.type = type;
        }
        connectedCallback() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = this.template(this.label);
            const style = document.createElement('style');
            style.innerHTML = css$1;
            shadowRoot.prepend(style);
            this.button = shadowRoot.querySelector('#button');
            this.trigger = shadowRoot.querySelector('.dropdown-trigger');
            this.dropdown = new DropdownListbox(this.options, this.handleChange.bind(this), this.handleNavigate, DropdownListTypes.menu);
            shadowRoot.querySelector('[role=menu]').append(this.dropdown.render());
            this.searchOptions = debouncedSearch(this.dropdown.options.map((option) => option.label), (index) => {
                this.dropdown.updateCurrent(index);
                this.showDropdown();
            });
            this.trigger.addEventListener('keydown', this.handlePress.bind(this), true);
            this.trigger.addEventListener('input', this.searchOptions.bind(this), true);
            this.button.addEventListener('click', this.toggleDropdown.bind(this), true);
            document.body.addEventListener('focus', this.handleBlur.bind(this), true);
        }
        disconnectedCallback() {
            this.trigger.removeEventListener('keydown', this.handlePress.bind(this), true);
            this.trigger.removeEventListener('input', this.searchOptions.bind(this));
            this.button.removeEventListener('click', this.toggleDropdown.bind(this));
            document.body.removeEventListener('focus', this.handleBlur.bind(this));
        }
        get options() {
            return this._options;
        }
        set options(options) {
            this._options = options;
            this.dropdown.updateOptions(options);
        }
        showDropdown() {
            this.trigger.classList.add('is-open');
            this.button.setAttribute('aria-expanded', 'true');
            this.button.setAttribute('aria-activedescendant', this.dropdown.currentItem.id);
        }
        hideDropdown() {
            this.trigger.classList.remove('is-open');
            this.button.setAttribute('aria-expanded', 'false');
            this.button.removeAttribute('aria-activedescendant');
        }
        toggleDropdown() {
            if (this.trigger.classList.contains('is-open')) {
                this.hideDropdown();
            }
            else {
                this.showDropdown();
            }
        }
        private;
        handleChange(option) {
            this.onChange(option);
        }
        handleNavigate(_id, _option) { }
        handleBlur(_e) {
            console.log('handleBlur', _e);
            if (!this.trigger.contains(document.activeElement)) {
                this.hideDropdown();
            }
        }
        handleFocus(_e) {
            this.showDropdown();
        }
        handlePress(e) {
            const { key } = e;
            switch (key) {
                case 'Enter':
                    e.stopPropagation();
                    e.preventDefault();
                    if (this.trigger.classList.contains('is-open')) {
                        // Hide the dropdown and submit if open
                        this.hideDropdown();
                        this.onChange(this.dropdown.currentItem.option);
                    }
                    else {
                        // Show the dropdown if closed
                        this.showDropdown();
                    }
                    break;
                case 'ArrowUp':
                    // Arrow through the list box
                    // Show the dropdown and move
                    e.stopPropagation();
                    e.preventDefault();
                    this.showDropdown();
                    this.dropdown.nextItem(e, -1);
                    break;
                case 'ArrowDown':
                    // Arrow through the list box
                    // Show the dropdown and move
                    e.stopPropagation();
                    e.preventDefault();
                    this.showDropdown();
                    this.dropdown.nextItem(e, 1);
                    break;
                case 'Escape':
                    if (this.button.getAttribute('aria-expanded') == 'true') {
                        e.stopPropagation();
                        e.preventDefault();
                        this.hideDropdown();
                    }
                    break;
                default:
                    this.searchOptions(e);
                    break;
            }
        }
        searchOptions;
        template = (label) => html$2 `
    <div class="dropdown-trigger dropdown-trigger_click">
      <button id="button" class="button" aria-haspopup="true" title="${label}">
        <span>${label}</span>
      </button>
      <div
        id="listbox"
        class="dropdown dropdown_length-with-icon-7 dropdown_fluid"
        role="menu"
      >
        <!-- ListBox -->
      </div>
    </div>
  `;
    }
    const html$2 = String.raw;
    customElements.define('o-menu', Menu);

    var css = ":host {\n  --c: black;\n  --bg: white;\n  --b: 0;\n  --b-radius: 0;\n  --gap: 0.25rem;\n  --lh: var(--xxl);\n  --p: 0 0.5rem;\n  --shadow: 0 0 0 3px inset black;\n}\n\n.button {\n  background: var(--o-button-background, var(--bg));\n  border: var(--o-button-border, var(--b));\n  border-radius: var(--o-button-border-radius, var(--b-radius));\n  color: var(--o-button-color, var(--c));\n  line-height: var(--o-button-height, var(--lh));\n  padding: var(--o-button-padding, var(--p));\n  display: flex;\n  gap: var(--o-button-gap, var(--gap));\n}\n\n.button:hover {\n  background: var(\n    --o-button-background-hover,\n    var(--o-button-background, var(--bg))\n  );\n  border: var(--o-button-border-hover, var(--o-button-border, var(--b)));\n  box-shadow: var(\n    --o-button-shadow-hover,\n    var(--o-button-shadow, var(--shadow))\n  );\n  color: var(--o-button-color-hover, var(--o-button-color, var(--c)));\n  outline: none;\n}\n\n.button:focus {\n  border: var(--o-button-background-focus, var(--o-button-border, var(--b)));\n  background: var(\n    --o-button-border-focus,\n    var(--o-button-background, var(--bg))\n  );\n  box-shadow: var(\n    --o-button-shadow-focus,\n    var(--o-button-shadow, var(--shadow))\n  );\n  color: var(--o-button-color-focus, var(--o-button-color, var(--c)));\n  outline: none;\n}\n\n.button:active {\n  background: var(\n    --o-button-background-active,\n    var(--o-button-background, var(--bg))\n  );\n  border: var(--o-button-border-active, var(--o-button-border, var(--b)));\n  color: var(--o-button-color-active, var(--o-button-color, var(--c)));\n}\n";

    //@ts-ignore
    class Button extends HTMLElement {
        button;
        label;
        onClick;
        constructor({ label, onClick }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.label = label;
            this.onClick = onClick;
        }
        connectedCallback() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = this.template(this.label);
            const style = document.createElement('style');
            style.innerHTML = css;
            shadowRoot.prepend(style);
            this.button = shadowRoot.querySelector('button');
            this.button.addEventListener('click', this.onClick.bind(this));
        }
        disconnectedCallback() {
            this.button.removeEventListener('click', this.onClick.bind(this));
        }
        template = (label) => html$1 `
    <button part="button" class="button">
      <slot name="before"></slot>
      ${label}
      <slot name="after"></slot>
    </button>
  `;
    }
    const html$1 = String.raw;
    customElements.define('o-button', Button);

    //@ts-ignore
    class Controls extends ReactiveMixin(HTMLElement) {
        newButton;
        menu;
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
            style.innerHTML = css$2;
            shadowRoot.prepend(style);
            this.menu = new Menu({
                label: 'New',
                options: [
                    { label: 'Hard', value: difficultyLevel.HARD },
                    { label: 'Medium', value: difficultyLevel.MED },
                    { label: 'MedEasy', value: difficultyLevel.EASY },
                    { label: 'Blank', value: 'blank' },
                ],
                onChange: ({ value }) => {
                    this.dispatch({ type: 'new', data: { difficulty: value } });
                },
                type: MenuTypes.menu,
            });
            this.shadowRoot.querySelector('#controls').append(this.menu);
            const undo = new Button({
                label: 'Undo',
                onClick: () => {
                    console.log('undo');
                    this.dispatch({ type: 'undo', data: {} });
                },
            });
            undo.classList.add('secondary');
            this.shadowRoot.querySelector('#controls').append(undo);
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
        const { possibilities: possibleValues, value, possibilityCount, } = possibilities[cell.i][cell.j];
        const values = Object.keys(possibleValues);
        const unmatchedValues = values.filter((value) => possibleValues[value] && !valueSteps[possibleValues[value]]);
        const unmatchedValue = unmatchedValues.slice(-1)[0]; // why does this only work when selecting the last element?
        return unmatchedValue && !value && possibilityCount > 1 // end cycle for cells that contain a value
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
        // const { possibilityCount } = possibilities[unmatchedCell.i][unmatchedCell.j];
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
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: var(--cell-text-color, black);
        cursor: pointer;
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        height: var(--cell-height, 100%);
        margin: 0;
        padding: 0;
        width: var(--cell-width, 100%);
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
    <button part="button" tabindex="-1">${this.value ?? ``}</button>
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
            shadowRoot.innerHTML = html$7;
            const style = document.createElement('style');
            style.innerHTML = css$3;
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
     *  mutates state
     */
    const updateBoardState = (state, i, j, value) => {
        state.board[i][j] = value;
        state.possibilities = possibilitiesForBoard(state.board);
        state.loops = {
            row: getLoopsForBoardByType(state.possibilities, 'row'),
            column: getLoopsForBoardByType(state.possibilities, 'column'),
            group: getLoopsForBoardByType(state.possibilities, 'group'),
        };
        return state;
    };
    /**
     * Reducer function to manage sudoku calculations
     * @param state
     * @param action
     * @returns
     */
    const reducer = (state, action) => {
        let updatedState;
        switch (action.type) {
            case 'update':
                const { i, j, value } = action.data;
                state.moves = state.moves || [];
                state.moves.push({
                    i,
                    j,
                    priorValue: state.board[i][j],
                });
                updatedState = updateBoardState(state, i, j, value);
                break;
            case 'undo':
                const { i: pI, j: pJ, priorValue: pV } = state.moves.pop();
                updatedState = updatedState = updateBoardState(state, pI, pJ, pV);
                break;
            case 'new':
                const { difficulty } = action.data;
                const board = difficulty === 'blank' ? null : generateBoard(difficulty);
                updatedState = initialState(board);
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
        if (updatedState.board.flat().every((value) => value > 0)) {
            document.querySelector('#solved').classList.remove('hidden');
        }
        else {
            document.querySelector('#solved').classList.add('hidden');
        }
        return updatedState;
    };
    const initialBoard = NNArray(9, 0);
    const initialState = (savedBoard) => {
        const board = savedBoard || cloneDeep(initialBoard);
        const possibilities = possibilitiesForBoard(board);
        return {
            board: board,
            original: cloneDeep(board),
            possibilities,
            loops: {
                row: getLoopsForBoardByType(possibilities, 'row'),
                column: getLoopsForBoardByType(possibilities, 'column'),
                group: getLoopsForBoardByType(possibilities, 'group'),
            },
            location: { i: 0, j: 0 },
            moves: [],
        };
    };
    (() => {
        const storedState = JSON.parse(window.localStorage.getItem('state'));
        initializeSubscriptions(storedState, reducer);
        // Move this stuff to a web component so we can utilize templates
        document.body.innerHTML = `
    <div id="app" class="dark">
      <sudoku-controls></sudoku-controls>
      <div id="viz">
        <div id="board">
          <h2>Board</h2>
          <sudoku-board class="main-board" />
        </div>
        <div>
          <h2>Possibilities</h2>
          <div id="viewer"></div>
        </div>
        <div>
          <h2>Connections</h2>
          <div id="loops"></div>
        </div>
      </div>
      <div id="solved" class="overflow-container hidden">
        <div class="shimmer"></div>
        <div class="flex center"><div class="shimmer-text">SOLVED!</div></div>
      </div>
    </div>
  `;
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
