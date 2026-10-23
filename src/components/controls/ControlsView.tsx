import React, { useState } from 'react';
import {
  Sliders,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ControlItem, ControlEffectiveness } from '../../types';

export const ControlsView: React.FC = () => {
  const { controls } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [effectivenessFilter, setEffectivenessFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedControl, setSelectedControl] = useState<ControlItem | null>(null);

  const filteredControls = controls.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEff = effectivenessFilter === 'all' || c.effectiveness === effectivenessFilter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesEff && matchesType;
  });

  const getEffectivenessBadge = (eff: ControlEffectiveness) => {
    switch (eff) {
      case 'Efectivo':
        return (
          <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Efectivo
          </span>
        );
      case 'Parcialmente efectivo':
        return (
          <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" /> Parcial
          </span>
        );
      case 'Inefectivo':
        return (
          <span className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded text-[11px]">
            <XCircle className="w-3.5 h-3.5" /> Inefectivo
          </span>
        );
      case 'No evaluado':
        return (
          <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
            <HelpCircle className="w-3.5 h-3.5" /> No evaluado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Catálogo de Controles Internos
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded">
              {controls.length} Controles Clave
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro unificado de controles preventivos, detectivos y automáticos vinculados a la matriz de riesgos.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre, objetivo o responsable..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={effectivenessFilter}
            onChange={e => setEffectivenessFilter(e.target.value)}
            aria-label="Filtrar por Efectividad"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">Todas las efectividades</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Parcialmente efectivo">Parcialmente efectivo</option>
            <option value="Inefectivo">Inefectivo</option>
            <option value="No evaluado">No evaluado</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            aria-label="Filtrar por Tipo de Control"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">Todos los tipos</option>
            <option value="Preventivo">Preventivo</option>
            <option value="Detectivo">Detectivo</option>
            <option value="Correctivo">Correctivo</option>
          </select>
        </div>
      </div>

      {/* Controls Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-3 px-4 font-semibold">Código</th>
                <th className="py-3 px-4 font-semibold">Nombre y Objetivo</th>
                <th className="py-3 px-4 font-semibold">Tipo</th>
                <th className="py-3 px-4 font-semibold">Frecuencia</th>
                <th className="py-3 px-4 font-semibold">Naturaleza</th>
                <th className="py-3 px-4 font-semibold">Riesgos Asociados</th>
                <th className="py-3 px-4 font-semibold text-center">Evidencias</th>
                <th className="py-3 px-4 font-semibold">Última Prueba</th>
                <th className="py-3 px-4 font-semibold">Efectividad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredControls.map(ctl => (
                <tr
                  key={ctl.id}
                  onClick={() => setSelectedControl(ctl)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {ctl.code}
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {ctl.name}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {ctl.objective}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {ctl.type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {ctl.frequency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                      {ctl.nature}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {ctl.relatedRisks.map(r => (
                        <span key={r} className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.2 rounded font-semibold">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold tabular-nums text-slate-700 dark:text-slate-300">
                    {ctl.evidencesCount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap tabular-nums text-[11px]">
                    {ctl.lastTestDate}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getEffectivenessBadge(ctl.effectiveness)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
