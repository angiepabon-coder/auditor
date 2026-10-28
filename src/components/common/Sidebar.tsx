import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  ShieldAlert,
  Sliders,
  AlertTriangle,
  ListTodo,
  FolderArchive,
  FileBarChart2,
  Building2,
  Cpu,
  Users2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ListChecks,
  Sun,
  Moon
} from 'lucide-react';
import { useApp, AppRoute } from '../../context/AppContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (m: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { currentRoute, setCurrentRoute, findings, actionPlans, isDarkMode, toggleDarkMode } = useApp();

  const openFindingsCount = findings.filter(f => f.status !== 'Cerrado').length;
  const overduePlansCount = actionPlans.filter(p => p.status === 'Vencido').length;

  const mainNavItems = [
    { label: 'Mi cuenta y datos', route: '/account' as AppRoute, icon: ShieldCheck },
    { label: 'Dashboard', route: '/dashboard' as AppRoute, icon: LayoutDashboard },
    { label: 'SIP y gestión de auditoría', route: '/audit-plan' as AppRoute, icon: CalendarDays },
    { label: 'Auditorías', route: '/audits' as AppRoute, icon: FileCheck2 },
    { label: 'Riesgos', route: '/risks' as AppRoute, icon: ShieldAlert },
    { label: 'Revisión anual CE', route: '/center-review' as AppRoute, icon: CalendarDays },
    { label: 'Indicadores CE', route: '/indicators' as AppRoute, icon: ListChecks },
    { label: 'Controles', route: '/controls' as AppRoute, icon: Sliders },
    {
      label: 'Hallazgos',
      route: '/findings' as AppRoute,
      icon: AlertTriangle,
      badge: undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      label: 'Planes de acción y PIME',
      route: '/action-plans' as AppRoute,
      icon: ListTodo,
      badge: undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { label: 'Evidencias', route: '/evidence' as AppRoute, icon: FolderArchive },
    { label: 'Reportes', route: '/reports' as AppRoute, icon: FileBarChart2 },
    { label: 'Centros de Excelencia', route: '/centers-excellence' as AppRoute, icon: Building2 },
    { label: 'Tareas diarias', route: '/daily-tasks' as AppRoute, icon: ListChecks },
  ];

  const adminNavItems = [
    { label: 'Organización', route: '/organization' as AppRoute, icon: Building2 },
    {
      label: 'Perfiles de Auditoría',
      route: '/audit-profiles' as AppRoute,
      icon: Cpu,
      highlight: true
    },
    { label: 'Usuarios', route: '/users' as AppRoute, icon: Users2 },
    { label: 'Configuración', route: '/settings' as AppRoute, icon: Settings },
  ];

  const handleNav = (route: AppRoute) => {
    setCurrentRoute(route);
    setMobileOpen(false);
  };

  const isRouteActive = (route: AppRoute) => {
    if (route === '/audits' && currentRoute === '/audit-detail') return true;
    if (route === '/audit-profiles' && currentRoute === '/audit-profile-detail') return true;
    return currentRoute === route;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  NIGMA <span className="text-indigo-600 dark:text-indigo-400 font-semibold">AUDIT</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  ENTERPRISE GRC CORE
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-md items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main items */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Gestión Operativa
              </div>
            )}
            {mainNavItems.map(item => {
              const active = isRouteActive(item.route);
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-3 space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Configuración y Núcleo
              </div>
            )}
            {adminNavItems.map(item => {
              const active = isRouteActive(item.route);
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : item.highlight
                      ? 'text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left flex items-center justify-between">
                      {item.label}
                      {item.highlight && (
                        <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-700/40">
                          Core
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Theme switch button */}
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              isDarkMode
                ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-amber-300'
                : 'bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-100 text-slate-700'
            }`}
            title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label="Cambiar tema de color"
          >
            <div className="flex items-center gap-2.5">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
              )}
              {!isCollapsed && (
                <span className="truncate">
                  {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                isDarkMode ? 'bg-amber-400/20 text-amber-300' : 'bg-indigo-600/10 text-indigo-600'
              }`}>
                {isDarkMode ? 'Activo' : 'Activo'}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Documentación & Ayuda</span>}
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              CE
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">Auditora CE</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Auditoría de Centros de Excelencia</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};





