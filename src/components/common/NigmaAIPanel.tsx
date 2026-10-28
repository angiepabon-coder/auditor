import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { almeraReview as almeraReview } from '../../data/privateEvidence';
import { almeraIndicators as almeraIndicators } from '../../data/privateEvidence';
import { almeraEntries as almeraEntries } from '../../data/privateEvidence';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  cards?: {
    title: string;
    description: string;
    badge?: string;
  }[];
}

export const NigmaAIPanel: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    currentRoute, setCurrentRoute,
    selectedAuditId,
    audits,
    risks,
    findings,
    actionPlans,
    controls,
    evidences,
    centersExcellence, dailyTasks,
    navigateToAudit
  } = useApp();

  const currentAudit = audits.find(a => a.id === selectedAuditId) || audits[0];

  const suggestedPrompts = [
    'Resume las alertas de indicadores.',
    '¿Qué autoevaluaciones requieren seguimiento?',
    'Resume los pendientes de los planes de mejora.',
    'Genera un resumen ejecutivo.',
    '¿Qué actividades tengo hoy?',
    'Identifica controles que no han sido evaluados.',
    'Resume los cambios de esta auditoría.'
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Soy el asistente de consulta de Centros de Excelencia. Consulto el corte privado que hayas cargado, las verificaciones pendientes y tus tareas diarias. Las respuestas se basan en los registros incorporados; no consultan Almera en vivo.',
      timestamp: 'Ahora'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isAiDrawerOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Ahora'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      let cards: Message['cards'] = undefined;

      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      const lower = query.toLowerCase();
      const openTasks = dailyTasks.filter(t => t.status !== 'Completada');
      const sourceNote = '\n\nFuente: corte privado cargado en este equipo. Revisa el detalle y la vigencia antes de concluir incumplimiento. No es una consulta en vivo.';
      if (!almeraReview.length && !/hoy|agenda|actividad|tarea/.test(lower)) { aiResponseText='Aún no hay un corte privado cargado. Recupera tu copia desde Base de datos o registra la información manualmente. No puedo concluir cumplimiento a partir de registros vacíos.'; } else if (/indicador|meta|medicion|medición/.test(lower)) {
        const fails = almeraIndicators.flatMap(i => i.measurements.filter(m => m.goal === 'Fuera de meta').map(m => `${i.code} · ${i.center} (${i.site}) · ${m.period}: ${m.valueText} frente a meta ${m.target}. Soporte: ${i.source}`));
        aiResponseText = `${almeraIndicators.length} fichas consultadas; ${almeraIndicators.filter(i => i.totalMeasurements === 0).length} sin mediciones visibles; ${fails.length} resultados visibles de 2026 fuera de meta.\n\n` + fails.slice(0,5).join('\n\n') + '\n\nEn Indicadores CE puedes preparar el correo y marcar el checklist. Plazo indicado por la auditora: día 5 calendario del mes siguiente al cierre del periodo mensual o trimestral. Confirmar la carga original antes de concluir mora.' + sourceNote;
      } else if (/autoeval|evaluacion|evaluación/.test(lower)) {
        aiResponseText = almeraReview.filter(r => r.evaluation.state === 'Ejecución').map(r => `${r.name} (${r.site}): en ejecución. Inicio: ${r.evaluation.start || 'Sin confirmar'}. Fin registrado: ${r.evaluation.end || 'Sin confirmar'}${r.evaluation.end && r.evaluation.end < today ? ' · Confirmar cierre o reprogramación' : ''}. Soporte: ${r.evaluation.source}`).join('\n\n') + '\n\nEl mínimo anual es una autoevaluación. Un registro sin fecha o no visible requiere verificar historial y acceso; no se da por ausente automáticamente.' + sourceNote;
      } else if (/plan|pime|mejora/.test(lower)) {
        const actions = almeraEntries.flatMap(e => 'almeraActions' in e ? e.almeraActions || [] : []);
        const pending = actions.filter(a => a.due < today && a.progress < 100);
        aiResponseText = `${actions.length} actividades incorporadas de los planes consultados; ${pending.length} con fecha de terminación anterior a hoy y avance inferior al 100%.\n\n` + pending.slice(0,5).map(a => `${a.title} · Compromiso: ${a.due} · Avance ${a.progress}%.`).join('\n\n') + '\n\nEl avance 100% no equivale a cierre verificado. Consulta fechas efectivas, evidencias y checklist en Planes de acción y PIME.' + sourceNote;
      } else if (/riesgo|control/.test(lower)) {
        aiResponseText = almeraReview.filter(r => r.risks.state.startsWith('Sin ')).map(r => `${r.name} (${r.site}): ${r.risks.state}. Sistema: ${r.risks.system}. Soporte: ${r.source}#tabRiesgosGral`).join('\n\n') + '\n\nLa creación, revisión de matriz, ejecución de controles y última revisión residual requieren verificación detallada.' + sourceNote;
      } else if (/hoy|agenda|actividad|tarea|vencid|pendiente/.test(lower)) {
        const due = openTasks.filter(t => t.date <= today || (!!t.dueDate && t.dueDate <= today)).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
        aiResponseText = `Actividades CE · ${today} · Bogotá\nFuente: tareas del aplicativo; registros iniciales por validar.\n\n` + (due.map(t => `${t.title} · ${centersExcellence.find(c => c.id === t.centerId)?.name || t.institution}\nResponsable: ${t.responsible}. Compromiso: ${t.dueDate||'Por acordar'}. Estado: ${t.status}.\nPróximo paso: ${t.checklist.find(i => !i.done)?.label || 'Validar cierre y evidencia'}`).join('\n\n') || 'No hay tareas abiertas programadas hasta hoy.') + '\n\nEn Tareas diarias puedes compartir el resumen con tu asistente de agenda y correos.';
      } else if (/resum|centro|avance/.test(lower)) {
        aiResponseText = `Corte de Almera: ${almeraReview.length} centros HIC/ICV, ${almeraIndicators.length} fichas de indicadores.\n\n` + almeraReview.filter(r => r.evaluation.state.includes('Terminada y Aprobada')).map(r => `${r.name}: autoevaluación aprobada del ciclo ${r.evaluation.year}; fin registrado ${r.evaluation.end}.`).join('\n') + '\n\nConsulta Revisión anual CE para las autoevaluaciones en ejecución, matrices y pendientes; Indicadores CE para resultados y alertas; y Planes de acción y PIME para las actividades y sus checklists.' + sourceNote;      } else {
        aiResponseText = 'Puedo consultar el avance registrado de los centros y organizar sus tareas y vencimientos. Para evaluar riesgos, evidencias o cumplimiento necesito registros específicos validados. No tengo una conexión en vivo con Almera, Gmail ni Calendar desde este panel.';
      }
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Ahora',
        cards
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">NIGMA AI Copilot</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-semibold border border-indigo-200 dark:border-indigo-800">
                Contextual
              </span>
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[260px]">
              Auditando: Centros de Excelencia
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsAiDrawerOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Audit Context Banner */}
      <div className="px-4 py-2 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
            Corte privado · registros cargados
          </span>
        </div>
        <button
          onClick={() => setCurrentRoute('/center-review')}
          className="text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 text-[11px] font-semibold flex items-center gap-1"
        >
          Ver revisión CE <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-line text-[12px]">{msg.text}</div>

              {/* Optional cards rendered by AI */}
              {msg.cards && (
                <div className="pt-2 space-y-1.5 border-t border-slate-200 dark:border-slate-700">
                  {msg.cards.map((c, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white mb-0.5">
                        <span>{c.title}</span>
                        {c.badge && (
                          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                            {c.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">{c.description}</div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`text-[10px] ${
                  msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center text-slate-400 text-xs pl-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>NIGMA AI analizando evidencias y controles...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts carousel */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Consultas sugeridas para esta pantalla</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 rounded-lg text-left transition-colors truncate max-w-full"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Pregunta a NIGMA AI sobre riesgos, hallazgos, ISO..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 bg-indigo-600 disabled:opacity-40 hover:bg-indigo-700 text-white rounded-lg transition-colors shrink-0"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};



