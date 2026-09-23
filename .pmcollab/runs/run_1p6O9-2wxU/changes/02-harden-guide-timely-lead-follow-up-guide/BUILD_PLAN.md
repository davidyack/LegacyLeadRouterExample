# Build Plan

## Overview

Build plan for **Guide Timely Lead Follow-Up — harden test surface (guide-timely-lead-follow-up#1)**.

### Tech Stack

- **Deployment**: GitHub Actions

## Implementation Tasks

### Phase 1: Test-Only Guardrails and Stable-Seam Discovery
- [ ] Confirm the `guide-timely-lead-follow-up#1` change remains test-only: add no production-code changes to `leadRouter.js` or `index.html`, make no baseline-spec edits, and add no data migration, API, webhook, third-party integration, feature flag, rollout, or deployment changes.
- [ ] Identify the outermost stable seam that reaches the TC-1 behavior currently implemented in `leadRouter.js`—prefer an HTTP route, page/view, or public `leadRouter.js` module API—and document a test comment only if no stable external seam can reach the routing behavior.
- [ ] Identify the outermost stable seam that reaches the TC-2 behavior currently implemented across `leadRouter.js` and `index.html`—prefer the routed-lead page/view and observable rendered content rather than internal collaborators.
- [ ] Configure characterization-test setup to assert observable outcomes only: routed-lead response values, persisted state, rendered `index.html` content, and emitted VP Sales notification events; mock only true externals such as clock, network, or third-party notification delivery.

### Phase 2: Lead-Response SLA Characterization Coverage
- [ ] Add the TC-1 characterization test with the required test comment annotation `@pmc-criterion master:business-rule:lead-response-slas-follow-segment`.
- [ ] Exercise TC-1 through the selected outermost stable seam and characterize partner-referral handling: partner acknowledgment is required within one business hour and lead contact is required within four business hours.
- [ ] Exercise TC-1 through the selected outermost stable seam and characterize executive-referral handling: lead contact is required the same day and a VP Sales notification is emitted as an observable outcome.
- [ ] Exercise TC-1 through the selected outermost stable seam and characterize segment-specific first-contact SLAs: Enterprise leads require contact within two business hours, Mid-Market leads within four business hours, and SMB leads within one business day.
- [ ] Use a controlled clock only where needed to make the TC-1 one-business-hour, two-business-hour, four-business-hour, same-day, and one-business-day deadlines deterministic without mocking `leadRouter.js` internal collaborators.
- [ ] Deliberately break each TC-1 SLA/notification outcome during protection verification and confirm the annotated TC-1 characterization test fails when partner acknowledgment, partner contact, executive same-day contact, VP Sales notification, Enterprise contact, Mid-Market contact, or SMB contact behavior drifts.

### Phase 3: Routed-Lead SLA and Escalation-Guidance UI Characterization Coverage
- [ ] Establish the shared layout system for the routed-lead UI test surface without modifying production files: use the existing app shell contract of top navigation plus content sharing one max width and gutters, the shared `PageHeader` contract, and the existing theme/design-token contract of one neutral palette, one accent, one spacing scale, and one type scale as the common composition baseline for `index.html` assertions.
- [ ] Add the TC-2 characterization test with the required test comment annotation `@pmc-criterion master:use-case:guide-timely-lead-follow-up`.
- [ ] Exercise the routed-lead page/view through `index.html` and assert that Sales teams can see the first-contact SLA associated with each routed lead based on its segment and source; compose the test’s page assertions with the shared app shell, `PageHeader`, and theme/design-token baseline rather than introducing separate width, header, or color expectations.
- [ ] Exercise the routed-lead page/view through `index.html` and assert that Sales teams can see the escalation guidance associated with each routed lead based on its segment and source; compose the test’s page assertions with the shared app shell, `PageHeader`, and theme/design-token baseline rather than introducing separate width, header, or color expectations.
- [ ] Supply routed-lead scenarios covering the segment and source combinations needed to prove that the visible first-contact SLA and escalation guidance are derived from the routed lead rather than being static `index.html` content.
- [ ] Deliberately break the TC-2 visible first-contact SLA and escalation-guidance behavior during protection verification and confirm the annotated TC-2 characterization test fails.

### Phase 4: Regression and Binding Verification
- [ ] Verify that both ratified Section 17 criteria have declared bindings: TC-1 bound to `master:business-rule:lead-response-slas-follow-segment` and TC-2 bound to `master:use-case:guide-timely-lead-follow-up`; do not report the 2 ratified criteria together with provisional criteria.
- [ ] Run the repository’s existing suite unchanged together with the additive TC-1 and TC-2 characterization tests, confirming no existing test has been weakened.
- [ ] Review the final diff to confirm every new test carries its required `@pmc-criterion` comment, each test uses its outermost stable seam or explains why it cannot, and no production file is touched.

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
