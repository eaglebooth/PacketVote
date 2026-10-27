# Historical PacketVote v0.1.0 live verification status

For the current v0.2.1 deployment and completed observed matrix, see
[LIVE_E2E_EVIDENCE.md](LIVE_E2E_EVIDENCE.md). This file preserves earlier failures.

Contract: `0x659C33379beFD7CE662804286c94b5B5Bc533194`

Source parity was verified byte for byte. Source SHA-256:
`6e3e28cd4ae90f38599c4331b2e74ea5797c67f1a267c66bc844741621a9a2f0`.

Five real transactions were finalized with accepted consensus during the first execution:

| Step | Transaction | Observed business result |
|---|---|---|
| Create | [Explorer](https://explorer-studio.genlayer.com/transactions/0xc385b2d3c05c6180083f7cea5c7e371f131697c3920297388c8abd4b165cc83f) | Proposal created |
| Consent A | [Explorer](https://explorer-studio.genlayer.com/transactions/0x5cfc7f3637b060b3296b2ed8d2303e2f0a8981bb57e6a373e39a989b9eb6d8d0) | Consent recorded |
| Consent B | [Explorer](https://explorer-studio.genlayer.com/transactions/0x8c28ed2d60eb97c2124cd833c862af6d1b1bdf80a8ade9d625a942100f75bd39) | Consent recorded |
| Unauthorized compile | [Explorer](https://explorer-studio.genlayer.com/transactions/0x99e5ad285e3699b68ec546330c55e67839c63209d2594e2ceb873f81d8d229ed) | Expected PROPOSER_ONLY error |
| Authorized compile | [Explorer](https://explorer-studio.genlayer.com/transactions/0xc74fb5154e035ea1dbee42016c959297e16dbe93926e15d02e6ec6a45817136e) | UNRESOLVED; empty findings; no plan/adoption |

The happy-path oracle stopped the original run. Empty findings do not identify
whether model execution failed or parsing rejected an output: the deployed code
collapses both into the same unresolved envelope. No positive semantic verdict,
ballot lifecycle, conflict suite or adversarial suite has passed live.

## Evidence integrity incident

Resuming initially failed because JSON omitted an undefined proposal ID. After
normalizing the resume key, the harness incorrectly overwrote historical `after`
snapshots with the current UNRESOLVED proposal, producing a false mutation alarm.
The journal now explicitly labels recovered snapshots taken from the already
recorded next-step `before` snapshot, and retains the later reads separately as
`resume_observation`. These are reconstructed records, not untouched original
post-state evidence. Existing receipt data and hashes remain available in the JSON.

The harness now skips already verified steps. However, automated approval review
rejected the next irreversible retry because the evidence workflow had been
modified. No retry transaction was sent after that rejection. Further signing
requires explicit user confirmation and a separate append-only retry evidence file;
the current journal must be retained with this disclosure.

No deployment or upgrade was performed by the agent. This is an incomplete live
run and is not submission-ready evidence of the complete functional matrix.

## Explicitly authorized retry

The user subsequently confirmed the remaining retry. A separate script used an
exclusive-create, append-only JSONL file and did not edit the prior journal.
Preflight rechecked exact deployed source, proposer identity, remaining attempt
and deadline before signing.

[Retry transaction](https://explorer-studio.genlayer.com/transactions/0xec9a8a3991f0abc9b95a3cc4ecc0403c90fbf814ed2269d84294685f52aae208)
finalized with MAJORITY_AGREE. Independent readback recorded UNRESOLVED, attempts=2,
empty findings, empty packets and no adopted clauses. The retry limit is exhausted
for this proposal. This is not a happy-path pass.

[Append-only retry evidence](live-evidence/compile-retry-authorized.jsonl) contains
the pre-state, signing intent, submitted hash, full finalized receipt and readback.
The earlier approval block was lifted for this explicitly confirmed action; no
further signing or deployment has been performed. Root cause remains unproven
because the deployed code collapses prompt exceptions and invalid model outputs
into the same empty-findings envelope. A diagnostic source change and a separately
user-deployed version would be needed if runtime diagnostics cannot be recovered.
