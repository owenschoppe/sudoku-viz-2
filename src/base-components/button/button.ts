//@ts-ignore
import css from './button.css';

export type ButtonParams = {
  label: string;
  onClick: () => void;
};

export class Button extends HTMLElement {
  button: HTMLButtonElement;

  label: ButtonParams['label'];

  onClick: ButtonParams['onClick'];

  constructor({ label, onClick }: ButtonParams) {
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

  template = (label: string) => html`
    <button part="button" class="button">
      <slot name="before"></slot>
      ${label}
      <slot name="after"></slot>
    </button>
  `;
}

const html = String.raw;

customElements.define('o-button', Button);
