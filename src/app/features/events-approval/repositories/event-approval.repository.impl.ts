import { ResultAsync } from 'neverthrow';
import { DomainError, ERROR_CODES } from '@/app/shared/errors/domain-error';
import { resolveApiBaseUrl } from '@/app/shared/utils/api-url';
import { EventApprovalRepository } from './event-approval.repository';
import {
  ListEventApprovalsFiltersDto,
  ListEventApprovalsApiResponseDto,
} from '../dto/event-approval.dto';
import { PaginatedEventApprovalsModel } from '../models/event-approval.model';
import { apiResponseToPaginatedModel } from '../mappers/event-approval.mapper';
import { AUTH_COOKIE_NAME, getCookie } from '@/app/features/auth';

export class EventApprovalRepositoryImpl implements EventApprovalRepository {
  private get baseUrl(): string {
    return resolveApiBaseUrl();
  }

  getEvents(filters: ListEventApprovalsFiltersDto): ResultAsync<PaginatedEventApprovalsModel, DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        const token = getCookie(AUTH_COOKIE_NAME);
        const params = new URLSearchParams();

        if (filters.status) params.set('status', filters.status);
        if (filters.search) params.set('search', filters.search);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const url = `${this.baseUrl}/events/approvals${queryString}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const message =
            (data && (data.message || data.error)) ||
            (res.status === 401
              ? 'Sesión no autorizada'
              : res.status === 403
              ? 'Acceso restringido a moderadores'
              : 'Error al consultar aprobaciones');

          throw new DomainError(
            message,
            res.status === 401
              ? ERROR_CODES.UNAUTHORIZED.code
              : res.status === 403
              ? ERROR_CODES.BUSINESS_RULE.code
              : ERROR_CODES.NETWORK_ERROR.code,
          );
        }

        return apiResponseToPaginatedModel(data as ListEventApprovalsApiResponseDto);
      })(),
      (error) => {
        if (error instanceof DomainError) return error;
        return new DomainError(
          'Error al conectar con el servidor',
          ERROR_CODES.NETWORK_ERROR.code,
          error,
        );
      },
    );
  }

  approveEvent(eventId: string): ResultAsync<void, DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        const token = getCookie(AUTH_COOKIE_NAME);
        const url = `${this.baseUrl}/events/${encodeURIComponent(eventId)}/approve`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new DomainError(
            (data && (data.message || data.error)) || 'No se pudo aprobar el evento',
            ERROR_CODES.BUSINESS_RULE.code,
          );
        }
      })(),
      (error) => (error instanceof DomainError ? error : new DomainError(String(error), ERROR_CODES.INTERNAL_ERROR.code)),
    );
  }

  observeEvent(eventId: string, reason?: string): ResultAsync<void, DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        const token = getCookie(AUTH_COOKIE_NAME);
        const url = `${this.baseUrl}/events/${encodeURIComponent(eventId)}/observe`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({ reason }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new DomainError(
            (data && (data.message || data.error)) || 'No se pudo observar el evento',
            ERROR_CODES.BUSINESS_RULE.code,
          );
        }
      })(),
      (error) => (error instanceof DomainError ? error : new DomainError(String(error), ERROR_CODES.INTERNAL_ERROR.code)),
    );
  }
}

export const eventApprovalRepository = new EventApprovalRepositoryImpl();
