# Build Task: Protection Tests — Route Leads to Best Rep

Read `SPEC.md` completely for the authoritative requirements. Read `CLAUDE.md` before making changes for repository setup, test conventions, commands, and coding standards. Follow `BUILD_PLAN.md` as the implementation sequence.

## Phase 1 — Inspect and Set Up
- Inspect the existing test suite and identify the existing tests covering both behaviors in SPEC.md Section 17.
- Inspect only enough implementation code to understand the outermost stable seam and observable outcomes.
- Do not scaffold a new project or add dependencies unless required by existing project conventions. If scaffolding is necessary, use generators with `@latest` and resolve/pin dependency versions from the registry at execution time, never from memory.
- Confirm the working tree baseline and identify production files; production files must remain untouched.

## Phase 2 — Strengthen Characterization Coverage
- Modify the existing test for TC-1; do not add a duplicate test.
- Add `@pmc-criterion master:use-case:route-leads-to-best-rep` in a comment on that test.
- Strengthen assertions through the outermost stable seam to prove routing considers the stated rules and that unavailable/full preferred reps overflow to the next-best rep or SDR pool with clear ownership.
- Modify the existing test for TC-2; do not add a duplicate test.
- Add `@pmc-criterion master:business-rule:copilot-pocs-prioritize-alex-rivera` in a comment on that test.
- Strengthen observable assertions proving Copilot Studio POC requests go to Alex Rivera while capacity exists, then to Casey Kim or Quinn Torres when Alex lacks capacity.
- Do not instantiate internal classes or mock internal collaborators. Mock only genuine external systems. If no stable external seam exists, use the narrowest internal seam and explain why in a test comment.
- Preserve existing test intent and assertions; add protection without weakening or replacing coverage.

## Phase 3 — Validate and Polish
- Run focused tests after each test change.
- Run the complete existing test suite before finishing.
- Verify both strengthened tests fail when their asserted behavior is deliberately broken, then restore the code/tests exactly.
- Review `git diff` and confirm only test files or test-only configuration changed; do not modify production code, baseline specs, or unrelated files.
- Confirm each required annotation is present and each criterion has strengthened coverage.
