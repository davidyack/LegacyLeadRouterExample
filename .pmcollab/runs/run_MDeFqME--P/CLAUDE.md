# CI Establishment — Work Item Brief

This work item implements an approved change to the repository's continuous-integration configuration. There is no product spec for this work — do not go looking for one. PROPOSAL.md is the approved plan; implement it, do not re-derive it.

Hard rules:

- **Only CI/workflow/config files change.** Never modify application code, never write new tests, never delete or weaken an existing test to make a gate pass. If a suite is red, it is baselined by name per the plan — a failing test is surfaced, not silenced.
- **Green on day one.** The delivered pipeline must pass on the current state of the repository. Pre-existing failures named in the plan are excluded from the blocking gate and listed visibly (a baseline file or an allow-list in the workflow), never silently skipped.
- **Coverage ratchet floor = MEASURE, never guess.** Where the plan includes the coverage ratchet, run the repository's own coverage tooling first, record the measured number as the initial floor in a checked-in baseline file, and wire the gate to fail below the floor and raise it when a merge lands higher, holding at the plan's target. If coverage cannot actually be measured, deliver without the ratchet and say so in the PR description.
- **Secrets by name only.** Reference environment variables and secrets by NAME in workflow files; never inline a value, and never copy a value into the PR or its description.
- **Pin what the plan pins.** Install from the committed lockfile with the strict command; pin runtime versions in the workflow where the plan says to.
- **Stay inside the plan.** Anything the proposal's exclusions list rules out stays out, even if it looks easy.

Deliverable: one pull request implementing PROPOSAL.md, with a description that lists what runs on which trigger, the measured initial coverage floor (when applicable), and anything baselined by name.

<!-- pmcollab:repo-stack -->

## Tech Stack

Recorded deployment profile: **Detected stack — SA Test 1** — GitHub Actions.

This work is built against that profile. A different stack is a change to the profile, not a choice to make here.

<!-- pmcollab:governance -->
## Ubiquitous Language (this product's words)

This organization has decided what these things are called. Use these words in code you write, in comments, in commit messages, in PR descriptions and in any user-facing string.

- Use "Policy-Based Lead Assignment" for as used in davidyack/LegacyLeadRouterExample [provisional].

Renaming an existing identifier is NOT part of this — these words govern new code and prose. If existing code uses a different word, leave it and say so in the PR.

If you need a word this list does not govern, use `TERMINOLOGY.md` for the full definitions, and declare any domain term you had to invent so it can be reviewed.

Injected 1 of 1 governed terms (complete).


## Code Factory Guidelines

[Engineering Target Baseline — Production]
Standing rules that apply to this product because its Engineering Target is "Production". They are the floor, not the ceiling: any organization, product, or certification rule below may tighten them, and a more specific rule wins over this baseline where the two genuinely conflict.

- Business logic carries unit tests; every external-service boundary carries an integration test.
- Handle errors explicitly. A swallowed exception or an empty catch block is a defect, not a style choice.
- Validate input at trust boundaries and never log secrets, credentials, or personal data.
- Schema and data migrations are reversible, and ship separately from the code that depends on them.

