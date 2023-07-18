// #1
// Object.assign(Cell.prototype, { mixin: 'foo' });

// const Mixin = (base) =>
//   class Mix extends base {
//     mix() {
//       console.log('mixin');
//     }
//   };

// Wrong way to employ mixin- results in a class Mix that extends Cell that extends HTMLElement
// export const CellMixin = Mixin(Cell);

// #2

// type Constructor = new (...args: any[]) => {};

type HTMLType = { new (...args: any[]): HTMLElement; prototype: HTMLElement };

export const CSSMixin = (Base: HTMLType) =>
  class CSS extends Base {
    css: string;

    constructor({ css }: { css: string }) {
      super();
      this.css = css;
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.prepend(htmlToElement(this.template()));
    }
    mix(msg: string) {
      console.log('mixin', msg);
    }
    template = () => html`
      <style>
        ${this.css}
      </style>
    `;
  };

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
const htmlToElement = (html) => {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
};

// Results in a class Cell that extends Mixin that extends HTMLElement
// Cell can access methods of Mixin.
// Cell can insert css into shadow dom but doesn't need to know about it
// Mixin must handle the base shadow dom declaration
export class CellGridItem extends CSSMixin(HTMLElement) {
  constructor({
    i,
    j,
    value,
    css,
  }: {
    css?: string;
    i: number;
    j: number;
    value?: number | null;
  }) {
    super({ css });
    // this.attachShadow({ mode: 'open' });
    console.log(`${i},${j},${value},${css}`);
    this.mix(`${i},${j},${value}`);
  }
}

const html = String.raw;

customElements.define('mixin-test', CellGridItem);
