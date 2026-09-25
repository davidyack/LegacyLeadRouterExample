# Protection tests: Track Lead Follow-Up Expectations

## Project Overview

Protection tests: Track Lead Follow-Up Expectations — see SPEC.md for full project requirements.

## Tech Stack

- **Platform**: Node.js
- **Agent Framework**: Claude Code
- **Deployment**: GitHub Actions

## Dependency Management — Use Current Versions

Version numbers a language model recalls are frozen at its training cutoff and
are usually several releases behind. When scaffolding this project and adding
dependencies, resolve the **current stable** release from the package registry
rather than pinning a remembered or hardcoded version:

- **Scaffold with the latest generators.** Use the `@latest` tag so the
  toolchain itself is current — e.g. `npm create vite@latest`,
  `npx create-expo-app@latest` (or `npm create expo@latest`),
  `npx create-next-app@latest`, `npm init <template>@latest`.
- **Check the registry before writing a manifest.** Before committing a
  `package.json`, `requirements.txt`, `pyproject.toml`, or `*.csproj`, look
  up the current version — `npm view <pkg> version`, `pip index versions <pkg>`,
  `dotnet package search <pkg>` — instead of copying a version from memory.
- **Refresh anything that lags.** After the first install, run `npm outdated`
  (or `npx npm-check-updates -u`) and bump stale entries, then reinstall and
  confirm the app still builds and its tests pass on the updated versions.
- **Stay on stable, matched majors.** Prefer the latest stable release (not
  alpha/beta/rc), and keep peer-linked packages on compatible majors — React
  with React DOM, the Expo SDK with its `expo-*` modules, Vite with its
  framework plugin.
- **Lock what you resolve; follow org policy.** This means "current at scaffold
  time," not "auto-upgrade production forever." After choosing versions, commit
  the lockfile so builds stay reproducible, and defer to your organization's
  dependency policy (approved/vetted registries, pinning rules, security review)
  where it applies.
- **Restricted or offline environments.** If public registry access is blocked,
  use your organization's internal mirror or the latest pre-approved versions
  instead — a blocked `@latest` is a signal to reach for the vetted source, not
  a reason to fall back to stale hardcoded pins or to fail the build.
- Treat any version literal elsewhere in this kit as an illustrative
  **minimum**, not a target — the registry's current stable release (subject to
  the policy notes above) is the source of truth.

## Testing

- Write unit tests for all business logic
- Write integration tests for external service boundaries
- Validate acceptance criteria from the spec before marking tasks complete

## Project Structure

```
src/               # Application source code
tests/             # Test files
docs/              # Documentation
config/            # Configuration files
```

## Claude Code Notes

- Work from the project root directory
- Complete each task fully before moving to the next
- Run validation checks after each task
- Skip items marked "[Needs Input]" and note the gap
- Respect dependency chains between tasks
- Consult SPEC.md for detailed requirements, data models, and edge cases
- Follow BUILD_PLAN.md for the implementation sequence

## Engineering Target: Production

Optimize for correctness, maintainability, and reliable operation. Resolve important ambiguities before committing to a design, follow established architecture and coding standards, implement appropriate testing (unit tests for business logic, integration tests at external boundaries), handle errors and edge cases, and produce software that is ready for production use.

Hold all generated code and artifacts to this bar.


<!-- pmcollab:governance -->
## Ubiquitous Language (this product's words)

This organization has decided what these things are called. Use these words in code you write, in comments, in commit messages, in PR descriptions and in any user-facing string.

- Use "Source-Specific Lead Routing" for as used in davidyack/LegacyLeadRouterExample [provisional].
- Use "Named Account Lead Assignment" for as used in davidyack/LegacyLeadRouterExample [provisional].

Renaming an existing identifier is NOT part of this — these words govern new code and prose. If existing code uses a different word, leave it and say so in the PR.

If you need a word this list does not govern, use `TERMINOLOGY.md` for the full definitions, and declare any domain term you had to invent so it can be reviewed.

Injected 2 of 2 governed terms (complete).


## Code Factory Guidelines

[Engineering Target Baseline — Production]
Standing rules that apply to this product because its Engineering Target is "Production". They are the floor, not the ceiling: any organization, product, or certification rule below may tighten them, and a more specific rule wins over this baseline where the two genuinely conflict.

- Business logic carries unit tests; every external-service boundary carries an integration test.
- Handle errors explicitly. A swallowed exception or an empty catch block is a defect, not a style choice.
- Validate input at trust boundaries and never log secrets, credentials, or personal data.
- Schema and data migrations are reversible, and ship separately from the code that depends on them.

