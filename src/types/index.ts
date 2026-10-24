export type PeriodType = '30d' | 'quarter' | 'year';

export type RiskLevel = 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
export type AuditStatus = 'Planeación' | 'En ejecución' | 'Revisión' | 'Completadas';
export type FindingSeverity = 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
export type FindingStatus = 'Borrador' | 'Abierto' | 'En remediación' | 'Pendiente validación' | 'Cerrado';
export type ActionPlanStatus = 'Pendiente' | 'En ejecución' | 'Para validar' | 'Cerrado' | 'Vencido';
export type ControlEffectiveness = 'Efectivo' | 'Parcialmente efectivo' | 'Inefectivo' | 'No evaluado';
export type ControlType = 'Preventivo' | 'Detectivo' | 'Correctivo';
export type ControlFrequency = 'Continuo' | 'Diario' | 'Semanal' | 'Mensual' | 'Trimestral' | 'Anual';
export type EvidenceType = 'PDF' | 'Excel' | 'Word' | 'Imagen' | 'Enlace' | 'Registro' | 'Formulario';

export interface AuditProfile {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  version: string;
  status: 'Activo' | 'Borrador' | 'Archivado';
  sectors: string[];
  auditsCount: number;
  updatedAt: string;
  createdAt: string;
  owner: string;
  methodologyStages: MethodologyStage[];
  riskMatrixConfig: RiskMatrixConfig;
  checklistSections: ChecklistSection[];
  auditProgram: AuditProcedureTemplate[];
  findingRules: FindingRulesConfig;
  evidenceConfig: EvidenceConfig;
  actionPlanConfig: ActionPlanConfig;
  customFields: CustomFieldDefinition[];
  rolesConfig: RolePermissionConfig[];
  reportTemplate: ReportSectionConfig[];
  versionsHistory: VersionHistoryEntry[];
}

export interface MethodologyStage {
  id: string;
  name: string;
  order: number;
  responsibleRole: string;
  advanceConditions: string;
  isMandatory: boolean;
  color?: string;
}

export interface RiskMatrixConfig {
  size: '3x3' | '4x4' | '5x5' | 'Personalizada';
  probabilityLabels: string[];
  impactLabels: string[];
  toleranceLevels: {
    level: RiskLevel;
    color: string;
    description: string;
  }[];
}

export interface ChecklistSection {
  id: string;
  title: string;
  order: number;
  questions: ChecklistQuestion[];
}

export interface ChecklistQuestion {
  id: string;
  code: string;
  text: string;
  responseType: 'Sí / No' | 'Conforme / No conforme' | 'Escala 1–5' | 'Texto' | 'Número' | 'Fecha' | 'Lista' | 'Selección múltiple' | 'Archivo' | 'Firma';
  isMandatory: boolean;
  requireEvidence: boolean;
  generatesFinding: boolean;
  scoreWeight: number;
  options?: string[];
}

export interface AuditProcedureTemplate {
  id: string;
  code: string;
  name: string;
  objective: string;
  procedureText: string;
  suggestedRole: string;
  relatedRisk: string;
  relatedControl: string;
  requiredEvidence: string;
  expectedResult: string;
}

export interface FindingRulesConfig {
  requiredFields: string[];
  severities: FindingSeverity[];
  autoRules: {
    id: string;
    conditionText: string;
    criticality: string;
    suggestedAction: string;
  }[];
}

export interface EvidenceConfig {
  allowedTypes: EvidenceType[];
  isMandatory: boolean;
  minEvidenceCount: number;
  requiresApproval: boolean;
}

export interface ActionPlanConfig {
  fields: string[];
  statuses: ActionPlanStatus[];
  requiresValidator: boolean;
  defaultDueDays: number;
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  key: string;
  type: 'Texto' | 'Número' | 'Fecha' | 'Dropdown' | 'Checkbox' | 'Selección múltiple' | 'Usuario' | 'Archivo' | 'Área' | 'Proceso' | 'URL';
  required: boolean;
  options?: string[];
  helperText?: string;
  appliesTo: 'Auditoría' | 'Hallazgo' | 'Prueba' | 'Riesgo';
}

export interface RolePermissionConfig {
  roleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  approve: boolean;
  close: boolean;
  delete: boolean;
  export: boolean;
}

export interface ReportSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface VersionHistoryEntry {
  version: string;
  date: string;
  author: string;
  changes: string;
  status: 'Vigente' | 'Histórica' | 'Borrador';
}

export interface AuditItem {
  id: string;
  code: string;
  title: string;
  profileId: string;
  profileName: string;
  profileVersion: string;
  company: string;
  sede: string;
  area: string;
  process: string;
  subprocess: string;
  leadAuditor: string;
  auditors: string[];
  processOwner: string;
  approver: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: AuditStatus;
  riskLevel: RiskLevel;
  scopeObjective: string;
  scopePeriod: string;
  includedProcesses: string[];
  includedRisks: string[];
  includedControls: string[];
  customFields?: Record<string, any>;
  indicators: {
    risksCount: number;
    controlsCount: number;
    testsCount: number;
    findingsCount: number;
  };
}

export interface RiskItem {
  id: string;
  code: string;
  name: string;
  process: string;
  category: string;
  probability: number; // 1-5
  impact: number; // 1-5
  inherentScore: number;
  inherentLevel: RiskLevel;
  controlsCount: number;
  residualScore: number;
  residualLevel: RiskLevel;
  responsible: string;
  auditId?: string;
}

export interface ControlItem {
  id: string;
  code: string;
  name: string;
  description: string;
  objective: string;
  responsible: string;
  type: ControlType;
  frequency: ControlFrequency;
  nature: 'Manual' | 'Automático' | 'Semi-automático';
  automation: string;
  relatedRisks: string[];
  evidencesCount: number;
  lastTestDate: string;
  effectiveness: ControlEffectiveness;
}

export interface AuditTestItem {
  id: string;
  code: string;
  procedureName: string;
  auditId: string;
  auditCode: string;
  responsible: string;
  status: 'No iniciado' | 'En progreso' | 'Para revisión' | 'Aprobado';
  date: string;
  result: 'Satisfactorio' | 'Con desviaciones' | 'No satisfactorio' | 'Pendiente';
  objective: string;
  procedureText: string;
  population: string;
  sample: string;
  criteria: string;
  conclusion: string;
  associatedRisk: string;
  associatedControl: string;
  attachmentsCount: number;
  commentsCount: number;
}

export interface FindingItem {
  id: string;
  code: string;
  title: string;
  auditId: string;
  auditCode: string;
  auditTitle: string;
  process: string;
  severity: FindingSeverity;
  responsible: string;
  date: string;
  status: FindingStatus;
  criterion: string;
  condition: string;
  cause: string;
  consequence: string;
  associatedRisk: string;
  recommendation: string;
  managementResponse: string;
  actionPlanTitle?: string;
  targetDate?: string;
  progressPercent?: number;
  evidencesCount: number;
}

export interface ActionPlanItem {
  id: string;
  code: string;
  actionTitle: string;
  findingId: string;
  findingCode: string;
  findingTitle: string;
  responsible: string;
  dueDate: string;
  priority: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  status: ActionPlanStatus;
  progressPercent: number;
  closingEvidence: string;
  validator: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: EvidenceType;
  auditId: string;
  auditCode: string;
  testCode: string;
  user: string;
  date: string;
  version: string;
  status: 'Aprobada' | 'En revisión' | 'Rechazada';
  size: string;
}

export interface OrgNode {
  id: string;
  name: string;
  type: 'Empresa' | 'Sede' | 'Área' | 'Proceso' | 'Subproceso';
  code: string;
  responsible: string;
  children?: OrgNode[];
  risksCount?: number;
  controlsCount?: number;
  auditsCount?: number;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Director de Auditoría' | 'Auditor Líder' | 'Auditor' | 'Responsable del Proceso' | 'Directivo' | 'Observador';
  organization: string;
  area: string;
  status: 'Activo' | 'Inactivo';
  auditsAssigned: number;
  avatarBg: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'alert' | 'info' | 'success';
  read: boolean;
  linkRoute?: string;
}

export type CenterInstitution = 'HIC' | 'ICV';
export type DailyTaskStatus = 'Pendiente' | 'En curso' | 'Completada' | 'Bloqueada';

export interface CenterExcellenceItem {
  id: string;
  name: string;
  institution: CenterInstitution;
  progress: number;
  completedOnTime: number;
  completedLate: number;
  priority: 'Alta' | 'Media' | 'Baja';
  indicatorStatus: 'Completo' | 'Parcial' | 'Pendiente';
  selfAssessment: 'Realizada' | 'En curso' | 'Pendiente';
  improvementPlan: 'Consolidado' | 'En construcción' | 'Pendiente';
}

export interface DailyTaskItem {
  id: string;
  title: string;
  description: string;
  date: string;
  dueDate: string;
  responsible: string;
  institution: CenterInstitution;
  centerId?: string;
  category: 'Seguimiento' | 'Articulación' | 'Documentos' | 'Indicadores' | 'Autoevaluación' | 'Otro';
  priority: 'Alta' | 'Media' | 'Baja';
  status: DailyTaskStatus;
  checklist: { id: string; label: string; done: boolean }[];
  evidence?: string;
}
