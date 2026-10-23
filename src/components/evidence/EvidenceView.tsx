import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  Image,
  Link,
  Upload,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EvidenceItem, EvidenceType } from '../../types';

export const EvidenceView: React.FC = () => {
  const { evidences, addEvidence } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New evidence form
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<EvidenceType>('PDF');
  const [newAuditCode, setNewAuditCode] = useState('AUD-2026-001');
  const [newTestCode, setNewTestCode] = useState('PRU-CMP-02');

  const filteredEvidences = evidences.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.auditCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    const matchesSt = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesType && matchesSt;
  });

  const getFileIcon = (t: EvidenceType) => {
    switch (t) {
      case 'Excel':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'Imagen':
        return <Image className="w-4 h-4 text-purple-600" />;
      case 'Enlace':
        return <Link className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-rose-600" />;
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: EvidenceItem = {
      id: `evi-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      auditId: 'aud-1',
      auditCode: newAuditCode,
      testCode: newTestCode,
      user: 'Auditora CE',
      date: 'Hoy',
      version: '1.0',
      status: 'En revisión',
      size: '1.8 MB'
    };

    addEvidence(created);
    setIsUploadModalOpen(false);
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Repositorio de Evidencias Digitales
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded">
              {evidences.length} Archivos Custodiados
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            File manager institucional para custodia de papeles de trabajo, actas firmadas, capturas de pantalla y bitácoras probatorias.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Cargar Evidencia</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de archivo, auditoría o usuario..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            aria-label="Filtrar por Formato"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">Todos los formatos</option>
            <option value="PDF">PDF</option>
            <option value="Excel">Excel</option>
            <option value="Word">Word</option>
            <option value="Imagen">Imagen</option>
            <option value="Enlace">Enlace</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filtrar por Estado de Aprobación"
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium"
          >
            <option value="all">Todos los estados</option>
            <option value="Aprobada">Aprobada</option>
            <option value="En revisión">En revisión</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>
      </div>

      {/* Evidences File Manager Grid / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-3 px-4 font-semibold">Nombre del Archivo</th>
                <th className="py-3 px-4 font-semibold">Formato</th>
                <th className="py-3 px-4 font-semibold">Auditoría</th>
                <th className="py-3 px-4 font-semibold">Prueba</th>
                <th className="py-3 px-4 font-semibold">Custodio / Subido por</th>
                <th className="py-3 px-4 font-semibold">Fecha</th>
                <th className="py-3 px-4 font-semibold">Versión</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEvidences.map(evi => (
                <tr
                  key={evi.id}
                  onClick={() => setSelectedEvidence(evi)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-2.5">
                      {getFileIcon(evi.type)}
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {evi.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{evi.size}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                    {evi.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {evi.auditCode}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {evi.testCode}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {evi.user}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 tabular-nums text-[11px] whitespace-nowrap">
                    {evi.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                    v{evi.version}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        evi.status === 'Aprobada'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : evi.status === 'En revisión'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {evi.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        // Safe trigger of simulated download without alert modal
                        const blob = new Blob([`Contenido de evidencia NIGMA AUDIT: ${evi.name}`], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = evi.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD EVIDENCE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cargar Evidencia Digital
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Vincula un papel de trabajo probatorio a una prueba activa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre descriptivo del archivo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Conciliacion_Bancaria_BancoBogota_Septiembre.pdf"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Evidencia
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="Word">Word</option>
                    <option value="Imagen">Imagen</option>
                    <option value="Enlace">Enlace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Auditoría Asociada
                  </label>
                  <input
                    type="text"
                    value={newAuditCode}
                    onChange={e => setNewAuditCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50/50 dark:bg-slate-800/40">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Arrastra tu archivo aquí o haz clic para explorar
                </span>
                <span className="text-[10px] text-slate-400">PDF, XLSX, DOCX, PNG hasta 50MB</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Subir y Registrar Custodia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
