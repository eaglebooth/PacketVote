// One authorized retry. Separate append-only evidence; never edits prior journals.
import {createClient,createAccount} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {readFileSync,appendFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const address='0x659C33379beFD7CE662804286c94b5B5Bc533194';
const id='0xeb57bc7125fa60d7482ce12058397369ab3581f8:fundraising-review-v1';
const file='docs/live-evidence/compile-retry-authorized.jsonl';
const client=()=>createClient({chain:studionet});
const read=async()=>JSON.parse(String(await client().readContract({address,functionName:'get_proposal',args:[id],transactionHashVariant:'latest-final'})));
const log=(event,data)=>appendFileSync(file,JSON.stringify({at:new Date().toISOString(),event,...data},(_,v)=>typeof v==='bigint'?String(v):v)+'\n');
const requireTrue=(x,m)=>{if(!x)throw Error(m)};
const hash=x=>createHash('sha256').update(x).digest('hex');
writeFileSync(file,'',{flag:'wx'}); // Refuse duplicate invocation/signing.
try{
 const local=readFileSync('contracts/packet_vote.py');
 const remote=Buffer.from(await client().getContractCode(address),'utf8');
 const before=await read();
 log('preflight',{address,id,source_sha256:hash(local),deployed_sha256:hash(remote),before});
 requireTrue(local.equals(remote),'Source mismatch');
 requireTrue(before.state==='UNRESOLVED'&&before.attempts===1,'Not eligible for final retry');
 requireTrue(Date.now()/1000<before.deadline,'Deadline passed; no signing');
 const entry=process.env.GENLAYER_CLI_ENTRY;
 requireTrue(entry,'Missing authorized CLI entry');
 const key=await createRequire(entry)('keytar').getPassword('genlayer-cli','account:dbl-owner');
 requireTrue(key,'Missing authorized secondary account');
 const account=createAccount(key.startsWith('0x')?key:`0x${key}`);
 requireTrue(account.address.toLowerCase()===before.owner,'Signer mismatch');
 log('intent',{actor:account.address,functionName:'compile_partition',args:[id,before.source_digest],value:'0',authorization:'User explicitly confirmed retry with separate evidence after prior journal incident.'});
 const sent=await createClient({chain:studionet,account}).writeContract({address,functionName:'compile_partition',args:[id,before.source_digest],value:0n});
 const txHash=typeof sent==='string'?sent:sent.txId;
 log('submitted',{hash:txHash});console.log(`Retry: ${txHash}`);
 for(let i=0;i<150;i++){
  const tx=await client().getTransaction({hash:txHash});
  if(tx.statusName==='FINALIZED'){
   log('finalized',{transaction:tx});
   requireTrue(tx.from_address?.toLowerCase()===account.address.toLowerCase()&&tx.to_address?.toLowerCase()===address.toLowerCase(),'Transaction binding mismatch');
   const after=await read();log('readback',{after});
   console.log(JSON.stringify({status:tx.statusName,consensus:tx.result_name,state:after.state,attempts:after.attempts,packets:after.packets,findings:after.findings}));
   process.exit(0);
  }
  await new Promise(r=>setTimeout(r,2500));
 }
 throw Error('Polling limit reached. Read existing hash; never resend.');
}catch(e){log('error',{error:String(e.stack||e)});console.error(String(e));process.exitCode=1}
