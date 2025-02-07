# solver

This library is where you should develop code to solve Advent of Code puzzles.

## Getting Started

To get started, generate stubs for the year you want to start work on. Run this workspace's bundled `@aon/plugin-solver` generator, either from the Nx console or by running:

```
yarn nx generate @aon/plugin-solver:solvers --year=<YEAR>
```

To generate JavaScript stubs instead of TypeScript, add the `--js` flag.

## Solving Puzzles

You will need to build `react-app` and launch `express-app` following the documentation in the root README. I recommend running the `express-app:serve` development target since it automatically rebuilds on save and allows debugging.

Find the stub for the solution you want to start work on and start coding. The stub imports your input, which part to run (1 or 2), and an 'output()' function that you can call anywhere in the file to halt execution and return an answer.

Each time a solution is run, it is spun up on its own Node worker thread. Any variables defined in the root scope of the file will not persist between runs of your solution.

For algorithms, data structures, etc. that you plan to reuse, implement them in the helper library under `solver/helpers/src/lib` and export them using the library's `index.ts`. Anything you export there can be imported here using the `@aon/solver-helper` path.

As you're developing a solution, you can specify custom inputs in the client using a basic filesystem that saves inputs to the database. "Run" will send your current input to the solver and return an answer. I included a few more features as well, including:

- Double click an input's title to give it a custom name.
- Double click a solution to clear the field.
- Undo (ctrl+z) and Redo (ctrl+shift+z or ctrl+y) keyboard shortcuts.
- The `//*` button in the navigation menu launches the current puzzle's AoC page in a new tab so you can put in your solution.
- The `*` button in the upper right of the page refetches your puzzle description, and should be used after you complete each part.

### Visual Studio Code

If you're developing in VS Code, you can run the included Express debug config from the Run and Debug pane (or hit F5). You will have access to the debug log and any breakpoints you set.

You can also automatically format your source files according to the project's Prettier and Eslint configurations whenever you save by opening settings and enabling "Editor: Format on Save".
