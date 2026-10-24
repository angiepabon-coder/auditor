import { almeraReview as centers } from '../data/privateEvidence';
import { almeraIndicators as indicators } from '../data/privateEvidence';
import { almeraEntries as entries } from '../data/privateEvidence';
export const projectUrl = 'https://ctelyszqiulavfsowged.supabase.co';
// Publishable client key, scoped by the database's row level security policies.
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_x4hmozbrJuv7kP6HnZNDAg_EVFF0nq9';
export const databaseConfigured = !!publicKey;
export const workspaceKeys = ['nigma_ce_audit_workspace_v1','nigma_ce_indicators_v1','nigma_ce_daily_tasks','nigma_ce_review_checklists_v1','nigma_ce_almera_indicator_checklists','nigma_ce_evidence_v1'] as const;
type Session = {access_token:string; user:{id:string;email?:string}};
export type Workspace = {owner_id:string;revision:number;payload:Snapshot;updated_at:string};
type Snapshot = {schemaVersion:1; savedAt:string; local:Record<string,unknown>; evidence:{centers:unknown;indicators:unknown;entries:unknown}};
let session:Session|null=null;
export function currentAccount(){return session?.user.email || '';}
async function request(path:string,options:RequestInit={}) {
  if(!publicKey) throw new Error('La conexión aún no tiene la clave pública del proyecto.');
  const response=await fetch(projectUrl+path,{...options,headers:{apikey:publicKey,...(session?{Authorization:'Bearer '+session.access_token}:{}),'Content-Type':'application/json',...options.headers}});
  if(!response.ok){if(response.status===401){session=null;throw new Error('Inicia sesión nuevamente en la base de datos.');}throw new Error(response.status===409?'Ya existe una copia. Consulta su versión antes de guardar.':`No se completó la operación (${response.status}). Verifica la cuenta y la configuración de la base de datos.`);}
  return response.status===204?null:response.json();
}
export async function signIn(email:string,password:string){session=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});if(!session?.user?.id)throw new Error('No se pudo validar la cuenta.');}
export async function signOut(){try{if(session)await request('/auth/v1/logout',{method:'POST'});}finally{session=null;}}
export async function checkDatabase(){
 // Anonymous access must be denied by the table grants (42501 / HTTP 401 or 403).
 const response=await fetch(projectUrl+'/rest/v1/ce_workspaces?select=revision&limit=1',{headers:{apikey:publicKey}});
 const body=await response.json();
 if((response.status===401||response.status===403)&&body.code==='42501')return;
 if(response.ok)throw new Error('La tabla permite consultar sin sesión. Revisa sus permisos antes de guardar datos.');
 throw new Error('La tabla privada aún no está disponible. Falta aplicar la configuración de la base de datos.');
}
export async function readWorkspace():Promise<Workspace|null>{if(!session)throw new Error('Inicia sesión para consultar tus registros.');const rows=await request('/rest/v1/ce_workspaces?owner_id=eq.'+encodeURIComponent(session.user.id)+'&select=*');return rows[0]||null;}
export function collectSnapshot():Snapshot {
 const local:Record<string,unknown>={};for(const key of workspaceKeys){const value=localStorage.getItem(key);if(value!==null)local[key]=JSON.parse(value);}
 return {schemaVersion:1,savedAt:new Date().toISOString(),local,evidence:{centers,indicators,entries}};
}
export async function saveWorkspace(revision:number|null):Promise<Workspace>{
 if(!session)throw new Error('Inicia sesión para guardar tus registros.');
 const row={owner_id:session.user.id,revision:(revision||0)+1,payload:collectSnapshot(),updated_at:new Date().toISOString()};
 const rows=await request('/rest/v1/ce_workspaces'+(revision===null?'':'?owner_id=eq.'+encodeURIComponent(session.user.id)+'&revision=eq.'+revision),{method:revision===null?'POST':'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(row)});
 if(!rows?.length)throw new Error('La versión cambió en otro equipo. Consulta la copia actual antes de guardar.');return rows[0];
}
export function restoreWorkspace(row:Workspace){
 if(row.payload?.schemaVersion!==1 || !row.payload.local || typeof row.payload.local!=='object')throw new Error('Formato de copia no compatible.');
 const values=workspaceKeys.filter(k=>Object.hasOwn(row.payload.local,k)).map(k=>[k,JSON.stringify(row.payload.local[k])] as const);
 const previous=workspaceKeys.map(k=>[k,localStorage.getItem(k)] as const);
 // Preserve a local recovery copy before replacing application records.
 localStorage.setItem('nigma_ce_before_database_restore',JSON.stringify(Object.fromEntries(previous)));
 try{for(const key of workspaceKeys)localStorage.removeItem(key);for(const [k,v] of values)localStorage.setItem(k,v);}catch(error){for(const [k,v] of previous){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}throw error;}
}
export function importPrivateBackup(value:unknown){
 const payload=value as Snapshot;
 if(payload?.schemaVersion!==1||!payload.evidence||!Array.isArray(payload.evidence.centers)||!Array.isArray(payload.evidence.indicators)||!Array.isArray(payload.evidence.entries))throw new Error('El archivo no contiene un respaldo privado compatible.');
 localStorage.setItem('nigma_ce_evidence_v1',JSON.stringify(payload.evidence));
}
