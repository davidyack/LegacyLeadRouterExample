# Change Specification: Protection tests — Track Lead Follow-Up Expectations (track-lead-follow-up-expectations#1)

These are **characterization tests**: they pin what the code does today, including any defects. A passing suite afterwards means the behavior has not drifted — not that the behavior is correct.

This batch is **test-only**. Do not change production code: a diff that touches it fails the remediation approval check and the batch is returned rather than merged.

**Enter at the outermost stable seam.** Exercise each behavior through the most external interface that can reach it — an HTTP route, a page/view, a public service or module API — and assert on observable outcomes (responses, persisted state, emitted events), not on internal calls. Do not instantiate internal classes or mock internal collaborators when a stable seam can drive the same behavior; mock only true externals (network, clock, third-party services). A test written this way stays valid if the implementation behind the seam is replaced, so the suite doubles as the acceptance contract for any future re-implementation. Drop to an internal seam only when no stable one can reach the behavior, and say so in a comment on the test.

## Change Header

| Field | Value |
|-------|-------|
| Title | Protection tests — Track Lead Follow-Up Expectations (track-lead-follow-up-expectations#1) |
| Target Spec Document | Track Lead Follow-Up Expectations (current promoted version) |
| Baseline Version | current |
| Baseline Section Range | n/a — test-surface change only |
| Change Type | code_align — characterization tests |
| Source | Codebase Preparation Journey remediation batch `track-lead-follow-up-expectations#1` (UC-102 §14.2) |
| Priority | Risk-ranked by the remediation plan |

### Problem / Opportunity

4 criteria of "Track Lead Follow-Up Expectations" have no proven test protection — nothing
would notice if their behavior changed. The behavior map lists each one below with the paths that
implement it.

### Desired Outcome

Every criterion in Section 17 has at least one test bound to its binding, and that test FAILS when
the behavior it pins is deliberately broken.

### Scope Boundary

- **In scope:** adding characterization tests for the criteria in Section 17, each carrying its
  binding annotation so the next scan records a declared binding.
- **Out of scope:** production code — a diff that touches it fails the remediation approval check
  and the batch is returned rather than merged. Also out of scope: changing the baseline spec's
  text; these tests pin behavior exactly as it stands.

## Change Summary Table

| # | Section | Delta Type | Element | Summary |
|---|---------|------------|---------|---------|
| 1 | 17. Affected Test Surface | MODIFIED | Characterization tests | Add: one characterization test per unprotected criterion (4 row(s)) |

*No baseline section deltas — this change adds tests only; the baseline spec's text is unchanged. The full test-surface delta is Section 17.*

### 16.1 Data Migration
No data migration required — this change adds tests only.

### 16.2 API / Interface Compatibility
None. No APIs, webhooks, or third-party integrations are touched.

### 16.3 Feature Flag / Rollout Strategy
None needed. Rollback: revert the test-only pull request. No production code or data is affected, and no user-facing behavior changes — the tests pin behavior exactly as it is today.

### 16.4 Deployment Sequence
Order does not matter — this change adds tests only.

## 17. Affected Test Surface

**Affected Test Surface — one test case spec per criterion.**

Each spec below is implementation-agnostic: the behavior statement is the contract. Derive the
test's **setup (Given)** from the statement's condition, its **action (When)** from what the
statement describes, and its **expected outcome (Then)** from what the statement asserts. A
statement that names a contrast ("only when …", "; otherwise …") needs BOTH cases — one test
proving the permitted outcome, one proving the refused one.

#### TC-1 — `bmb_0KqMN8Mw_1RG`

**Behavior under test:** Partner referrals require acknowledgment within 1 business hour and first contact within 4 business hours.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:partner-referrals-require-accelerated-response`

#### TC-2 — `bmb_0MD5gqHqchVh`

**Behavior under test:** Sales teams can see the expected follow-up deadline for a routed lead based on its segment and referral source. This helps teams prioritize outreach and stay aligned to service-level expectations.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:use-case:track-lead-follow-up-expectations`

#### TC-3 — `bmb_Xeq4-rFpWPQ2`

**Behavior under test:** Enterprise leads require first contact within 2 business hours, Mid-Market leads within 4 business hours, and SMB leads within 1 business day.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:segment-based-follow-up-slas-apply`

#### TC-4 — `bmb_XhWQnTnjBEjH`

**Behavior under test:** Executive referrals require same-day contact and VP Sales notification.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:executive-referrals-require-same-day-contact`

Put each spec's annotation in a comment on the test you write for it. It is what lets the next scan
record the binding as DECLARED rather than inferred — the test says which criterion it protects
instead of the platform guessing from names and paths, and a declared binding survives a rename
that would break an inferred one. The annotation is stripped before a test's identity is hashed, so
adding it never makes an existing test look like a new one.

**Population:** 4 ratified and 0 provisional
criteria. These are reported separately and never added together — a ratified criterion is a human's
stated intent, a provisional one is the platform's own reading of the code.

**Where these behaviors live today** — a navigation aid for the test author — not part of the behavioral contract above:

- TC-1: `leadRouter.js`
- TC-2: `leadRouter.js`, `index.html`
- TC-3: `leadRouter.js`
- TC-4: `leadRouter.js`

### 17.3 Regression Tests

The repository's existing suite must still pass unchanged — these tests are additive, and a diff
that weakens an existing test fails the approval check.

## Readiness Checklist

- [ ] Each row in Section 17 has at least one test bound to its binding
- [ ] Each test FAILS when the behavior it pins is deliberately broken — a merged pull request is
      not the completion signal; the batch goes back through a protection check, and a row whose
      test does not notice the break is returned rather than closed
- [ ] The diff touches no production file
- [ ] Every new test carries its `@pmc-criterion` annotation
- [ ] Each test enters at the outermost stable seam that reaches its behavior (or carries a comment
      saying why it could not)
