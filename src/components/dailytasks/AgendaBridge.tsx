import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export function AgendaBridge() {
  const { dailyTasks, centersExcellence } = useApp();
  const [notice, setNotice] = useState('');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const tasks = dailyTasks.filter(t => t.status !== 'Completada' && (t.date <= today || (!!t.dueDate && t.dueDate <= today)))
    .sort((a, b) => (a.dueDate||'9999-12-31').localeCompare(b.dueDate||'9999-12-31') || ({ Alta: 0, Media: 1, Baja: 2 }[a.priority] - { Alta: 0, Media: 1, Baja: 2 }[b.priority]));
  const summary = `Actividades CE · ${today} · America/Bogota\nFuente: actividades registradas en el aplicativo CE; los datos de Almera conservan su propio corte. Fechas de compromiso vacías: por acordar.\n\n` + tasks.map(t => `${t.id} | ${centersExcellence.find(c => c.id === t.centerId)?.name || t.institution} | ${t.title}\nResponsable: ${t.responsible}. Compromiso: ${t.dueDate||'Por acordar'}. Estado: ${t.status}${t.dueDate && t.dueDate < today ? ' · Vencida' : ''}\nPróximo paso: ${t.checklist.find(i => !i.done)?.label || 'Validar cierre y evidencia'}`).join('\n\n');
  async function share() {
    try {
      const response = await fetch('/api/ce-agenda', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updatedAt: new Date().toISOString(), timezone: 'America/Bogota', source: 'Aplicativo local CE; registros iniciales por validar', tasks: dailyTasks, summary }) });
      if (!response.ok) throw new Error();
      setNotice('Resumen compartido con el asistente local. Repite al terminar de actualizar tus tareas.');
    } catch { setNotice('El enlace local no está disponible. Copia el resumen y compártelo en el chat del asistente.'); }
  }
  return <section className="bg-white dark:bg-slate-900 border rounded-xl p-5 space-y-3">
    <h2 className="font-bold">Hoy · Agenda y correos</h2>
    <p className="text-sm text-slate-500">{today} · Bogotá. Hasta tres prioridades para revisar; las tareas bloqueadas requieren seguimiento.</p>
    <ol className="list-decimal pl-5 text-sm space-y-2">{tasks.slice(0, 3).map(t => <li key={t.id}><b>{t.title}</b> · {t.status} · compromiso {t.dueDate||'por acordar'}<p className="text-xs text-slate-500">{t.checklist.find(i => !i.done)?.label || 'Validar cierre y evidencia'}</p></li>)}</ol>
    {!tasks.length && <p>No hay actividades abiertas programadas hasta hoy.</p>}
    <div className="flex flex-wrap gap-2 text-xs">{import.meta.env.DEV&&<button onClick={share} className="bg-indigo-600 text-white rounded-lg px-3 py-2">Compartir actualización con el asistente</button>}<button className="border rounded-lg px-3 py-2" onClick={async () => { try { await navigator.clipboard.writeText(summary); setNotice('Resumen copiado.'); } catch { setNotice('Selecciona y copia el resumen desplegable.'); } }}>Copiar resumen</button><a className="border rounded-lg px-3 py-2" href="https://chatgpt.com/scheduled?automationId=asistente-de-agenda-y-correos&automationSource=local" target="_blank" rel="noreferrer">Abrir asistente de agenda</a></div>
    <p className="text-xs text-slate-500">La revisión local programada puede leer los datos del asistente mientras este navegador y la aplicación estén disponibles. Si no logra acceder, informará el bloqueo. Copiar resumen permite compartirlo manualmente. No crea eventos ni envía correos.</p>
    <p role="status" className="text-xs">{notice}</p><details><summary className="text-xs cursor-pointer">Ver resumen para agenda</summary><pre className="whitespace-pre-wrap text-xs mt-2">{summary}</pre></details><details><summary className="text-xs cursor-pointer">Datos para el asistente de agenda</summary><pre aria-label="Datos CE para el asistente" className="whitespace-pre-wrap text-xs mt-2">{JSON.stringify({schemaVersion:1,updatedAt:new Date().toISOString(),timezone:'America/Bogota',source:'Consulta de actividades del aplicativo CE; no es una consulta nueva de Almera',tasks:dailyTasks,summary},null,2)}</pre></details>
  </section>;
}
