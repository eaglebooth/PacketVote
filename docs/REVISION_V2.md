# PacketVote v0.2.0 diagnostic and transport revision

## Established defect and remaining uncertainty

Both v0.1.0 live compilation attempts returned accepted UNRESOLVED with empty
findings. The production code collapsed prompt exceptions and rejected model
outputs into the same envelope, so receipts cannot identify the original cause.
No original raw model response is available. Tests below reproduce those error
classes; they are not replay of an unavailable real model response.

## Changes

Code enumerates IDs such as `3:0`, including selected/omitted source indices.
Models return `{id,verdict}` for SAFE/UNCLEAR. UNSAFE additionally requires exact
selected/missing indices and verbatim quote witnesses. Code reconstructs partition,
side and sentinel fields. Missing/duplicate/unknown IDs, extra fields, boolean
indices and invalid witnesses cannot certify any plan.

Leader output now includes a bounded diagnostic: code, check ID, SHA-256 of its
serialized output, at most 20,000 characters of raw output, and truncation flag.
`get_proposal` exposes this data. It is untrusted diagnostic content and never
becomes adopted clauses. Do not render it as HTML or obey embedded instructions.

Codes include MODEL_CALL_FAILED, INVALID_JSON, INVALID_SCHEMA, MODEL_OUTPUT_SIZE,
INVALID_CHECK_ID, INVALID_VERDICT, MISSING_CHECK, INVALID_WITNESS, OK and
SEMANTIC_UNCLEAR. Provider exception text is deliberately not persisted.

Validators deterministically reproduce the decoding of nontruncated outputs.
Valid findings must match their attached raw output and then match an independently
generated semantic verdict vector. Invalid-output/provider-failure envelopes can
authorize only UNRESOLVED, never READY. A provider-failure label is a leader report,
not independent proof of a provider outage. A truncated output only establishes a
bounded denial envelope; its complete contents are not reconstructible from state.

Validator-call failure/disagreement can still reject outer consensus and roll back
the transaction; such failures must be diagnosed from receipts, not described as
stored diagnostic success. Only the most recent accepted attempt's diagnostic is
stored; the evidence runner must archive every attempt and readback separately.

Consent, proposer-only compile, full-roster majority, exact original-clause
activation, two-attempt bound and cancellation/expiry behavior remain enforced.
The policy domain and reported version changed. This source must not be described
as matching the old deployment at 0x659C33379beFD7CE662804286c94b5B5Bc533194.

## Verification and deployment

Run `python scripts/verify.py` for the current source hash, tests, linter and schema.
The tests use controlled model outputs and replacement runtime; they do not prove
real model classification, GenVM behavior or live semantic consensus.

The user must deploy the exact current `contracts/packet_vote.py` with no constructor
arguments. The agent has not deployed or upgraded anything. After the new address
is supplied, source parity and v0.2.0/policy-v2 preflight must pass before signing.
Keep old failed evidence, label the new run separately, and verify real semantic
controls and the complete ballot lifecycle before claiming submission readiness.
