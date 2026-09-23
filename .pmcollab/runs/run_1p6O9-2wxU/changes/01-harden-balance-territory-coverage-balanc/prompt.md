# Build Instructions

Read `SPEC.md` completely for the authoritative requirements and `CLAUDE.md` for repository setup, stack, conventions, test commands, and file-scope rules. Follow `BUILD_PLAN.md` as the implementation sequence.

## Phase 1 — Setup and Discovery
- Inspect the repository, existing test structure, and public/stable seams before editing.
- Identify the outermost stable interface that exercises each behavior in SPEC.md Section 17.
- Preserve all production files. This is a test-only change: do not modify application source, HTML, CSS, configuration, baseline specs, or existing tests.
- Add dependencies only if strictly necessary. If scaffolding or adding a dependency is required, use the relevant generator with `@latest` and resolve/pin its current stable registry version; do not use versions remembered from memory.
- Run the existing test suite before making changes to establish a baseline.

## Phase 2 — Characterization Tests
- Add additive characterization tests for all three Section 17 criteria:
  - Executive referrals route to Avery Johnson and escalate for VP Sales engagement.
  - Sales operations can review each representative’s territory, segment, product focus, configured capacity, and current routing load in one team view.
  - Lead segmentation applies Enterprise, Mid-Market, and SMB thresholds exactly as specified, including boundary and contrast cases.
- Exercise behavior through the outermost stable seam available (route, page/view, public module/service API).
- Assert only observable outcomes: responses, rendered output, persisted state, or emitted events.
- Do not instantiate internal classes or mock internal collaborators. Mock only genuine external systems when needed.
- If no stable external seam can reach a behavior, use the narrowest internal seam and add a test comment explaining why.
- Put the required annotation in a comment on each corresponding test:
  - `@pmc-criterion master:business-rule:executive-referrals-go-to-avery`
  - `@pmc-criterion master:use-case:balance-territory-coverage`
  - `@pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment`
- Preserve current behavior exactly, including defects. Do not “fix” production behavior or weaken existing tests.

## Phase 3 — Validate and Polish
- Run targeted new tests after adding each behavior, then run the complete existing suite.
- Confirm every Section 17 criterion has at least one annotated test and that contrast conditions have coverage for both permitted and refused outcomes where applicable.
- Review `git diff` before completion. Ensure only new test files or test-only changes are present and no production file was touched.
- Report the tests added, stable seams used, validation commands run, and any unavoidable internal-seam justification.
