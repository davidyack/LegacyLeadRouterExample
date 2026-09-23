# Build Task: Harden Test Surface — Guide Timely Lead Follow-Up

Read `CLAUDE.md` first for repository setup, technology choices, test commands, conventions, and file-scope rules. Read `SPEC.md` fully for the authoritative requirements. Follow `BUILD_PLAN.md` for implementation order where present.

## Phase 1 — Inspect and prepare
- Inspect the existing application, test suite, and relevant public seams before changing files.
- Locate the stable external interface that reaches the lead-routing behavior described in `SPEC.md` (for example, public module API, HTTP route, or rendered page).
- Identify test-only files and conventions. Do not modify production code, application configuration, baseline specifications, or existing tests.
- Do not scaffold a new application or add dependencies unless the repository genuinely requires it. If scaffolding is required, use official generators with `@latest` and resolve/pin dependency versions from the current registry, never from memory.
- Create a focused implementation plan consistent with `BUILD_PLAN.md`.

## Phase 2 — Add characterization coverage
- Add additive characterization tests for both criteria in SPEC.md Section 17.
- Test TC-1 through the outermost stable seam: verify the observable SLA behavior for partner, executive, Enterprise, Mid-Market, and SMB leads, including required acknowledgment/contact timing and executive VP Sales notification.
- Test TC-2 through the outermost stable seam: verify sales users can observe the first-contact SLA and escalation guidance for routed leads based on segment and source.
- Put the exact required annotation in a comment on each corresponding test:
  - `@pmc-criterion master:business-rule:lead-response-slas-follow-segment`
  - `@pmc-criterion master:use-case:guide-timely-lead-follow-up`
- Assert observable outputs, persisted state, rendered content, or emitted events—not internal implementation calls.
- Mock only genuine external dependencies such as clocks, network services, or third-party integrations.
- If no outer stable seam can reach a behavior, use the least-internal viable seam and add a comment explaining why.
- Preserve current behavior exactly, including defects; these are characterization tests, not fixes.

## Phase 3 — Validate and polish
- Confirm the diff changes only new or test-only files. Revert any production-code, configuration, or existing-test modifications.
- Run focused tests after adding each test group, then run the complete existing test suite using the command documented in `CLAUDE.md`.
- Verify each new test would fail if its pinned behavior were deliberately broken, without committing any deliberate break.
- Check that both required annotations are present and exact.
- Report changed test files, seams used, test commands run, and results.
