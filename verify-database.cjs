const assert=require('node:assert/strict');
const esbuild=require('esbuild');
const output=esbuild.buildSync({entryPoints:['src/lib/ceDatabase.ts'],bundle:true,write:false,platform:'node',format:'cjs',define:{'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY':'"test-public-key"'}});
const memory=new Map();global.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const tabMemory=new Map();global.sessionStorage={getItem:k=>tabMemory.get(k)??null,setItem:(k,v)=>tabMemory.set(k,v),removeItem:k=>tabMemory.delete(k)};
const mod={exports:{}};new Function('module','exports',output.outputFiles[0].text)(mod,mod.exports);const db=mod.exports;
let row=null;let requests=0;let expired=false;let refreshCalls=0;
global.fetch=async(url,options={})=>{
 requests++;
 if(url.includes('/auth/v1/logout'))return new Response(null,{status:204});
 if(url.includes('/auth/v1/token')){const renewing=url.includes('grant_type=refresh_token');if(renewing)refreshCalls++;return new Response(JSON.stringify({access_token:renewing?'test-refreshed':'test',refresh_token:'test-refresh-token',expires_at:Math.floor(Date.now()/1000)+(expired&&!renewing?-60:3600),user:{id:'owner',email:'owner@example.com'}}));}
 if(options.method==='POST'){if(row)return new Response('{}',{status:409});row=JSON.parse(options.body);return new Response(JSON.stringify([row]));}
 if(options.method==='PATCH'){if(!url.includes('&revision=eq.'+row.revision))return new Response('[]');row=JSON.parse(options.body);return new Response(JSON.stringify([row]));}
 return new Response(JSON.stringify(row?[row]:[]));
};
(async()=>{
 await assert.rejects(()=>db.readWorkspace(),/Inicia sesión/);assert.equal(requests,0);
 await db.signIn('owner@example.com','test');assert.equal(await db.readWorkspace(),null);
 assert.equal(tabMemory.size,0,'Login must not be persisted unless explicitly requested.');
 memory.set('nigma_ce_daily_tasks','[{"id":"manual"}]');
 const first=await db.saveWorkspace(null);assert.equal(first.revision,1);assert.equal(first.payload.local.nigma_ce_daily_tasks[0].id,'manual');
 await assert.rejects(()=>db.saveWorkspace(null),/Ya existe/);
 const second=await db.saveWorkspace(1);assert.equal(second.revision,2);
 await assert.rejects(()=>db.saveWorkspace(1),/versión cambió/);assert.equal(row.revision,2);
 memory.set('nigma_ce_indicators_v1','{}');db.restoreWorkspace(second);assert.equal(memory.get('nigma_ce_indicators_v1'),undefined);assert.ok(memory.has('nigma_ce_before_database_restore'));
 assert.throws(()=>db.importPrivateBackup({}),/compatible/);
 assert.deepEqual(first.payload.evidence,{centers:[],indicators:[],entries:[]});
 const fingerprint=db.workspaceFingerprint();assert.equal(db.workspaceFingerprint(),fingerprint);
 memory.set('nigma_ce_daily_tasks','[{"id":"changed"}]');assert.notEqual(db.workspaceFingerprint(),fingerprint);
 memory.set('nigma_ce_audit_workspace_v1',JSON.stringify([{id:'manual-only',notes:'Personal note'},{id:'almera-matriz-verificada-test',notes:'Manual observation',created:'2026-01-02',checklist:[{label:'Manual verification',done:true}]}]));
 db.importPrivateBackup({schemaVersion:1,evidence:{centers:[],indicators:[],entries:[{id:'almera-matriz-verificada-test',kind:'Matrices de riesgos',notes:'New source evidence',riskVerification:{checkedOn:'2026-10-28'}}]}});
 const imported=JSON.parse(memory.get('nigma_ce_audit_workspace_v1'));assert.equal(imported.length,2);assert.equal(imported[0].notes,'Personal note');assert.equal(imported[1].notes,'Manual observation');assert.equal(imported[1].created,'2026-01-02');assert.equal(imported[1].checklist[0].done,true);assert.equal(imported[1].sourceNotes,'New source evidence');assert.equal(imported[1].riskVerification.checkedOn,'2026-10-28');assert.equal(db.currentAccount(),'owner@example.com','Import must preserve the signed-in account.');assert.ok(memory.has('nigma_ce_before_private_import'));
 expired=true;await db.signIn('owner@example.com','test',true);assert.equal(tabMemory.size,1);assert.equal(db.currentAccount(),'owner@example.com');
 await db.readWorkspace();assert.equal(refreshCalls,1,'Expired sessions should be refreshed before accessing private data.');
 assert.equal(JSON.stringify(db.collectSnapshot()).includes('test-refresh-token'),false,'Authentication must never be included in audit backups.');
 memory.set('nigma_ce_project_reviews_v1',JSON.stringify({'project-test':{notes:'Manual project follow-up',checks:[true,false]}}));
 const projectBackup=db.collectSnapshot();assert.equal(projectBackup.local.nigma_ce_project_reviews_v1['project-test'].checks[0],true,'Project checklists must be included in private backups.');
 const supplement={centers:[],indicators:[],entries:[],projects:[{id:'project-test',centerId:'test-center',name:'Test fixture',site:'HIC',actual:0,planned:0,compliance:100,schedules:[]}],certifications:[],directory:[]};
 db.importPrivateBackup({schemaVersion:1,evidence:supplement});assert.equal(db.collectSnapshot().evidence.projects[0].actual,0,'Source project values must survive import and backup.');assert.equal(JSON.parse(memory.get('nigma_ce_project_reviews_v1'))['project-test'].notes,'Manual project follow-up','Source imports must not overwrite manual project reviews.');
 memory.clear();assert.equal(db.hasLocalWorkspaceData(),false);
 memory.set('nigma_ce_indicators_v1',JSON.stringify({indicators:[],measurements:[],verifiedMissing:{},checklists:{}}));assert.equal(db.hasLocalWorkspaceData(),false,'An empty form must not prevent cloud recovery.');
 memory.set('nigma_ce_daily_tasks',JSON.stringify([{id:'manual-preserved'}]));assert.equal(db.hasLocalWorkspaceData(),true,'Manual work must prevent automatic replacement.');
 let restoreEvents=0;global.window={dispatchEvent:()=>{restoreEvents++;}};
 const cloudEvidence={centers:[{centerId:'ce-restored'}],indicators:[],entries:[]};
 db.restoreWorkspace({...second,payload:{...second.payload,local:{nigma_ce_evidence_v1:cloudEvidence},evidence:cloudEvidence}});
 assert.equal(db.collectSnapshot().evidence.centers[0].centerId,'ce-restored');assert.equal(restoreEvents,1,'Recovery must refresh the open interface without reloading.');assert.equal(db.currentAccount(),'owner@example.com','Recovery must retain the active login.');
 await db.signOut();assert.equal(tabMemory.size,0);assert.equal(db.currentAccount(),'');
 console.log('Database checks passed: authentication, refresh, opt-in tab session, version conflicts, restore, private data isolation.');
})().catch(e=>{console.error(e.message);process.exit(1);});
