# Build Plan

## Overview

Build plan for **Route Leads to Best Rep — harden test surface (route-leads-to-best-rep#1)**.

### Tech Stack

- **Deployment**: GitHub Actions

## Implementation Tasks

### Phase 1: Test Foundation and Seam Selection
- [ ] Inspect the existing test harness and identify the outermost stable seam that can exercise the `Route Leads to Best Rep` behavior through `index.html` and observable routing outcomes, without instantiating internal classes or mocking `leadRouter.js` collaborators.
- [ ] Preserve the test-only scope for `Harden test surface — Route Leads to Best Rep (route-leads-to-best-rep#1)`: add tests only, touch no production files including `index.html`, `leadRouter.js`, and `styles.css`, and do not modify the `Route Leads to Best Rep (current promoted version)` baseline text.
- [ ] Establish test fixtures through the selected stable seam for inbound leads, partner referrals, and event-sourced opportunities, including account, geography, segment, product interest, source, representative availability, and representative capacity conditions needed by TC-1 and TC-2.
- [ ] Add a test comment documenting the selected outermost stable seam for each new characterization test; if no stable seam can reach a behavior, document in that test why an internal seam is required.

### Phase 2: TC-1 Route Leads to Best Rep Characterization Coverage
- [ ] Add a TC-1 characterization test with the exact binding annotation comment `@pmc-criterion master:use-case:route-leads-to-best-rep`.
- [ ] Through the selected outermost stable seam, characterize routing of an inbound lead to the most appropriate representative using the existing account, geography, segment, product interest, and source rules, and assert only on observable ownership/routing outcomes.
- [ ] Characterize the TC-1 permitted overflow outcome: when the preferred representative is unavailable or full, verify that the lead is routed to the existing next-best representative or SDR pool outcome that preserves response-time and ownership behavior.
- [ ] Characterize the TC-1 contrasting non-overflow outcome: when the preferred representative is available and has capacity, verify that the lead remains assigned to that preferred representative rather than being overflowed to the next-best representative or SDR pool.
- [ ] Cover partner referrals and event-sourced opportunities through the same TC-1 routing contract where the stable seam exposes those source types, asserting the current observable representative-selection behavior without asserting internal `leadRouter.js` calls.

### Phase 3: TC-2 Copilot Studio POC Assignment Characterization Coverage
- [ ] Add a TC-2 characterization test with the exact binding annotation comment `@pmc-criterion master:business-rule:copilot-pocs-prioritize-alex-rivera`.
- [ ] Through the selected outermost stable seam, characterize the permitted `Copilot Studio POC` assignment outcome: assign a `Copilot Studio POC` request to `Alex Rivera` while `Alex Rivera` has capacity.
- [ ] Characterize the TC-2 contrasting backup outcome: when `Alex Rivera` does not have capacity, verify that the `Copilot Studio POC` request is assigned to `Casey Kim` or `Quinn Torres` according to the current observable behavior.
- [ ] Ensure the TC-2 tests assert persisted assignment, rendered ownership, emitted events, or other externally observable outcomes rather than internal `leadRouter.js` implementation details.

### Phase 4: Regression and Protection Verification
- [ ] Run the repository’s existing suite unchanged together with the additive TC-1 and TC-2 characterization tests, ensuring no existing test is weakened.
- [ ] Perform the required deliberate-break validation for TC-1: temporarily break the pinned `Route Leads to Best Rep` routing or overflow behavior and confirm the TC-1 characterization coverage fails.
- [ ] Perform the required deliberate-break validation for TC-2: temporarily break `Copilot Studio POC` prioritization of `Alex Rivera` or its `Casey Kim`/`Quinn Torres` backup behavior and confirm the TC-2 characterization coverage fails.
- [ ] Verify that both Section 17 criteria have declared bindings through their `@pmc-criterion` comments, covering the population of `2 ratified and 0 provisional` criteria.
- [ ] Review the final diff to confirm it contains only additive characterization tests and test comments, with no production-code, data-migration, API/interface, webhook, third-party integration, feature-flag, rollout, or deployment changes.

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
