# Build Plan

## Overview

Build plan for **Protection tests: Assign Leads to Sales Owners**.

### Tech Stack

- **Platform**: Node.js
- **Agents**: Claude Code
- **Deployment**: GitHub Actions

## Implementation Tasks

### Phase 1: Test-Only Foundation and Stable-Seam Discovery
- [ ] Identify the outermost stable seam that reaches the lead-assignment behavior implemented in `leadRouter.js` for TC-1, TC-2, TC-3, TC-5, and TC-6; use an HTTP route, page/view, or public service/module API rather than instantiating internal classes or mocking internal collaborators.
- [ ] Identify the outermost stable seam that exposes the routing decision and backup-overflow explanation implemented across `leadRouter.js` and `index.html` for TC-4, asserting observable responses, persisted state, emitted events, or rendered output.
- [ ] Preserve the test-only scope for `assign-leads-to-sales-owners#1`: add characterization tests without modifying `leadRouter.js`, `index.html`, baseline-spec text, production code, data migrations, APIs, webhooks, feature flags, or third-party integrations.
- [ ] Where no outermost stable seam can reach a Section 17 behavior, add a comment on the affected test explaining why an internal seam is required, in accordance with the stable-seam requirement.

### Phase 2: Capacity and Segment Characterization Tests
- [ ] Add a characterization test for TC-1 with the comment annotation `@pmc-criterion master:business-rule:capacity-remains-a-soft-ceiling`, proving that when no alternative representative has capacity, a lead may still be assigned to another representative in the same segment even when that representative is at capacity.
- [ ] Configure the TC-1 setup with a lead, a same-segment representative at capacity, and no alternative representative with capacity; invoke the identified stable seam and assert the observable assignment to the at-capacity same-segment representative.
- [ ] Add a characterization test for TC-2 with the comment annotation `@pmc-criterion master:business-rule:capacity-overflow-prefers-available-segment-reps`, proving that when a representative has reached their lead capacity, the lead is reassigned to another available representative in the same segment where possible.
- [ ] Configure the TC-2 setup with an initially selected representative at lead capacity and another available representative in the same segment; invoke the identified stable seam and assert the observable reassignment to the available same-segment representative.
- [ ] Deliberately break the capacity-soft-ceiling behavior pinned by TC-1 and verify the TC-1 characterization test fails.
- [ ] Deliberately break the available-same-segment overflow behavior pinned by TC-2 and verify the TC-2 characterization test fails.

### Phase 3: Specialized Routing and Lead-Segment Characterization Tests
- [ ] Add a characterization test for TC-3 with the comment annotation `@pmc-criterion master:business-rule:copilot-pocs-prefer-national-sme`, proving that Copilot Studio POC requests route first to the designated national SME when that representative has capacity.
- [ ] Add the TC-3 fallback case proving that Copilot Studio POC requests route to the designated backup representative when the designated national SME does not have capacity.
- [ ] Add a characterization test for TC-5 with the comment annotation `@pmc-criterion master:business-rule:lead-segments-follow-size-thresholds`, proving that leads with 1,000 or more employees are classified as Enterprise.
- [ ] Add the TC-5 ARR threshold case proving that leads with ARR above $10M are classified as Enterprise.
- [ ] Add the TC-5 Mid-Market employee threshold case proving that leads with 100 or more employees are classified as Mid-Market.
- [ ] Add the TC-5 Mid-Market ARR threshold case proving that leads with ARR of at least $1M are classified as Mid-Market.
- [ ] Add the TC-5 fallback case proving that leads not meeting the Enterprise or Mid-Market thresholds are classified as SMB.
- [ ] Deliberately break the designated national SME preference and designated backup representative fallback behavior pinned by TC-3 and verify the TC-3 characterization coverage fails.
- [ ] Deliberately break the Enterprise, Mid-Market, or SMB size-threshold classification behavior pinned by TC-5 and verify the TC-5 characterization coverage fails.

### Phase 4: Sales-Owner Decision and Executive-Referral Characterization Tests
- [ ] Add a characterization test for TC-4 with the comment annotation `@pmc-criterion master:use-case:assign-leads-to-sales-owners`, exercising the stable seam that routes an incoming lead to the right sales owner based on named accounts, territory, segment, product interest, source, and current rep capacity.
- [ ] In the TC-4 characterization coverage, assert the observable routing decision explanation for the selected sales owner rather than internal `leadRouter.js` calls.
- [ ] Add the TC-4 overflow case in which current rep capacity causes routing to a backup representative, and assert that the observable output shows the backup-representative overflow explanation.
- [ ] Add a characterization test for TC-6 with the comment annotation `@pmc-criterion master:business-rule:executive-referrals-route-to-avery-johnson`, proving that Executive referrals are routed to Avery Johnson.
- [ ] In the TC-6 test, assert the observable escalation for VP Sales direct engagement in addition to the assignment to Avery Johnson.
- [ ] Deliberately break named-account, territory, segment, product-interest, source, current-rep-capacity, routing-explanation, or backup-overflow behavior pinned by TC-4 and verify the TC-4 characterization coverage fails.
- [ ] Deliberately break either Executive-referral routing to Avery Johnson or VP Sales direct-engagement escalation and verify the TC-6 characterization test fails.

### Phase 5: Regression and Protection Validation
- [ ] Run the repository’s existing regression suite unchanged, confirming the new Section 17 characterization tests are additive and no existing test has been weakened.
- [ ] Verify that all 6 ratified criteria—`bmb_67o5nNGEQRxI`, `bmb_6fVlZjDHSPKy`, `bmb_7McJXVOTdZLx`, `bmb_Gp7_st99tmQ6`, `bmb_UPhtUQpci8Mt`, and `bmb_Yj6avbbHbCFh`—have at least one test carrying their exact `@pmc-criterion` binding annotation.
- [ ] Confirm the protection check records the six Section 17 bindings as DECLARED rather than inferred through the test comments.
- [ ] Review the final diff to confirm it touches only test files and contains no production-file changes to `leadRouter.js`, `index.html`, or any other production code.

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
