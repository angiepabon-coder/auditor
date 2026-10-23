import React from 'react';
import {
  FileBarChart2,
  Download,
  Eye,
  FileText,
  ShieldAlert,
  Sliders,
  AlertTriangle,
  ListTodo,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { setIsExportModalOpen, setExportFormat } = useApp();

  const reportLibrary = [
    {
      id: 'rep-exec',
      title: 'Informe Ejecutivo de Control y Gobierno',
      description: 'Resumen consolidado para Junta Directiva y Comité de Auditoría con dictamen general, KPIs y mapa semafórico.',
      icon: FileBarChart2,
      category: 'Directivo',
      format: 'PDF (A4)'
    },
    {
      id: 'rep-audit',
      title: 'Informe Individual de Auditoría',
      description: 'Cédula completa con alcance, objetivos, pruebas sustantivas, debilidades encontradas y conclusiones del auditor líder.',
      icon: FileText,
      category: 'Operativo',
      format: 'PDF / Word'
    },
    {
      id: 'rep-risks',
      title: 'Matriz Cartográfica y Mapa de Riesgos',
      description: 'Inventario de riesgos con cálculo inherente y residual, desglose por impacto vs probabilidad y brechas de tolerancia.',
      icon: ShieldAlert,
      category: 'Riesgos',
      format: 'Excel / PDF'
    },
    {
      id: 'rep-controls',
      title: 'Estado de Efectividad de Controles',
      description: 'Certificación de diseño y operatividad de controles SOX/COSO con registro de pruebas de recorrido y desviaciones.',
      icon: Sliders,
      category: 'Controles',
      format: 'Excel'
    },
    {
      id: 'rep-findings',
      title: 'Reporte Consolidado de Hallazgos',
      description: 'Detalle de no conformidades bajo metodología de las 5C: Criterio, Condición, Causa, Consecuencia y Corrección.',
      icon: AlertTriangle,
      category: 'Cumplimiento',
      format: 'PDF / Excel'
    },
    {
      id: 'rep-plans',
      title: 'Tablero de Seguimiento a Planes de Acción',
      description: 'Monitoreo de compromisos vencidos, porcentaje de avance en remediación y registro de evidencias de cierre.',
      icon: ListTodo,
      category: 'Seguimiento',
      format: 'Excel'
    },
    {
      id: 'rep-annual',
      title: 'Plan Anual de Auditoría 2026',
      description: 'Documento formal de aprobación del universo de auditoría, capacidad del equipo y calendario de compromisos.',
      icon: CalendarDays,
      category: 'Estratégico',
      format: 'PDF'
    }
  ];

  const handleOpenExport = (format: 'PDF' | 'Excel') => {
    setExportFormat(format);
    setIsExportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Biblioteca de Reportes
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded">
              7 Plantillas Ejecutivas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Genera dictámenes oficiales, exportaciones para comités y libros de trabajo analíticos en tiempo real.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportLibrary.map(rep => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {rep.category}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {rep.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400">
                  {rep.format}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenExport('PDF')}
                    className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded transition-colors"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleOpenExport('Excel')}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded transition-colors"
                  >
                    Excel
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
