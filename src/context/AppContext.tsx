import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  AuditProfile,
  AuditItem,
  RiskItem,
  ControlItem,
  AuditTestItem,
  FindingItem,
  ActionPlanItem,
  EvidenceItem,
  PeriodType,
  NotificationItem,
  OrgNode,
  UserItem,
  CenterExcellenceItem,
  DailyTaskItem
} from '../types';
import {
  INITIAL_AUDIT_PROFILES,
  INITIAL_AUDITS,
  INITIAL_RISKS,
  INITIAL_CONTROLS,
  INITIAL_TESTS,
  INITIAL_FINDINGS,
  INITIAL_ACTION_PLANS,
  INITIAL_EVIDENCES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORGANIZATION_TREE,
  INITIAL_USERS
} from '../data/initialData';
import { CENTER_EXCELLENCE_DATA, INITIAL_DAILY_TASKS } from '../data/centersExcellence';

export type AppRoute =
  | '/dashboard'
  | '/audit-plan'
  | '/audits'
  | '/audit-detail'
  | '/risks'
  | '/controls'
  | '/findings'
  | '/action-plans'
  | '/evidence'
  | '/reports'
  | '/organization'
  | '/audit-profiles'
  | '/audit-profile-detail'
  | '/users'
  | '/settings'
  | '/centers-excellence'
  | '/daily-tasks'
  | '/indicators'
  | '/center-review';
  

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  selectedPeriod: PeriodType;
  setSelectedPeriod: (p: PeriodType) => void;
  selectedProfileId: string;
  setSelectedProfileId: (id: string) => void;
  selectedAuditId: string;
  setSelectedAuditId: (id: string) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isWizardOpen: boolean;
  setIsWizardOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  exportFormat: 'PDF' | 'Excel';
  setExportFormat: (f: 'PDF' | 'Excel') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Data items
  profiles: AuditProfile[];
  audits: AuditItem[];
  risks: RiskItem[];
  controls: ControlItem[];
  tests: AuditTestItem[];
  findings: FindingItem[];
  actionPlans: ActionPlanItem[];
  centersExcellence: CenterExcellenceItem[];
  dailyTasks: DailyTaskItem[];
  evidences: EvidenceItem[];
  notifications: NotificationItem[];
  users: UserItem[];
  orgTree: OrgNode;

  // Actions
  addAudit: (audit: AuditItem) => void;
  updateAudit: (audit: AuditItem) => void;
  addProfile: (profile: AuditProfile) => void;
  updateProfile: (profile: AuditProfile) => void;
  duplicateProfile: (profileId: string) => void;
  bumpProfileVersion: (profileId: string, newVersion: string, notes: string) => void;
  updateFindingStatus: (findingId: string, status: FindingItem['status']) => void;
  updateActionPlanStatus: (planId: string, status: ActionPlanItem['status'], progress: number) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addEvidence: (evidence: EvidenceItem) => void;
  addDailyTask: (task: DailyTaskItem) => void;
  updateDailyTask: (taskId: string, patch: Partial<DailyTaskItem>) => void;
  toggleDailyTaskChecklist: (taskId: string, itemId: string) => void;
  
  // Navigation helpers
  navigateToAudit: (auditId: string) => void;
  navigateToProfile: (profileId: string) => void;

  // Dynamic Metrics based on period
  kpiMetrics: {
    activeAudits: number;
    activeAuditsChange: string;
    criticalRisks: number;
    criticalRisksChange: string;
    openFindings: number;
    openFindingsChange: string;
    complianceScore: number;
    complianceScoreChange: string;
    auditsByStatus: { planning: number; inProgress: number; review: number; completed: number };
    findingsBySeverity: { critical: number; high: number; medium: number; low: number };
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('30d');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('profile-1');
  const [selectedAuditId, setSelectedAuditId] = useState<string>('aud-1');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel'>('PDF');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nigma_audit_dark_mode');
        if (saved !== null) {
          return saved === 'true';
        }
      } catch {
        return false;
      }
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDarkMode) {
        root.classList.add('dark');
        document.body.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        document.body.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      try {
        localStorage.setItem('nigma_audit_dark_mode', String(isDarkMode));
      } catch {
        // Ignore localStorage quota or restricted iframe errors
      }
    }
  }, [isDarkMode]);

  // Collections state
  const [profiles, setProfiles] = useState<AuditProfile[]>(INITIAL_AUDIT_PROFILES);
  const [audits, setAudits] = useState<AuditItem[]>(INITIAL_AUDITS);
  const [risks] = useState<RiskItem[]>(INITIAL_RISKS);
  const [controls] = useState<ControlItem[]>(INITIAL_CONTROLS);
  const [tests] = useState<AuditTestItem[]>(INITIAL_TESTS);
  const [findings, setFindings] = useState<FindingItem[]>(INITIAL_FINDINGS);
  const [actionPlans, setActionPlans] = useState<ActionPlanItem[]>(INITIAL_ACTION_PLANS);
  const [centersExcellence] = useState<CenterExcellenceItem[]>(CENTER_EXCELLENCE_DATA);
  const [dailyTasks, setDailyTasks] = useState<DailyTaskItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nigma_ce_daily_tasks');
        if (saved) return JSON.parse(saved) as DailyTaskItem[];
      } catch { /* use the seeded monthly tasks when local storage is unavailable */ }
    }
    return INITIAL_DAILY_TASKS;
  });
  useEffect(() => {
    try { localStorage.setItem('nigma_ce_daily_tasks', JSON.stringify(dailyTasks)); } catch { /* keep the in-memory workflow available */ }
  }, [dailyTasks]);
  const [evidences, setEvidences] = useState<EvidenceItem[]>(INITIAL_EVIDENCES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [users] = useState<UserItem[]>(INITIAL_USERS);
  const [orgTree] = useState<OrgNode>(INITIAL_ORGANIZATION_TREE);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const navigateToAudit = (auditId: string) => {
    setSelectedAuditId(auditId);
    setCurrentRoute('/audit-detail');
  };

  const navigateToProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setCurrentRoute('/audit-profile-detail');
  };

  const addAudit = (newAudit: AuditItem) => {
    setAudits(prev => [newAudit, ...prev]);
    // Also bump profile count
    setProfiles(prev =>
      prev.map(p => (p.id === newAudit.profileId ? { ...p, auditsCount: p.auditsCount + 1 } : p))
    );
  };

  const updateAudit = (updated: AuditItem) => {
    setAudits(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const addProfile = (newProfile: AuditProfile) => {
    setProfiles(prev => [newProfile, ...prev]);
  };

  const updateProfile = (updated: AuditProfile) => {
    setProfiles(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const duplicateProfile = (profileId: string) => {
    const target = profiles.find(p => p.id === profileId);
    if (!target) return;
    const clone: AuditProfile = {
      ...JSON.parse(JSON.stringify(target)),
      id: `profile-${Date.now()}`,
      code: `${target.code}-COPIA`,
      name: `${target.name} (Copia)`,
      version: '1.0',
      status: 'Borrador',
      auditsCount: 0,
      createdAt: 'Hoy',
      updatedAt: 'Hoy',
      owner: 'Auditora CE'
    };
    setProfiles(prev => [clone, ...prev]);
  };

  const bumpProfileVersion = (profileId: string, newVersion: string, notes: string) => {
    setProfiles(prev =>
      prev.map(p => {
        if (p.id === profileId) {
          const newHistory = [
            {
              version: newVersion,
              date: 'Hoy',
              author: 'Auditora CE',
              changes: notes,
              status: 'Vigente' as const
            },
            ...p.versionsHistory.map(v => ({ ...v, status: 'Histórica' as const }))
          ];
          return {
            ...p,
            version: newVersion,
            updatedAt: 'Hoy',
            versionsHistory: newHistory
          };
        }
        return p;
      })
    );
  };

  const updateFindingStatus = (findingId: string, status: FindingItem['status']) => {
    setFindings(prev => prev.map(f => (f.id === findingId ? { ...f, status } : f)));
  };

  const updateActionPlanStatus = (planId: string, status: ActionPlanItem['status'], progress: number) => {
    setActionPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, status, progressPercent: progress } : p))
    );
  };

  const addDailyTask = (task: DailyTaskItem) => setDailyTasks(prev => prev.some(t => t.id === task.id) ? prev : [...prev, task]);
  const updateDailyTask = (taskId: string, patch: Partial<DailyTaskItem>) => {
    setDailyTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...patch } : task));
  };

  const toggleDailyTaskChecklist = (taskId: string, itemId: string) => {
    setDailyTasks(prev => prev.map(task => task.id === taskId ? {
      ...task,
      checklist: task.checklist.map(item => item.id === itemId ? { ...item, done: !item.done } : item)
    } : task));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addEvidence = (evidence: EvidenceItem) => {
    setEvidences(prev => [evidence, ...prev]);
  };

  const kpiMetrics = useMemo(() => ({activeAudits:audits.filter(a=>a.status!=='Completadas').length,activeAuditsChange:'Según registros',criticalRisks:risks.filter(r=>r.residualLevel==='Crítico').length,criticalRisksChange:'Según registros',openFindings:findings.filter(f=>f.status!=='Cerrado').length,openFindingsChange:'Según registros',complianceScore:0,complianceScoreChange:'Sin evaluación consolidada',auditsByStatus:{planning:0,inProgress:0,review:0,completed:0},findingsBySeverity:{critical:0,high:0,medium:0,low:0}}),[audits,risks,findings]);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedPeriod,
        setSelectedPeriod,
        selectedProfileId,
        setSelectedProfileId,
        selectedAuditId,
        setSelectedAuditId,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isWizardOpen,
        setIsWizardOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        exportFormat,
        setExportFormat,
        isDarkMode,
        toggleDarkMode,
        profiles,
        audits,
        risks,
        controls,
        tests,
        findings,
        actionPlans,
        centersExcellence,
        dailyTasks,
        evidences,
        notifications,
        users,
        orgTree,
        addAudit,
        updateAudit,
        addProfile,
        updateProfile,
        duplicateProfile,
        bumpProfileVersion,
        updateFindingStatus,
        updateActionPlanStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addEvidence,
        addDailyTask,
        updateDailyTask,
        toggleDailyTaskChecklist,
        navigateToAudit,
        navigateToProfile,
        kpiMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


