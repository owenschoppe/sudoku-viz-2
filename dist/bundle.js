(function () {
    'use strict';

    const subscribers = new Set();
    /**
     * Subscriber function for the module singleton.
     * TODO: add dependency array param and update state to use `new Proxy` and only call render when dependency changes.
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

    var css = ":host {\n  /* --my-button-color-public: var(--my-button-color-public, blue); */\n  --board-size: var(--public-board-size, 240px);\n  --board-cell-gap: var(--public-board-gap, 2px);\n  --board-group-gap: var(--public-board-gap, 4px);\n}\n\n/* ::part(button) {\n  color: darkgreen;\n} */\n\n.grid {\n  display: grid;\n  grid-template-rows:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-columns:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-areas:\n    'c00 c01 c02 . c03 c04 c05 . c06 c07 c08'\n    'c10 c11 c12 . c13 c14 c15 . c16 c17 c18'\n    'c20 c21 c22 . c23 c24 c25 . c26 c27 c28'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c30 c31 c32 . c33 c34 c35 . c36 c37 c38'\n    'c40 c41 c42 . c43 c44 c45 . c46 c47 c48'\n    'c50 c51 c52 . c53 c54 c55 . c56 c57 c58'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c60 c61 c62 . c63 c64 c65 . c66 c67 c68'\n    'c70 c71 c72 . c73 c74 c75 . c76 c77 c78'\n    'c80 c81 c82 . c83 c84 c85 . c86 c87 c88';\n  height: var(--board-size);\n  width: var(--board-size);\n  row-gap: var(--board-cell-gap);\n  column-gap: var(--board-cell-gap);\n  line-height: 0;\n}\n";

    var html$2 = "<div id=\"board\" class=\"grid\"></div>\n";

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
        button;
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
            const value = state.board[this.i][this.j];
            if (value !== this.value) {
                this.state = state;
                this.value = value;
                this.button.textContent = String(this.value || '');
            }
        }
        handleClick(_event) {
            // console.log('click', this.i, this.j, this.value, event);
            this.value = this.dispatch({
                type: 'update',
                data: {
                    i: this.i,
                    j: this.j,
                    value: this.value ? (this.value % 9) + 1 : 1,
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
        background: var(--cell-background-color, #f3f3f3);
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
      }
      ${this.css}
    </style>
    <button part="button">${this.value ?? ``}</button>
  `;
    }
    const html$1 = String.raw;
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
            shadowRoot.innerHTML = html$2;
            const style = document.createElement('style');
            style.innerHTML = css;
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
        }
        render(state) {
            console.log('render board', state.board);
            // Slightly expensive since it updates style for every cell.
            if (state.color) {
                this.board.setAttribute('style', `--cell-text-color: ${state.color}; background-color: ${state.color};`);
            }
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
        value = null;
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
            const value = state.board[this.i][this.j];
            const displayValue = value === this.lens ? value : null;
            if (displayValue !== this.value) {
                this.state = state;
                this.value = displayValue;
                this.button.textContent = String(this.value || '');
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
        template = () => html `
    <!DOCTYPE html>
    <style>
      button {
        font-weight: var(--cell-font-weight, bold);
        font-size: var(--cell-text-size, 10px);
        color: var(--cell-text-color, black);
        border: none;
        background: var(--cell-background-color, #f3f3f3);
        width: var(--cell-width, 100%);
        height: var(--cell-height, 100%);
        padding: 0;
        margin: 0;
      }
      ${this.css}
    </style>
    <button part="button">${this.value ?? ``}</button>
  `;
    }
    const html = String.raw;
    customElements.define('board-cell-lens', BoardCellLens);

    class BoardLens extends Board {
        lens = null;
        constructor(lens) {
            super();
            this.lens = lens;
        }
        init() {
            const { shadowRoot } = this;
            super.init();
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
        }
    }
    customElements.define('sudoku-board-lens', BoardLens);

    const NNArray = (n, fill) => Array(n)
        .fill(null)
        .map(() => Array(n).fill(fill));
    const reducer = (state, action) => {
        switch (action.type) {
            case 'update':
                const { i, j, value, color } = action.data;
                state.board[i][j] = value;
                state.color = color;
                console.log(i, j, value, state);
                return state;
            default:
                return state;
        }
    };
    let initialState = {
        board: NNArray(9, null),
    };
    (() => {
        initializeSubscriptions(initialState, reducer);
        // Move this stuff to a web component so we can utilize templates
        document.body.innerHTML = `<div id="app">
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
