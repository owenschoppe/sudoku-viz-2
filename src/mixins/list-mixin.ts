type Constructor = new (...args: any[]) => {};

// // Generic Contructor with constraints
// type GConstructor<T = {}> = new (...args: any[]) => T;

// // Define properties that the extended class must have.
// type Renderable = GConstructor<{ render: (state: State) => void }>

export type Direction = 1 | -1;

export const ListMixin = <T extends Constructor>(Base: T) =>
  class List extends Base {
    items: any[] = [];

    constructor(...args: any[]) {
      super(...args);
    }

    nextIndex(index: number, dir: Direction, loop: boolean) {
      if (loop) {
        return (index + dir + this.items.length) % this.items.length;
      } else {
        return Math.max(Math.min(index + dir, this.items.length - 1), 0);
      }
    }
  };
