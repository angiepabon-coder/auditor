import {
  AuditProfile,
  AuditItem,
  RiskItem,
  ControlItem,
  AuditTestItem,
  FindingItem,
  ActionPlanItem,
  EvidenceItem,
  OrgNode,
  UserItem,
  NotificationItem
} from '../types';

export const INITIAL_AUDIT_PROFILES: AuditProfile[] = [];
export const INITIAL_AUDITS: AuditItem[] = [];
export const INITIAL_RISKS: RiskItem[] = [];
export const INITIAL_CONTROLS: ControlItem[] = [];
export const INITIAL_TESTS: AuditTestItem[] = [];
export const INITIAL_FINDINGS: FindingItem[] = [];
export const INITIAL_ACTION_PLANS: ActionPlanItem[] = [];
export const INITIAL_EVIDENCES: EvidenceItem[] = [];
export const INITIAL_ORGANIZATION_TREE: OrgNode = {id:'ce-root',name:'Centros de Excelencia',type:'Empresa',code:'CE',responsible:'Por registrar',children:[]};
export const INITIAL_USERS: UserItem[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const ANNUAL_PLAN_2026 = [];
