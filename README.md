# PacketVote — Dependency-Preserving Ballot Packing

Contract-only GenLayer prototype. A declared group freezes two to four exact
clauses and its voter roster. Code enumerates every unordered two-packet partition.
GenLayer evaluates each proper packet selection against the whole source, asking
whether rejecting the other packet drops a material condition, exception or duty.
Only a partition with both selections SAFE can open a whole-packet ballot.

The final effect is an internal adopted-rulebook record containing the exact
original clauses of winning packets. It does not execute treasury calls, grant
actual external NFT rights or prove that a real DAO authorized these declarations.
There is no frontend, custody, external data acquisition or deployer-only role.

## Status

Source implemented; local controlled-runtime tests, lint/validation and schema verified.
Current source is v0.2.1, policy v2, deployed by the user at
`0x80645050c5d047Ae990f9df2DF2A655aEb9Cd461`. Deployed source matches local bytes.
See [42 actual test transactions and independent readbacks](docs/LIVE_E2E_EVIDENCE.md)
and the separate [local verification record](docs/local-verification.json).
The observed matrix includes exact-clause adoption, inseparable-source blocking,
rejected invalid writes, missing-vote expiry, opposite-ballot rejection, and one
instruction-like source that remained safely unresolved with ballot opening denied.
The latter is a safety-only result, not successful adversarial semantic classification
or universal injection resistance. The happy sample needed one retry after an
invalid-schema model output; that failure is preserved.

Earlier v0.1.0/v0.2.0 failed runs remain documented in [historical live status](docs/LIVE_STATUS.md)
and [captured quote-bound regression](docs/REVISION_V21.md). They must not be
confused with the current deployment. Main wallet deploys only; two secondary wallets
performed the test workflow.
Any reviewer can create their own isolated group, with two to four consenting voters.

## Mechanism

1. `create_proposal(local_id, clauses_json, voters_json, deadline)` freezes exact
   source/roles/deadline; its digest binds policy, chain, contract and proposal ID.
2. Every voter calls `accept_source` with that exact digest.
3. Only the authenticated proposer calls `compile_partition`. Code supplies all
   canonical bipartitions (max seven) and both proper selections (max fourteen).
4. Leader judges the complete set; validators independently try to falsify SAFE
   results against the full source. Invalid shapes or missing checks cannot create
   a plan. Verbatim witnesses for UNSAFE must refer to selected and omitted clauses.
5. The first fully SAFE partition by canonical mask order becomes READY. This is
   not a claim of an optimal/maximally separated partition. If every candidate has
   an UNSAFE selection, state is terminal UNSPLITTABLE; otherwise unresolved results
   permit up to two accepted compilation attempts and cancellation/expiry.
6. Anyone may open the exact READY plan. Voters choose YES/NO/ABSTAIN for each of
   its two whole packets, bound to the plan digest. No clause-level vote API exists.
7. Anyone may finalize after all voters cast. Each winning packet requires a strict
   majority of the entire roster. Missing votes at expiry cause no adoption.

Full original adoption is the unchanged baseline; empty adoption has no effect.
Neither proves consistency or correctness of the original source. A complete,
timely ballot can be finalized after the deadline, but new votes cannot be cast at
or after it. Before voting the proposer may cancel; a voter cannot be silently
removed or have a consent/choice rewritten.

## Local build

```powershell
python -m pip install -r requirements-dev.txt
python scripts/verify.py
```

The harness calls production public methods, but replaces GenLayer storage/runtime
and supplies controlled leader/validator model outputs. It is not a full GenVM,
multi-validator or native transaction simulator. See [test resources](docs/TEST_RESOURCES.md),
[specification](docs/SPEC.md), [originality](docs/ORIGINALITY.md) and
[live verification guide](docs/LIVE_GUIDE.md).

## Runtime boundaries

Runner header is pinned by workspace rule. JSON-mode model output is validated
directly as an object, with serialized JSON accepted as a compatibility path; Python
dict repr is not treated as JSON. No model output writes an arbitrary state string.
Models return only fixed check IDs/verdicts and witnesses for UNSAFE; code expands
them into complete internal findings. Bounded diagnostic output is exposed as
untrusted data, never adopted text. Provider failures, invalid JSON/schema/coverage,
invalid witnesses and semantic uncertainty have distinct diagnostics. A provider
failure code describes the leader's reported call outcome, not independently
verified provider telemetry. Validator disagreement may still roll back the call.

Time derives from the transaction message's UTC datetime (whole-second precision),
not the machine clock. The current deployment exercised proposal creation, source
domain fields and real deadline expiry. Exhaustive calendar/edge-boundary tests
remain controlled-runtime tests. Caller arguments and SDK wall time cannot override
transaction time.

No claim of universal prompt-injection resistance, global originality, official DAO
authority, external execution or guaranteed steward acceptance is made.
