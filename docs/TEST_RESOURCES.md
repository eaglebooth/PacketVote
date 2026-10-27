# Test resources and evidence boundary

The product's ground truth is a sender-authenticated onchain declaration, not a
claim about the objective truth of an external event. Therefore no explorer, GitHub
artifact, private API, pre-existing Arbitrum transaction or historical token balance
is required to establish the source text being analyzed.

`samples/fundraising.json` and `samples/inseparable.json` are explicitly synthetic
group declarations. They are not official DAO texts, receipts or authentic external
permissions. Their expected outcomes are controlled test oracles; they are not
recorded live LLM decisions. Sample SHA-256 values must be recomputed in the release
verification manifest before submission, and exact source/plan IDs must appear in
each actual lifecycle record.

The direct harness imports `contracts/packet_vote.py`, exercises its production
entrypoints and compares consequential state before/after rejected operations. It
does not substitute a separate business-logic model. GenLayer decorators/storage,
clock and leader/validator execution are controlled. JSON-mode fixtures default to
dict objects matching the SDK's eager decoding, with string/malformed controls.
Leader and independent validator can receive different outputs to prove rejection
of a plausible but unsafe classification.
Existing explicit semantic matrices are converted to the new compact transport
in the fixture layer, retaining malformed fields in negative controls. Additional
tests feed the compact protocol directly, verify distinct diagnostic codes,
JSON object/string equivalence, coverage/witness rejection, forged diagnostic
rejection and safe retry replacement. The unavailable v0.1.0 raw model output is
not represented as a captured fixture; no exact live-root-cause reproduction is claimed.

Required live samples:

- Fundraising text: an authorization and its limits remain in one packet, while the
  independent meeting-minutes clause can be selected separately.
- Inseparable text: the only two-packet split drops a restriction, so no ballot opens.
- Injection controls: append evaluator instructions to a source clause; actual
  semantic behavior is not promised by a blacklist or preselected mock verdict.
- SDK negative writes: wrong digest, wrong role, partial choice shape, replay and
  missing-vote early finalize, each with complete no-mutation readbacks.

Live semantic disagreement/malformed provider output cannot be forced through
ordinary public arguments. Record these as direct/harness-only unless observed
in real consensus. Do not generate fake hashes, screenshots or positive verdicts
to fill gaps. No private keys or API credentials belong in resources/evidence.

External OpenZeppelin docs in the concept research are application context only;
they are not proof that PacketVote governs an external protocol.
