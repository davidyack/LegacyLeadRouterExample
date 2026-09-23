# Train — 3 approved changes, one pull request

This kit bundles the starter kits of the approved changes below. All of
them belong in ONE branch and ONE pull request from this run — none may
be split into a separate PR. Work them in order; where they touch the
same files, later changes build on earlier ones.

1. Harden Balance Territory Coverage (balance-territory-coverage#1) — kit under `changes/01-harden-balance-territory-coverage-balanc/`
2. Harden Guide Timely Lead Follow-Up (guide-timely-lead-follow-up#1) — kit under `changes/02-harden-guide-timely-lead-follow-up-guide/`
3. Harden Route Leads to Best Rep (route-leads-to-best-rep#1) — kit under `changes/03-harden-route-leads-to-best-rep-route-lea/`

Each folder carries that change's own CLAUDE.md / SPEC.md / BUILD_PLAN.md
and acceptance criteria.

ALL OR NOTHING. Every change above must land in this one pull request.
If any of them cannot be delivered, STOP and report the failure rather
than opening a partial pull request: each change here is an approved,
release-scheduled item, and one that silently did not land would be
marked complete on merge without its work existing. Never half-apply a
change, and never drop one to get the rest through.