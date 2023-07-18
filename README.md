# Sudoku Viz

Typescript app to visualize Sudoku puzzles

- templated components allows for better compositioning
- but we still have to query each element in order to pass props
- with query selector we have to use `document.querySelector() as Class` to get the interface
  - or `document.querySelector<Class>()`
- then we have to pass each prop individually...
- can use `document.createElement() as Class` OR can just use `new Class()` to create new elements programatically
  - with `new Class({})` we can pass multiple props directly to the constructor
  - versus then having to say `el.prop = ...` for each prop
