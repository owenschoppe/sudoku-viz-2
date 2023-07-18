import Cell from '../cell';
import MyButton from '../my-button';
import MyComponent from '../my-component/my-component';
//@ts-ignore
import css from './my-container.css';
//@ts-ignore
import html from './my-container.html';

import { Dispatch, State } from '../../types';
// import { CellGridItem } from '../cell-mixin-test';

export default class MyContainer extends HTMLElement {
  dispatch: Dispatch;
  state: State;
  cells: Cell[] = [];

  constructor({ dispatch, state }: { dispatch: Dispatch; state: State }) {
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

    shadowRoot.innerHTML = html;

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    this.cells = this.state.board
      .map((row, i) =>
        row.map(
          (value, j) =>
            new Cell({
              i,
              j,
              value,
              css: `:host { grid-area: c${i}${j}; }`,
              dispatch: this.dispatch,
              state: this.state,
            }),
        ),
      )
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

    const mycmp = shadowRoot.querySelector('my-component') as MyComponent;
    mycmp.label = 'hi';

    const mybutton = shadowRoot.querySelector('my-button') as MyButton;
    mybutton.label = 'there';

    this.cells.forEach((cell) => cell.render(this.state)); // ?
  }

  handleClick(event) {
    console.log('click', event);
  }
}

customElements.define('my-container', MyContainer);
