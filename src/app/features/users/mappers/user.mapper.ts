import { ApiUserItemDto, ListUsersApiResponseDto } from '../dto/user.dto';
import { UserModel, PaginatedUsersModel, UserRole, UserStatus } from '../models/user.model';

const AVATAR_COLORS = [
  'bg-indigo-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-violet-600',
  'bg-emerald-600',
];

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  export function apiUserItemToModel(dto: ApiUserItemDto): UserModel {
    const nameToUse = dto.name?.trim() || dto.username || dto.email;
    const parts = nameToUse.split(' ').filter(Boolean);
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : nameToUse.slice(0, 2).toUpperCase();

    const colorIndex = Math.abs(dto.id) % AVATAR_COLORS.length;

    const role: UserRole = dto.role === 'admin' ? 'admin' : 'customer';
    const status: UserStatus = dto.isEmailVerified ? 'active' : 'pending_verification';

    return {
      id: dto.id,
      publicUuid: dto.publicUuid,
      fullName: nameToUse,
      email: dto.email,
      username: dto.username,
      role,
      isOrganizer: dto.isOrganizer,
      documentType: dto.organizerDocumentType || 'DNI',
      documentNumber: dto.organizerDocumentNumber || 'No registrado',
      phoneNumber: dto.organizerPhone || 'No registrado',
      registeredDateFormatted: formatDate(dto.createdAt),
      isEmailVerified: dto.isEmailVerified,
      status,
      ticketsCount: dto.ticketsCount || 0,
      lastActivityText: dto.isOrganizer ? 'Organizador registrado' : 'Comprador web',
      avatarInitials: initials,
      avatarBgColor: AVATAR_COLORS[colorIndex],
    };
  }

  export function apiResponseToPaginatedModel(
    dto: ListUsersApiResponseDto,
  ): PaginatedUsersModel {
    return {
      users: (dto.data || []).map(apiUserItemToModel),
      meta: dto.meta,
    };
  }
