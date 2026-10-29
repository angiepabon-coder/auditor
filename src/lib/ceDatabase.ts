import {validateProjectEvidence} from '../data/projectTypes';
import {readPrivateEvidence,refreshPrivateEvidence} from '../data/privateEvidence';
export const projectUrl='https://ctelyszqiulavfsowged.supabase.co';
// Publishable client key only. Access to private records is enforced by RLS.
const publicKey=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_x4hmozbrJuv7kP6HnZNDAg_EVFF0nq9';
export const databaseConfigured=!!publicKey;
export const workspaceKeys=['nigma_ce_audit_workspace_v1','nigma_ce_indicators_v1','nigma_ce_daily_tasks','nigma_ce_review_checklists_v1','nigma_ce_almera_indicator_checklists','nigma_ce_evidence_v1','nigma_ce_project_reviews_v1'] as const;
type Session={access_token:string;refresh_token?:string;expires_at?:number;expires_in?:number;user:{id:string;email?:string}};
type Snapshot={schemaVersion:1;savedAt:string;local:Record<string,unknown>;evidence:{centers:unknown;indicators:unknown;entries:unknown;projects?:unknown;certifications?:unknown;directory?:unknown}};
export type Workspace={owner_id:string;revision:number;payload:Snapshot;updated_at:string};
const sessionKey='ce_private_session_v1';
let retainInTab=false;
let session:Session|null=null;
try{if(typeof sessionStorage!=='undefined'){const saved=JSON.parse(sessionStorage.getItem(sessionKey)||'null');if(saved&&typeof saved.access_token==='string'&&typeof saved.user?.id==='string'){session=saved;retainInTab=true;}}}catch{/* In-memory login remains available. */}
let refresh:Promise<void>|null=null;
function keepSession(value:Session|null){
 session=value;if(value&&!value.expires_at)value.expires_at=Math.floor(Date.now()/1000)+(value.expires_in??3600);
 try{if(typeof sessionStorage!=='undefined'){if(value&&retainInTab)sessionStorage.setItem(sessionKey,JSON.stringify(value));else sessionStorage.removeItem(sessionKey);}}catch{/* Never persist a password; a session can continue in memory. */}
}
export function currentAccount(){return session?.user.email||'';}
async function ensureSession(){
 if(!session||!session.expires_at||session.expires_at>Date.now()/1000+30)return;
 if(!session.refresh_token){keepSession(null);throw new Error('Tu sesión venció. Inicia sesión nuevamente; los cambios locales se conservan.');}
 if(!refresh)refresh=(async()=>{try{const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:session?.refresh_token})});if(!next?.user?.id)throw new Error();keepSession(next);}catch{keepSession(null);throw new Error('No se pudo renovar la sesión. Inicia sesión nuevamente; los cambios locales se conservan.');}finally{refresh=null;}})();
 await refresh;
}
async function request(path:string,options:RequestInit={}){
 if(!publicKey)throw new Error('La conexión aún no tiene la clave pública del proyecto.');
 const tokenEndpoint=path.startsWith('/auth/v1/token');if(!tokenEndpoint)await ensureSession();
 let response:Response;
 try{response=await fetch(projectUrl+path,{...options,signal:AbortSignal.timeout(15000),headers:{apikey:publicKey,...(!tokenEndpoint&&session?{Authorization:'Bearer '+session.access_token}:{}),'Content-Type':'application/json',...options.headers}});}catch{throw new Error('No se pudo conectar con Supabase. Tus cambios se conservan en este navegador.');}
 if(!response.ok){
  if(response.status===401){keepSession(null);throw new Error('Inicia sesión nuevamente en la base de datos.');}
  if(response.status===400&&tokenEndpoint)throw new Error('Verifica tu correo y contraseña. La cuenta debe estar creada y confirmada en Supabase.');
  throw new Error(response.status===409?'Ya existe una copia. Consulta su versión antes de guardar.':`No se completó la operación (${response.status}). Verifica la cuenta y la configuración de la base de datos.`);
 }
 return response.status===204?null:response.json();
}
export async function signIn(email:string,password:string,keepInThisTab=false){
 keepSession(null);retainInTab=keepInThisTab;
 const next=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
 if(!next?.user?.id)throw new Error('No se pudo validar la cuenta.');keepSession(next);
}
export async function signOut(){try{if(session)await request('/auth/v1/logout',{method:'POST'});}finally{keepSession(null);retainInTab=false;}}
export async function checkDatabase(){
 const response=await fetch(projectUrl+'/rest/v1/ce_workspaces?select=revision&limit=1',{signal:AbortSignal.timeout(15000),headers:{apikey:publicKey}});const body=await response.json();
 if((response.status===401||response.status===403)&&body.code==='42501')return;
 if(response.ok)throw new Error('La tabla permite consultar sin sesión. Revisa sus permisos antes de guardar datos.');
 throw new Error('La tabla privada aún no está disponible. Falta aplicar la configuración de la base de datos.');
}
export async function readWorkspace():Promise<Workspace|null>{await ensureSession();if(!session)throw new Error('Inicia sesión para consultar tus registros.');const rows=await request('/rest/v1/ce_workspaces?owner_id=eq.'+encodeURIComponent(session.user.id)+'&select=*');return rows[0]||null;}
export function collectSnapshot():Snapshot{
 const local:Record<string,unknown>={};for(const key of workspaceKeys){const value=localStorage.getItem(key);if(value!==null)local[key]=JSON.parse(value);}
 return {schemaVersion:1,savedAt:new Date().toISOString(),local,evidence:readPrivateEvidence()};
}
export function workspaceFingerprint(){const {local,evidence}=collectSnapshot();return JSON.stringify({local,evidence});}
export function hasLocalWorkspaceData(){
 const {local}=collectSnapshot();const evidence=readPrivateEvidence();
 if(evidence.centers.length||evidence.indicators.length||evidence.entries.length||evidence.projects?.length||evidence.certifications?.length||evidence.directory?.length)return true;
 return Object.entries(local).some(([key,value])=>{
  if(key==='nigma_ce_evidence_v1')return false;
  if(Array.isArray(value))return value.length>0;
  if(!value||typeof value!=='object')return false;
  const record=value as Record<string,unknown>;
  if(key==='nigma_ce_indicators_v1')return Object.values(record).some(v=>Array.isArray(v)?v.length>0:!!v&&typeof v==='object'&&Object.keys(v).length>0);
  return Object.keys(record).length>0;
 });
}
export async function saveWorkspace(revision:number|null,payload=collectSnapshot()):Promise<Workspace>{
 await ensureSession();if(!session)throw new Error('Inicia sesión para guardar tus registros.');
 const row={owner_id:session.user.id,revision:(revision||0)+1,payload,updated_at:new Date().toISOString()};
 const rows=await request('/rest/v1/ce_workspaces'+(revision===null?'':'?owner_id=eq.'+encodeURIComponent(session.user.id)+'&revision=eq.'+revision),{method:revision===null?'POST':'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(row)});
 if(!rows?.length)throw new Error('La versión cambió en otro equipo. Consulta la copia actual antes de guardar.');return rows[0];
}
export function restoreWorkspace(row:Workspace){
 if(row.payload?.schemaVersion!==1||!row.payload.local||typeof row.payload.local!=='object')throw new Error('Formato de copia no compatible.');
 const values=workspaceKeys.filter(k=>Object.hasOwn(row.payload.local,k)).map(k=>[k,JSON.stringify(row.payload.local[k])] as const);const previous=workspaceKeys.map(k=>[k,localStorage.getItem(k)] as const);
 localStorage.setItem('nigma_ce_before_database_restore',JSON.stringify(Object.fromEntries(previous)));
 try{for(const key of workspaceKeys)localStorage.removeItem(key);for(const [k,v] of values)localStorage.setItem(k,v);}catch(error){for(const [k,v] of previous){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}throw error;}
 refreshPrivateEvidence();if(typeof window!=='undefined')window.dispatchEvent(new Event('ce-private-evidence-updated'));
}
export function importPrivateBackup(value:unknown){
 const payload=value as Snapshot;
 if(payload?.schemaVersion!==1||!payload.evidence||!Array.isArray(payload.evidence.centers)||!Array.isArray(payload.evidence.indicators)||!Array.isArray(payload.evidence.entries))throw new Error('El archivo no contiene un respaldo privado compatible.');
 validateProjectEvidence(payload.evidence);
 const evidenceKey='nigma_ce_evidence_v1',workspaceKey='nigma_ce_audit_workspace_v1';
 const previousEvidence=localStorage.getItem(evidenceKey),previousWorkspace=localStorage.getItem(workspaceKey);
 const existing=JSON.parse(previousWorkspace||'[]');if(!Array.isArray(existing))throw new Error('El espacio local necesita revisión antes de importar.');
 const matrices=payload.evidence.entries.filter(item=>item&&item.kind==='Matrices de riesgos'&&typeof item.id==='string'&&item.id.startsWith('almera-matriz-verificada-'));
 const merged=existing.map(saved=>{const incoming=matrices.find(item=>item.id===saved.id);return incoming?{...saved,riskVerification:incoming.riskVerification,sourceNotes:incoming.notes}:saved;});
 for(const item of matrices)if(!merged.some(saved=>saved.id===item.id))merged.push(item);
 localStorage.setItem('nigma_ce_before_private_import',JSON.stringify({evidence:previousEvidence,workspace:previousWorkspace}));
 try{localStorage.setItem(workspaceKey,JSON.stringify(merged));localStorage.setItem(evidenceKey,JSON.stringify(payload.evidence));}catch(error){for(const [key,value]of[[workspaceKey,previousWorkspace],[evidenceKey,previousEvidence]]){if(value===null)localStorage.removeItem(key!);else localStorage.setItem(key!,value!);}throw error;}
 refreshPrivateEvidence();if(typeof window!=='undefined')window.dispatchEvent(new Event('ce-private-evidence-updated'));
}
