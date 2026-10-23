import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DatabasePanel } from './DatabasePanel';
import { CommandPalette } from './CommandPalette';
import { NigmaAIPanel } from './NigmaAIPanel';
import { ExportModal } from './ExportModal';
import { NewAuditWizardModal } from '../wizard/NewAuditWizardModal';

// Route Views
import { DashboardView } from '../dashboard/DashboardView';
import { AuditProfilesView } from '../profiles/AuditProfilesView';
import { AuditProfileDetailView } from '../profiles/AuditProfileDetailView';
import { AuditsListView } from '../audits/AuditsListView';
import { AuditDetailView } from '../audits/AuditDetailView';
import { RisksView } from '../risks/RisksView';
import { IndicatorsView } from '../indicators/IndicatorsView';
import { ControlsView } from '../controls/ControlsView';
import { FindingsView } from '../findings/FindingsView';
import { ActionPlansView } from '../actionplans/ActionPlansView';
import { EvidenceView } from '../evidence/EvidenceView';
import { AnnualAuditPlanView } from '../auditplan/AnnualAuditPlanView';
import { ReportsView } from '../reports/ReportsView';
import { OrganizationView } from '../organization/OrganizationView';
import { UsersView } from '../users/UsersView';
import { SettingsView } from '../settings/SettingsView';
import { CenterReviewView } from '../centers/CenterReviewView';
import { CentersExcellenceView } from '../centers/CentersExcellenceView';
import { DailyTasksView } from '../dailytasks/DailyTasksView';

export const AppShell: React.FC = () => {
  const { currentRoute, isDarkMode } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/dashboard':
        return <DashboardView />;
      case '/audit-plan':
        return <AnnualAuditPlanView />;
      case '/audits':
        return <AuditsListView />;
      case '/audit-detail':
        return <AuditDetailView />;
      case '/risks':
        return <RisksView />;
      case '/indicators':
        return <IndicatorsView />;
      case '/controls':
        return <ControlsView />;
      case '/findings':
        return <FindingsView />;
      case '/action-plans':
        return <ActionPlansView />;
      case '/evidence':
        return <EvidenceView />;
      case '/reports':
        return <ReportsView />;
      case '/organization':
        return <OrganizationView />;
      case '/audit-profiles':
        return <AuditProfilesView />;
      case '/audit-profile-detail':
        return <AuditProfileDetailView />;
      case '/users':
        return <UsersView />;
      case '/settings':
        return <SettingsView />;
      case '/center-review':
        return <CenterReviewView />;
      case '/centers-excellence':
        return <CentersExcellenceView />;
      case '/daily-tasks':
        return <DailyTasksView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div
      data-theme={isDarkMode ? 'dark' : 'light'}
      className={`min-h-screen bg-slate-50/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar onToggleMobileMenu={() => setMobileSidebarOpen(prev => !prev)} />
        <DatabasePanel />

        {/* Viewport Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Modals & Overlays */}
      <CommandPalette />
      <NigmaAIPanel />
      <ExportModal />
      <NewAuditWizardModal />
    </div>
  );
};


// CE view revision

