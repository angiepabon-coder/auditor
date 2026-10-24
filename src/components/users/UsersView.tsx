import React, { useState } from 'react';
import {
  Users2,
  ShieldCheck,
  Check,
  X,
  Search,
  Filter,
  UserCheck,
  Building2,
  Lock,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserItem } from '../../types';

export const UsersView: React.FC = () => {
  const { users, audits } = useApp();

  const [selectedUser, setSelectedUser] = useState<UserItem>(users[0]);
  const [testAuditId, setTestAuditId] = useState(audits[0]?.id || 'aud-1');
  const [testArea, setTestArea] = useState('Compras');

  if (!selectedUser) return <p className="p-6">No hay usuarios registrados. El acceso privado se administra en Supabase Auth.</p>;
  // Calculate effective permission based on role + organization + area + audit
  const calculatePermissions = (role: UserItem['role'], userArea: string, targetArea: string) => {
    switch (role) {
      case 'Administrador':
      case 'Director de Auditoría':
        return {
          view: true,
          create: true,
          edit: true,
          approve: true,
          close: true,
          delete: true,
          export: true,
          reason: 'Acceso total y gobierno de auditoría corporativa sin restricciones por área.'
        };
      case 'Auditor Líder':
        return {
          view: true,
          create: true,
          edit: true,
          approve: true,
          close: false,
          delete: false,
          export: true,
          reason: 'Facultad para aprobar papeles de trabajo y emitir borrador. Cierre reservado a Dirección.'
        };
      case 'Auditor':
        return {
          view: true,
          create: true,
          edit: true,
          approve: false,
          close: false,
          delete: false,
          export: true,
          reason: 'Ejecución de pruebas y documentación de evidencias en trabajo de campo.'
        };
      case 'Responsable del Proceso':
        const isMyArea = userArea.toLowerCase() === targetArea.toLowerCase();
        return {
          view: isMyArea,
          create: false,
          edit: isMyArea,
          approve: false,
          close: false,
          delete: false,
          export: isMyArea,
          reason: isMyArea
            ? 'Permiso de edición acotado a responder descargos y cargar evidencias de planes de acción de su propia área.'
            : 'Acceso denegado: El usuario no pertenece al área propietaria del proceso auditado.'
        };
      case 'Directivo':
        return {
          view: true,
          create: false,
          edit: false,
          approve: false,
          close: false,
          delete: false,
          export: true,
          reason: 'Lectura ejecutiva consolidada y exportación de informes para Junta Directiva.'
        };
      default: // Observador
        return {
          view: true,
          create: false,
          edit: false,
          approve: false,
          close: false,
          delete: false,
          export: false,
          reason: 'Solo lectura de papeles de trabajo sin facultad de descarga ni modificación.'
        };
    }
  };

  const effective = calculatePermissions(selectedUser.role, selectedUser.area, testArea);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Usuarios y Permisos RBAC
            </h1>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded">
              Matriz de Permiso Efectivo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Modelo de seguridad basado en: <strong>ROL + ORGANIZACIÓN + ÁREA + AUDITORÍA = PERMISO EFECTIVO</strong>.
          </p>
        </div>
      </div>

      {/* Main Layout: User Directory + Interactive RBAC Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* User Directory */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
            Directorio de Usuarios Activos
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
            {users.map(u => (
              <div
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                  selectedUser.id === u.id
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full ${u.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="truncate text-xs">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {u.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {u.email} · {u.area}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Effective Permission Calculator */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulador de Permiso Efectivo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calcula los privilegios resultantes evaluando el contexto transaccional en tiempo real.
            </p>
          </div>

          {/* Context test settings */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Usuario Seleccionado:</label>
              <div className="font-bold text-slate-900 dark:text-white">
                {selectedUser.name} ({selectedUser.role})
              </div>
              <span className="text-[10px] text-slate-400">Área base: {selectedUser.area}</span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Área Auditada Evaluada:</label>
              <select
                value={testArea}
                onChange={e => setTestArea(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold"
              >
                <option value="Compras">Compras</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Salud">Salud</option>
                <option value="SST">SST</option>
              </select>
            </div>
          </div>

          {/* Effective permissions grid */}
          <div className="space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Permisos Calculados para este Contexto:
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Ver Papeles / Dashboard', val: effective.view },
                { label: 'Crear Pruebas / Hallazgos', val: effective.create },
                { label: 'Editar Registros', val: effective.edit },
                { label: 'Aprobar Papeles de Trabajo', val: effective.approve },
                { label: 'Cerrar Auditoría', val: effective.close },
                { label: 'Exportar Dictamen', val: effective.export },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    p.val
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="font-medium text-[11px]">{p.label}</span>
                  {p.val ? (
                    <span className="font-bold text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                      Permitido
                    </span>
                  ) : (
                    <span className="font-medium text-[10px] text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                      Denegado
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rationale explanation */}
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 text-[11px] block mb-1">
              Fundamento de Control de Acceso:
            </span>
            <p className="text-indigo-800 dark:text-indigo-300 text-[11px] leading-relaxed">
              {effective.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
