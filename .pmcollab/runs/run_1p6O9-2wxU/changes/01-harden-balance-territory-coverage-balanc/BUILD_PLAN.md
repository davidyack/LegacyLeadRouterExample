# Build Plan

## Overview

Build plan for **Balance Territory Coverage — harden test surface (balance-territory-coverage#1)**.

### Tech Stack

- **Deployment**: GitHub Actions

## Implementation Tasks

### Phase 1: Test-Only Foundation
- [ ] Verify the `balance-territory-coverage#1` diff is limited to additive characterization tests for Section 17 and does not modify `leadRouter.js`, `index.html`, `styles.css`, baseline specification text, production data, APIs, webhooks, or third-party integrations.
- [ ] Identify the outermost stable seam for the `leadRouter.js` behaviors covered by TC-1 and TC-3, using a public service/module API, HTTP route, page/view, or other external interface that exposes observable routing and lead-segment outcomes; document an internal-seam exception in the test only if no stable seam can reach the behavior.
- [ ] Identify the outermost stable seam for the TC-2 sales-operations team view spanning `leadRouter.js`, `index.html`, and `styles.css`, so the test can assert the rendered or otherwise observable team-view content without instantiating internal classes or mocking internal collaborators.

### Phase 2: Characterization Tests — Executive Referral Routing
- [ ] Add a characterization test for TC-1, `bmb_e_O9SGVZ3Vot`, with the comment annotation `@pmc-criterion master:business-rule:executive-referrals-go-to-avery`.
- [ ] Drive an executive referral through the identified outermost stable seam and assert the observable outcome that the referral is assigned to `Avery Johnson`.
- [ ] Assert through observable persisted state, response data, rendered output, or emitted events that the executive referral is escalated for `VP Sales` direct engagement.
- [ ] Deliberately break the executive-referral assignment or `VP Sales` escalation behavior in a protection-check workflow and verify the TC-1 characterization test fails, then restore the unchanged production implementation.

### Phase 3: Characterization Tests — Sales Operations Team View
- [ ] Add a characterization test for TC-2, `bmb_PKO7Pv4DWm07`, with the comment annotation `@pmc-criterion master:use-case:balance-territory-coverage`.
- [ ] Exercise the sales-operations team view through its outermost stable page/view seam and assert that each representative’s `territory`, `segment`, `product focus`, `configured capacity`, and `current routing load` are available together in one team view.
- [ ] Seed or otherwise establish representative and routing data through supported external setup paths so the TC-2 test demonstrates the team view used for `capacity planning`, `territory oversight`, and fair distribution of leads across the sales team.
- [ ] Assert TC-2 against observable page/view output rather than internal calls in `leadRouter.js`, `index.html`, or `styles.css`.
- [ ] Deliberately remove or alter one required representative attribute or routing-load outcome in a protection-check workflow and verify the TC-2 characterization test fails, then restore the unchanged production implementation.

### Phase 4: Characterization Tests — Lead Segment Thresholds
- [ ] Add a characterization test for TC-3, `bmb_zjwI1dzbe_z2`, with the comment annotation `@pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment`.
- [ ] Exercise lead classification through the identified outermost stable seam and assert that a lead with `1,000 or more employees` is classified as `Enterprise`.
- [ ] Exercise lead classification through the identified outermost stable seam and assert that a lead with `ARR above $10M` is classified as `Enterprise`.
- [ ] Assert that a non-Enterprise lead with `100 or more employees` is classified as `Mid-Market`.
- [ ] Assert that a non-Enterprise lead with `ARR of at least $1M` is classified as `Mid-Market`.
- [ ] Assert that a lead that is neither `Enterprise` nor `Mid-Market` is classified as `SMB`.
- [ ] Cover the stated threshold boundaries, including `1,000` employees, `$10M` ARR not qualifying as “above $10M” unless another Enterprise condition applies, `100` employees, and `$1M` ARR.
- [ ] Deliberately break each pinned `Enterprise`, `Mid-Market`, or `SMB` classification branch in a protection-check workflow and verify the TC-3 characterization coverage fails, then restore the unchanged production implementation.

### Phase 5: Regression and Approval Validation
- [ ] Run the repository’s existing regression suite unchanged alongside the new TC-1, TC-2, and TC-3 characterization tests; do not weaken any existing test.
- [ ] Verify every new characterization test contains its exact `@pmc-criterion` annotation comment so all 3 ratified criteria are recorded as `DECLARED` bindings: `master:business-rule:executive-referrals-go-to-avery`, `master:use-case:balance-territory-coverage`, and `master:business-rule:enterprise-thresholds-determine-lead-segment`.
- [ ] Confirm each Section 17 row has at least one bound test and that the protection check demonstrates each test fails when its pinned behavior is deliberately broken.
- [ ] Confirm the final diff contains no production-code changes and can be rolled back by reverting the test-only pull request.

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
