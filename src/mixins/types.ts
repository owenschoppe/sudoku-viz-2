import { State } from '../types';

export type Constructor = new (...args: any[]) => {};

// Generic Contructor with constraints
export type GConstructor<T = {}> = new (...args: any[]) => T;

// Define properties that the extended class must have.
export type Renderable = GConstructor<RenderableBaseClass>;

export class RenderableBaseClass {
  render(_state: State) {}
  connectedCallback() {}
  disconnectedCallback() {}
}
