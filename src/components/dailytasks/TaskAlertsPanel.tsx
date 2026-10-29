import React,{useState} from 'react';
import {useApp} from '../../context/AppContext';
import {taskAlerts} from '../../lib/taskAlerts';

export function TaskAlertsPanel({today,onSelect}:{today:string;onSelect:(title:string)=>void}){
 const {dailyTasks}=useApp();const [expanded,setExpanded]=useState(false);
 const alerts=taskAlerts(dailyTasks,today);const open=dailyTasks.filter(t=>t.status!=='Completada');
 const jci=open.filter(t=>/intraciclo.*JCI|JCI.*intraciclo/i.test(t.title));
 const missing=open.filter(t=>!t.dueDate);
 return <section className="rounded-2xl border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4" aria-label="Alertas de actividades">
  <div><p className="text-xs font-semibold text-indigo-600">SEGUIMIENTO DE COMPROMISOS</p><h2 className="text-xl font-bold">Alertas de la enfermera auditora</h2><p className="text-xs text-slate-500 mt-1">Bogotá · {today}. Preparación desde 30 días antes; atención prioritaria en los últimos 7 días. Los hitos históricos sin soporte requieren confirmar recepción.</p></div>
  <div className="grid sm:grid-cols-3 gap-3">{[['Alertas para revisar',alerts.length],['Intraciclos JCI abiertos',jci.length],['Compromisos por acordar',missing.length]].map(([label,count])=><div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4" key={label}><p className="text-xs text-slate-500">{label}</p><b className="text-2xl">{count}</b></div>)}</div>
  {!!jci.length&&<details><summary className="cursor-pointer font-semibold text-sm">Fechas de carga de intraciclos en JCI · {jci.length}</summary><div className="grid sm:grid-cols-2 gap-2 mt-3">{jci.map(t=><button key={t.id} className="text-left border rounded-xl p-3 text-xs hover:border-indigo-400" onClick={()=>onSelect(t.title)}><b className="block">{t.title}</b><span>Fecha límite: {t.dueDate||'Por confirmar'} · {t.status}</span></button>)}</div></details>}
  {!alerts.length?<p className="text-sm text-slate-500">No hay alertas por fechas en los registros cargados. Revisa también los compromisos por acordar.</p>:<div className="space-y-2">{(expanded?alerts:alerts.slice(0,5)).map(a=><button key={a.taskId+(a.stepId||'-due')} onClick={()=>onSelect(a.title)} className={'block w-full text-left rounded-xl border p-3 text-xs '+(a.level==='danger'?'bg-rose-50 border-rose-200 text-rose-900':a.level==='warning'?'bg-amber-50 border-amber-200 text-amber-900':'bg-indigo-50 border-indigo-100 text-indigo-900')}><b>{a.label} · {a.date}</b><span className="block mt-1">{a.title}</span></button>)}{alerts.length>5&&<button className="text-xs underline text-indigo-600" onClick={()=>setExpanded(!expanded)}>{expanded?'Ver menos':`Ver las ${alerts.length} alertas`}</button>}</div>}
  <p className="text-xs text-slate-500">Completar un paso retira su alerta; solo el checklist completo permite cerrar la actividad. Las alertas se recalculan al consultar esta página. La revisión diaria local comparte los pendientes con el asistente existente; no envía información a JCI ni correos automáticamente.</p>
 </section>;
}
