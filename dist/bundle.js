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
            console.log(getState(), action);
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

    var html$3 = "<div id=\"board\" class=\"grid\"></div>\n";

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
            console.log('subscribe', this.render);
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
        .map(() => Array(n).fill(fill));
    /**
     * Convert index to coordinates
     * @param index 0-80 indexed number of a cell in 9x9 grid
     * @returns 0 indexed row, col coordinates
     */
    const indexToCoord = (index) => {
        const i = Math.floor(index / 9);
        const j = index % 9;
        return { i, j };
    };
    const possibilitiesObjectToArray = (possibilities) => Object.entries(possibilities).reduce((acc, [value, possible]) => {
        if (possible) {
            acc.push(Number(value));
        }
        return acc;
    }, []);
    const cloneDeep = (arr) => arr.map((row) => [...row]);
    const shuffle = (arr) => arr.reduce((acc, cur) => {
        const index = randomInt(acc.length);
        acc.splice(index, 0, cur);
        return acc;
    }, []);

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
        }
        render(state) {
            const value = state.board[this.i][this.j];
            if (this.i == 4 && this.j == 4) {
                console.log(this.value, isCellValue(this.value), isCellValue(this.value) ? String(this.value) : '');
            }
            if (value !== this.value) {
                this.state = state;
                this.value = value;
                const displayValue = isCellValue(this.value) ? String(this.value) : '';
                this.input.value = displayValue;
            }
        }
        handleChange(event) {
            console.log(event);
            event.preventDefault();
            if (isValidInput(event.key, this.state.possibilities[this.i][this.j].possibilities) &&
                Number(event.key) !== this.value) {
                this.value = this.dispatch({
                    type: 'update',
                    data: {
                        i: this.i,
                        j: this.j,
                        value: Number(event.key),
                        color: this.getColor(),
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
                        color: this.getColor(),
                    },
                }).board[this.i][this.j];
            }
        }
        getColor() {
            const step = 255 / 9;
            return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
        }
        // Todo
        template = () => html$2 `
    <!DOCTYPE html>
    <style>
      input {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        background: var(--cell-background-color, #f3f3f3);
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
        text-align: center;
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
            ${this.css}
    </style>
    <input
      value="${isCellValue(this.value) ? String(this.value) : ''}"
      type="number"
    />
  `;
    }
    const html$2 = String.raw;
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
            shadowRoot.innerHTML = html$3;
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
    class BoardCellLens extends ReactiveMixin(HTMLElement) {
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
            // console.log('click', this.i, this.j, this.value, event);
            this.value = this.dispatch({
                type: 'update',
                data: {
                    i: this.i,
                    j: this.j,
                    value: this.lens,
                    color: this.getColor(),
                },
            }).board[this.i][this.j];
        }
        getColor() {
            const step = 255 / 9;
            return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
        }
        // Todo
        template = () => html$1 `
    <!DOCTYPE html>
    <style>
      button {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        /* background: var(--cell-background-color, #f3f3f3); */
        background: white;
        opacity: 0.1;
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
      }
      button.selected {
        background: var(--cell-background-color, #f3f3f3);
        opacity: 1;
      }
      button.only {
        background: white;
        opacity: 1;
      }
      button.possibility {
        background: var(--cell-background-color, #f3f3f3);
        opacity: 0.5;
      }
      :host{
        display: block;
      }
      ${this.css}
    </style>
    <button part="button">${this.value ?? ``}</button>
  `;
    }
    const html$1 = String.raw;
    customElements.define('board-cell-lens', BoardCellLens);

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
            shadowRoot.innerHTML = html$3;
            const style = document.createElement('style');
            style.innerHTML = css$1;
            shadowRoot.prepend(style);
            this.cells = this.state.board
                .map((row, i) => row.map((_value, j) => new BoardCellLens({
                i,
                j,
                css: `:host { grid-area: c${i}${j}; }`,
                lens: this.lens,
            })))
                .flat();
            this.board = shadowRoot.querySelector('#board');
            this.board.append(...this.cells);
            this.board.setAttribute('style', `--cell-text-color: black; --cell-background-color: hsl(${hue[this.lens]} ${saturation}% ${brightness}%);`);
        }
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
    customElements.define('sudoku-board-lens', BoardLens);

    var css = ".flex {\n  height: 32px;\n  padding: 8px 0;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  gap: 8px;\n  align-content: center;\n}\n\n.primary {\n  border: 0;\n  background: white;\n  color: black;\n}\n\n.primary:hover,\n.primary:focus {\n  border: 0;\n  background: white;\n  outline: none;\n  box-shadow: 0 0 0 2px violet;\n  color: black;\n}\n\n.primary:active {\n  border: 0;\n  background: lavenderblush;\n  color: black;\n}\n";

    var html = "<div class=\"flex\">\n  <button id=\"new\" class=\"primary\">New</button>\n</div>\n";

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
            shadowRoot.innerHTML = html;
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
                console.log(i, j, value, state);
                updatedState = state;
                break;
            case 'new':
                const newBoard = generateBoard(action.data.difficulty);
                state.board = newBoard;
                state.possibilities = possibilitiesForBoard(newBoard);
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
        return {
            board: board,
            possibilities: possibilitiesForBoard(board),
        };
    };
    (() => {
        const storedState = JSON.parse(window.localStorage.getItem('state'));
        initializeSubscriptions(initialState(storedState?.board), reducer);
        // Move this stuff to a web component so we can utilize templates
        document.body.innerHTML = `<sudoku-controls></sudoku-controls>
  <div id="app">
      <div id="board"><sudoku-board class="main-board"/></div>
      <div id="viewer"></div>
    </div>`;
        const secondary = Array(9)
            .fill(null)
            .map((_, i) => new BoardLens((i + 1)));
        secondary.forEach((board) => board.classList.add('secondary-board'));
        document.querySelector('#viewer').append(...secondary);
        // Add hot reloading in dev mode
        document.write('<script src="http://' +
            (location.host || 'localhost').split(':')[0] +
            ':35729/livereload.js?snipver=1"></' +
            'script>');
    })();

})();
//# sourceMappingURL=bundle.js.map
