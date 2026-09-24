# Build Plan

1. Read PROPOSAL.md end to end. The plan is approved; you are implementing it, not redesigning it.
2. Reproduce the repository's install + fast checks locally (strict lockfile install, typecheck/lint where they exist) so you know the day-one state.
3. Where the ratchet applies: run coverage, record the measured floor in a checked-in baseline file.
4. Add/update exactly the files the plan names. Baseline any pre-existing failures by name.
5. Prove the pipeline green on the current repository state before opening the PR.
6. Open one pull request; describe what runs on which trigger, the measured floor, and everything baselined.
