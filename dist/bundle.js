(function () {
    'use strict';

    const component = (name = 'world') => {
        const div = document.createElement('div');
        div.textContent = `hello ${name}`;
        return div;
    };

    var css$1 = ":host {\n  --my-button-color: var(--my-button-color-public, purple);\n}\n\n::part(my-button),\nbutton {\n  font-weight: bold;\n  color: var(--my-button-color, tomato);\n}\n";

    var html$3 = "<div>hello <span id=\"name\"></span></div>\n<button part=\"my-button\"></button>\n";

    //@ts-ignore
    class MyComponent extends HTMLElement {
        _label = 'yo';
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            this.render();
        }
        disconnectedCallback() {
            this.shadowRoot
                .querySelector('button')
                .removeEventListener('click', this.handleClick);
        }
        render() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = html$3;
            const style = document.createElement('style');
            style.innerHTML = css$1;
            shadowRoot.prepend(style);
            shadowRoot.querySelector('#name').textContent = this.getAttribute('name');
            const button = shadowRoot.querySelector('button');
            button.addEventListener('click', this.handleClick);
            button.textContent = this._label;
        }
        set label(l) {
            this._label = l;
            this.render();
        }
        handleClick(event) {
            console.log('click', event);
        }
    }
    customElements.define('my-component', MyComponent);
    // todo:
    // test passing a data object and callback function to custom component

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
    class Cell extends HTMLElement {
        i;
        j;
        value;
        css;
        state;
        dispatch;
        button;
        constructor({ i, j, css, dispatch, state, }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.i = i;
            this.j = j;
            this.value = state.board[i][j];
            this.css = css;
            this.state = state;
            this.dispatch = dispatch;
        }
        connectedCallback() {
            this.init();
            this.render(this.state);
        }
        disconnectedCallback() {
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
        // Render method
        // Can diff current state against stored state to decide whether to render.
        render(state) {
            this.state = state;
            this.value = state.board[this.i][this.j];
            this.button.textContent = String(this.value || '');
            if (this.state.color)
                this.button.setAttribute('style', `background-color: ${this.state.color}`);
        }
        handleClick(_event) {
            // console.log('click', this.i, this.j, this.value, event);
            this.value = this.dispatch({
                type: 'update',
                data: {
                    i: this.i,
                    j: this.j,
                    value: this.value ? this.value + 1 : 1,
                    color: this.getColor(),
                },
            }).board[this.i][this.j];
        }
        getColor() {
            const step = 255 / 9;
            return `rgb(${step * this.i},${step * this.j},${step * this.value})`;
        }
        template = () => html$2 `
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
    const html$2 = String.raw;
    customElements.define('board-cell', Cell);

    var css = ":host {\n  /* --my-button-color-public: var(--my-button-color-public, blue); */\n  --board-size: var(--public-board-size, 240px);\n  --board-cell-gap: var(--public-board-gap, 2px);\n  --board-group-gap: var(--public-board-gap, 4px);\n}\n\n::part(button) {\n  color: darkgreen;\n}\n\n.grid {\n  display: grid;\n  grid-template-rows:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-columns:\n    1fr 1fr 1fr var(--board-group-gap) 1fr 1fr 1fr var(--board-group-gap)\n    1fr 1fr 1fr;\n  grid-template-areas:\n    'c00 c01 c02 . c03 c04 c05 . c06 c07 c08'\n    'c10 c11 c12 . c13 c14 c15 . c16 c17 c18'\n    'c20 c21 c22 . c23 c24 c25 . c26 c27 c28'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c30 c31 c32 . c33 c34 c35 . c36 c37 c38'\n    'c40 c41 c42 . c43 c44 c45 . c46 c47 c48'\n    'c50 c51 c52 . c53 c54 c55 . c56 c57 c58'\n    '... ... ... . ... ... ... . ... ... ...'\n    'c60 c61 c62 . c63 c64 c65 . c66 c67 c68'\n    'c70 c71 c72 . c73 c74 c75 . c76 c77 c78'\n    'c80 c81 c82 . c83 c84 c85 . c86 c87 c88';\n  height: var(--board-size);\n  width: var(--board-size);\n  row-gap: var(--board-cell-gap);\n  column-gap: var(--board-cell-gap);\n}\n";

    var html$1 = "<my-component name=\"owen\"></my-component> <my-button></my-button>\n<div class=\"grid\"></div>\n";

    // import { CellGridItem } from '../cell-mixin-test';
    class MyContainer extends HTMLElement {
        dispatch;
        state;
        cells = [];
        constructor({ dispatch, state }) {
            super();
            this.attachShadow({ mode: 'open' });
            this.dispatch = dispatch;
            this.state = state;
        }
        connectedCallback() {
            this.init();
            this.render();
        }
        disconnectedCallback() {
            this.shadowRoot
                .querySelector('button')
                .removeEventListener('click', this.handleClick);
        }
        init() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = html$1;
            const style = document.createElement('style');
            style.innerHTML = css;
            shadowRoot.prepend(style);
            this.cells = this.state.board
                .map((row, i) => row.map((value, j) => new Cell({
                i,
                j,
                value,
                css: `:host { grid-area: c${i}${j}; }`,
                dispatch: this.dispatch,
                state: this.state,
            })))
                .flat();
            shadowRoot.querySelector('.grid').append(...this.cells);
            // shadowRoot.append(
            //   ...[0].map(
            //     () =>
            //       new CellGridItem({
            //         i: 0,
            //         j: 0,
            //         value: 0,
            //         css: `:host { grid-area: c; }`,
            //       }),
            //   ),
            // );
        }
        render() {
            const { shadowRoot } = this;
            console.log(this.state.board);
            const mycmp = shadowRoot.querySelector('my-component');
            mycmp.label = 'hi';
            const mybutton = shadowRoot.querySelector('my-button');
            mybutton.label = 'there';
            this.cells.forEach((cell) => cell.render(this.state)); // ?
        }
        handleClick(event) {
            console.log('click', event);
        }
    }
    customElements.define('my-container', MyContainer);

    class MyButton extends HTMLElement {
        _label = 'yo';
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            this.render();
        }
        disconnectedCallback() {
            this.shadowRoot
                .querySelector('button')
                .removeEventListener('click', this.handleClick);
        }
        render() {
            const { shadowRoot } = this;
            shadowRoot.innerHTML = this.template();
            const button = shadowRoot.querySelector('button');
            button.addEventListener('click', this.handleClick);
        }
        set label(l) {
            this._label = l;
            this.render();
        }
        handleClick(event) {
            console.log('click', event);
        }
        template = () => html `
    <!DOCTYPE html>
    <style>
      button {
        font-weight: bold;
        color: var(--my-button-color, tomato);
      }
    </style>
    <div>
      <button part="button">${this._label}</button>
    </div>
  `;
    }
    const html = String.raw;
    customElements.define('my-button', MyButton);
    // todo:
    // test passing a data object and callback function to custom component

    const children = [];
    (() => {
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
        const dispatch = (action) => {
            state = reducer(state, action);
            children.forEach((child) => child.render(state));
            return state;
        };
        let state = {
            board: Array(9)
                .fill(null)
                .map(() => Array(9).fill(null)),
        };
        // const data = Array(9).fill(Array(9).fill(null));
        document.querySelector('body').appendChild(component('cora'));
        // const el = document.createElement('my-container') as MyContainer;
        const el = new MyContainer({ dispatch, state });
        children.push(el);
        document.querySelector('body').appendChild(el);
        const le = new MyButton();
        document.querySelector('body').appendChild(le);
        // Add hot reloading in dev mo
        document.write('<script src="http://' +
            (location.host || 'localhost').split(':')[0] +
            ':35729/livereload.js?snipver=1"></' +
            'script>');
    })();

})();
//# sourceMappingURL=bundle.js.map
