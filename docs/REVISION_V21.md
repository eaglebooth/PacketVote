# v0.2.1: exact full-clause quote witnesses

Update: the user subsequently deployed v0.2.1 at
`0x80645050c5d047Ae990f9df2DF2A655aEb9Cd461`. See
[current live evidence](LIVE_E2E_EVIDENCE.md). The correction history below predates
that deployment; its pending-verification statements describe that earlier point.

User-deployed v0.2.0 at `0xf3787004699057F0Af02f281653DBba5C5dD3005`
matched source SHA-256 `6b981225ad59647f5c2eba3ed4ece65d70e72978eb5e0ee304554d4f11eaf638`.
Creation and both source consents succeeded. Unauthorized compilation failed with
PROPOSER_ONLY without a state change. Both authorized attempts finalized with
UNRESOLVED / INVALID_WITNESS at check `1:0`.

The diagnostic raw model output included the complete original restriction clause
as its missing_quote. It is 124 characters, exceeding the 100-character cap. Both exact substring and
packet-side membership are correct; the old parser's length cap rejected it.

## Reproduction and narrow fix

`tests/fixtures/v2-real-model-output.json` is the actual leader output from the first
v0.2.0 compilation, extracted from the recorded diagnostic. A regression expecting
successful decoding failed with INVALID_WITNESS on v0.2.0, then passed after the
length change. This replays decoding, not live independent semantic consensus.

Both quote lengths now allow 4..MAX_CLAUSE_CHARS (400). The full existing source
clause bound is unchanged. Exact source substring, integer-index type, opposite
packet-side membership, complete coverage, raw-output reproduction and independent
validator assessment are all retained. The model prompt reflects this bound.
No invalid quote is cropped or rewritten, no verdict is changed, and no unsafe
selection is defaulted to SAFE.

An independent review confirmed the fixture matches both actual compilation
outputs and found no blocker in this narrow fix (87 tests at review time).
Primary final verification additionally covered length boundaries 3,4,100,101,400,
401: 93 tests passed, alongside linter validation and schema generation.

Version is 0.2.1; policy remains v2 because the semantic obligation is unchanged.
Source commitments bind chain, contract and source. A fresh deployment must pass
byte-for-byte parity and version checks. No deployment/upgrade has been performed
by the agent. The current two attempted proposals have exhausted their retry bound.

## Actual transactions

| Step | Explorer |
|---|---|
| Create | [tx](https://explorer-studio.genlayer.com/transactions/0xe4b4db76ddc7e9a7c5cb769e54f3799381e971de8b61bf191a1108299e18e72b) |
| Consent A | [tx](https://explorer-studio.genlayer.com/transactions/0x2e1a379906f6402a6dc17e2d5c3331c029f543aa38aafc550607823baf194713) |
| Consent B | [tx](https://explorer-studio.genlayer.com/transactions/0xfe3bed6818cb284ec642f26bf20824819a45cbc4793eb3dbe6aa3f63b2780b01) |
| Wrong proposer | [tx](https://explorer-studio.genlayer.com/transactions/0xcb925c1720d40acb985ea99f7303ae0a227494577e5e9e13cc7957249e3e45cb) |
| Compile | [tx](https://explorer-studio.genlayer.com/transactions/0xcab03173f3380f27324747573c3c5d594a17f8784e53dc0dc22c52bcad8946e1) |
| Retry | [tx](https://explorer-studio.genlayer.com/transactions/0x2fd059c3df5da260acf443a28f74fca12dc2a1aca54cee18eabbc22f7c0faa43) |

[Lifecycle receipts/readbacks](live-evidence/lifecycle-0xf3787004699057f0af02f281653dbba5c5dd3005-review-v2.json)
and [append-only events](live-evidence/lifecycle-0xf3787004699057f0af02f281653dbba5c5dd3005-review-v2.events.jsonl)
remain preserved. Happy-path adoption, negative semantic control, adversarial
classification, conflict and expiry lifecycle are still not verified live.
