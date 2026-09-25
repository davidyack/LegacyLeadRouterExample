# Build Prompt: Protection Tests — Assign Leads to Sales Owners

Read `CLAUDE.md` first for repository setup, tech stack, test conventions, commands, and coding standards. Read `SPEC.md` as the authoritative requirements. Follow `BUILD_PLAN.md` for implementation order; reconcile conflicts by prioritizing `SPEC.md`, then `CLAUDE.md`.

## Phase 1 — Setup and discovery
- Inspect the repository, existing test harness, public interfaces, and relevant routing behavior before editing files.
- Identify the outermost stable seam that can exercise each requirement (prefer HTTP, UI, or public module/service APIs).
- Do not modify production code, baseline specifications, or existing tests. This is strictly a test-only change.
- Add test infrastructure only if genuinely required. When scaffolding is necessary, use the ecosystem’s latest generators with `@latest`, and resolve/pin dependency versions from the current registry rather than memory.
- Preserve existing dependency and project conventions wherever possible.

## Phase 2 — Characterization coverage
- Add characterization tests for every criterion in SPEC.md Section 17: TC-1 through TC-6.
- Add the exact required `@pmc-criterion` annotation as a comment on every new test that protects that criterion.
- Exercise observable outcomes only: returned responses, rendered UI, persisted state, routing results, explanations, and escalation signals.
- Do not instantiate internal implementation classes or mock internal collaborators when a public seam reaches the behavior. Mock only genuine externals such as network services, clocks, or third-party APIs.
- Cover both outcomes when a criterion includes a contrast or fallback condition, including capacity-available versus overflow behavior.
- Test the documented current behavior exactly, including defects; do not “correct” product behavior.
- If no stable external seam can reach a behavior, use the narrowest viable internal seam and add a test comment explaining why.
- Keep tests additive, deterministic, isolated, and consistent with existing naming and fixture patterns.

## Phase 3 — Validation and polish
- Run targeted tests after implementing each logical group of coverage.
- Run the complete existing test suite before completion; do not weaken, remove, skip, or alter existing tests.
- Verify the final diff contains only test files and unavoidable test-only configuration or fixtures—never production files.
- Temporarily and locally break each protected behavior where practical to confirm its test fails, then revert the deliberate break before finalizing.
- Confirm every TC-1 through TC-6 binding is present, every required annotation is exact, and all tests pass.
- Summarize created tests, seams used, validation commands/results, and any justified internal-seam exception.
