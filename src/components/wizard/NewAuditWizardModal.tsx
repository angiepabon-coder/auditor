import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileCheck2,
  Cpu,
  Building2,
  Target,
  Users,
  Calendar,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditItem } from '../../types';

export const NewAuditWizardModal: React.FC = () => {
  const {
    isWizardOpen,
    setIsWizardOpen,
    profiles,
    addAudit,
    navigateToAudit,
    orgTree
  } = useApp();

  const [step, setStep] = useState(1);
  const [profileSearch, setProfileSearch] = useState('');

  // Step 1: Selected profile
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id || 'profile-1');

  // Step 2: Context
  const [company, setCompany] = useState('');
  const [sede, setSede] = useState('');
  const [area, setArea] = useState('');
  const [process, setProcess] = useState('');
  const [subprocess, setSubprocess] = useState('');

  // Step 3: Scope
  const [auditTitle, setAuditTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [riskLevel, setRiskLevel] = useState<AuditItem['riskLevel']>('Alto');

  // Step 4: Team
  const [leadAuditor, setLeadAuditor] = useState('');
  const [auditorsString, setAuditorsString] = useState('');
  const [processOwner, setProcessOwner] = useState('');
  const [approver, setApprover] = useState('');

  if (!isWizardOpen) return null;
  if (!profiles.length) return <div role="dialog" aria-label="Nueva auditoría" className="fixed inset-0 z-50 bg-white dark:bg-slate-900 p-8"><h2>Primero registra un perfil de auditoría</h2><p>También puedes agregar auditorías por centro desde Gestión de auditoría.</p><button onClick={()=>setIsWizardOpen(false)}>Cerrar</button></div>;

  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  const filteredProfiles = profiles.filter(
    p =>
      p.name.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(profileSearch.toLowerCase())
  );

  const handleFinish = () => {
    const newCode = `AUD-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const newAudit: AuditItem = {
      id: `aud-${Date.now()}`,
      code: newCode,
      title: auditTitle || `Auditoría al proceso de ${area}`,
      profileId: selectedProfile.id,
      profileName: selectedProfile.name,
      profileVersion: selectedProfile.version,
      company,
      sede,
      area,
      process,
      subprocess,
      leadAuditor,
      auditors: auditorsString.split(',').map(s => s.trim()),
      processOwner,
      approver,
      startDate,
      endDate,
      progress: 5,
      status: 'Planeación',
      riskLevel,
      scopeObjective: objective,
      scopePeriod: period,
      includedProcesses: [process, subprocess],
      includedRisks: ['RSK-CMP-01', 'RSK-CMP-02'],
      includedControls: ['CTL-CMP-01', 'CTL-CMP-02'],
      indicators: {
        risksCount: 4,
        controlsCount: 6,
        testsCount: selectedProfile.auditProgram?.length || 8,
        findingsCount: 0
      }
    };

    addAudit(newAudit);
    setIsWizardOpen(false);
    setStep(1);
    navigateToAudit(newAudit.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs text-slate-700 dark:text-slate-300">
        {/* Wizard Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Nueva Auditoría · Asistente de Creación
              </h2>
              <p className="text-[11px] text-slate-500">
                Paso {step} de 5: {step === 1 ? 'Seleccionar Perfil Metodológico' : step === 2 ? 'Definir Contexto Organizacional' : step === 3 ? 'Establecer Alcance y Objetivos' : step === 4 ? 'Asignar Equipo y Responsables' : 'Revisar y Clonar Instancia'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWizardOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress bar */}
        <div className="px-6 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-950 flex items-center justify-between text-[11px] font-semibold text-slate-500 shrink-0">
          {['1. Perfil', '2. Contexto', '3. Alcance', '4. Equipo', '5. Confirmación'].map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 ${
                step === idx + 1
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : step > idx + 1
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === idx + 1
                    ? 'bg-indigo-600 text-white'
                    : step > idx + 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: Seleccionar Perfil de Auditoría */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Paso 1: Selecciona el Perfil de Auditoría Metodológico
                  </h3>
                  <p className="text-xs text-slate-500">
                    La auditoría heredará el workflow, matriz de riesgos, checklist, programa y campos personalizados de esta plantilla.
                  </p>
                </div>
              </div>

              {/* Search box for profiles */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar perfiles (Interna General, Financiera, TI, Calidad, SST...)"
                  value={profileSearch}
                  onChange={e => setProfileSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {filteredProfiles.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfileId(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedProfileId === p.id
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {p.code}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                        v{p.version}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                      {p.name}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400">
                      Sectores: {p.sectors.slice(0, 3).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Seleccionar contexto */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Paso 2: Contexto Organizacional
                </h3>
                <p className="text-xs text-slate-500">
                  Ubica la auditoría dentro de la jerarquía de la empresa y define el proceso auditado.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organización / Empresa *
                  </label>
                  <select
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Centros de Excelencia">Centros de Excelencia</option>
                    <option value="Red Hospitalaria San Vicente">Red Hospitalaria San Vicente</option>
                    <option value="Constructora e Infraestructura Andina">Constructora e Infraestructura Andina</option>
                    <option value="Logística & Transporte Global">Logística & Transporte Global</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sede Operativa *
                  </label>
                  <input
                    type="text"
                    value={sede}
                    onChange={e => setSede(e.target.value)}
                    placeholder="Sede Principal - Bogotá"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Área Responsable *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="Compras, Finanzas, TI, Urgencias..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Proceso Auditado *
                  </label>
                  <input
                    type="text"
                    value={process}
                    onChange={e => setProcess(e.target.value)}
                    placeholder="Abastecimiento Estratégico"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subproceso Específico
                </label>
                <input
                  type="text"
                  value={subprocess}
                  onChange={e => setSubprocess(e.target.value)}
                  placeholder="Selección, Contratación y Recepción"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Definir alcance */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Paso 3: Alcance, Objetivo y Fechas
                </h3>
                <p className="text-xs text-slate-500">
                  Establece el horizonte temporal y la justificación técnica de la evaluación.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la Auditoría *
                </label>
                <input
                  type="text"
                  required
                  value={auditTitle}
                  onChange={e => setAuditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Objetivo General *
                </label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Periodo Evaluado
                  </label>
                  <input
                    type="text"
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    placeholder="Q4 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Inicial *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Final *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nivel de Riesgo Global Asignado
                </label>
                <div className="flex gap-2">
                  {(['Bajo', 'Medio', 'Alto', 'Crítico'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setRiskLevel(lvl)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                        riskLevel === lvl
                          ? lvl === 'Crítico'
                            ? 'bg-rose-600 text-white'
                            : lvl === 'Alto'
                            ? 'bg-orange-600 text-white'
                            : lvl === 'Medio'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Asignar equipo */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Paso 4: Equipo Auditor y Responsables
                </h3>
                <p className="text-xs text-slate-500">
                  Asigna los roles que firmarán y responderán por el trabajo de campo y los planes de acción.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Auditor Líder *
                  </label>
                  <input
                    type="text"
                    value={leadAuditor}
                    onChange={e => setLeadAuditor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Auditores Asistentes (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={auditorsString}
                    onChange={e => setAuditorsString(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Responsable del Proceso (Auditado) *
                  </label>
                  <input
                    type="text"
                    value={processOwner}
                    onChange={e => setProcessOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Aprobador Final / Comité *
                  </label>
                  <input
                    type="text"
                    value={approver}
                    onChange={e => setApprover(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Revisar configuración y clonar */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Paso 5: Revisión y Creación de Instancia Independiente
                </h3>
                <p className="text-xs text-slate-500">
                  Al confirmar, se clonará la configuración completa de <strong>{selectedProfile.name} v{selectedProfile.version}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Perfil Seleccionado:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedProfile.code} - {selectedProfile.name} (v{selectedProfile.version})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Auditoría:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{auditTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organización y Sede:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{company} · {sede}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proceso:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{process} / {subprocess}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Equipo:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Líder: {leadAuditor} · Auditores: {auditorsString}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fechas:</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {startDate} al {endDate} ({period})
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-[11px] text-indigo-800 dark:text-indigo-200 leading-relaxed flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Aislamiento de auditoría:</strong> Esta auditoría conservará la instantánea metodológica v{selectedProfile.version}. Modificaciones futuras al perfil no alterarán esta auditoría.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 rounded-lg font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(prev => Math.min(5, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Crear Auditoría Independiente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
