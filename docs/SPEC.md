# PacketVote specification / proof obligation

## Claim and authority

For the exact two-to-four-clause source accepted by every declared voter, the chosen
two-packet partition permits selective adoption without dropping a material
qualifier attached to a selected right or duty. A counterexample is a selected
clause losing scope because a clause in the other packet was rejected.

Evidence is the complete immutable contract record. The authority is only the
sender-authenticated, consenting group for this proposal. The proposer alone
cannot create an actionable ballot: all listed voters consent first, then each
vote is separately bound to the later partition digest. There is no bootstrap
claim that a namespace, address or text is an official outside DAO constitution.

## Bounded reasoning topology

The lowest source index always belongs to packet zero. For n clauses, masks with
that bit and at least one omitted clause enumerate every unordered bipartition:
1, 3 or 7 candidates for n=2,3,4. Each has exactly two nonempty proper selections.
All candidates, not a user-selected subset, are included. Source text and catalogue
are treated as data, not instructions.

Each model row binds a code-owned ID representing partition+side,
SAFE/UNSAFE/UNCLEAR and optional grounded
counterexample. Selected/missing witnesses must point to opposite packet sides and
quote actual source text. Quote equality is not required across models; the full
consequential partition/side/verdict vector must agree. The validator performs a
fresh full-source falsification task, not only schema checking. A malformed leader
result may agree only on a failed/unresolved attempt, never on a valid plan.
Version 0.2.0 stores bounded diagnostic evidence and uses compact model rows;
see [revision details](REVISION_V2.md) for exact codes and trust limits.

Code chooses the lowest canonical partition with SAFE on both sides. An UNCLEAR
elsewhere does not invalidate an independently SAFE chosen candidate. An explicit
UNSAFE in every candidate gives UNSPLITTABLE. If remaining candidates are only
uncertain, state is UNRESOLVED. Missing/extra/duplicate rows cannot default to SAFE.
The model cannot generate clause contents, recipients, actions or majority rules.

## Lifecycle and recovery

CONSENTING → COMPILABLE → READY → VOTING → ADOPTED / REJECTED.
Compilation may instead produce UNRESOLVED (max two accepted attempts) or terminal
UNSPLITTABLE. Any pre-voting state can be cancelled by the proposer. Any unfinished
state can expire after its sealed deadline without creating adoption, except a
fully cast ballot: it must be finalized rather than discarded through expiry.

No source editing, roster editing, plan replacement or ballot rewriting methods
exist. A changed document requires a new proposal and fresh consent/votes. Outer
GenLayer consensus failure may roll back the transaction, including attempt count;
do not claim a returned/accepted retry state without readback. The independent
expiry/cancel paths do not invoke model inference and preserve liveness.

Deadline must be 60 seconds to seven days after transaction time at creation.
Consent, compilation, ballot opening and voting require now < deadline; expiry
requires now >= deadline. Finalization before deadline requires every voter has
cast; after deadline a missing-vote ballot expires with no adopted text. Timely
complete ballots can finalize later, with no late votes admitted. Majority means
YES*2 > full roster size, including abstainers in the denominator. Anyone can
finalize; finalization is single-use and all terminal states reject mutation.

## Consequence and limitation

The only activation surface is `finalize`: it derives winning whole packets and
copies exactly their source indices/text into the internal adopted-rulebook view.
There is no public method accepting arbitrary adopted indices or replacement text.
`get_adopted` is active only for ADOPTED. This is real state enforcement of this
group's recorded ballot, not external treasury/governor/NFT enforcement. It does
not certify the baseline document's consistency, legality, completeness or justice.

The constructor assigns no owner/admin. Proposer ownership comes from each create
transaction; at least one other distinct voter is required. The source commitment
uses current chain and contract message fields, which must be verified on the
actual deployment before release readiness. There is no payable method or custody.

Creation quota is 32 proposals per authenticated proposer, not a finite global
quota an unrelated wallet can fill. This is a local storage bound, not Sybil
resistance. Writes never scan global history. Compilation currently requires exact
agreement on the full consequence vector, including rejected candidates; that is
conservative and may reduce live liveness when models disagree on irrelevant
alternatives. Such disagreement does not create adoption; cancel/expiry is available.
