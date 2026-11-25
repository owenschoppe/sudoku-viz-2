# Sudoku Viz

A TypeScript app for visualizing Sudoku puzzles: possibilities, row/column/group "loops", and a lens view of the board. It uses no framework, just Web Components and a small store written for this app.

## How it works

- **One global store** ([src/utils/subscribe.ts](src/utils/subscribe.ts)). A module-level singleton holds the state. `initializeSubscriptions(state, reducer)` sets it up in [src/main.ts](src/main.ts). Calling `dispatch(action)` runs the reducer and then calls every subscriber's `render(state)`.
- **Redux-style reducer** ([src/main.ts](src/main.ts)). The actions are `update`, `undo`, `new`, `move`, `arrow` and `settings`. The reducer recomputes possibilities and loops whenever the board changes, and it saves state to `localStorage` after every action.
- **Reactive components through mixins** ([src/mixins/](src/mixins/)).
  - `ReactiveMixin(HTMLElement)` subscribes the element when it is constructed, renders it on connect and unsubscribes it on disconnect. It gives the element `state`, `dispatch` and `render(state)`.
  - `HandleInputMixin` adds keyboard handling for cells: arrow keys move, digits enter a value, Backspace clears it. It also manages focus and roving `tabindex`.
- **Components own their children.** Each custom element builds its Shadow DOM from an HTML string or template once, in `init()`. It creates its children directly with `new Child({...props})` and keeps references to them. `render(state)` then updates only what changed. There is no virtual DOM.
- **Two kinds of components.** The ones in [src/base-components/](src/base-components/) are generic, accessible UI pieces (button, menu, combobox). The ones in [src/components/](src/components/) are the Sudoku-specific views (board, cells, loops, lens, controls, layout).
- **Pure logic is kept separate** in [src/utils/](src/utils/) (solver, possibilities, loops, moves). This is the code covered by the Jest tests.

## Scripts

```sh
yarn r:dev     # rollup watch + serve dist + livereload
yarn r:build   # production bundle to dist/
yarn r:deploy  # deploy dist/ to App Engine
yarn test
```
