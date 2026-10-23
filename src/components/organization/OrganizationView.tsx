import React, { useState } from 'react';
import {
  Building2,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  Sliders,
  FileCheck2,
  User,
  Plus,
  Layers,
  FolderTree
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrgNode } from '../../types';

export const OrganizationView: React.FC = () => {
  const { orgTree } = useApp();

  const [selectedNode, setSelectedNode] = useState<OrgNode>(orgTree);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'org-root': true,
    'sede-bogota': true,
    'area-compras': true,
    'sede-tech': true,
    'sede-salud': true
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTreeNode = (node: OrgNode, level = 0) => {
    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedNode.id === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => setSelectedNode(node)}
          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
            isSelected
              ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={e => toggleExpand(node.id, e)}
                className="p-0.5 hover:text-indigo-400"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <span className="truncate">{node.name}</span>
          </div>

          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-2 ${
              isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {node.type}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Estructura y Jerarquía Organizacional
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded">
              Empresa → Sede → Área → Proceso → Subproceso
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Vincula riesgos, controles, auditores y auditorías al nodo específico de la empresa.
          </p>
        </div>
      </div>

      {/* Main Grid: Tree Browser on left, Node details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Tree Navigator */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-600" />
              <span>Árbol de Procesos y Sedes</span>
            </div>
            <span className="text-[11px] font-normal text-slate-400">Navegación interactiva</span>
          </div>

          <div className="space-y-0.5 max-h-[500px] overflow-y-auto pr-1">
            {renderTreeNode(orgTree)}
          </div>
        </div>

        {/* Right Node Inspector */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                {selectedNode.code}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {selectedNode.name}
              </h2>
              <span className="text-xs text-slate-500">
                Nivel jerárquico: <strong>{selectedNode.type}</strong>
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-slate-500">Responsable / Dueño:</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedNode.responsible}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-400 text-[11px] block">Riesgos Asociados</span>
                <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block tabular-nums">
                  {selectedNode.risksCount || 4}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-400 text-[11px] block">Controles Activos</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block tabular-nums">
                  {selectedNode.controlsCount || 7}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-400 text-[11px] block">Auditorías</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block tabular-nums">
                  {selectedNode.auditsCount || 2}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                Subprocesos / Nodos Hijos:
              </span>
              {selectedNode.children && selectedNode.children.length > 0 ? (
                <div className="space-y-1">
                  {selectedNode.children.map(ch => (
                    <div
                      key={ch.id}
                      onClick={() => setSelectedNode(ch)}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">{ch.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{ch.code}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-[11px]">
                  Este es el nivel más granular de la jerarquía de procesos.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
