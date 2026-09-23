# Build Task: Harden Test Surface — Route Leads to Best Rep

Read `CLAUDE.md` first and follow its project setup, tech stack, test conventions, and coding rules. Read `SPEC.md` for the complete behavioral requirements. Follow `BUILD_PLAN.md` for implementation order; if it conflicts with the test-only scope, preserve the test-only scope.

## Phase 1: Setup and discovery
- Inspect the repository, existing test runner, test structure, and stable external seams.
- Identify how users interact with lead routing through the UI, HTTP boundary, or public module API.
- Do not modify production files, application configuration, baseline specs, or existing tests.
- Add dependencies only if essential for testing. Use the relevant generator with `@latest`, and resolve/pin every dependency to its current stable registry version rather than recalling versions from memory.

## Phase 2: Characterization tests
- Add only additive characterization tests for every criterion in SPEC.md Section 17.
- Enter through the outermost stable seam available; assert observable outcomes such as rendered UI, public API results, persisted state, or emitted events.
- Do not instantiate internal classes or mock internal collaborators when a stable seam can exercise the behavior. Mock only true external systems.
- Add a comment containing the exact required binding annotation to each applicable test:
  - `@pmc-criterion master:use-case:route-leads-to-best-rep`
  - `@pmc-criterion master:business-rule:copilot-pocs-prioritize-alex-rivera`
- Cover both sides of conditional behavior:
  - Route inbound leads, partner referrals, and event opportunities using account, geography, segment, product interest, and source rules; verify overflow to the next-best rep or SDR pool when the preferred rep is unavailable or full.
  - Verify Copilot Studio POC requests route to Alex Rivera while capacity exists, then to Casey Kim or Quinn Torres when Alex lacks capacity.
- If no outer stable seam can reach a behavior, use the least-internal viable seam and add a test comment explaining why.

## Phase 3: Validation and polish
- Run focused new tests while implementing, then run the full existing suite before completion.
- Verify new tests fail when their pinned behavior is deliberately broken, then restore the code immediately without committing production changes.
- Confirm the final diff contains test files only, preserves all existing tests unchanged, and includes every required annotation.
- Report the tests added, seams used, commands run, and validation results.
