# Engineering guidelines

Rules for writing and reviewing code in Yoko. They apply to whoever implements a change and to whoever reviews the PR. The workflow (branches, commits, board) lives in `CLAUDE.md`.

Old code that breaks these rules does not need to be fixed in the same PR. If it gets in the way, open an issue. The exception is lint, prettier and type errors: anything they flag in the files the PR touches is fixed in the same PR. The only exception to that is the `max-lines` warning, which follows the file size rules below.

## Principles

- Make the smallest change that fully solves the issue. Improvements spotted along the way become issues, not part of the PR.
- No premature abstraction. Extract a component, hook or helper only when there is a second real use.
- Before creating something, look for what already exists in the codebase and in the dependencies.
- A new dependency needs a justification in the PR.
- Readable beats clever. Names describe what the thing is.
- Comments explain why, not what.

## Security

- Follow the "can and cannot publish" table in `docs/decisions/001-documentation-strategy.md`.
- No `dangerouslySetInnerHTML` without sanitizing the content, and no `eval`.
- User input is validated before it is saved.
- Before adding a dependency, check that it is maintained and that its license is compatible.

## Front-end

Applies to `client/`. Paths below are relative to it.

### Structure

- `src/components/{action,display,utils}`: generic components, no business rules.
- `src/pages/<feature>/`: whatever belongs to a feature stays with it, in `components/`, `hooks/`, `helpers/`, `schemas/` and `enum/`. It moves up to `src/` only when another feature needs it.
- `src/store/`: global state, with zustand. State used by a single component stays in that component.
- `src/types/`: shared domain types.
- Imports use the `@/` alias.

### File size

| File                                 | Max lines |
| ------------------------------------ | --------- |
| Component (`.tsx`)                   | 300       |
| Hook, helper or store                | 150       |
| SASS partial                         | 150       |
| Test (`.spec.tsx`, `.spec.ts`)       | 300       |
| Types, enums, schemas, icon wrappers | no limit  |

- Lines are counted as the file is, blank lines included.
- A file that goes past its limit is split by responsibility: a subcomponent, a hook, a helper or another partial. If splitting makes it worse, justify it in the PR.
- A file already over its limit should not grow. Splitting it is welcome, but only when the PR is already changing that part of the file.
- ESLint warns with `max-lines` when a `.ts` or `.tsx` file passes its limit. SASS partials are checked in review.
- The limit is a trigger to look at responsibilities, not a goal. A long file that does one thing well beats several tiny files that only add indirection.
- Why these numbers: components and tests use the default of ESLint's [`max-lines`](https://eslint.org/docs/latest/rules/max-lines), 300. A component mixes markup, state and handlers, so it gets more room than a hook, helper or partial, which should do one thing. _Clean Code_ (Robert C. Martin, ch. 5) shows large systems built from files typically around 200 lines, with an upper bound of 500. Sonar and CISQ ([CWE-1080](https://cwe.mitre.org/data/definitions/1080.html)) flag files only past 1000 lines, which is a ceiling, not a target.

### React and TypeScript

- Components are functions. Props are typed with `interface <Component>Props`.
- No `any`, and no `as` to silence the compiler. Outside data (localStorage, API, URL) goes through a zod schema.
- Forms use react-hook-form with zod. The schema lives in `schemas/`.
- Dates use date-fns and the helpers in `src/helpers/formatters/date`. No hand-rolled date math.
- `useEffect` is only for syncing with something external. Derived values are computed during render.
- Lists use a stable id as `key`, never the index.

### Styles

- Styles live in `src/assets/sass/`, mirroring the component or page folder.
- Classes follow BEM, prefixed with `c-` for components and `p-` for pages. Examples: `c-default-button--error`, `p-homepage__intro`.
- Colors, breakpoints and effects come from `src/assets/sass/tokens/`. No loose values.

#### Flexbox or grid

- **Flexbox:** content-first. Items flow in one direction and the layout mostly happens on the children. Good for alignment and small pieces, such as a toolbar or a card's content.
- **Grid:** layout-first. Grid is defined on the parent, which places the children in rows, columns or both. Good for page structure, consistent gaps between blocks and overlapping elements.
- "Grid is for 2D" is not a rule. Grid also works well for 1D layouts.
- If you start giving every flex item a fixed width, switch to grid.
- One grid parent should own the structure. Don't nest grids to fix what the parent grid could handle.
- Space siblings with `gap` on the parent, not with margins on each child.
- Further reading: [CSS flexbox vs. CSS grid](https://blog.logrocket.com/css-flexbox-vs-css-grid/) (LogRocket) and [What's the difference between flexbox and grid?](https://css-tricks.com/quick-whats-the-difference-between-flexbox-and-grid/) (CSS-Tricks).

### Accessibility

- Use the right native element: `button` for actions, `a` for navigation.
- An icon-only button needs an `aria-label`. Every field has an associated label.
- Everything works with the keyboard, with a visible focus.

### Tests

Before implementing, map the most important cases: main behavior, edge cases and critical flows.

- Features and fixes ship with a test of the behavior. A fix starts with a test that reproduces the bug.
- Test behavior, not implementation. Query by what the user sees (`getByRole`, `getByText`) and interact like they would.
- The test sits next to the code, in `<File>.spec.tsx`.
- Before opening the PR, `type-check`, `lint:all`, `format:check:all`, `test` and `build` must pass.

#### Unit or integration

- **Unit:** one isolated piece (a helper, a hook, a store), with plain Vitest.
- **Integration:** pieces working together (a component with its context, store and mocked outside world), with Testing Library. Testing Library is integration-driven by design.
- A page with no logic worth isolating gets integration tests only.

#### Mocks

Mock only the edges of the app:

- HTTP and API calls.
- `localStorage` and `sessionStorage`, when the test needs to control them.
- Third-party modules with side effects, such as the router or Sentry.

Don't mock child components, contexts and providers (such as `AuthContext`), internal hooks or helpers. Mocking them tests the mock, not the app.

When a mock is needed:

- Shared mocks live in a `__mocks__/` folder. Spread the real module and override only what the test needs, instead of redefining everything:

  ```ts
  vi.mock("some-module", async (importOriginal) => ({
    ...(await importOriginal<typeof import("some-module")>()),
    SomeExport: vi.fn(),
  }));
  ```

- A mock for a single test goes in that test file with `vi.mock`, which overrides the one in `__mocks__/`.
- Reset mocks between tests (`vi.restoreAllMocks()` in `afterEach`) so one test doesn't leak into another.

#### Organization

- One top-level `describe` naming what is under test, wrapping every test of that scope. Example: `describe('OccurrenceCreateEdit - editing an event')`.
- Use nested `describe` blocks only to separate contexts, and avoid deep nesting.
- Choose matchers on purpose: `toBeInTheDocument` checks that the element exists, `toBeVisible` checks that the user can see it.

#### Further reading

- [The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications), Kent C. Dodds
- [Static vs Unit vs Integration vs E2E Tests](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests), Kent C. Dodds
- [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests), Kent C. Dodds
- [React testing best practices](https://infinum.com/handbook/frontend/react/testing/best-practices), Infinum handbook
- [Frontend testing guide](https://www.chromatic.com/frontend-testing-guide), Chromatic

## Reviewing a PR

What to check, in this order:

1. The PR solves the issue it closes, and only that issue.
2. Bugs and edge cases.
3. Tests cover the new or fixed behavior.
4. Security.
5. The rules in this document.
6. What can be removed or simplified.

How to comment:

- Tag each comment as **Blocking** (bug, security flaw, new behavior without a test, lint or type error in a touched file, a file over its size limit without justification, a broken rule from this document), **Suggestion** (optional improvement) or **Question**.
- State the problem, why it matters and a concrete fix.
- Don't repeat style nits that prettier fixes on its own.
- Anything outside the PR's scope becomes a suggested issue, not a blocker.

Closing issue checklist:

- Tick the checklist items of the issue the PR closes that the PR delivers. Never untick an item.
- An item left unchecked without a reason in the PR is **Blocking**.
