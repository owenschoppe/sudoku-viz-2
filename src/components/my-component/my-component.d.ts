class MyComponent extends HTMLElement {
  label: string;
}

declare global {
  interface Window {
    MyComponent: typeof MyComponent; // if you register your element in global scope
  }
  interface HTMLElementTagNameMap {
    'my-component': MyComponent;
  }
}
