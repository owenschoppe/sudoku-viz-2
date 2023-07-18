import { State } from '../types';

// Dispatch Pattern
// export const ReactiveMixin = (Base: HTMLType) =>
//   class Reactive extends Base {
//     state: string;
//     dispatch: string;

//     constructor({ dispatch, state }: { dispatch: Dispatch; state: State }) {
//       super();
//     }
//     render(state: any) {
//       console.log('reactive', state);
//     }
//   };

type Constructor = new (...args: any[]) => {};

// // Generic Contructor with constraints
// type GConstructor<T = {}> = new (...args: any[]) => T;

// // Define properties that the extended class must have.
// type Renderable = GConstructor<{ render: (state: State) => void }>

/////////////////////
// Register Pattern
/////////////////////
// Classes still need to save references to their child elements so they can update props as needed
// Classes independently register themselves so their parent no longer needs to call their render method
// Classes can register with a list of dependencies they want to track? Use JS Proxy?
// Allows webcomponents to be instantiated in template using <foo> syntax and still be reactive.
// Import register rather than pulling it from constructor!

// export const ReactiveMixin = <T extends Constructor>(Base: T) =>
//   class Reactive extends Base {
//     state: State;
//     dispatch: Dispatch;
//     unregister: Unregister;

//     constructor(...args: any[]) {
//       super(...args);
//       const { unregister, dispatch, state } = args[0].register(this.render);
//       this.state = state;
//       this.dispatch = dispatch;
//       this.unregister = unregister;
//     }

//     render(state: State) {
//       console.log('render', state);
//     }
//   };

// export class ReactiveCell extends ReactiveMixin(HTMLElement) {
//   constructor(...args: any[]) {
//     super(args);
//   }

//   render(state: State) {
//     console.log('reactive cell render', state);
//   }
// }

// https://stackoverflow.com/questions/64396668/why-do-typescript-mixins-require-a-constructor-with-a-single-rest-parameter-any
type GetProps<TBase> = TBase extends new (props: infer P) => any ? P : never;
type GetInstance<TBase> = TBase extends new (...args: any[]) => infer I
  ? I
  : never;
type MergeCtor<A, B> = new (
  props: GetProps<A> & GetProps<B>,
) => GetInstance<A> & GetInstance<B>;

// Usage:
// bypass the restriction and manually type the signature
function GeometryMixin<TBase extends Constructor>(Base: TBase) {
  // key 1: assert Base as any to mute the TS error
  const Derived = class Geometry extends (Base as any) {
    shape: 'rectangle' | 'triangle';
    constructor(props: { shape: 'rectangle' | 'triangle' }) {
      super(props);
      this.shape = props.shape;
    }
  };

  // key 2: manually cast type to be MergeCtor
  return Derived as MergeCtor<typeof Derived, TBase>;
}

export class GeometryCell extends GeometryMixin(HTMLElement) {
  constructor(props: { shape: 'rectangle' | 'triangle' }) {
    super(props);
  }

  render(state: State) {
    console.log('reactive cell render', state);
  }
}

// Method 1:
// Final Class = Mixin => ... => WebComponent => HTMLElement
// Use constraints to access child class properties and methods
// Webcomponent can't make use of mixin methods... super.method()?

// Method 2:
// WebComponent => Mixin => ... => HTMLElement
// Can still use constraints on mixins...
// WebComponent can access everything.
// Mixin can't call webcomponent render function?
