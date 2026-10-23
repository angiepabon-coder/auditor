import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Copy,
  GitBranch,
  Archive,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
  FileCheck2,
  Shield,
  Layers,
  Settings,
  AlertTriangle,
  FileText,
  Users,
  Grid,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  AuditProfile,
  MethodologyStage,
  ChecklistSection,
  ChecklistQuestion,
  AuditProcedureTemplate,
  CustomFieldDefinition
} from '../../types';

export const AuditProfileDetailView: React.FC = () => {
  const {
    selectedProfileId,
    profiles,
    updateProfile,
    duplicateProfile,
    bumpProfileVersion,
    setCurrentRoute,
    setIsWizardOpen
  } = useApp();

  const profile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  type TabKey =
    | 'resumen'
    | 'metodologia'
    | 'riesgos'
    | 'checklist'
    | 'programa'
    | 'evidencias'
    | 'hallazgos'
    | 'planes'
    | 'campos'
    | 'roles'
    | 'informe'
    | 'versiones';

  const [activeTab, setActiveTab] = useState<TabKey>('resumen');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Local mutable state for editing
  const [stages, setStages] = useState<MethodologyStage[]>(profile?.methodologyStages || []);
  const [matrixSize, setMatrixSize] = useState<'3x3' | '4x4' | '5x5' | 'Personalizada'>(
    profile?.riskMatrixConfig?.size || '5x5'
  );
  const [checklistSections, setChecklistSections] = useState<ChecklistSection[]>(
    profile?.checklistSections || []
  );
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(
    profile?.customFields || []
  );
  const [procedures, setProcedures] = useState<AuditProcedureTemplate[]>(
    profile?.auditProgram || []
  );
  const [reportSections, setReportSections] = useState(profile?.reportTemplate || []);

  // New item modal/form states
  const [newStageName, setNewStageName] = useState('');
  const [newStageRole, setNewStageRole] = useState('Auditor');
  const [newStageCondition, setNewStageCondition] = useState('');

  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldDefinition['type']>('Texto');
  const [newFieldApplies, setNewFieldApplies] = useState<CustomFieldDefinition['appliesTo']>('Auditoría');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<ChecklistQuestion['responseType']>('Conforme / No conforme');
  const [newQuestionMandatory, setNewQuestionMandatory] = useState(true);
  const [newQuestionEvidence, setNewQuestionEvidence] = useState(true);
  const [newQuestionFinding, setNewQuestionFinding] = useState(true);

  const showSaveSuccess = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  const handleSaveProfile = () => {
    const updated: AuditProfile = {
      ...profile,
      methodologyStages: stages,
      riskMatrixConfig: {
        ...profile.riskMatrixConfig,
        size: matrixSize
      },
      checklistSections,
      customFields,
      auditProgram: procedures,
      reportTemplate: reportSections,
      updatedAt: 'Hoy'
    };
    updateProfile(updated);
    showSaveSuccess();
  };

  // Stage operations
  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    const newStage: MethodologyStage = {
      id: `stage-${Date.now()}`,
      name: newStageName.trim(),
      order: stages.length + 1,
      responsibleRole: newStageRole,
      advanceConditions: newStageCondition || 'Condición de aprobación formal registrada',
      isMandatory: true,
      color: 'indigo'
    };
    setStages(prev => [...prev, newStage]);
    setNewStageName('');
    setNewStageCondition('');
  };

  const handleDeleteStage = (id: string) => {
    setStages(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const handleMoveStage = (idx: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === stages.length - 1)) return;
    const nextStages = [...stages];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = nextStages[idx];
    nextStages[idx] = nextStages[targetIdx];
    nextStages[targetIdx] = temp;
    setStages(nextStages.map((s, i) => ({ ...s, order: i + 1 })));
  };

  // Custom field operations
  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;
    const autoKey = newFieldKey.trim() || newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newField: CustomFieldDefinition = {
      id: `cf-${Date.now()}`,
      label: newFieldLabel.trim(),
      key: autoKey,
      type: newFieldType,
      required: newFieldRequired,
      appliesTo: newFieldApplies,
      options: newFieldOptions ? newFieldOptions.split(',').map(o => o.trim()) : undefined
    };
    setCustomFields(prev => [...prev, newField]);
    setNewFieldLabel('');
    setNewFieldKey('');
    setNewFieldOptions('');
  };

  const handleDeleteCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  // Checklist question operations
  const handleAddQuestion = (sectionId: string) => {
    if (!newQuestionText.trim()) return;
    const newQ: ChecklistQuestion = {
      id: `q-${Date.now()}`,
      code: `CK-${Math.floor(10 + Math.random() * 90)}`,
      text: newQuestionText.trim(),
      responseType: newQuestionType,
      isMandatory: newQuestionMandatory,
      requireEvidence: newQuestionEvidence,
      generatesFinding: newQuestionFinding,
      scoreWeight: 10
    };
    setChecklistSections(prev =>
      prev.map(sec => (sec.id === sectionId ? { ...sec, questions: [...sec.questions, newQ] } : sec))
    );
    setNewQuestionText('');
  };

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'metodologia', label: 'Metodología' },
    { id: 'riesgos', label: 'Riesgos' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'programa', label: 'Programa' },
    { id: 'evidencias', label: 'Evidencias' },
    { id: 'hallazgos', label: 'Hallazgos' },
    { id: 'planes', label: 'Planes de Acción' },
    { id: 'campos', label: 'Campos', highlight: true },
    { id: 'roles', label: 'Roles' },
    { id: 'informe', label: 'Informe' },
    { id: 'versiones', label: 'Versiones' },
  ];

  if (!profile) return <p className="p-6">No hay un perfil seleccionado.</p>;
  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setCurrentRoute('/audit-profiles')}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mt-0.5"
              title="Volver a Perfiles"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {profile.code}
                </span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">
                  v{profile.version}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {profile.status}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {profile.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => duplicateProfile(profile.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicar</span>
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </div>

        {/* Saved confirmation toast */}
        {isSavedToast && (
          <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuración del perfil actualizada con éxito.</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center gap-1 border-t border-slate-100 dark:border-slate-800 mt-5 pt-3 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.highlight && (
                <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${activeTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'}`}>
                  Custom
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. RESUMEN TAB */}
      {activeTab === 'resumen' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ficha Técnica del Perfil
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Código Metodológico:</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{profile.code}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Categoría Principal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Versión Vigente:</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">v{profile.version}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estado Operativo:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{profile.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Propietario Técnico:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.owner}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Última Modificación:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.updatedAt}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1.5">Sectores Sugeridos:</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.sectors.map((sec, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1">Descripción:</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {profile.description}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Uso e Impacto en Producción
            </h3>
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {profile.auditsCount}
              </div>
              <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 mt-1">
                Auditorías creadas con este perfil
              </div>
              <p className="text-[11px] text-indigo-700/70 dark:text-indigo-300/70 mt-1">
                Cada auditoría funciona como una instancia independiente e inmutable.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="w-full flex items-center justify-between p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-2xs"
              >
                <span>+ Nueva Auditoría con este Perfil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => duplicateProfile(profile.id)}
                className="w-full flex items-center justify-between p-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
              >
                <span>Duplicar como plantilla derivada</span>
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. METODOLOGÍA TAB (Workflow Stepper Builder) */}
      {activeTab === 'metodologia' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workflow y Etapas Metodológicas
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Define el ciclo de vida del proceso de auditoría. Puedes reorganizar, renombrar y configurar condiciones de avance para cada compuerta de aprobación.
            </p>
          </div>

          {/* Stepper horizontal preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <div className="flex items-center min-w-[700px]">
              {stages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {stage.order}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5 max-w-[100px] truncate">
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                      {stage.responsibleRole}
                    </span>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="flex-1 h-0.5 bg-indigo-200 dark:bg-indigo-900 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Stages list editor */}
          <div className="space-y-2 text-xs">
            {stages.map((stage, idx) => (
              <div
                key={stage.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex flex-col gap-0.5 text-slate-400">
                    <button
                      onClick={() => handleMoveStage(idx, 'up')}
                      disabled={idx === 0}
                      className="disabled:opacity-20 hover:text-indigo-600"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveStage(idx, 'down')}
                      disabled={idx === stages.length - 1}
                      className="disabled:opacity-20 hover:text-indigo-600"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 font-bold text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    {stage.order}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {stage.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Compuerta: {stage.advanceConditions}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    Rol: {stage.responsibleRole}
                  </span>
                  <button
                    onClick={() => handleDeleteStage(stage.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Eliminar etapa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Stage Form */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Agregar Nueva Etapa Metodológica</span>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Nombre de la Etapa</label>
                <input
                  type="text"
                  placeholder="Ej: Mesa de Trabajo Previa"
                  value={newStageName}
                  onChange={e => setNewStageName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Rol Responsable</label>
                <select
                  value={newStageRole}
                  onChange={e => setNewStageRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Auditor Líder">Auditor Líder</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Director de Auditoría">Director de Auditoría</option>
                  <option value="Responsable del Proceso">Responsable del Proceso</option>
                  <option value="Comité de Auditoría">Comité de Auditoría</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Condición de Avance</label>
                <input
                  type="text"
                  placeholder="Ej: Minuta firmada por auditado"
                  value={newStageCondition}
                  onChange={e => setNewStageCondition(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAddStage}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Agregar Etapa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MATRIZ DE RIESGOS TAB */}
      {activeTab === 'riesgos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Configuración de Matriz de Riesgos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecciona las dimensiones de probabilidad e impacto y personaliza los niveles de tolerancia.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Dimensiones de la Matriz:</span>
            {(['3x3', '4x4', '5x5', 'Personalizada'] as const).map(size => (
              <button
                key={size}
                onClick={() => setMatrixSize(size)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  matrixSize === size
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <span className="font-bold text-emerald-800 dark:text-emerald-200 text-xs">Nivel Bajo (1-5 pts)</span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                Riesgo aceptable con controles operativos ordinarios.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <span className="font-bold text-amber-800 dark:text-amber-200 text-xs">Nivel Medio (6-9 pts)</span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                Riesgo tolerable; requiere monitoreo trimestral y pruebas de eficacia.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60">
              <span className="font-bold text-orange-800 dark:text-orange-200 text-xs">Nivel Alto (10-14 pts)</span>
              <p className="text-[11px] text-orange-700 dark:text-orange-300 mt-1">
                Riesgo significativo; requiere plan de mitigación prioritario.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
              <span className="font-bold text-rose-800 dark:text-rose-200 text-xs">Nivel Crítico (15-25 pts)</span>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">
                Riesgo inaceptable; requiere intervención inmediata de dirección ejecutiva.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. CHECKLIST BUILDER TAB */}
      {activeTab === 'checklist' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Constructor Visual de Checklist y Cuestionarios
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Diseña cuestionarios de verificación, tipos de respuesta y reglas automáticas de generación de hallazgos.
              </p>
            </div>
          </div>

          {/* Sections list */}
          {checklistSections.map(sec => (
            <div key={sec.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                <span>{sec.title}</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {sec.questions.length} preguntas
                </span>
              </div>

              <div className="space-y-2">
                {sec.questions.map(q => (
                  <div
                    key={q.id}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                        {q.code}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                        {q.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                        {q.responseType}
                      </span>
                      {q.isMandatory && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                          Obligatoria
                        </span>
                      )}
                      {q.requireEvidence && (
                        <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">
                          Evidencia
                        </span>
                      )}
                      {q.generatesFinding && (
                        <span className="text-[10px] bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-medium">
                          Abre Hallazgo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add question to this section */}
              <div className="pt-2 flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Escribe el texto de una nueva pregunta para esta sección..."
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <select
                  value={newQuestionType}
                  onChange={e => setNewQuestionType(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Conforme / No conforme">Conforme / No conforme</option>
                  <option value="Sí / No">Sí / No</option>
                  <option value="Escala 1–5">Escala 1–5</option>
                  <option value="Texto">Texto</option>
                  <option value="Número">Número</option>
                  <option value="Archivo">Archivo</option>
                  <option value="Firma">Firma</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleAddQuestion(sec.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0"
                >
                  + Pregunta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. PROGRAMA DE AUDITORÍA TAB */}
      {activeTab === 'programa' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Programa de Pruebas Reutilizables
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Procedimientos estándar que se precargarán automáticamente al iniciar cualquier auditoría con este perfil.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {procedures.map(prg => (
              <div
                key={prg.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {prg.code} · {prg.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Rol: {prg.suggestedRole}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {prg.objective}
                </p>
                <div className="text-[11px] text-slate-500 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong>Procedimiento:</strong> {prg.procedureText}
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                  <span><strong>Riesgo:</strong> {prg.relatedRisk}</span>
                  <span><strong>Control:</strong> {prg.relatedControl}</span>
                  <span><strong>Evidencia exigida:</strong> {prg.requiredEvidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. EVIDENCIAS TAB */}
      {activeTab === 'evidencias' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Política de Evidencias Digitales
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configura los formatos admisibles, requisitos de aprobación y umbrales mínimos probatorios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {(['PDF', 'Excel', 'Word', 'Imagen', 'Enlace', 'Registro', 'Formulario'] as const).map(fmt => (
              <div
                key={fmt}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
              >
                <span className="font-bold text-slate-900 dark:text-white">{fmt}</span>
                <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Permitido
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
              <span className="font-bold text-indigo-900 dark:text-indigo-200">Evidencia Obligatoria</span>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                Toda prueba no conforme debe anexar soporte digital antes de poder avanzar de etapa.
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/60">
              <span className="font-bold text-purple-900 dark:text-purple-200">Validación por Supervisor</span>
              <p className="text-[11px] text-purple-700/80 dark:text-purple-300/80 mt-1">
                El Auditor Líder debe emitir dictamen de aprobación formal sobre el papel de trabajo.
              </p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-200">Mínimo de Evidencias</span>
              <p className="text-[11px] text-slate-500 mt-1">
                Mínimo 1 archivo adjunto por prueba ejecutada en terreno.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. HALLAZGOS TAB */}
      {activeTab === 'hallazgos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Reglas y Campos Estándar de Hallazgos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Estructura basada en las 5C de auditoría internacional: Criterio, Condición, Causa, Consecuencia y Corrección.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {['Criterio (Norma/Política)', 'Condición (Hecho observado)', 'Causa Raíz (Por qué ocurrió)', 'Consecuencia (Impacto/Riesgo)', 'Recomendación (Plan de acción)'].map(c => (
              <div key={c} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="font-bold text-slate-900 dark:text-white block">{c}</span>
                <span className="text-[10px] text-rose-600 font-semibold">Campo Obligatorio</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">Regla Automática del Perfil</h4>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-900 font-mono text-indigo-700 dark:text-indigo-300">
              IF (Resultado == "No Conforme" AND Criticidad == "Alta") THEN Sugerir apertura automática de Hallazgo con notificación prioritaria al Auditor Líder.
            </div>
          </div>
        </div>
      )}

      {/* 8. PLANES DE ACCIÓN TAB */}
      {activeTab === 'planes' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ciclo de Vida de Planes de Acción
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Campos y transiciones permitidas para los compromisos de remediación asumidos por los auditados.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {(['Pendiente', 'En ejecución', 'Para validar', 'Cerrado', 'Vencido'] as const).map(st => (
              <span key={st} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Estado: {st}
              </span>
            ))}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <span className="font-bold text-slate-900 dark:text-white">SLA Máximo por Defecto:</span>
            <p className="text-slate-600 dark:text-slate-400">
              30 días calendario para hallazgos medios, 15 días para altos y 5 días para críticos.
            </p>
          </div>
        </div>
      )}

      {/* 9. CAMPOS PERSONALIZADOS TAB (CRÍTICO MULTISECTOR) */}
      {activeTab === 'campos' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Constructor de Campos Personalizados
                </h3>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2 py-0.5 rounded">
                  Núcleo Multisector
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Adapta NIGMA Audit a cualquier industria (hospitales, plantas, obras, banca) agregando campos propios de ese sector sin alterar el núcleo de la aplicación.
              </p>
            </div>
          </div>

          {/* Existing custom fields list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {customFields.map(f => (
              <div
                key={f.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{f.label}</span>
                    {f.required && (
                      <span className="text-[10px] text-rose-500 font-bold">*</span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                    key: {f.key}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-semibold">
                      {f.type}
                    </span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      En: {f.appliesTo}
                    </span>
                  </div>
                  {f.options && (
                    <div className="text-[10px] text-slate-500 mt-1.5 truncate max-w-[200px]">
                      Opciones: {f.options.join(', ')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteCustomField(f.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Eliminar campo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom field form */}
          <form
            onSubmit={handleAddCustomField}
            className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl space-y-3 text-xs"
          >
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Crear Campo Personalizado para este Perfil</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Etiqueta Visible *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lote de Fármaco / N° Matrícula"
                  value={newFieldLabel}
                  onChange={e => setNewFieldLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Tipo de Dato</label>
                <select
                  value={newFieldType}
                  onChange={e => setNewFieldType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Texto">Texto</option>
                  <option value="Número">Número</option>
                  <option value="Fecha">Fecha</option>
                  <option value="Dropdown">Dropdown (Lista desplegable)</option>
                  <option value="Checkbox">Checkbox (Booleano)</option>
                  <option value="Selección múltiple">Selección múltiple</option>
                  <option value="Usuario">Usuario del Sistema</option>
                  <option value="Archivo">Archivo adjunto</option>
                  <option value="Área">Área Organizacional</option>
                  <option value="Proceso">Proceso</option>
                  <option value="URL">Enlace URL</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Aplica en</label>
                <select
                  value={newFieldApplies}
                  onChange={e => setNewFieldApplies(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Auditoría">Auditoría (Encabezado)</option>
                  <option value="Hallazgo">Hallazgo</option>
                  <option value="Prueba">Prueba de Campo</option>
                  <option value="Riesgo">Riesgo</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Opciones (si es Dropdown)</label>
                <input
                  type="text"
                  placeholder="Urgencias, UCI, Cirugía"
                  value={newFieldOptions}
                  onChange={e => setNewFieldOptions(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={e => setNewFieldRequired(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  Campo obligatorio al registrar
                </span>
              </label>

              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Agregar Campo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 10. ROLES TAB */}
      {activeTab === 'roles' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Matriz de Permisos Específicos del Perfil
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Asigna permisos de visualización, creación, aprobación y cierre para los roles que intervienen en esta metodología.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 pr-4 font-semibold">Rol Metodológico</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Ver</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Crear</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Editar</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Aprobar</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Cerrar</th>
                  <th className="py-2.5 pl-3 font-semibold text-center">Exportar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { role: 'Director de Auditoría', v: true, c: true, e: true, a: true, cl: true, ex: true },
                  { role: 'Auditor Líder', v: true, c: true, e: true, a: true, cl: false, ex: true },
                  { role: 'Auditor de Campo', v: true, c: true, e: true, a: false, cl: false, ex: true },
                  { role: 'Responsable del Proceso (Auditado)', v: true, c: false, e: false, a: false, cl: false, ex: true },
                  { role: 'Observador / Directivo', v: true, c: false, e: false, a: false, cl: false, ex: false },
                ].map(r => (
                  <tr key={r.role} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">{r.role}</td>
                    <td className="py-3 px-3 text-center">{r.v ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="py-3 px-3 text-center">{r.c ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="py-3 px-3 text-center">{r.e ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="py-3 px-3 text-center">{r.a ? <Check className="w-4 h-4 text-indigo-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="py-3 px-3 text-center">{r.cl ? <Check className="w-4 h-4 text-purple-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="py-3 pl-3 text-center">{r.ex ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 11. INFORME TAB */}
      {activeTab === 'informe' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Estructura de la Plantilla de Informe Ejecutivo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Activa o desactiva secciones que se imprimirán en el dictamen final exportable.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {reportSections.map(sec => (
              <div
                key={sec.id}
                className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                    {sec.order}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {sec.name}
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sec.enabled}
                    onChange={() => {
                      setReportSections(prev =>
                        prev.map(s => (s.id === sec.id ? { ...s, enabled: !s.enabled } : s))
                      );
                    }}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-[11px] text-slate-500">
                    {sec.enabled ? 'Incluido' : 'Omitido'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. VERSIONES TAB */}
      {activeTab === 'versiones' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Historial de Versionado e Inmutabilidad
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro formal de cambios metodológicos. Cuando una auditoría se crea, queda congelada con la versión vigente en ese instante.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {profile.versionsHistory.map((v, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      v{v.version}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        v.status === 'Vigente'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v.status}
                    </span>
                    <span className="text-slate-400 text-[11px]">· {v.date}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mt-1.5 font-medium">
                    {v.changes}
                  </p>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Autor: {v.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
