import { ApiEventApprovalItemDto, ListEventApprovalsApiResponseDto } from '../dto/event-approval.dto';
import { EventApprovalItem, PaginatedEventApprovalsModel, EventApprovalZoneModel } from '../models/event-approval.model';

const CATEGORY_COLORS: Record<string, string> = {
  CONCERTS: 'bg-purple-600',
  THEATER: 'bg-orange-600',
  SPORTS: 'bg-blue-600',
  FESTIVALS: 'bg-pink-600',
  COMEDY: 'bg-amber-600',
  GASTRONOMY: 'bg-emerald-600',
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'Fecha por programar';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function apiEventToModel(dto: ApiEventApprovalItemDto): EventApprovalItem {
  const words = (dto.title || 'Evento').trim().split(' ').filter(Boolean);
  const initials =
    words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : dto.title.slice(0, 2).toUpperCase();

  const avatarBgColor = CATEGORY_COLORS[dto.category] || 'bg-indigo-600';

  const priceRange =
    dto.minPrice === 0 && dto.maxPrice === 0
      ? 'Entrada libre'
      : dto.minPrice === dto.maxPrice
      ? `S/ ${dto.minPrice.toFixed(2)}`
      : `S/ ${dto.minPrice.toFixed(0)} - S/ ${dto.maxPrice.toFixed(0)}`;

  const mappedZones: EventApprovalZoneModel[] = (dto.zones || []).map((z) => {
    const regPrice = Number(z.regularPrice) || 0;
    const fee = Number(z.serviceFee) || 0;
    const buyerPrice = z.feeIncluded ? regPrice : regPrice + fee;
    return {
      name: z.name,
      regularPrice: regPrice,
      serviceFee: fee,
      feeIncluded: Boolean(z.feeIncluded),
      capacity: Number(z.capacity) || 0,
      buyerPrice,
    };
  });

  return {
    id: dto.id,
    publicUuid: dto.publicUuid,
    slug: dto.slug,
    title: dto.title,
    organizerName: dto.organizerName || 'Organizador independiente',
    organizerDocumentNumber: dto.organizerDocumentNumber || 'No registrado',
    category: dto.category,
    eventDateFormatted: formatDate(dto.firstShowDate),
    venueName: dto.venue || 'Recinto por confirmar',
    venueCity: dto.city || 'Lima',
    totalCapacity: dto.totalCapacity,
    capacityFormatted: dto.totalCapacity > 0 ? `${dto.totalCapacity.toLocaleString()} pers.` : 'No asignado',
    priceRangeFormatted: priceRange,
    minPrice: dto.minPrice,
    maxPrice: dto.maxPrice,
    status: dto.status,
    observationReason: dto.observationReason || null,
    zones: mappedZones,
    avatarInitials: initials,
    avatarBgColor,
    createdAtFormatted: formatDate(dto.createdAt),
  };
}

export function apiResponseToPaginatedModel(
  dto: ListEventApprovalsApiResponseDto,
): PaginatedEventApprovalsModel {
  return {
    items: (dto.data || []).map(apiEventToModel),
    meta: dto.meta,
  };
}
