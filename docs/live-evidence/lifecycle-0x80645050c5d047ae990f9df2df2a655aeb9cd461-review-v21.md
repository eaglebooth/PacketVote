# PacketVote actual lifecycle

Contract: 0x80645050c5d047Ae990f9df2DF2A655aEb9Cd461

Source SHA-256: e71ae96a172f9f447fb98fc82b85c4fd902b826b8284d4418c6c35cc1d12e3cb

Status: core lifecycle completed; expiry recovery: verified.

| Step | Explorer | Finality | Consensus | Execution expectation |
|---|---|---|---|---|
| fundraising-create | [tx](https://explorer-studio.genlayer.com/transactions/0xf4d3aa437df41d1c8d1391b48eac2ca72e5da0f37d0a6c60b62e17c85ff17181) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0x4ab1cc9981c3198c69529d3aa62e64eebabe19fde7b9c14aa956bace30b6bb41) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0x6243dd8490ea081cc46c788bb88a98033247f16d08ce83870f098b62d2015d75) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-wrong-proposer | [tx](https://explorer-studio.genlayer.com/transactions/0x891beaa81058fae7c636181a189d5e25568ab0d08a73ca846e83a410d0b30b0c) | FINALIZED | MAJORITY_AGREE | PROPOSER_ONLY |
| fundraising-compile | [tx](https://explorer-studio.genlayer.com/transactions/0x7448a67dbcb877bcb79478ede6db5158ac61efd4d71aa3ca77f39bad5bc220cd) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-compile-retry | [tx](https://explorer-studio.genlayer.com/transactions/0x43d3ac3d829e4bd6dc4a053383175c7c0cf23a047fe767020b31916a752cef82) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-open | [tx](https://explorer-studio.genlayer.com/transactions/0x5722fdf5529d509e81e4fffecc66177d324e7613b73c5ded94314a57c102d937) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-partial-denied | [tx](https://explorer-studio.genlayer.com/transactions/0xad68057cf2865a2564d1ff29bcfd68084aeec3645f3ebc77f6fb20a4bd39f64a) | FINALIZED | MAJORITY_AGREE | INVALID_PACKET_CHOICES |
| fundraising-wrong-plan | [tx](https://explorer-studio.genlayer.com/transactions/0x36033c564505b6ff2e8eff90cf74bfef5980ae7c0b0e6145a3d682d6506f19ea) | FINALIZED | MAJORITY_AGREE | PLAN_DIGEST_MISMATCH |
| fundraising-vote-a | [tx](https://explorer-studio.genlayer.com/transactions/0xb5f0b2a8aad1714acb6fbd9fd4228d15fff157db3882b75fbe3d635df74c77ca) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-early-finalize-denied | [tx](https://explorer-studio.genlayer.com/transactions/0x219bebd2fbf98af5583a0f62e235c8b8eb3f82804257d58376f9452367f19806) | FINALIZED | MAJORITY_AGREE | VOTES_INCOMPLETE |
| fundraising-replay-denied | [tx](https://explorer-studio.genlayer.com/transactions/0x1b1fbfc6717dd4ddd929d4f44783ff15362f123cc958e7509420ec77f26b047e) | FINALIZED | MAJORITY_AGREE | VOTE_REPLAY |
| fundraising-vote-b | [tx](https://explorer-studio.genlayer.com/transactions/0x6ba9d632938b39effefd1b3a48f8301b49c7b35b39dbde657f5391f54a14a0f8) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-finalize | [tx](https://explorer-studio.genlayer.com/transactions/0x2fd1d42e2299480f3ba92ac0239ac98a6cd5afd6ad94cb6de28c568e64b4e46f) | FINALIZED | MAJORITY_AGREE | expected success |
| fundraising-terminal-denied | [tx](https://explorer-studio.genlayer.com/transactions/0xcbd4d9a8a7aa0e160484e92ab1502e32c8ec36c58afd7315bb2955e1394ad9a0) | FINALIZED | MAJORITY_AGREE | BALLOT_NOT_ACTIVE |
| inseparable-create | [tx](https://explorer-studio.genlayer.com/transactions/0x45f70e1675b8a7c7ca75bb2b3a2fef33e6b7fb0e4f4a340cffdb3b400f18f401) | FINALIZED | MAJORITY_AGREE | expected success |
| inseparable-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0x8b12fb3ee8a3298f3ff23e648ee51d2e79b2b030dd910099180bf0c9ee03dcdf) | FINALIZED | MAJORITY_AGREE | expected success |
| inseparable-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0x295dd5f469cecdcb0e2485a370912be2a5e5a56a4b3665804f29130880a3cf41) | FINALIZED | MAJORITY_AGREE | expected success |
| inseparable-wrong-proposer | [tx](https://explorer-studio.genlayer.com/transactions/0xe000f97bce83d2da67873255495d1ea813fdee67a8516ac20f2f4fff7b4f822e) | FINALIZED | MAJORITY_AGREE | PROPOSER_ONLY |
| inseparable-compile | [tx](https://explorer-studio.genlayer.com/transactions/0x2ea8986028bed1cbc4e9d9fbfcfa165673306e6f549842d23d728e044524c481) | FINALIZED | MAJORITY_AGREE | expected success |
| inseparable-open-denied | [tx](https://explorer-studio.genlayer.com/transactions/0x50952b02caa46c89246af9c5c67575bba839c2f5ad4e9cdcc256b59d17f17744) | FINALIZED | MAJORITY_AGREE | PLAN_NOT_READY |
| expiry-create | [tx](https://explorer-studio.genlayer.com/transactions/0x67a0c0cffb1737b39042a8eb4978eeaf13e63cc3d89c3663a8baedd0e44b7e8c) | FINALIZED | MAJORITY_AGREE | expected success |
| expiry-consent-a | [tx](https://explorer-studio.genlayer.com/transactions/0xa8ce9e44312950c5eb3c8fc08deb5581816d14cbeb5f3d2205d8e4f82f3c0668) | FINALIZED | MAJORITY_AGREE | expected success |
| expiry-consent-b | [tx](https://explorer-studio.genlayer.com/transactions/0xf85f7803365590524de6aeea01d160f4fb428e45e537f7c33e3edae7722355d6) | FINALIZED | MAJORITY_AGREE | expected success |
| expiry-compile | [tx](https://explorer-studio.genlayer.com/transactions/0xc39d98992881206d6675c26d954d6aefff04b05d54350d634c24e23fbfc82d73) | FINALIZED | MAJORITY_AGREE | expected success |
| expiry-open | [tx](https://explorer-studio.genlayer.com/transactions/0xc0c9ddb3a9486ba6d831262db1e9baf6b2c2a3621649d7cc0cd3eeef896c7843) | FINALIZED | MAJORITY_AGREE | expected success |
| expiry-vote-a-only | [tx](https://explorer-studio.genlayer.com/transactions/0x0a70883c49589dffe8d5e46b8515ac4e89e09b31f3f4e612046a04fe467f69ef) | FINALIZED | MAJORITY_AGREE | expected success |
| expiry-finalize | [tx](https://explorer-studio.genlayer.com/transactions/0x5f5ad98b1a2039340e7533f5a4213d3a0089a41d21f2c0c243b46b1eb304b32a) | FINALIZED | MAJORITY_AGREE | expected success |

Raw receipts/readbacks: [JSON](lifecycle-0x80645050c5d047ae990f9df2df2a655aeb9cd461-review-v21.json).

FINALIZED/MAJORITY_AGREE alone is not business success. No semantic verdict is supplied by this script.
