# Build Prompt

Read `SPEC.md` for complete requirements, `CLAUDE.md` for repository setup, tech stack, and conventions, and `BUILD_PLAN.md` for the required implementation sequence. Follow them in that order; resolve conflicts in favor of `SPEC.md`.

This is a test-only characterization-test change. Do not modify production code, application assets, baseline specifications, or existing behavior. Keep the diff limited to tests and essential test configuration only.

## Phase 1 — Setup and discovery
- Inspect the repository, existing test commands, test conventions, and the current tests covering `leadRouter.js`.
- Identify the outermost stable seam for each required behavior before writing tests.
- If project scaffolding or a missing test dependency is genuinely required, use the applicable generator with `@latest` and pin dependencies to their current stable registry versions; do not use versions remembered from memory.
- Do not add tooling or dependencies unless necessary for the requested tests.
- Run the existing relevant test suite before making changes to establish the baseline.

## Phase 2 — Core test coverage
- Strengthen the existing test for executive referrals; do not create a duplicate test.
- Add `@pmc-criterion master:business-rule:executive-referrals-go-to-avery` in a comment on that test.
- Assert observable outcomes proving both assignment to Avery Johnson and escalation for VP Sales direct engagement. Make the assertions strong enough to fail if either outcome is removed or changed.
- Locate the existing proven territory/team-view test. Do not otherwise alter its behavior; add this annotation comment to the existing test:
  `@pmc-criterion master:use-case:balance-territory-coverage`
- Locate the existing proven lead-segmentation test. Do not otherwise alter its behavior; add this annotation comment to the existing test:
  `@pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment`
- Exercise behavior through the outermost stable interface available and assert responses, rendered output, persisted state, or emitted events—not internal method calls.
- Mock only genuine external systems. If no stable external seam can reach a behavior, use the nearest internal seam and explain why in a test comment.
- Preserve all existing tests; do not weaken, replace, delete, or rename them merely to satisfy coverage.

## Phase 3 — Validation and polish
- Verify every changed or added test carries the exact required annotation.
- Verify the executive-referral test covers the full asserted outcome and is not implementation-coupled.
- Run targeted tests after each meaningful change, then run the complete repository test suite.
- Inspect the final diff to confirm no production files were changed and no unrelated formatting or dependency churn was introduced.
- Report the tests run, their results, the stable seams used, and any unavoidable limitations.
