# Build Plan

## Overview

Build plan for **Protection tests: Balance Territory Coverage**.

### Tech Stack

- **Deployment**: GitHub Actions

## Implementation Tasks

### Phase 1: Test-Surface Assessment and Guardrails
- [ ] Identify the existing characterization test for TC-1 `bmb_e_O9SGVZ3Vot` covering “Executive referrals are assigned to Avery Johnson and escalated for VP Sales direct engagement,” using `leadRouter.js` only as a navigation aid and entering through the outermost stable seam available.
- [ ] Identify the already-proven existing tests for TC-2 `bmb_PKO7Pv4DWm07` and TC-3 `bmb_zjwI1dzbe_z2` without changing their existing behavior coverage or weakening any assertions.
- [ ] Establish a test-only change boundary for `balance-territory-coverage#1`: do not modify `leadRouter.js`, `index.html`, `styles.css`, baseline spec text, production APIs, webhooks, third-party integrations, production data, or feature flags.
- [ ] Verify that each test reaches its behavior through an HTTP route, page/view, public service, or module API; if no outermost stable seam can reach a behavior, add a comment on that specific test explaining why an internal seam is required.
- [ ] Ensure tests assert observable outcomes—such as responses, persisted state, emitted events, rendered team-view data, referral assignment, or escalation outcomes—and do not mock internal collaborators; mock only true externals such as network, clock, or third-party services if applicable.

### Phase 2: Characterization Test Binding Annotations
- [ ] Add the comment annotation `@pmc-criterion master:business-rule:executive-referrals-go-to-avery` to the existing strengthened TC-1 test for `bmb_e_O9SGVZ3Vot`.
- [ ] Add the comment annotation `@pmc-criterion master:use-case:balance-territory-coverage` to the existing proven TC-2 test for `bmb_PKO7Pv4DWm07`, leaving its already-proven assertions otherwise unchanged.
- [ ] Add the comment annotation `@pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment` to the existing proven TC-3 test for `bmb_zjwI1dzbe_z2`, leaving its already-proven assertions otherwise unchanged.
- [ ] Confirm each of the 3 ratified criteria in Section 17 has a declared `@pmc-criterion` binding comment and that no provisional criteria are introduced or combined with the ratified population.

### Phase 3: Executive Referral Characterization Coverage
- [ ] Strengthen the existing TC-1 `bmb_e_O9SGVZ3Vot` test with an observable assertion that an executive referral is assigned to `Avery Johnson`.
- [ ] Strengthen the existing TC-1 `bmb_e_O9SGVZ3Vot` test with an observable assertion that the executive referral is escalated for `VP Sales` direct engagement.
- [ ] Preserve the existing TC-1 test identity rather than adding a second test, as required by “STRENGTHEN the existing test for this behavior — do not add a second one.”
- [ ] Drive the TC-1 executive-referral workflow through the most external stable interface that reaches `leadRouter.js`, avoiding direct instantiation of internal routing classes or mocking internal routing collaborators.
- [ ] Deliberately break the executive-referral assignment outcome and verify the strengthened TC-1 test fails when executive referrals no longer resolve to `Avery Johnson`.
- [ ] Deliberately break the `VP Sales` direct-engagement escalation outcome and verify the strengthened TC-1 test fails when the escalation is no longer produced.

### Phase 4: Existing Territory Coverage and Segmentation Regression Protection
- [ ] Preserve the existing TC-2 `bmb_PKO7Pv4DWm07` characterization coverage proving that sales operations can review each representative’s territory, segment, product focus, configured capacity, and current routing load in one team view.
- [ ] Verify TC-2 continues to exercise the team-view behavior associated with `leadRouter.js`, `index.html`, and `styles.css` through its existing outermost stable seam, without introducing a replacement test or changing the proven behavior assertions.
- [ ] Preserve the existing TC-3 `bmb_zjwI1dzbe_z2` characterization coverage for Enterprise classification at `1,000 or more employees` or `ARR above $10M`.
- [ ] Preserve the existing TC-3 characterization coverage for Mid-Market classification at `100 or more employees` or `ARR of at least $1M when not Enterprise`.
- [ ] Preserve the existing TC-3 characterization coverage for SMB classification otherwise, without changing the already-proven test behavior beyond its declared binding annotation.

### Phase 5: Protection Verification and Regression Validation
- [ ] Run the repository’s existing suite unchanged together with the additive characterization-test updates required by Section 17.3.
- [ ] Confirm the TC-1 strengthened test fails under deliberate breaks to each asserted outcome and passes again when the current `leadRouter.js` behavior is restored.
- [ ] Confirm TC-2 `bmb_PKO7Pv4DWm07` and TC-3 `bmb_zjwI1dzbe_z2` remain unchanged except for their `@pmc-criterion` comments and retain their previously proven protection.
- [ ] Inspect the final diff to confirm it contains only test changes and `@pmc-criterion` comments, with no production-file modifications.
- [ ] Validate the Readiness Checklist outcome: all 3 Section 17 rows have declared bindings, each bound test fails when its pinned behavior is deliberately broken, no existing test is weakened, and every test uses the outermost stable seam or documents why it cannot.

## Validation Checklist

- [ ] Project scaffolding builds and runs
- [ ] Dependencies resolved to current stable versions (scaffolded with `@latest`; no training-cutoff pins)
- [ ] Data model / schema created and validated
- [ ] Core business logic implemented with unit tests
- [ ] UI screens match spec flow narratives
- [ ] Integration points connected and tested
- [ ] All acceptance criteria from SPEC.md verified
- [ ] Edge cases and error handling reviewed
- [ ] Final build and full test pass
