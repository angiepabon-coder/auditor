import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Download,
  Bell,
  Sparkles,
  ChevronDown,
  FileCheck,
  Cpu,
  AlertTriangle,
  ShieldAlert,
  Moon,
  Sun,
  LogOut,
  User,
  ExternalLink,
  Check
} from 'lucide-react';
import { useApp, AppRoute } from '../../context/AppContext';
import { PeriodType } from '../../types';

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const {
    currentRoute,
    setCurrentRoute,
    selectedPeriod,
    setSelectedPeriod,
    selectedAuditId,
    audits,
    selectedProfileId,
    profiles,
    setIsAiDrawerOpen,
    isAiDrawerOpen,
    setIsCommandPaletteOpen,
    setIsWizardOpen,
    setIsExportModalOpen,
    setExportFormat,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setPeriodDropdownOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = (): { label: string; route?: AppRoute }[] => {
    switch (currentRoute) {
      case '/dashboard':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Dashboard Ejecutivo' }];
      case '/audit-plan':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'SIP y gestión de auditoría CE' }];
      case '/audits':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Auditorías' }];
      case '/audit-detail': {
        const audit = audits.find(a => a.id === selectedAuditId);
        return [
          { label: 'Auditorías', route: '/audits' },
          { label: audit ? `${audit.code} - ${audit.title}` : 'Detalle de Auditoría' }
        ];
      }
      case '/risks':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Matrices de riesgos CE' }];
      case '/center-review':
        return [{ label: 'Centros de Excelencia' }, { label: 'Revisión integral y seguimiento anual' }];
      case '/indicators':
        return [{ label: 'Centros de Excelencia' }, { label: 'Indicadores: oportunidad y metas' }];
      case '/controls':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Catálogo de Controles Internos' }];
      case '/findings':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Hallazgos de Centros de Excelencia' }];
      case '/action-plans':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Planes de Acción y Seguimiento' }];
      case '/evidence':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Repositorio de Evidencias' }];
      case '/reports':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Biblioteca de Reportes' }];
      case '/centers-excellence':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Centros de Excelencia' }];
      case '/daily-tasks':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Tareas diarias' }];
      case '/organization':
        return [{ label: 'Configuración', route: '/settings' }, { label: 'Jerarquía Organizacional' }];
      case '/audit-profiles':
        return [{ label: 'Configuración', route: '/settings' }, { label: 'Perfiles de Auditoría' }];
      case '/audit-profile-detail': {
        const profile = profiles.find(p => p.id === selectedProfileId);
        return [
          { label: 'Perfiles de Auditoría', route: '/audit-profiles' },
          { label: profile ? `${profile.code} (${profile.name})` : 'Detalle de Perfil' }
        ];
      }
      case '/users':
        return [{ label: 'Configuración', route: '/settings' }, { label: 'Usuarios y Permisos RBAC' }];
      case '/settings':
        return [{ label: 'NIGMA', route: '/dashboard' }, { label: 'Configuración del Núcleo' }];
      case '/account':
        return [{ label: 'Centros de Excelencia', route: '/dashboard' }, { label: 'Mi cuenta y datos' }];
      default:
        return [{ label: 'NIGMA', route: '/dashboard' }];
    }
  };

  const periodLabels: Record<PeriodType, string> = {
    '30d': 'Últimos 30 días',
    'quarter': 'Trimestre (Q3 2026)',
    'year': 'Anual (2026)'
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleExport = (format: 'PDF' | 'Excel') => {
    setExportFormat(format);
    setIsExportModalOpen(true);
    setExportDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 transition-colors">
      {/* Left: Mobile menu toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden shrink-0 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
          {getBreadcrumbs().map((b, idx, arr) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-400 dark:text-slate-600">/</span>}
              {b.route ? (
                <button
                  onClick={() => setCurrentRoute(b.route!)}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors truncate"
                >
                  {b.label}
                </button>
              ) : (
                <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[240px] md:max-w-[400px]">
                  {b.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Actions, Search, Period, Export, Notifications, AI, User */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors border border-slate-200/80 dark:border-slate-700"
          title="Buscar auditorías, riesgos, controles o hallazgos (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Búsqueda rápida...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick "+ Crear" Dropdown */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Crear</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {createDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1.5 z-50 text-xs">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Acciones Rápidas
              </div>
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  setIsWizardOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                <FileCheck className="w-4 h-4 text-indigo-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Nueva Auditoría</div>
                  <div className="text-[11px] text-slate-400">Asistente guiado por perfil</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  setCurrentRoute('/audit-profiles');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <Cpu className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Nuevo Perfil</div>
                  <div className="text-[11px] text-slate-400">Plantilla metodológica</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  setCurrentRoute('/findings');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Registrar Hallazgo</span>
              </button>
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  setCurrentRoute('/risks');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Registrar Riesgo</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Period Selector */}
        <div className="relative hidden sm:block" ref={periodRef}>
          <button
            onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span className="tabular-nums font-semibold">{periodLabels[selectedPeriod]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {periodDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-50 text-xs">
              {(['30d', 'quarter', 'year'] as PeriodType[]).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedPeriod(p);
                    setPeriodDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedPeriod === p
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <span>{periodLabels[p]}</span>
                  {selectedPeriod === p && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export Icon Button with Dropdown (NO permanent text as requested) */}
        <div className="relative hidden sm:block" ref={exportRef}>
          <button
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            title="Exportar"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            aria-label="Exportar"
          >
            <Download className="w-4 h-4" />
          </button>

          {exportDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-50 text-xs">
              <button
                onClick={() => handleExport('PDF')}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
              >
                <span>Exportar PDF</span>
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
              >
                <span>Exportar Excel</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 z-50 text-xs">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-slate-700 mb-1">
                <span className="font-semibold text-slate-900 dark:text-white">Notificaciones</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Marcar leídas
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.linkRoute) {
                        setCurrentRoute(n.linkRoute as AppRoute);
                        setNotificationsOpen(false);
                      }
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      n.read ? 'bg-transparent text-slate-500' : 'bg-slate-50 dark:bg-slate-700/40 text-slate-900 dark:text-slate-100 font-medium'
                    } hover:bg-slate-100 dark:hover:bg-slate-700`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="font-semibold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-slate-400">{n.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{n.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NIGMA AI Contextual Copilot Access */}
        <button
          onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            isAiDrawerOpen
              ? 'bg-indigo-900 text-indigo-200 border-indigo-700 shadow-inner'
              : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400'
          }`}
          title="Abrir copiloto contextual NIGMA AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline font-bold">NIGMA AI</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border shadow-2xs group ${
            isDarkMode
              ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-500/30'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
          }`}
          title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          aria-label={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="hidden sm:inline text-[11px] font-semibold text-amber-300">Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline text-[11px] font-semibold text-indigo-700">Modo Oscuro</span>
            </>
          )}
        </button>

        {/* User Profile Avatar & Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              CE
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                <div className="font-bold text-slate-900 dark:text-white">Auditora CE</div>
                <div className="text-[11px] text-slate-400">carlos.mendoza@nigma-audit.com</div>
                <div className="mt-1 inline-flex text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                  Auditoría de Centros de Excelencia
                </div>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  setCurrentRoute('/users');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Mi Perfil & Roles</span>
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  setCurrentRoute('/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Preferencias del Sistema</span>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <span>Cerrar Sesión</span>
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">SSO Activo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


