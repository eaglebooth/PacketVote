# PacketVote v0.2.1 live evidence

Verified: 2026-10-27T09:19:54.976Z

Contract: [0x80645050c5d047Ae990f9df2DF2A655aEb9Cd461](https://explorer-studio.genlayer.com/contracts/0x80645050c5d047Ae990f9df2DF2A655aEb9Cd461)

Source parity SHA-256: `e71ae96a172f9f447fb98fc82b85c4fd902b826b8284d4418c6c35cc1d12e3cb`. Two authorized secondary accounts signed; the main account did not participate in these test calls.

| Case | Independent readback |
|---|---|
| Happy path | ADOPTED; exact original clauses 0,1; meeting-minutes packet not adopted |
| Inseparable source | UNSPLITTABLE; opening denied; no adoption |
| Missing vote at actual deadline | EXPIRED; one ballot only; no adoption |
| Instruction-like adversarial source | UNRESOLVED; opening denied; no adoption; safety-only result |
| Opposing ballots | REJECTED; YES counts [1,1]; no strict majority or adoption |

Malformed packet choices, stale plan, wrong proposer, early finalize, replay and terminal re-finalize were rejected with unchanged proposal snapshots.

The happy source's first compile returned INVALID_SCHEMA; its accepted retry produced READY. Adversarial attempts remained unresolved with invalid witnesses. These failures are preserved. This demonstrates one observed fail-closed adversarial control, not semantic robustness or universal prompt-injection resistance.

This is contract-only: no frontend/UI consistency test exists. Model results were obtained through actual GenLayer calls; no fixture verdict was injected into a live transaction. Local controlled tests remain a separate evidence layer.

Independent final-state readback: [JSON](live-evidence/independent-0x80645050c5d047ae990f9df2df2a655aeb9cd461-1793092818116.json).
Core receipts/readbacks: [JSON](live-evidence/lifecycle-0x80645050c5d047ae990f9df2df2a655aeb9cd461-review-v21.json). Append-only events: [core](live-evidence/lifecycle-0x80645050c5d047ae990f9df2df2a655aeb9cd461-review-v21.events.jsonl), [adversarial](live-evidence/audit-0x80645050c5d047ae990f9df2df2a655aeb9cd461-v21.jsonl), [conflict](live-evidence/conflict-0x80645050c5d047ae990f9df2df2a655aeb9cd461-v21.jsonl).

## All 42 actual test transactions

FINALIZED/MAJORITY_AGREE alone does not establish successful business execution; expected errors and unresolved semantic attempts are included explicitly.

| Suite / step | Explorer | Finality / consensus | Execution expectation |
|---|---|---|---|
| lifecycle / fundraising-create | [tx](https://explorer-studio.genlayer.com/transactions/0xf4d3aa437df41d1c8d1391b48eac2ca72e5da0f37d0a6c60b62e17c85ff17181) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0x4ab1cc9981c3198c69529d3aa62e64eebabe19fde7b9c14aa956bace30b6bb41) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0x6243dd8490ea081cc46c788bb88a98033247f16d08ce83870f098b62d2015d75) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-wrong-proposer | [tx](https://explorer-studio.genlayer.com/transactions/0x891beaa81058fae7c636181a189d5e25568ab0d08a73ca846e83a410d0b30b0c) | FINALIZED / MAJORITY_AGREE | PROPOSER_ONLY |
| lifecycle / fundraising-compile | [tx](https://explorer-studio.genlayer.com/transactions/0x7448a67dbcb877bcb79478ede6db5158ac61efd4d71aa3ca77f39bad5bc220cd) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-compile-retry | [tx](https://explorer-studio.genlayer.com/transactions/0x43d3ac3d829e4bd6dc4a053383175c7c0cf23a047fe767020b31916a752cef82) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-open | [tx](https://explorer-studio.genlayer.com/transactions/0x5722fdf5529d509e81e4fffecc66177d324e7613b73c5ded94314a57c102d937) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-partial-denied | [tx](https://explorer-studio.genlayer.com/transactions/0xad68057cf2865a2564d1ff29bcfd68084aeec3645f3ebc77f6fb20a4bd39f64a) | FINALIZED / MAJORITY_AGREE | INVALID_PACKET_CHOICES |
| lifecycle / fundraising-wrong-plan | [tx](https://explorer-studio.genlayer.com/transactions/0x36033c564505b6ff2e8eff90cf74bfef5980ae7c0b0e6145a3d682d6506f19ea) | FINALIZED / MAJORITY_AGREE | PLAN_DIGEST_MISMATCH |
| lifecycle / fundraising-vote-a | [tx](https://explorer-studio.genlayer.com/transactions/0xb5f0b2a8aad1714acb6fbd9fd4228d15fff157db3882b75fbe3d635df74c77ca) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-early-finalize-denied | [tx](https://explorer-studio.genlayer.com/transactions/0x219bebd2fbf98af5583a0f62e235c8b8eb3f82804257d58376f9452367f19806) | FINALIZED / MAJORITY_AGREE | VOTES_INCOMPLETE |
| lifecycle / fundraising-replay-denied | [tx](https://explorer-studio.genlayer.com/transactions/0x1b1fbfc6717dd4ddd929d4f44783ff15362f123cc958e7509420ec77f26b047e) | FINALIZED / MAJORITY_AGREE | VOTE_REPLAY |
| lifecycle / fundraising-vote-b | [tx](https://explorer-studio.genlayer.com/transactions/0x6ba9d632938b39effefd1b3a48f8301b49c7b35b39dbde657f5391f54a14a0f8) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-finalize | [tx](https://explorer-studio.genlayer.com/transactions/0x2fd1d42e2299480f3ba92ac0239ac98a6cd5afd6ad94cb6de28c568e64b4e46f) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / fundraising-terminal-denied | [tx](https://explorer-studio.genlayer.com/transactions/0xcbd4d9a8a7aa0e160484e92ab1502e32c8ec36c58afd7315bb2955e1394ad9a0) | FINALIZED / MAJORITY_AGREE | BALLOT_NOT_ACTIVE |
| lifecycle / inseparable-create | [tx](https://explorer-studio.genlayer.com/transactions/0x45f70e1675b8a7c7ca75bb2b3a2fef33e6b7fb0e4f4a340cffdb3b400f18f401) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / inseparable-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0x8b12fb3ee8a3298f3ff23e648ee51d2e79b2b030dd910099180bf0c9ee03dcdf) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / inseparable-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0x295dd5f469cecdcb0e2485a370912be2a5e5a56a4b3665804f29130880a3cf41) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / inseparable-wrong-proposer | [tx](https://explorer-studio.genlayer.com/transactions/0xe000f97bce83d2da67873255495d1ea813fdee67a8516ac20f2f4fff7b4f822e) | FINALIZED / MAJORITY_AGREE | PROPOSER_ONLY |
| lifecycle / inseparable-compile | [tx](https://explorer-studio.genlayer.com/transactions/0x2ea8986028bed1cbc4e9d9fbfcfa165673306e6f549842d23d728e044524c481) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / inseparable-open-denied | [tx](https://explorer-studio.genlayer.com/transactions/0x50952b02caa46c89246af9c5c67575bba839c2f5ad4e9cdcc256b59d17f17744) | FINALIZED / MAJORITY_AGREE | PLAN_NOT_READY |
| lifecycle / expiry-create | [tx](https://explorer-studio.genlayer.com/transactions/0x67a0c0cffb1737b39042a8eb4978eeaf13e63cc3d89c3663a8baedd0e44b7e8c) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / expiry-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0xa8ce9e44312950c5eb3c8fc08deb5581816d14cbeb5f3d2205d8e4f82f3c0668) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / expiry-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0xf85f7803365590524de6aeea01d160f4fb428e45e537f7c33e3edae7722355d6) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / expiry-compile | [tx](https://explorer-studio.genlayer.com/transactions/0xc39d98992881206d6675c26d954d6aefff04b05d54350d634c24e23fbfc82d73) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / expiry-open | [tx](https://explorer-studio.genlayer.com/transactions/0xc0c9ddb3a9486ba6d831262db1e9baf6b2c2a3621649d7cc0cd3eeef896c7843) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / expiry-vote-a-only | [tx](https://explorer-studio.genlayer.com/transactions/0x0a70883c49589dffe8d5e46b8515ac4e89e09b31f3f4e612046a04fe467f69ef) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| lifecycle / expiry-finalize | [tx](https://explorer-studio.genlayer.com/transactions/0x5f5ad98b1a2039340e7533f5a4213d3a0089a41d21f2c0c243b46b1eb304b32a) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| adversarial / audit-create | [tx](https://explorer-studio.genlayer.com/transactions/0x7a319b83d837e1e94125e7c273db38b83753edd87cf0c378b927bafe8c70f695) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| adversarial / audit-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0xdcc28954c101061c06d4a2e10da2efcbb355249fcfadb8559a83a3ae7c71c04f) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| adversarial / audit-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0xf6336f77f9dffc0ef2ea65d423c984fbc81a1bf74a16b90303c72e461b68b0b5) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| adversarial / audit-compile | [tx](https://explorer-studio.genlayer.com/transactions/0x14ac5624120130d66a014f202e96d499298924be614004abecd6d5b2afcb679c) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| adversarial / audit-compile-retry | [tx](https://explorer-studio.genlayer.com/transactions/0x54c547f0ac53268997550906e16251abf9f4c0e9b5a023b03a9fc939b7a7ca51) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| adversarial / audit-open-denied | [tx](https://explorer-studio.genlayer.com/transactions/0x3f71cdf48177698e7599c3d64179dc471a493e60795e3f5f6704a5416bbb8ad9) | FINALIZED / MAJORITY_AGREE | PLAN_NOT_READY |
| conflict / audit-create | [tx](https://explorer-studio.genlayer.com/transactions/0xede03bf3cd94930a9ffb922ffc22c9b319ad269f0f592ce18bf837940be895a8) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| conflict / audit-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0xba93b83af295f69d67aaa1bba69673242b5bf506d24f81b74e21236dd42831ea) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| conflict / audit-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0x37ee2a6e3c40aec3c4abe3b386b07bd10472ea9512e7ed31fbdab43ff5d839e7) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| conflict / audit-compile | [tx](https://explorer-studio.genlayer.com/transactions/0x489485eb8b11d59b5fae0476be0ce417f8fdf730dcb93d0aba165c68966ed1d5) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| conflict / audit-open | [tx](https://explorer-studio.genlayer.com/transactions/0x2244be268220e5ac686b11f77a711b1eeb30da2a9a017281c565c1f89512762b) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| conflict / audit-vote-a | [tx](https://explorer-studio.genlayer.com/transactions/0xd0f6986fe355ae00c11590aabc6cb85808a539be8bd0a35a171c4a931147a7df) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| conflict / audit-vote-b | [tx](https://explorer-studio.genlayer.com/transactions/0xf91e7b042c4f406cb996e924f3634b56fbb8c73dc0a0702e20f2bf6d2cb5d09c) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
| conflict / audit-finalize | [tx](https://explorer-studio.genlayer.com/transactions/0xa81cbb4291bfa6630a2c6a2028aa65b2e997e58a9c6cafc4b35370403ac46d5e) | FINALIZED / MAJORITY_AGREE | successful execution; inspect business readback |
