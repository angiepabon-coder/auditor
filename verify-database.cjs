const assert=require('node:assert/strict');
const esbuild=require('esbuild');
const output=esbuild.buildSync({entryPoints:['src/lib/ceDatabase.ts'],bundle:true,write:false,platform:'node',format:'cjs',define:{'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY':'"test-public-key"'}});
const memory=new Map();global.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const mod={exports:{}};new Function('module','exports',output.outputFiles[0].text)(mod,mod.exports);const db=mod.exports;
let row=null;let requests=0;global.fetch=async(url,options={})=>{requests++;if(url.includes('/auth/v1/token'))return new Response(JSON.stringify({access_token:'test',user:{id:'owner'}}));if(options.method==='POST'){if(row)return new Response('{}',{status:409});row=JSON.parse(options.body);return new Response(JSON.stringify([row]));}if(options.method==='PATCH'){if(!url.includes('&revision=eq.'+row.revision))return new Response('[]');row=JSON.parse(options.body);return new Response(JSON.stringify([row]));}return new Response(JSON.stringify(row?[row]:[]));};
(async()=>{
 await assert.rejects(()=>db.readWorkspace(),/Inicia sesión/);assert.equal(requests,0);
 await db.signIn('owner@example.com','test');assert.equal(await db.readWorkspace(),null);
 memory.set('nigma_ce_daily_tasks','[{"id":"manual"}]');
 const first=await db.saveWorkspace(null);assert.equal(first.revision,1);assert.equal(first.payload.local.nigma_ce_daily_tasks[0].id,'manual');
 await assert.rejects(()=>db.saveWorkspace(null),/Ya existe/);
 const second=await db.saveWorkspace(1);assert.equal(second.revision,2);
 await assert.rejects(()=>db.saveWorkspace(1),/versión cambió/);assert.equal(row.revision,2);
 memory.set('nigma_ce_indicators_v1','{}');db.restoreWorkspace(second);assert.equal(memory.get('nigma_ce_indicators_v1'),undefined);assert.ok(memory.has('nigma_ce_before_database_restore'));
 assert.throws(()=>db.importPrivateBackup({}),/compatible/);
 assert.deepEqual(first.payload.evidence,{centers:[],indicators:[],entries:[]});
 console.log('Database checks passed: authentication, version conflicts, restore, private data isolation.');
})().catch(e=>{console.error(e.message);process.exit(1);});
