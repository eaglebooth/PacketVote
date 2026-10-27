# User deployment and live verification gate

Current v0.2.1 was user-deployed at `0x80645050c5d047Ae990f9df2DF2A655aEb9Cd461`.
See LIVE_E2E_EVIDENCE.md for the actual run and its scope. Prior v0.1.0/v0.2.0
failed runs remain in LIVE_STATUS.md and REVISION_V21.md. Source for review is
`contracts/packet_vote.py`, with the two exact pinned runner header lines. Only the
user's main wallet deploys; it has no workflow privilege and is not used by tests.

1. Verify local tests/lint/schema and read the documented limitations.
2. Reviewers can use the current verified deployment and create their own isolated
   proposal with consenting voters. For an intentionally new deployment, only the
   user's main wallet deploys with no constructor arguments and supplies its address.
   Do not upgrade an unrelated prior project's deployment.
3. Preflight reads exact getContractCode bytes and get_version on StudioNet, then
   checks the pinned policy before any signing. Record deployment tx separately.
4. Secondary test A creates the fundraising proposal, with A/B as electorate and
   a realistic future deadline. Both accept its exact source digest. The proposer
   compiles using actual GenLayer model output, not a fixture injected into runtime.
5. If actual semantic result is READY, read packets and verify they are [[0,1],[2]].
   Do not silently treat an unexpected safe split as the planned happy path. Bind
   all further writes to the actual source/plan readback.
6. Open ballot, send negative writes with before/after snapshots, then both A/B vote
   YES/NO for whole packets. Permissionless finalize activates only clauses0,1.
7. Independently repeat readback: clause0 cannot be activated without clause1; all
   adopted bytes must exactly match original source. Replay/terminal writes fail.
8. Create the separate inseparable sample and run actual semantic compilation.
   Its negative result must not authorize ballot opening or any adopted text.
9. Exercise a missed-vote expiry/recovery using actual transaction time. Do not
   call host-clock advancement a live test; record the wait and exact boundary.
10. Archive role/method/args/hash/finality/leader-execution/consensus/pre-post state,
    and link every transaction in Markdown. Freeze the submission address only
    after the relevant real positive and negative matrix passes.

No main-wallet funds, existing Arbitrum activity, external explorer parsing or
frontend wallet popup is required. Test signing can use the authorized secondary
CLI-keychain accounts in memory, never printed or stored in the repository.
