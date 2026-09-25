# Build Prompt

Read `CLAUDE.md` first for repository setup, tech stack, test conventions, and coding standards. Read `SPEC.md` for the complete requirements. Follow `BUILD_PLAN.md` as the implementation sequence; reconcile conflicts by prioritizing `SPEC.md`, then `CLAUDE.md`.

## Phase 1 — Setup and Discovery
- Inspect the repository, existing test suite, `leadRouter.js`, `index.html`, and available public seams before editing.
- Preserve the existing project structure and test tooling; this is a test-only change.
- Do not scaffold a new application or alter production configuration unless explicitly required by repository setup.
- If scaffolding is genuinely required, use the relevant generator with `@latest` and pin all dependencies to current stable registry versions verified at execution time, never recalled versions.
- Identify the outermost stable seam that can exercise each required behavior. Prefer HTTP, UI, or public module/service APIs.
- Run the relevant existing tests before changes to establish a baseline.

## Phase 2 — Characterization Tests
- Add only additive characterization tests; do not modify production code, existing tests, baseline specification text, or behavior.
- Create coverage for every criterion in SPEC Section 17:
  - Partner referrals: acknowledgment within 1 business hour and first contact within 4 business hours.
  - Routed-lead follow-up deadline visibility based on segment and referral source.
  - Segment SLAs: Enterprise 2 business hours, Mid-Market 4 business hours, SMB 1 business day.
  - Executive referrals: same-day contact and VP Sales notification.
- Add the exact `@pmc-criterion` annotation from each test-case specification as a comment on its corresponding test.
- Cover both permitted and refused/contrast outcomes whenever the stated behavior implies a contrast.
- Drive tests through observable outcomes such as responses, rendered views, persisted state, or emitted events.
- Mock only true external dependencies such as clocks, networks, or third-party services.
- Do not instantiate internal classes or mock internal collaborators when a stable external seam is available.
- If no stable external seam can reach a behavior, use the narrowest internal seam and add a test comment explaining why.

## Phase 3 — Validation and Polish
- Keep the diff limited to test files and essential test fixtures only; verify no production file changed.
- Run focused tests after each test group, then run the complete existing test suite unchanged.
- Verify every new test fails when its pinned behavior is deliberately broken, then restore the code without committing production changes.
- Confirm all four criteria have declared annotations and that no existing test was weakened.
- Report the tests added, seams used, validation commands and results, and any unavoidable internal-seam justification.
