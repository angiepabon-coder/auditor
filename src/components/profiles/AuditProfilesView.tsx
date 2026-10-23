import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  MoreVertical,
  ArrowRight,
  Copy,
  GitBranch,
  Archive,
  Edit3,
  Calendar,
  Layers,
  CheckCircle,
  FileCheck2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditProfile } from '../../types';

export const AuditProfilesView: React.FC = () => {
  const {
    profiles,
    navigateToProfile,
    duplicateProfile,
    bumpProfileVersion,
    addProfile,
    updateProfile,
    setIsWizardOpen
  } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  // New profile modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileCode, setNewProfileCode] = useState('');
  const [newProfileCat, setNewProfileCat] = useState('Gobierno y Control');
  const [newProfileDesc, setNewProfileDesc] = useState('');
  const [newProfileSector, setNewProfileSector] = useState('Comercial, Industrial');

  // Version bump modal state
  const [versionBumpTarget, setVersionBumpTarget] = useState<AuditProfile | null>(null);
  const [newVersionString, setNewVersionString] = useState('');
  const [versionNotes, setVersionNotes] = useState('');

  // Dropdown open state for actions
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Extract unique categories and sectors
  const categories = ['all', ...Array.from(new Set(profiles.map(p => p.category)))];
  const allSectors = ['all', 'Comercial', 'Industrial', 'Salud', 'Finanzas', 'Tecnología', 'Construcción'];

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesSector =
      selectedSector === 'all' || p.sectors.some(s => s.toLowerCase().includes(selectedSector.toLowerCase()));
    return matchesSearch && matchesCat && matchesStatus && matchesSector;
  });

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim() || !newProfileCode.trim()) return;

    const baseTemplate = profiles[0];
    const created: AuditProfile = {
      ...(baseTemplate ? JSON.parse(JSON.stringify(baseTemplate)) : {methodologyStages:[],riskMatrixConfig:{size:"5x5",probabilityLabels:[],impactLabels:[],toleranceLevels:[]},checklistSections:[],procedureTemplates:[],requiredEvidenceTypes:[],customFields:[],roles:[],reportSections:[],versionsHistory:[]}),
      id: `profile-${Date.now()}`,
      code: newProfileCode.toUpperCase().trim(),
      name: newProfileName.trim(),
      description: newProfileDesc || 'Metodología configurada para operaciones específicas.',
      category: newProfileCat,
      version: '1.0',
      status: 'Activo',
      sectors: newProfileSector.split(',').map(s => s.trim()),
      auditsCount: 0,
      updatedAt: 'Hoy',
      createdAt: 'Hoy',
      owner: 'Auditora CE',
      versionsHistory: [
        { version: '1.0', date: 'Hoy', author: 'Auditora CE', changes: 'Creación inicial del perfil metodológico.', status: 'Vigente' }
      ]
    };

    addProfile(created);
    setIsCreateModalOpen(false);
    setNewProfileName('');
    setNewProfileCode('');
    setNewProfileDesc('');
    navigateToProfile(created.id);
  };

  const handleVersionBumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionBumpTarget || !newVersionString.trim()) return;
    bumpProfileVersion(versionBumpTarget.id, newVersionString.trim(), versionNotes || 'Actualización metodológica');
    setVersionBumpTarget(null);
    setNewVersionString('');
    setVersionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Perfiles de Auditoría
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
              {profiles.length} Metodologías
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Crea y administra metodologías reutilizables para diferentes tipos de auditoría. Permite utilizar el mismo núcleo en hospitales, industrias, banca o tecnología mediante plantillas independientes y versionadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Crear perfil</span>
          </button>
        </div>
      </div>

      {/* Filter and View bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre o sector..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Categoría */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            aria-label="Filtrar por Categoría"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none"
          >
            <option value="all">Todas las categorías</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Estado */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            aria-label="Filtrar por Estado"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Borrador">Borrador</option>
            <option value="Archivado">Archivado</option>
          </select>

          {/* Sector */}
          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            aria-label="Filtrar por Sector"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none"
          >
            <option value="all">Todos los sectores</option>
            {allSectors.filter(s => s !== 'all').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* View mode toggle (Cards vs Table) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 ml-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Vista Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Vista Tabla"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map(profile => (
            <div
              key={profile.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:border-indigo-400/80 dark:hover:border-indigo-600 transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Header row: Code + Version + Status + Dropdown */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-900/60">
                      {profile.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium">
                      v{profile.version}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        profile.status === 'Activo'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {profile.status}
                    </span>

                    {/* Context menu */}
                    <div className="relative">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setOpenActionId(openActionId === profile.id ? null : profile.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openActionId === profile.id && (
                        <div
                          className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 z-20 text-xs"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              navigateToProfile(profile.id);
                              setOpenActionId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Abrir / Configurar</span>
                          </button>
                          <button
                            onClick={() => {
                              duplicateProfile(profile.id);
                              setOpenActionId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                          >
                            <Copy className="w-3.5 h-3.5 text-purple-500" />
                            <span>Duplicar perfil</span>
                          </button>
                          <button
                            onClick={() => {
                              setVersionBumpTarget(profile);
                              setNewVersionString(`v${(parseFloat(profile.version) + 0.1).toFixed(1)}`);
                              setOpenActionId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                          >
                            <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                            <span>Crear nueva versión</span>
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                          <button
                            onClick={() => {
                              updateProfile({ ...profile, status: 'Archivado' });
                              setOpenActionId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>Archivar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Name & Category */}
                <h3
                  onClick={() => navigateToProfile(profile.id)}
                  className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  {profile.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {profile.category}
                </span>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {profile.description}
                </p>

                {/* Sectors tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {profile.sectors.slice(0, 3).map((sec, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-medium"
                    >
                      {sec}
                    </span>
                  ))}
                  {profile.sectors.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{profile.sectors.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom stats & CTA */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <FileCheck2 className="w-3.5 h-3.5 text-indigo-500" />
                    {profile.auditsCount} auditorías
                  </span>
                  <span>Modif: {profile.updatedAt}</span>
                </div>

                <button
                  onClick={() => navigateToProfile(profile.id)}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 text-xs"
                >
                  <span>Abrir</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Profile Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="py-3 px-4 font-semibold">Código</th>
                  <th className="py-3 px-4 font-semibold">Nombre del Perfil</th>
                  <th className="py-3 px-4 font-semibold">Categoría</th>
                  <th className="py-3 px-4 font-semibold">Versión</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold text-center">Auditorías</th>
                  <th className="py-3 px-4 font-semibold">Última Modificación</th>
                  <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProfiles.map(profile => (
                  <tr
                    key={profile.id}
                    onClick={() => navigateToProfile(profile.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {profile.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {profile.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {profile.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      v{profile.version}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          profile.status === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {profile.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white tabular-nums">
                      {profile.auditsCount}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {profile.updatedAt}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateToProfile(profile.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded"
                        >
                          Abrir
                        </button>
                        <button
                          onClick={() => duplicateProfile(profile.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Duplicar"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE PROFILE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Crear Nuevo Perfil de Auditoría
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define una metodología reutilizable para un sector o proceso
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Perfil *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Auditoría Clínica y Seguridad del Paciente"
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código Identificador *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="AUD-MED-01"
                    value={newProfileCode}
                    onChange={e => setNewProfileCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newProfileCat}
                    onChange={e => setNewProfileCat(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Gobierno y Control">Gobierno y Control</option>
                    <option value="Financiera">Financiera</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Salud y Farmacia">Salud y Farmacia</option>
                    <option value="Calidad y Procesos">Calidad y Procesos</option>
                    <option value="Seguridad y Salud">Seguridad y Salud</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sectores de Aplicación
                </label>
                <input
                  type="text"
                  placeholder="Hospitales, Farmacias, Laboratorios"
                  value={newProfileSector}
                  onChange={e => setNewProfileSector(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción y Alcance Metodológico
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe los objetivos, requisitos y alcance evaluativo de esta plantilla..."
                  value={newProfileDesc}
                  onChange={e => setNewProfileDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  Guardar e inicializar perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERSION BUMP MODAL */}
      {versionBumpTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Crear Nueva Versión ({versionBumpTarget.code})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Versión actual: v{versionBumpTarget.version}
                </p>
              </div>
              <button
                onClick={() => setVersionBumpTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVersionBumpSubmit} className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nueva Versión *
                </label>
                <input
                  type="text"
                  required
                  placeholder="v1.1 o v2.0"
                  value={newVersionString}
                  onChange={e => setNewVersionString(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas de Cambio (Changelog)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Especifica los cambios en checklist, pruebas o campos personalizados..."
                  value={versionNotes}
                  onChange={e => setVersionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
                <strong>Inmutabilidad garantizada:</strong> Las auditorías ya creadas bajo la versión v{versionBumpTarget.version} permanecerán congeladas con su metodología original.
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVersionBumpTarget(null)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  Publicar nueva versión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
