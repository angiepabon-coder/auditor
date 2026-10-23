import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Building2,
  FileCheck2,
  ShieldAlert,
  Sliders,
  AlertTriangle,
  ListTodo,
  FolderArchive,
  FileText,
  Activity,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Check,
  ChevronRight,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditTestItem, FindingItem } from '../../types';

export const AuditDetailView: React.FC = () => {
  const {
    selectedAuditId,
    audits,
    tests,
    findings,
    actionPlans,
    evidences,
    setCurrentRoute,
    navigateToProfile,
    setIsExportModalOpen,
    setExportFormat
  } = useApp();

  const audit = audits.find(a => a.id === selectedAuditId) || audits[0];

  type AuditTabKey =
    | 'resumen'
    | 'planeacion'
    | 'riesgos'
    | 'controles'
    | 'programa'
    | 'pruebas'
    | 'evidencias'
    | 'hallazgos'
    | 'planes'
    | 'informe'
    | 'actividad';

  const [activeTab, setActiveTab] = useState<AuditTabKey>('resumen');
  const [selectedTest, setSelectedTest] = useState<AuditTestItem | null>(null);

  if (!audit) return <p className="p-6">No hay una auditoría seleccionada. Registra la auditoría desde la gestión por centro.</p>;
  const auditTests = tests.filter(t => t.auditId === audit.id || t.auditCode === audit.code);
  const auditFindings = findings.filter(f => f.auditId === audit.id || f.auditCode === audit.code);
  const auditEvidences = evidences.filter(e => e.auditId === audit.id || e.auditCode === audit.code);

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'planeacion', label: 'Planeación' },
    { id: 'riesgos', label: `Riesgos (${audit.indicators.risksCount})` },
    { id: 'controles', label: `Controles (${audit.indicators.controlsCount})` },
    { id: 'programa', label: 'Programa' },
    { id: 'pruebas', label: `Pruebas (${auditTests.length || audit.indicators.testsCount})` },
    { id: 'evidencias', label: `Evidencias (${auditEvidences.length})` },
    { id: 'hallazgos', label: `Hallazgos (${auditFindings.length || audit.indicators.findingsCount})` },
    { id: 'planes', label: 'Planes de Acción' },
    { id: 'informe', label: 'Informe' },
    { id: 'actividad', label: 'Actividad' },
  ];

  const timelineStages = [
    { name: 'Planeación', status: 'completed' },
    { name: 'Trabajo de campo', status: 'active' },
    { name: 'Revisión', status: 'pending' },
    { name: 'Informe', status: 'pending' },
    { name: 'Seguimiento', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setCurrentRoute('/audits')}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mt-0.5"
              title="Volver a Auditorías"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {audit.code}
                </span>
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/80 px-2 py-0.5 rounded">
                  {audit.status}
                </span>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                  Riesgo {audit.riskLevel}
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Perfil: {audit.profileName} (v{audit.profileVersion})
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {audit.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {audit.company} · {audit.sede} · Área de {audit.area}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress circular / indicator */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${audit.progress}%` }}
                />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-xs tabular-nums">
                {audit.progress}%
              </span>
            </div>

            <button
              onClick={() => {
                setExportFormat('PDF');
                setIsExportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Dictamen</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-1 border-t border-slate-100 dark:border-slate-800 mt-5 pt-3 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AuditTabKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. RESUMEN TAB */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          {/* Key Indicators Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400">Riesgos Identificados</span>
              <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {audit.indicators.risksCount}
              </div>
              <span className="text-[11px] text-slate-500">2 críticos · 3 altos</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400">Controles Clave</span>
              <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {audit.indicators.controlsCount}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">8 efectivos evaluados</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400">Pruebas en Programa</span>
              <div className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {audit.indicators.testsCount}
              </div>
              <span className="text-[11px] text-slate-500">11 ejecutadas (61%)</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400">Hallazgos Detectados</span>
              <div className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {audit.indicators.findingsCount}
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">1 crítico · 2 en plan</span>
            </div>
          </div>

          {/* Timeline of Stages */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Línea de Tiempo y Etapas de Avance
            </h3>
            <div className="flex items-center justify-between overflow-x-auto py-2">
              {timelineStages.map((st, idx) => (
                <React.Fragment key={st.name}>
                  <div className="flex flex-col items-center text-center shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        st.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : st.status === 'active'
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {st.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5">
                      {st.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {st.status === 'completed' ? 'Finalizada' : st.status === 'active' ? 'En curso' : 'Pendiente'}
                    </span>
                  </div>
                  {idx < timelineStages.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 ${
                        st.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Scope and Team Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-2xs text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Objetivo y Alcance Formal
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {audit.scopeObjective}
              </p>
              <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-500">Periodo Muestreado:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{audit.scopePeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cronograma de Ejecución:</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {audit.startDate} al {audit.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Perfil Metodológico Base:</span>
                  <button
                    onClick={() => navigateToProfile(audit.profileId)}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {audit.profileName} v{audit.profileVersion} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-2xs text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Equipo Asignado y Gobernanza
              </h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-500">Auditor Líder:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{audit.leadAuditor}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-500">Auditores de Campo:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{audit.auditors.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-500">Dueño del Proceso (Auditado):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{audit.processOwner}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-500">Aprobador / Comité:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{audit.approver}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRUEBAS TAB (With Procedure execution Drawer) */}
      {(activeTab === 'pruebas' || activeTab === 'programa') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Programa de Pruebas de Auditoría
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Haz clic en cualquier prueba para abrir la cédula de trabajo, registrar conclusiones y asociar evidencias.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="py-2.5 px-3 font-semibold">Código</th>
                  <th className="py-2.5 px-3 font-semibold">Procedimiento / Prueba</th>
                  <th className="py-2.5 px-3 font-semibold">Responsable</th>
                  <th className="py-2.5 px-3 font-semibold">Fecha</th>
                  <th className="py-2.5 px-3 font-semibold">Estado</th>
                  <th className="py-2.5 px-3 font-semibold">Resultado</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Cédula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditTests.map(test => (
                  <tr
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {test.code}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-sm truncate">
                      {test.procedureName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {test.responsible}
                    </td>
                    <td className="py-3 px-3 text-slate-500 tabular-nums">
                      {test.date}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        {test.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          test.result === 'Satisfactorio'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : test.result === 'Con desviaciones'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {test.result}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-end gap-1 ml-auto"
                      >
                        <span>Inspeccionar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. HALLAZGOS TAB */}
      {activeTab === 'hallazgos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Hallazgos Identificados en {audit.code}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Desviaciones observadas en el proceso de {audit.process} con sus respectivos planes de remediación.
              </p>
            </div>
            <button
              onClick={() => setCurrentRoute('/findings')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Ver en módulo general
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {auditFindings.map(f => (
              <div
                key={f.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {f.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        f.severity === 'Crítico'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                      }`}
                    >
                      {f.severity}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {f.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  {f.title}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Criterio:</span> {f.criterion}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Condición:</span> {f.condition}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] mt-2">
                  <span className="font-bold text-slate-900 dark:text-white">Recomendación:</span> {f.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs fallback */}
      {activeTab !== 'resumen' && activeTab !== 'pruebas' && activeTab !== 'programa' && activeTab !== 'hallazgos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs space-y-2">
          <FileText className="w-8 h-8 text-indigo-500 mx-auto" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm capitalize">
            {activeTab} de {audit.code}
          </h4>
          <p className="text-slate-500 max-w-md mx-auto">
            Módulo completamente conectado a la instancia metodológica {audit.profileName} v{audit.profileVersion}. Todos los registros guardan relación con el cronograma y plan anual de auditoría.
          </p>
        </div>
      )}

      {/* LATERAL DRAWER FOR TEST EXECUTION (CÉDULA DE PRUEBA) */}
      {selectedTest && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[540px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
            <div>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {selectedTest.code} · Papel de Trabajo
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 truncate max-w-sm">
                {selectedTest.procedureName}
              </h3>
            </div>
            <button
              onClick={() => setSelectedTest(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Objetivo del Procedimiento
              </span>
              <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedTest.objective}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Procedimiento Ejecutado:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedTest.procedureText}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Población Auditada:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedTest.population}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Muestra Seleccionada:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedTest.sample}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Criterios de Evaluación y Norma
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {selectedTest.criteria}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Conclusión del Auditor
              </span>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                {selectedTest.conclusion}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Evidencias Digitales Vinculadas
              </span>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                    Reporte_Matriz_Roles_SAP_MM_FI_Q3.xlsx
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  Aprobada
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-end gap-2">
            <button
              onClick={() => setSelectedTest(null)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              Cerrar Cédula
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
