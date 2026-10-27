// Never deploys. Actual GenLayer SDK transactions; no injected model verdicts.
import {createClient,createAccount} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {readFileSync,writeFileSync,appendFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {isDeepStrictEqual} from 'node:util';
const address=process.env.PACKETVOTE_CONTRACT;
if(!/^0x[0-9a-fA-F]{40}$/.test(address||''))throw Error('Set PACKETVOTE_CONTRACT to the user-deployed address');
const mode=process.argv[2]||'preflight';
if(!['preflight','lifecycle','expiry'].includes(mode))throw Error('Use preflight, lifecycle or expiry');
const sha=x=>createHash('sha256').update(x).digest('hex');
const local=readFileSync('contracts/packet_vote.py');
const fresh=()=>createClient({chain:studionet});
const read=async(functionName,args=[])=>JSON.parse(String(await fresh().readContract({address,functionName,args,transactionHashVariant:'latest-final'})));
const remote=Buffer.from(await fresh().getContractCode(address),'utf8');
const version=await read('get_version');
const preflight={checked_at:new Date().toISOString(),address,chain_id:studionet.id,source_sha256:sha(local),deployed_sha256:sha(remote),byte_for_byte:local.equals(remote),version};
mkdirSync('docs/live-evidence',{recursive:true});
writeFileSync(`docs/live-evidence/preflight-${address.toLowerCase()}.json`,JSON.stringify(preflight,null,2)+'\n');
if(!preflight.byte_for_byte||version.name!=='PacketVote'||version.version!=='0.2.1'||version.policy!=='packetvote/counterfactual-bipartition-v2')throw Error('Preflight mismatch; no signing');
console.log(`Source parity verified: ${sha(local)}`);
if(mode==='preflight')process.exit(0);
const entry=process.env.GENLAYER_CLI_ENTRY;
if(!entry)throw Error('Set GENLAYER_CLI_ENTRY for authorized OS-keychain test accounts');
const keytar=createRequire(entry)('keytar');
const secrets=await Promise.all(['dbl-owner','dbl-adapter'].map(n=>keytar.getPassword('genlayer-cli',`account:${n}`)));
if(!secrets.every(Boolean))throw Error('Missing authorized secondary accounts');
const actors=secrets.map(k=>createAccount(k.startsWith('0x')?k:`0x${k}`));
const expected=['0xeb57bc7125fa60d7482ce12058397369ab3581f8','0x2da5393d7bbb9a037dc3abb56dbbc5c150fc843f'];
if(!actors.every((a,i)=>a.address.toLowerCase()===expected[i]))throw Error('Signer mismatch; do not use main deployer');
const run=process.env.PACKETVOTE_RUN||'review-v21';
if(!/^[a-zA-Z0-9_-]{1,16}$/.test(run))throw Error('Invalid run label');
const samples=['fundraising','inseparable'].map(name=>({name,bytes:readFileSync(`samples/${name}.json`)}));
const context={address,chain_id:studionet.id,source_sha256:sha(local),actors:actors.map(a=>a.address),samples:samples.map(s=>({name:s.name,sha256:sha(s.bytes)})),run};
const path=`docs/live-evidence/lifecycle-${address.toLowerCase()}-${run}.json`;
const report=existsSync(path)?JSON.parse(readFileSync(path)):{context,started_at:new Date().toISOString(),steps:[],cases:{}};
if(!isDeepStrictEqual(report.context,context))throw Error('Resume context mismatch');
const append=(event,data)=>appendFileSync(path.replace(/\.json$/,'.events.jsonl'),JSON.stringify({at:new Date().toISOString(),event,...data},(_,v)=>typeof v==='bigint'?String(v):v)+'\n');
append('session',{context,preflight});
const save=()=>{
 writeFileSync(path,JSON.stringify(report,(_,v)=>typeof v==='bigint'?String(v):v,2)+'\n');
 const rows=report.steps.map(s=>`| ${s.label} | [tx](https://explorer-studio.genlayer.com/transactions/${s.hash}) | ${s.transaction?.statusName||'pending'} | ${s.transaction?.result_name||'pending'} | ${s.expected_error||'expected success'} |`).join('\n');
 writeFileSync(path.replace(/\.json$/,'.md'),`# PacketVote actual lifecycle\n\nContract: ${address}\n\nSource SHA-256: ${context.source_sha256}\n\nStatus: ${report.completed_at?'core lifecycle completed':report.error?'FAILED / incomplete':'in progress'}; expiry recovery: ${report.expiry_completed_at?'verified':'not yet verified'}.\n\n| Step | Explorer | Finality | Consensus | Execution expectation |\n|---|---|---|---|---|\n${rows}\n\nRaw receipts/readbacks: [JSON](${path.split('/').pop()}).\n\nFINALIZED/MAJORITY_AGREE alone is not business success. No semantic verdict is supplied by this script.\n`);
};
const check=(ok,message)=>{if(!ok)throw Error(message)};
const receiptList=x=>Array.isArray(x)?x:Object.values(x||{});
async function send(label,actor,functionName,args,id,expectedError){
 let step=report.steps.find(s=>s.label===label);
 const key=JSON.parse(JSON.stringify({actor:actors[actor].address,functionName,args,id,expected_error:expectedError||null}));
 if(step)check(isDeepStrictEqual(step.input,key),'Resume input mismatch');
 else{step={label,input:key,expected_error:expectedError||null,before:id?await read('get_proposal',[id]):null,submitted_at:new Date().toISOString()};report.steps.push(step);append('intent',{step});save()}
 if(step.verified_at)return step.returned;
 if(!step.hash){const raw=await createClient({chain:studionet,account:actors[actor]}).writeContract({address,functionName,args,value:0n});step.hash=typeof raw==='string'?raw:raw.txId;append('submitted',{label,hash:step.hash});check(/^0x[0-9a-fA-F]{64}$/.test(step.hash),'Invalid returned hash');save()}
 console.log(`${label}: ${step.hash}`);
 let tx=await fresh().getTransaction({hash:step.hash});
 if(tx.statusName!=='FINALIZED'){await fresh().waitForTransactionReceipt({hash:step.hash,status:'FINALIZED',interval:2500,retries:120});tx=await fresh().getTransaction({hash:step.hash})}
 step.transaction=tx;append('receipt',{label,transaction:tx});save();
 const leaders=receiptList(tx.consensus_data?.leader_receipt),leader=leaders.find(x=>x.mode==='leader')||leaders[0];
 check(tx.from_address?.toLowerCase()===actors[actor].address.toLowerCase()&&tx.to_address?.toLowerCase()===address.toLowerCase(),'Transaction binding mismatch');
 check(tx.statusName==='FINALIZED'&&tx.result_name==='MAJORITY_AGREE','No finalized accepted consensus');
 const execution=leader?.genvm_result?.error_code?'ERROR':leader?.execution_result||tx.txExecutionResultName;
 check(execution===(expectedError?'ERROR':'SUCCESS'),`${label}: unexpected execution`);
 const payload=leader?.result?.payload;
 step.returned=payload&&typeof payload==='object'&&typeof payload.readable==='string'?JSON.parse(payload.readable):payload;
 if(!Object.hasOwn(step,'after')){step.after=id?await read('get_proposal',[id]):null;append('readback',{label,after:step.after});save()}
 if(expectedError){check(payload===expectedError,`${label}: wrong error`);check(isDeepStrictEqual(step.before,step.after),`${label}: rejected operation mutated proposal`)}
 step.verified_at=new Date().toISOString();append('verified',{label,returned:step.returned});save();
 return step.returned;
}
save();
try{
 if(mode==='expiry'){
  const x=report.cases.expiry;check(x,'Run lifecycle first');
  const p=await read('get_proposal',[x.id]);check(Date.now()/1000>=p.deadline,`Wait actual deadline ${new Date(p.deadline*1000).toISOString()}`);
  await send('expiry-finalize',1,'finalize',[x.id],x.id);
  report.expired=await read('get_proposal',[x.id]);
  check(report.expired.state==='EXPIRED'&&report.expired.adopted_indices.length===0,'Expiry adopted clauses');
  report.expiry_completed_at=new Date().toISOString();save();process.exit(0);
 }
 for(const sample of samples){
  const data=JSON.parse(sample.bytes),name=sample.name;
  const slot=report.cases[name]||={deadline:Math.floor(Date.now()/1000)+3600};save();
  const returned=await send(`${name}-create`,0,'create_proposal',[`${name}-${run}`,JSON.stringify(data.clauses),JSON.stringify(actors.map(a=>a.address)),slot.deadline]);
  check(typeof returned==='string'&&returned.toLowerCase().startsWith(actors[0].address.toLowerCase()+':'),'Invalid returned proposal ID');slot.id=returned;save();
  let p=await read('get_proposal',[slot.id]);
  await send(`${name}-consent-a`,0,'accept_source',[slot.id,p.source_digest],slot.id);
  await send(`${name}-consent-b`,1,'accept_source',[slot.id,p.source_digest],slot.id);
  await send(`${name}-wrong-proposer`,1,'compile_partition',[slot.id,p.source_digest],slot.id,'PROPOSER_ONLY');
  let compiled=await send(`${name}-compile`,0,'compile_partition',[slot.id,p.source_digest],slot.id);
  p=await read('get_proposal',[slot.id]);
  if(p.state==='UNRESOLVED'&&p.attempts<2){
   compiled=await send(`${name}-compile-retry`,0,'compile_partition',[slot.id,p.source_digest],slot.id);
  }
  p=await read('get_proposal',[slot.id]);slot.compiled=p;save();
  if(name==='inseparable'){
   check(compiled==='UNSPLITTABLE'&&p.state==='UNSPLITTABLE'&&!p.plan_digest,'Actual negative semantic control did not match expected unsplittability');
   await send('inseparable-open-denied',0,'open_ballot',[slot.id,''],slot.id,'PLAN_NOT_READY');
   slot.adopted=await read('get_adopted',[slot.id]);check(!slot.adopted.active&&slot.adopted.clauses.length===0,'Negative source became active');save();continue;
  }
  check(compiled==='READY'&&p.state==='READY'&&isDeepStrictEqual(p.packets,data.expected_semantic_partition),'Actual semantic partition differs from happy-path oracle');
  await send('fundraising-open',1,'open_ballot',[slot.id,p.plan_digest],slot.id);
  await send('fundraising-partial-denied',0,'cast_vote',[slot.id,p.plan_digest,'["YES"]'],slot.id,'INVALID_PACKET_CHOICES');
  await send('fundraising-wrong-plan',0,'cast_vote',[slot.id,'0'.repeat(64),'["YES","NO"]'],slot.id,'PLAN_DIGEST_MISMATCH');
  await send('fundraising-vote-a',0,'cast_vote',[slot.id,p.plan_digest,'["YES","NO"]'],slot.id);
  await send('fundraising-early-finalize-denied',0,'finalize',[slot.id],slot.id,'VOTES_INCOMPLETE');
  await send('fundraising-replay-denied',0,'cast_vote',[slot.id,p.plan_digest,'["NO","YES"]'],slot.id,'VOTE_REPLAY');
  await send('fundraising-vote-b',1,'cast_vote',[slot.id,p.plan_digest,'["YES","NO"]'],slot.id);
  await send('fundraising-finalize',1,'finalize',[slot.id],slot.id);
  slot.final=await read('get_proposal',[slot.id]);slot.adopted=await read('get_adopted',[slot.id]);save();
  check(slot.final.state==='ADOPTED'&&isDeepStrictEqual(slot.adopted.clauses,data.clauses.slice(0,2)),'Whole-packet exact-clause adoption mismatch');
  await send('fundraising-terminal-denied',0,'finalize',[slot.id],slot.id,'BALLOT_NOT_ACTIVE');
 }
 // Separate short bounded abandonment test. Its deadline is sealed, never changed
 // to skip the real wait. Later use `node scripts/live.mjs expiry`.
 const e=report.cases.expiry||={deadline:Math.floor(Date.now()/1000)+600};save();
 const independent=[{id:'minutes',text:'Publish community meeting minutes monthly.'},{id:'calendar',text:'Publish a community events calendar quarterly, independently of meeting minutes.'}];
 e.id=await send('expiry-create',0,'create_proposal',[`expiry-${run}`,JSON.stringify(independent),JSON.stringify(actors.map(a=>a.address)),e.deadline]);save();
 let ep=await read('get_proposal',[e.id]);
 await send('expiry-consent-a',0,'accept_source',[e.id,ep.source_digest],e.id);
 await send('expiry-consent-b',1,'accept_source',[e.id,ep.source_digest],e.id);
 await send('expiry-compile',0,'compile_partition',[e.id,ep.source_digest],e.id);
 ep=await read('get_proposal',[e.id]);check(ep.state==='READY','Independent expiry fixture did not produce READY');
 await send('expiry-open',0,'open_ballot',[e.id,ep.plan_digest],e.id);
 await send('expiry-vote-a-only',0,'cast_vote',[e.id,ep.plan_digest,'["YES","YES"]'],e.id);
 e.current=await read('get_proposal',[e.id]);report.completed_at=new Date().toISOString();delete report.error;save();
 console.log(`Core lifecycle complete. Run expiry after ${new Date(e.deadline*1000).toISOString()}`);
}catch(error){report.error=String(error.stack||error);append('error',{error:report.error});save();console.error(report.error);process.exitCode=1}
