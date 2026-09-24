# Build Plan

## Overview

Build plan for **Protection tests: Route Leads to Best Rep**.

### Tech Stack

- **Deployment**: GitHub Actions

## Implementation Tasks

### Phase 1: Test-Surface Preparation
- [ ] Locate the existing characterization test that covers TC-1 `bmb_aRD9TxRgCruJ` across the current `index.html`, `leadRouter.js`, and `styles.css` behavior path; strengthen that existing test rather than creating a second TC-1 test.
- [ ] Locate the existing characterization test that covers TC-2 `bmb_TJKIzmg_E3WC` in `leadRouter.js`; strengthen that existing test rather than creating a second TC-2 test.
- [ ] Identify the outermost stable seam already available for exercising lead routing—an HTTP route, page/view rooted in `index.html`, or public `leadRouter.js` module/service API—and use it instead of instantiating internal routing classes or mocking internal collaborators.
- [ ] Add a test comment explaining the internal-seam exception only if no HTTP route, `index.html` page/view, or public `leadRouter.js` API can reach the required behavior.
- [ ] Constrain the change set to additive characterization-test updates only; do not modify `index.html`, `leadRouter.js`, `styles.css`, baseline-spec text, production data, APIs, webhooks, feature flags, or third-party integrations.

### Phase 2: TC-1 Characterization-Test Strengthening
- [ ] Add the comment annotation `@pmc-criterion master:use-case:route-leads-to-best-rep` to the existing TC-1 test for `bmb_aRD9TxRgCruJ`.
- [ ] Strengthen the TC-1 setup to exercise inbound leads, partner referrals, and event-sourced opportunities using the routing inputs named by the criterion: account, geography, segment, product interest, and source rules.
- [ ] Strengthen TC-1 observable-outcome assertions to verify that each applicable lead is routed to the most appropriate representative under the configured account, geography, segment, product interest, and source rules.
- [ ] Add TC-1 assertions for the permitted preferred-representative path: when the preferred rep is available and has capacity, the lead retains that preferred-rep assignment and clear ownership.
- [ ] Add TC-1 assertions for the unavailable/full contrast: when the preferred rep is unavailable or full, the lead overflows to the next-best rep or SDR pool rather than remaining assigned to the unavailable/full preferred rep.
- [ ] Assert persisted assignment state, rendered routing outcome, response payload, or emitted routing event at the selected outermost stable seam so TC-1 verifies observable ownership and overflow outcomes rather than internal `leadRouter.js` calls.
- [ ] Deliberately break each TC-1 asserted routing outcome during local protection verification—appropriate-representative selection, preferred-rep assignment, and unavailable/full overflow—and confirm the strengthened existing test fails for every break.

### Phase 3: TC-2 Characterization-Test Strengthening
- [ ] Add the comment annotation `@pmc-criterion master:business-rule:copilot-pocs-prioritize-alex-rivera` to the existing TC-2 test for `bmb_TJKIzmg_E3WC`.
- [ ] Strengthen TC-2 setup with a Copilot Studio POC request and an Alex Rivera capacity state that represents Alex Rivera having capacity.
- [ ] Add TC-2 observable-outcome assertions that a Copilot Studio POC request is assigned to Alex Rivera while Alex Rivera has capacity.
- [ ] Strengthen TC-2 with the required otherwise case: configure Alex Rivera without capacity and assert that the Copilot Studio POC request is assigned to Casey Kim or Quinn Torres as backups.
- [ ] Assert the Copilot Studio POC assignment through the selected outermost stable seam, using observable persisted assignment state, response output, page/view outcome, or emitted event rather than internal collaborator mocks.
- [ ] Deliberately break the Alex Rivera priority outcome and the Casey Kim/Quinn Torres backup outcome during local protection verification, and confirm the strengthened existing test fails for both breaks.

### Phase 4: Regression and Remediation Validation
- [ ] Run the repository’s existing suite with the strengthened TC-1 and TC-2 characterization tests included, confirming existing tests still pass unchanged and no existing test has been weakened.
- [ ] Verify that exactly the two Section 17 ratified criteria have declared test bindings: `master:use-case:route-leads-to-best-rep` for TC-1 and `master:business-rule:copilot-pocs-prioritize-alex-rivera` for TC-2; do not add or combine provisional criteria.
- [ ] Review the diff to confirm every modified file is test-only, every strengthened test carries its required `@pmc-criterion` comment, and no production file modification would trigger the remediation approval check.
- [ ] Submit the test-only pull request for the follow-up protection check, with completion contingent on both strengthened tests failing when their deliberately broken behaviors are rechecked.

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
