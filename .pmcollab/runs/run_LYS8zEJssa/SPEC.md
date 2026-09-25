# Change Specification: Protection tests — Assign Leads to Sales Owners (assign-leads-to-sales-owners#1)

These are **characterization tests**: they pin what the code does today, including any defects. A passing suite afterwards means the behavior has not drifted — not that the behavior is correct.

This batch is **test-only**. Do not change production code: a diff that touches it fails the remediation approval check and the batch is returned rather than merged.

**Enter at the outermost stable seam.** Exercise each behavior through the most external interface that can reach it — an HTTP route, a page/view, a public service or module API — and assert on observable outcomes (responses, persisted state, emitted events), not on internal calls. Do not instantiate internal classes or mock internal collaborators when a stable seam can drive the same behavior; mock only true externals (network, clock, third-party services). A test written this way stays valid if the implementation behind the seam is replaced, so the suite doubles as the acceptance contract for any future re-implementation. Drop to an internal seam only when no stable one can reach the behavior, and say so in a comment on the test.

## Change Header

| Field | Value |
|-------|-------|
| Title | Protection tests — Assign Leads to Sales Owners (assign-leads-to-sales-owners#1) |
| Target Spec Document | Assign Leads to Sales Owners (current promoted version) |
| Baseline Version | current |
| Baseline Section Range | n/a — test-surface change only |
| Change Type | code_align — characterization tests |
| Source | Codebase Preparation Journey remediation batch `assign-leads-to-sales-owners#1` (UC-102 §14.2) |
| Priority | Risk-ranked by the remediation plan |

### Problem / Opportunity

6 criteria of "Assign Leads to Sales Owners" have no proven test protection — nothing
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
| 1 | 17. Affected Test Surface | MODIFIED | Characterization tests | Add: one characterization test per unprotected criterion (6 row(s)) |

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

#### TC-1 — `bmb_67o5nNGEQRxI`

**Behavior under test:** If no alternative representative has capacity, a lead may still be assigned to another representative in the same segment even when that representative is at capacity.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:capacity-remains-a-soft-ceiling`

#### TC-2 — `bmb_6fVlZjDHSPKy`

**Behavior under test:** When a representative has reached their lead capacity, leads are reassigned to another available representative in the same segment where possible.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:capacity-overflow-prefers-available-segment-reps`

#### TC-3 — `bmb_7McJXVOTdZLx`

**Behavior under test:** Copilot Studio POC requests are routed first to the designated national SME when that representative has capacity, otherwise to a designated backup representative.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:copilot-pocs-prefer-national-sme`

#### TC-4 — `bmb_Gp7_st99tmQ6`

**Behavior under test:** Sales operations can route incoming leads to the right sales owner based on named accounts, territory, segment, product interest, source, and current rep capacity. The product also explains the routing decision and shows when leads overflow to a backup representative.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:use-case:assign-leads-to-sales-owners`

#### TC-5 — `bmb_UPhtUQpci8Mt`

**Behavior under test:** Leads are classified as Enterprise at 1,000 or more employees or ARR above $10M, Mid-Market at 100 or more employees or ARR of at least $1M, and SMB otherwise.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:lead-segments-follow-size-thresholds`

#### TC-6 — `bmb_Yj6avbbHbCFh`

**Behavior under test:** Executive referrals are routed to Avery Johnson and escalated for VP Sales direct engagement.

- **Protection today:** not measured — Not enough evidence from a protection check to judge — treat the existing coverage as unproven.
- **Annotation to add:** `@pmc-criterion master:business-rule:executive-referrals-route-to-avery-johnson`

Put each spec's annotation in a comment on the test you write for it. It is what lets the next scan
record the binding as DECLARED rather than inferred — the test says which criterion it protects
instead of the platform guessing from names and paths, and a declared binding survives a rename
that would break an inferred one. The annotation is stripped before a test's identity is hashed, so
adding it never makes an existing test look like a new one.

**Population:** 6 ratified and 0 provisional
criteria. These are reported separately and never added together — a ratified criterion is a human's
stated intent, a provisional one is the platform's own reading of the code.

**Where these behaviors live today** — a navigation aid for the test author — not part of the behavioral contract above:

- TC-1: `leadRouter.js`
- TC-2: `leadRouter.js`
- TC-3: `leadRouter.js`
- TC-4: `leadRouter.js`, `index.html`
- TC-5: `leadRouter.js`
- TC-6: `leadRouter.js`

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
