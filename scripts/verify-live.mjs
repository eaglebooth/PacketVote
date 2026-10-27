// Independent read-only verification and consolidated evidence index.
import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
const address=process.env.PACKETVOTE_CONTRACT;
if(!/^0x[0-9a-fA-F]{40}$/.test(address||''))throw Error('Missing contract');
const client=()=>createClient({chain:studionet});
const read=async(functionName,args=[])=>JSON.parse(String(await client().readContract({address,functionName,args,transactionHashVariant:'latest-final'})));
const check=(x,m)=>{if(!x)throw Error(m)};
const sha=x=>createHash('sha256').update(x).digest('hex');
const local=readFileSync('contracts/packet_vote.py');
const remote=Buffer.from(await client().getContractCode(address),'utf8');
check(local.equals(remote),'Source mismatch');
const version=await read('get_version');check(version.version==='0.2.1','Version mismatch');
const owner='0xeb57bc7125fa60d7482ce12058397369ab3581f8';
const other='0x2da5393d7bbb9a037dc3abb56dbbc5c150fc843f';
const result={checked_at:new Date().toISOString(),address,chain_id:studionet.id,source_sha256:sha(local),deployed_sha256:sha(remote),version,cases:{}};
const expected={fundraising:'ADOPTED',inseparable:'UNSPLITTABLE',expiry:'EXPIRED',audit:'UNRESOLVED',conflict:'REJECTED'};
const raw=JSON.parse(readFileSync('samples/fundraising.json')).clauses;
for(const [name,state] of Object.entries(expected)){
 const suffix=['audit','conflict'].includes(name)?`${name}-v21`:`${name}-review-v21`;
 const id=`${owner}:${suffix}`;
 const p=await read('get_proposal',[id]),adopted=await read('get_adopted',[id]);
 const votes=await Promise.all([owner,other].map(a=>read('get_vote',[id,a])));
 check(p.state===state,`${name}: unexpected state ${p.state}`);
 check(p.owner===owner&&same(p.voters,[other,owner].sort())&&p.consent_count===2,`${name}: source roles mismatch`);
 if(name==='fundraising')check(same(p.packets,[[0,1],[2]])&&same(p.adopted_indices,[0,1])&&adopted.active&&same(adopted.clauses,raw.slice(0,2))&&same(votes,[["YES","NO"],["YES","NO"]]),'Happy activation mismatch');
 else check(!adopted.active&&adopted.clauses.length===0&&p.adopted_indices.length===0,`${name}: unexpected activation`);
 if(name==='conflict')check(same(p.yes,[1,1])&&same(votes,[["YES","NO"],["NO","YES"]]),'Conflict majority mismatch');
 if(name==='expiry')check(p.vote_count===1&&same(votes,[["YES","YES"],[]]),'Expiry vote mismatch');
 result.cases[name]={proposal:p,adopted,votes};
}
const lower=address.toLowerCase();
const base=`docs/live-evidence/lifecycle-${lower}-review-v21`;
const lifecycle=JSON.parse(readFileSync(base+'.json'));
const events=name=>readFileSync(`docs/live-evidence/${name}-${lower}-v21.jsonl`,'utf8').trim().split('\n').map(JSON.parse);
const audit=events('audit'),conflict=events('conflict');
check(lifecycle.completed_at&&lifecycle.expiry_completed_at,'Lifecycle completion missing');
check(audit.some(e=>e.event==='safety-only')&&conflict.some(e=>e.event==='completed'),'Audit/conflict evidence incomplete');
const steps=lifecycle.steps.map(s=>({suite:'lifecycle',label:s.label,hash:s.hash,error:s.expected_error,tx:s.transaction}));
for(const [suite,items] of [['adversarial',audit],['conflict',conflict]]){
 for(const s of items.filter(e=>e.event==='submitted')){
  const intent=items.find(e=>e.event==='intent'&&e.label===s.label);
  const receipt=items.filter(e=>e.event==='receipt'&&e.label===s.label).at(-1);
  check(items.some(e=>e.event==='verified'&&e.label===s.label),`${suite}/${s.label}: not verified`);
  steps.push({suite,label:s.label,hash:s.hash,error:intent.input.error,tx:receipt.transaction});
 }
}
for(const s of steps)check(s.tx.statusName==='FINALIZED'&&s.tx.result_name==='MAJORITY_AGREE',`${s.label}: finality missing`);
result.transaction_count=steps.length;
result.transaction_hashes=steps.map(s=>s.hash);
const output=`docs/live-evidence/independent-${lower}-${Date.now()}.json`;
writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
const rows=steps.map(s=>`| ${s.suite} / ${s.label} | [tx](https://explorer-studio.genlayer.com/transactions/${s.hash}) | ${s.tx.statusName} / ${s.tx.result_name} | ${s.error||'successful execution; inspect business readback'} |`).join('\n');
writeFileSync('docs/LIVE_E2E_EVIDENCE.md',`# PacketVote v0.2.1 live evidence\n\nVerified: ${result.checked_at}\n\nContract: [${address}](https://explorer-studio.genlayer.com/contracts/${address})\n\nSource parity SHA-256: \`${sha(local)}\`. Two authorized secondary accounts signed; the main account did not participate in these test calls.\n\n| Case | Independent readback |\n|---|---|\n| Happy path | ADOPTED; exact original clauses 0,1; meeting-minutes packet not adopted |\n| Inseparable source | UNSPLITTABLE; opening denied; no adoption |\n| Missing vote at actual deadline | EXPIRED; one ballot only; no adoption |\n| Instruction-like adversarial source | UNRESOLVED; opening denied; no adoption; safety-only result |\n| Opposing ballots | REJECTED; YES counts [1,1]; no strict majority or adoption |\n\nMalformed packet choices, stale plan, wrong proposer, early finalize, replay and terminal re-finalize were rejected with unchanged proposal snapshots.\n\nThe happy source's first compile returned INVALID_SCHEMA; its accepted retry produced READY. Adversarial attempts remained unresolved with invalid witnesses. These failures are preserved. This demonstrates one observed fail-closed adversarial control, not semantic robustness or universal prompt-injection resistance.\n\nThis is contract-only: no frontend/UI consistency test exists. Model results were obtained through actual GenLayer calls; no fixture verdict was injected into a live transaction. Local controlled tests remain a separate evidence layer.\n\nIndependent final-state readback: [JSON](${output.replace('docs/','')}).\nCore receipts/readbacks: [JSON](live-evidence/lifecycle-${lower}-review-v21.json). Append-only events: [core](live-evidence/lifecycle-${lower}-review-v21.events.jsonl), [adversarial](live-evidence/audit-${lower}-v21.jsonl), [conflict](live-evidence/conflict-${lower}-v21.jsonl).\n\n## All ${steps.length} actual test transactions\n\nFINALIZED/MAJORITY_AGREE alone does not establish successful business execution; expected errors and unresolved semantic attempts are included explicitly.\n\n| Suite / step | Explorer | Finality / consensus | Execution expectation |\n|---|---|---|---|\n${rows}\n`);
console.log(JSON.stringify({verified:true,transaction_count:steps.length,readback:output,states:Object.fromEntries(Object.entries(result.cases).map(([k,v])=>[k,v.proposal.state]))}));
