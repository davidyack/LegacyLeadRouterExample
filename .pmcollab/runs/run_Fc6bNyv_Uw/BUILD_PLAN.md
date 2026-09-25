# Build Plan

## Overview

Build plan for **Protection tests: Track Lead Follow-Up Expectations**.

### Tech Stack

- **Platform**: Node.js
- **Agents**: Claude Code
- **Deployment**: GitHub Actions

## Implementation Tasks

### Phase 1: Test-Surface Discovery and Guardrails
- [ ] Identify the outermost stable seam that reaches the follow-up expectation behavior in `leadRouter.js` for TC-1, TC-3, and TC-4; use an HTTP route, page/view, or public service/module API rather than instantiating internal classes or mocking internal collaborators.
- [ ] Identify the outermost stable seam connecting `leadRouter.js` and `index.html` for TC-2 so the test observes that Sales teams can see the expected follow-up deadline for a routed lead.
- [ ] Confirm the repository’s existing test conventions and test locations for `leadRouter.js` and `index.html`, while ensuring the implementation change is limited to additive characterization test files.
- [ ] Add a test-only change guard for this remediation batch: do not modify production code, baseline spec text, data, APIs, webhooks, third-party integrations, feature flags, or rollout behavior.
- [ ] Where business-hour, business-day, or same-day calculations depend on time, mock only the clock as a true external and keep assertions focused on observable responses, persisted state, rendered output, or emitted events.
- [ ] Add a comment in any test that must drop below an outermost stable seam because no stable HTTP route, page/view, or public API can reach the required behavior.

### Phase 2: Characterization Tests for Partner and Segment Follow-Up SLAs
- [ ] Add a characterization test for TC-1 — `bmb_0KqMN8Mw_1RG` — with the comment annotation `@pmc-criterion master:business-rule:partner-referrals-require-accelerated-response`.
- [ ] Drive TC-1 through the selected stable seam with a Partner referral and assert the observable follow-up expectations: acknowledgment within 1 business hour and first contact within 4 business hours.
- [ ] Add a characterization test for TC-3 — `bmb_Xeq4-rFpWPQ2` — with the comment annotation `@pmc-criterion master:business-rule:segment-based-follow-up-slas-apply`.
- [ ] Drive TC-3 through the selected stable seam and assert the observable first-contact deadline for an Enterprise lead is within 2 business hours.
- [ ] Extend the TC-3 characterization coverage through the same stable seam to assert the observable first-contact deadline for a Mid-Market lead is within 4 business hours.
- [ ] Extend the TC-3 characterization coverage through the same stable seam to assert the observable first-contact deadline for an SMB lead is within 1 business day.

### Phase 3: Characterization Test for Routed-Lead Deadline Visibility
- [ ] Add a characterization test for TC-2 — `bmb_0MD5gqHqchVh` — with the comment annotation `@pmc-criterion master:use-case:track-lead-follow-up-expectations`.
- [ ] Exercise the `leadRouter.js` and `index.html` user-facing flow through the selected page/view or public interface, using routed leads whose segment and referral source determine different expected follow-up deadlines.
- [ ] Assert that Sales teams can see the expected follow-up deadline for each routed lead based on its segment and referral source, using rendered page output or another externally observable outcome rather than assertions on internal calls.

### Phase 4: Characterization Test for Executive Referral Escalation
- [ ] Add a characterization test for TC-4 — `bmb_XhWQnTnjBEjH` — with the comment annotation `@pmc-criterion master:business-rule:executive-referrals-require-same-day-contact`.
- [ ] Drive TC-4 through the selected stable seam with an Executive referral and assert the observable same-day contact expectation.
- [ ] Assert through the same TC-4 flow that VP Sales notification is emitted or otherwise observably recorded, mocking only a true external notification provider if one is involved.

### Phase 5: Protection Validation and Regression
- [ ] Verify that each of the 4 ratified criteria in Section 17 has at least one characterization test carrying its exact `@pmc-criterion` binding annotation.
- [ ] Deliberately break the Partner referral acknowledgment or first-contact behavior and confirm the TC-1 test fails.
- [ ] Deliberately break routed-lead expected follow-up deadline visibility in the `leadRouter.js` / `index.html` flow and confirm the TC-2 test fails.
- [ ] Deliberately break an Enterprise, Mid-Market, or SMB first-contact SLA and confirm the TC-3 test fails.
- [ ] Deliberately break Executive referral same-day contact or VP Sales notification behavior and confirm the TC-4 test fails.
- [ ] Run the repository’s existing regression suite unchanged alongside the new characterization tests and confirm no existing test has been weakened.
- [ ] Review the final diff to confirm it touches no production file and contains only additive characterization tests for `track-lead-follow-up-expectations#1`.

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
