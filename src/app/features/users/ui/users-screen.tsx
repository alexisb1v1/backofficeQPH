'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getUsersUseCase,
  UserModel,
  PaginatedUsersModel,
} from '@/app/features/users';
import {
  Search,
  Download,
  ShoppingBag,
  Megaphone,
  UserCheck,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export function UsersScreen() {
  const [filterRole, setFilterRole] = useState<'all' | 'customer' | 'organizer'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState<PaginatedUsersModel>({
    users: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Debounce para el input de búsqueda de texto
  useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchInput.trim());
    setPage(1); // Reiniciar a la primera página ante nueva búsqueda
  }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

const loadUsers = useCallback(async () => {
  setLoading(true);
  setFeedbackMessage(null);

    const isOrganizerFilter =
      filterRole === 'organizer'
        ? true
        : filterRole === 'customer'
        ? false
        : undefined;

    const result = await getUsersUseCase.execute({
      role: 'customer', // Filtrar por los usuarios clientes/web
      search: debouncedSearch || undefined,
      isOrganizer: isOrganizerFilter,
      page,
      limit,
    });

    result.match(
        (data) => {
          setPaginatedData(data);
          setLoading(false);
        },
            (err) => {
  setFeedbackMessage(`Error al cargar usuarios: ${err.message}`);
  setLoading(false);
},
    );
  }, [filterRole, debouncedSearch, page, limit]);

useEffect(() => {
  loadUsers();
}, [loadUsers]);

const handleRoleTabChange = (tab: 'all' | 'customer' | 'organizer') => {
  setFilterRole(tab);
  setPage(1);
};

return (
  <div className="flex flex-col w-full pb-16">
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
      {/* Header & Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Directorio Web • Clientes QPH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="text-xs text-on-surface-variant font-medium">
              {paginatedData.meta.total} Usuarios Registrados
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
            Gestión de Usuarios Clientes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadUsers()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:text-primary font-bold text-xs shadow-sm border border-surface-container transition-all cursor-pointer"
            title="Refrescar listado"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : 'text-on-surface-variant'}`} />
            <span>Actualizar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:text-primary font-bold text-xs shadow-sm border border-surface-container transition-all">
            <Download className="w-4 h-4 text-primary" />
            <span>Exportar (CSV)</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-start justify-between gap-2 text-xs font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
              <button
                onClick={() => setFeedbackMessage(null)}
                className="hover:opacity-75"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
        )}

                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-sm">
                        <div className="space-y-1">
                          <span className="text-xs text-on-surface-variant font-semibold">
                            Total Clientes Registrados
                          </span>
                          <h3 className="text-2xl font-black text-on-surface">
                            {paginatedData.meta.total.toLocaleString()}
                          </h3>
                        </div>
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <UserCheck className="w-6 h-6" />
                          </div>
                        </div>

                              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-sm">
                                <div className="space-y-1">
                                  <span className="text-xs text-on-surface-variant font-semibold">
                                    Página Actual
                                  </span>
                                  <h3 className="text-2xl font-black text-on-surface">
                                    {paginatedData.meta.page} de {paginatedData.meta.totalPages}
                                  </h3>
                                </div>
                                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                    <ShoppingBag className="w-6 h-6" />
                                  </div>
                                </div>

                                      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between shadow-sm">
                                        <div className="space-y-1">
                                          <span className="text-xs text-on-surface-variant font-semibold">
                                            Estado API Conectada
                                          </span>
                                          <h3 className="text-2xl font-black text-emerald-600">En Vivo</h3>
                                        </div>
                                          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Megaphone className="w-6 h-6" />
                                          </div>
                                        </div>
                                      </div>

                                        {/* Search & Tabs Filter */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm">
                                          {/* Search Box */}
                                          <div className="relative flex-1 max-w-md">
                                            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            <input
                                              type="text"
                                              value={searchInput}
                                              onChange={(e) => setSearchInput(e.target.value)}
                                              placeholder="Buscar por nombre, email o username..."
                                              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-electric-indigo transition-all border border-transparent focus:border-electric-indigo"
                                            />
                                            {searchInput && (
                                              <button
                                                onClick={() => setSearchInput('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                          </div>

          {/* Subfilter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleTabChange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterRole === 'all'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Todos {filterRole === 'all' && `(${paginatedData.meta.total})`}
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('customer')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterRole === 'customer'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Compradores Web {filterRole === 'customer' && `(${paginatedData.meta.total})`}
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('organizer')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterRole === 'organizer'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Organizadores {filterRole === 'organizer' && `(${paginatedData.meta.total})`}
            </button>
          </div>
                                        </div>

                                          {/* Table Container */}
                                          <div className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm overflow-hidden flex flex-col">
                                            <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-xs">
                                                      <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-surface-container">
                                                        <tr>
                                                          <th className="py-3.5 px-6">Usuario / Email</th>
                                                          <th className="py-3.5 px-6">Username</th>
                                                          <th className="py-3.5 px-6">Tipo / Perfil</th>
                                                          <th className="py-3.5 px-6">Tickets Comprados</th>
                                                          <th className="py-3.5 px-6">Fecha Registro</th>
                                                          <th className="py-3.5 px-6">Estado Email</th>
                                                          <th className="py-3.5 px-6 text-right">Acciones</th>
                                                        </tr>
                                                      </thead>
              <tbody className="divide-y divide-surface-container/60">
                                                                    {loading ? (
                                                                      <tr>
                                                                        <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                                                                          <div className="flex flex-col items-center justify-center gap-3">
                                                                            <Loader2 className="w-7 h-7 animate-spin text-primary" />
                                                                            <span className="font-semibold text-xs">Cargando directorio de usuarios...</span>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    ) : paginatedData.users.length === 0 ? (
                                                                      <tr>
                                                                        <td colSpan={7} className="py-16 text-center text-on-surface-variant">
                                                                          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                                                                            <Search className="w-8 h-8 text-outline" />
                                                                            <h4 className="font-bold text-sm text-on-surface">No se encontraron usuarios</h4>
                                                                            <p className="text-xs text-outline leading-relaxed">
                                                                              No existen registros que coincidan con los criterios de búsqueda actuales.
                                                                            </p>
                                                                          </div>
                                                                        </td>
                                                                      </tr>
                                                                    ) : (
                                                                      paginatedData.users.map((user) => (
                                                                        <tr
                                                                          key={user.id}
                                                                          className="hover:bg-surface-container-low/50 transition-colors"
                                                                        >
                                                                          {/* Name & Email */}
                                                                          <td className="py-3.5 px-6">
                                                                            <div className="flex items-center gap-3">
                                                                              <div
                                                                                className={`w-9 h-9 rounded-full ${user.avatarBgColor} text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0`}
                                                                              >
                                                                              {user.avatarInitials}
                                                                            </div>
                                                                            <div className="flex flex-col min-w-0">
                                                                              <span className="font-bold text-on-surface truncate">
                                                                                {user.fullName}
                                                                              </span>
                                                                              <span className="text-[11px] text-on-surface-variant truncate">
                                                                                {user.email}
                                                                              </span>
                                                                            </div>
                                                                          </div>
                                                                </td>

                      {/* Username */}
                      <td className="py-3.5 px-6">
                        <span className="font-mono text-xs bg-surface-container px-2 py-0.5 rounded-md text-on-surface font-semibold">
                          @{user.username}
                        </span>
                      </td>

                      {/* Tipo / Perfil */}
                                                                  <td className="py-3.5 px-6">
                                                                    {user.isOrganizer ? (
                                                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700">
                                                                        <Megaphone className="w-3 h-3" />
                                                                        Organizador
                                                                      </span>
                                                                    ) : (
                                                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-700">
                                                                        <ShoppingBag className="w-3 h-3" />
                                                                        Comprador
                                                                      </span>
                                                                    )}
                                                                  </td>

                      {/* Tickets Comprados */}
                      <td className="py-3.5 px-6 font-semibold text-on-surface">
                        <span className="px-2.5 py-1 rounded-lg bg-surface-container font-mono text-xs">
                          {user.ticketsCount} tickets
                        </span>
                      </td>

                      {/* Fecha Registro */}
                                                                    <td className="py-3.5 px-6 text-on-surface-variant text-[11px]">
                                                                      {user.registeredDateFormatted}
                                                                    </td>

                                                                    {/* Estado Email */}
                                                                    <td className="py-3.5 px-6">
                                                                      {user.isEmailVerified ? (
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700">
                                                                          Verificado
                                                                        </span>
                                                                      ) : (
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700">
                                                                          Pendiente
                                                                        </span>
                                                                      )}
                                                                    </td>

                                                                        {/* Actions */}
                                                                        <td className="py-3.5 px-6 text-right">
                                                                          <button
                                                                            onClick={() => setSelectedUser(user)}
                                                                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                                                                            title="Ver detalle del usuario"
                                                                          >
                                                                            <Eye className="w-4 h-4" />
                                                                          </button>
                                                                </td>
                                                              </tr>
                                                              ))
                )}
                                                            </tbody>
                                                          </table>
          </div>

                                                      {/* Pagination Footer */}
                                                      <div className="p-4 bg-surface-container-low border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                                        <span className="text-on-surface-variant font-medium">
                                                          Mostrando {paginatedData.users.length} de {paginatedData.meta.total} usuarios (Página {paginatedData.meta.page} de {paginatedData.meta.totalPages})
                                                        </span>

                                                        <div className="flex items-center gap-2">
                                                          <button
                                                            disabled={!paginatedData.meta.hasPrevPage || loading}
                                                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container font-semibold text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-all cursor-pointer"
                                                          >
                                                            <ChevronLeft className="w-4 h-4" />
                                                            <span>Anterior</span>
                                                          </button>

                                                          <div className="px-3 py-1.5 rounded-xl bg-surface-container font-bold text-on-surface">
                                                            {paginatedData.meta.page}
                                                          </div>

                                                          <button
                                                            disabled={!paginatedData.meta.hasNextPage || loading}
                                                            onClick={() => setPage((prev) => prev + 1)}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container font-semibold text-on-surface disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-all cursor-pointer"
                                                          >
                                                            <span>Siguiente</span>
                                                            <ChevronRight className="w-4 h-4" />
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* User Details Drawer Modal */}
                                                  {selectedUser && (
                                                          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
                                                            <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
                                                              <div className="p-6 border-b border-surface-container flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                  <div
                                                                    className={`w-11 h-11 rounded-full ${selectedUser.avatarBgColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                                                                  >
                                                                    {selectedUser.avatarInitials}
                                                                  </div>
                                                                    <div>
                                                                      <h3 className="font-bold text-base text-on-surface leading-tight">
                                                                        {selectedUser.fullName}
                                                                      </h3>
                                                                      <span className="text-xs text-on-surface-variant font-mono">
                                                                        @{selectedUser.username}
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                  <button
                                                                    onClick={() => setSelectedUser(null)}
                                                                    className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
                                                                  >
                                                                    <X className="w-5 h-5" />
                                                                  </button>
                                                                </div>

                                                                <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                                                                  <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
                                                                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-on-surface">
                                                                      Datos de Cuenta y Acceso
                                                                    </h4>
                                                                    <div className="flex justify-between py-1 border-b border-surface-container">
                                                                      <span className="text-on-surface-variant">UUID Público</span>
                                                                      <span className="font-mono text-[10px] text-on-surface truncate max-w-[200px]">
                                                                        {selectedUser.publicUuid}
                                                                      </span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-surface-container">
                                                                      <span className="text-on-surface-variant">Correo Electrónico</span>
                                                                      <span className="font-bold text-on-surface">{selectedUser.email}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-surface-container">
                                                                      <span className="text-on-surface-variant">Rol de Usuario</span>
                                                                      <span className="font-bold text-on-surface uppercase">{selectedUser.role}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1">
                                                                      <span className="text-on-surface-variant">Organizador</span>
                                                                      <span className="font-bold text-primary">
                                                                        {selectedUser.isOrganizer ? 'Sí (Activo)' : 'No (Solo Comprador)'}
                                                                      </span>
                                                                    </div>
                                                                  </div>

                                                                  <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
                                                                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-on-surface">
                                                                      Auditoría y Transacciones
                                                                    </h4>
                                                                    <div className="flex justify-between py-1 border-b border-surface-container">
                                                                      <span className="text-on-surface-variant">Fecha de Registro</span>
                                                                      <span className="text-on-surface">{selectedUser.registeredDateFormatted}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-surface-container">
                                                                      <span className="text-on-surface-variant">Email Verificado</span>
                                                                      <span className="font-bold text-on-surface">
                                                                        {selectedUser.isEmailVerified ? 'Sí (Confirmado)' : 'Pendiente'}
                                                                      </span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1">
                                                                      <span className="text-on-surface-variant">Tickets Comprados</span>
                                                                      <span className="font-bold text-on-surface font-mono">
                                                                        {selectedUser.ticketsCount} tickets
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                </div>

                                                                  <div className="p-5 bg-surface border-t border-surface-container flex items-center justify-end">
                                                                    <button
                                                                      onClick={() => setSelectedUser(null)}
                                                                      className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface cursor-pointer"
                                                                    >
                                                                      Cerrar
                                                                    </button>
                                                                  </div>
                                                                </div>
                                                              </div>
      )}
                                                            </div>
                                                            );
}
