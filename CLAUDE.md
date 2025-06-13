This file describes the structure of this code base, how to effectively interact with it, and conventions for contributing to it.

Target audience: an AI agent with an excellent broad knowledge of coding, but little familiarity with this specific project, being managed by a senior software engineer ("Spencer") who is available to answer questions and offer guidance.

# Meta

## App purpose

This is the repo for "Probable Panic," a fast-paced game meant to train the skill of quickly assigning probabilities to things.
The game is a series of short (~10sec) rounds:

- at the beginning of a round, a claim (e.g. "The Great Wall of China is visible with the naked eye from the moon.") is presented simultaneously to all players;
- for the duration of the round, the players are free to bet (play money) in a prediction market on that claim;
- at the end of the round, the true answer is revealed, the players see how much each player won/lost on the market, and then the next round begins.

## Keep this file up-to-date!

If you ever discover that something in this file is wrong, or out of date, or just confusingly stated, fix it!

If Spencer ever asks you to "make a note" of something, he's probably asking you to update this file, to transfer some lesson to future instantiations of you.

## Architecture overview

- **Package manager:** npm
- **UI framework:** React
- **Build tools:** Vite + TypeScript
- **Other tools:** [Convex](https://convex.dev)

### Convex development notes

- After creating or modifying schema files or adding new queries/mutations in `convex/`, run `npx convex dev --once` to generate TypeScript types and API definitions
- The generated files in `convex/_generated/` are required for proper TypeScript support in React components
- Without running this command, `api.queries.functionName` will show TypeScript errors

## Directory structure

- `src/` - the user interface run in the browser
- `convex/` - Convex database schema and server functions
  - `convex/shared/` - code that's used by both the UI and Convex
- `tasks/`
  - `tasks/todo/*.md` - files describing changes Spencer wants to make, eventually
  - `tasks/done/YYYY-mm-dd-*.md` - files describing past changes

## Contribution conventions

- Avoid huge commits. Prefer sequences of small, incremental, logically self-contained commits.

  Example:

  ```
  $ # good
  $ git commit -m "feat(schema): add historical games table"
  $ git commit -m "chore(backend): when game ends, move it to historical games table"
  $ git commit -m "feat(backend): add API endpoint to list logged-in user's past games"
  $ git commit -m "test(backend): add test to reveal server crash when anonymous user requests past games"
  $ git commit -m "fix(backend): fix server crash when anonymous user requests past games"
  $ git commit -m "feat(ui): add /history page"
  $ git commit -m "refactor(ui,backend): make typing more precise"
  $ git commit -m "refactor(ui,backend): clean up debug messages"

  $ # bad
  $ git commit -m "feat: let users see their past games"

  ```

- Use "conventional commit" syntax, as exemplified in the `good` example above.

  Valid commit types:

  - feat (for new functionality)
  - test (for test-only changes)
  - docs
  - fix
  - refactor (for changes that should leave functionality unchanged)
  - chore (for misc maintenance tasks)

  Valid scopes:

  - schema (for db schema changes)
  - backend (for changes to server-side functionality)
  - ui (for purely browser-side changes)

  Feel free to make up more, but run them by Spencer and add them to this list before committing.

### Development workflow

Unless Spencer specifies otherwise:

1. Create a new git branch for the change
2. Figure out a good implementation plan, broken into logical, self-contained chunks
3. Get Spencer's sign-off, especially on the module/type/interface/function signatures.
4. Implement the first chunk
5. Ensure no build or lint errors
6. Commit (using conventional commit format)
7. Push branch and create PR via GitHub CLI (`gh pr create`)
8. Verify CI passes on GitHub, make & push any needed corrections
9. BEFORE MERGING: if Spencer pointed you at a `tasks/todo/*.md` file describing the change, move the file to `tasks/done/YYYY-mm-dd-*.md`, then commit that moved file and push to the PR
10. Merge PR and delete branch
11. Locally: `git fetch origin/main` and fast-forward local main branch

### UI development patterns

Follow React best practices:

- Functional components with hooks
- TypeScript interfaces for props
- Event handlers passed as props -- a component should **almost never** issue mutations / make API calls / ... itself; e.g. instead of calling `api.games.create(...)`, it should call an `onCreateGame: (...) => Promise<GameId>` prop.
  - ...and, when feasible, components shouldn't issue queries either, taking their data via `props` as well. (Sometimes it isn't feasible for the top-level page component to know all the queries it needs to make; that's fine. This is somewhat flexible.)
  - (This philosophy is somewhat influenced by Elm, esp. [this page](https://guide.elm-lang.org/webapps/structure.html); "rather than making a `Sidebar` component with its own internal update logic, just make a function `viewSidebar`." Though, in React, that view would technically be a "component.")
