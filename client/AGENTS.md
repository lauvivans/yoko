# Agents.md

## Pull Requests and Commits

Every task will be classified as one of the following types: `chore`, `documentation`, `spike`, `feature`, or `bug`.

When opening a pull request, prefix the main PR title with the task type, separated by a slash:

`[task-type / Main PR title]`

For example:

`[bug / Add end date in occurrence]`

Individual commits may use semantic commit messages. Follow the conventions documented in [Yoko Docs](https://develop.yoko-docs.pages.dev/) under **Dev docs > Project patterns**.

## TDD and Test Strategy

Before implementing a feature, first map the most important test cases and expected behaviors.

- Use React Testing Library for component and user-interaction tests.
- Use Cypress for end-to-end tests covering critical user flows across the application.
- Use Vitest for unit tests when the functionality is strictly isolated or requires focused logic-level coverage.

Prioritize the tests that protect the feature's main behavior, edge cases, and critical user paths before or alongside the implementation.

## Kanban Workflow

Update the task status as work progresses:

- Move the task to `In progress` when starting it.
- Move it to `Blocked` when there is an impediment or the task requirements are unclear.
- Move it to `Review` when the implementation is ready for the user to review.
- Move it to `Test staging` after the changes are merged into `develop`.
- Move it to `Deploy` after the changes are released to production.
- Use `Done` only for tasks of type `documentation` or `spike`.

## Development Workflow

During implementation work, run `npm run dev` so the user can follow the changes in the development environment.

## Branch Naming

Name each task branch with the task type as its prefix, followed by a descriptive kebab-case name:

`[chore|documentation|spike|feature|bug]/descriptive-task-name`

For example:

`chore/migrate-occurrence-form-rhf-zod`
