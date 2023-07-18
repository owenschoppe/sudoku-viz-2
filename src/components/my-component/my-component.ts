//@ts-ignore
import css from './my-component.css';
//@ts-ignore
import html from './my-component.html';

export default class MyComponent extends HTMLElement {
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

    shadowRoot.innerHTML = html;

    const style = document.createElement('style');
    style.innerHTML = css;
    shadowRoot.prepend(style);

    shadowRoot.querySelector('#name').textContent = this.getAttribute('name');

    const button = shadowRoot.querySelector('button');
    button.addEventListener('click', this.handleClick);
    button.textContent = this._label;
  }

  set label(l: string) {
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
