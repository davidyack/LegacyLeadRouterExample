# Approved CI Proposal (create)

No CI invocation of the repository's discovered test suite was observed. Add one pull-request workflow that uses a pinned Node.js runtime, installs dependencies reproducibly with the committed npm lockfile, and runs `npm run test`; this adds one routine PR check and no new tests. Coverage is not proposed because no coverage-capable repository tooling was identified.

## Test suites (assessed inventory)

| Working dir | Command | Framework | Run by CI today | Usable |
|---|---|---|---|---|
| . | `npm run test` |  | not_observed | yes |

## Files to add or update

- **add** `.github/workflows/test.yml` — Add a pull-request workflow pinned to Node.js 22 that runs `npm ci` and then `npm run test` from the repository root.

## Which suites run on which trigger

- `npm run test` → pull-request

## Coverage ratchet gate

- No ratchet: No repository coverage measurement command or coverage tool was identified in the supplied test profile..
