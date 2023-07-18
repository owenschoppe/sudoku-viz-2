export default class MyButton extends HTMLElement {
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

  set label(l: string) {
    this._label = l;
    this.render();
  }

  handleClick(event) {
    console.log('click', event);
  }

  template = () => html`
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
