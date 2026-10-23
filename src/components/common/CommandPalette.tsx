import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileCheck, Cpu, AlertTriangle, ShieldAlert, Sliders, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    audits,
    profiles,
    risks,
    controls,
    findings,
    navigateToAudit,
    navigateToProfile,
    setCurrentRoute
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredAudits = audits
    .filter(a => a.code.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.area.toLowerCase().includes(q))
    .slice(0, 4);

  const filteredProfiles = profiles
    .filter(p => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .slice(0, 3);

  const filteredFindings = findings
    .filter(f => f.code.toLowerCase().includes(q) || f.title.toLowerCase().includes(q))
    .slice(0, 3);

  const filteredRisks = risks
    .filter(r => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por código, auditoría, perfil, riesgo, hallazgo o acción..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Audits Group */}
          {filteredAudits.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Auditorías</span>
                <span className="text-[10px] lowercase font-normal">{filteredAudits.length} resultados</span>
              </div>
              <div className="space-y-1">
                {filteredAudits.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      navigateToAudit(a.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white mr-2">{a.code}</span>
                        <span className="text-slate-600 dark:text-slate-300">{a.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">{a.area}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Profiles Group */}
          {filteredProfiles.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Perfiles de Auditoría
              </div>
              <div className="space-y-1">
                {filteredProfiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigateToProfile(p.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Cpu className="w-4 h-4 text-purple-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white mr-2">{p.code}</span>
                        <span className="text-slate-600 dark:text-slate-300">{p.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-medium">
                      v{p.version}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Findings Group */}
          {filteredFindings.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hallazgos
              </div>
              <div className="space-y-1">
                {filteredFindings.map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setCurrentRoute('/findings');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white mr-2">{f.code}</span>
                        <span className="text-slate-600 dark:text-slate-300">{f.title}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{f.severity}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Risks Group */}
          {filteredRisks.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Riesgos Clave
              </div>
              <div className="space-y-1">
                {filteredRisks.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentRoute('/risks');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white mr-2">{r.code}</span>
                        <span className="text-slate-600 dark:text-slate-300">{r.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{r.inherentLevel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredAudits.length === 0 && filteredProfiles.length === 0 && filteredFindings.length === 0 && filteredRisks.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Presiona <kbd className="px-1 py-0.5 bg-white dark:bg-slate-900 border rounded font-mono text-[10px]">ESC</kbd> para salir</span>
            <span>Usa flechas para navegar</span>
          </div>
          <span className="font-medium text-indigo-600 dark:text-indigo-400">NIGMA Audit Search</span>
        </div>
      </div>
    </div>
  );
};
