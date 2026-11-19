import { ResultAsync } from "neverthrow";
import { DomainError, ERROR_CODES } from "@/app/shared/errors/domain-error";
import { resolveApiBaseUrl } from "@/app/shared/utils/api-url";
import { FinanceRepository } from "./finance.repository";
import {
  AdminSettlementListApiResponseDto,
  PayFinanceRequestDto,
  RejectFinanceRequestDto,
} from "../dto/finance-request.dto";
import { FinanceRequestItem } from "../models/finance-request.model";
import { adminSettlementApiToModel } from "../mappers/finance-request.mapper";
import { AUTH_COOKIE_NAME, getCookie } from "@/app/features/auth";

export class FinanceRepositoryImpl implements FinanceRepository {
  private get baseUrl(): string {
    return resolveApiBaseUrl();
  }

  getRequests(
    status?: string,
    search?: string,
  ): ResultAsync<FinanceRequestItem[], DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        const token = getCookie(AUTH_COOKIE_NAME);
        const params = new URLSearchParams();

        if (status && status !== "all") params.set("status", status);
        if (search) params.set("search", search);

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const url = `${this.baseUrl}/events/admin/settlements${queryString}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const message =
            (data && (data.message || data.error)) ||
            (res.status === 401
              ? "Sesión no autorizada"
              : res.status === 403
                ? "Acceso restringido a administradores"
                : "Error al consultar solicitudes de liquidación");

          throw new DomainError(
            message,
            res.status === 401
              ? ERROR_CODES.UNAUTHORIZED.code
              : res.status === 403
                ? ERROR_CODES.BUSINESS_RULE.code
                : ERROR_CODES.NETWORK_ERROR.code,
          );
        }

        const apiResponse = data as AdminSettlementListApiResponseDto;
        const items = Array.isArray(apiResponse?.items)
          ? apiResponse.items
          : [];
        return items.map(adminSettlementApiToModel);
      })(),
      (error) => {
        if (error instanceof DomainError) return error;
        return new DomainError(
          "Error al conectar con el servidor",
          ERROR_CODES.NETWORK_ERROR.code,
          error,
        );
      },
    );
  }

  approveRequest(id: string): ResultAsync<void, DomainError> {
    // Si la liquidación ya está en revisión, aprobar directamente se despacha con la transferencia
    return ResultAsync.fromPromise(
      (async () => {
        // Reservado si se requiere un estado intermedio de pre-aprobación
      })(),
      (error) =>
        error instanceof DomainError
          ? error
          : new DomainError(String(error), ERROR_CODES.INTERNAL_ERROR.code),
    );
  }

  markRequestPaid(
    id: string,
    dto: PayFinanceRequestDto,
  ): ResultAsync<void, DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        const token = getCookie(AUTH_COOKIE_NAME);
        const url = `${this.baseUrl}/events/admin/settlements/${encodeURIComponent(id)}/pay`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(dto),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new DomainError(
            (data && (data.message || data.error)) ||
              "No se pudo procesar el pago de la liquidación",
            ERROR_CODES.BUSINESS_RULE.code,
          );
        }
      })(),
      (error) =>
        error instanceof DomainError
          ? error
          : new DomainError(String(error), ERROR_CODES.INTERNAL_ERROR.code),
    );
  }

  rejectRequest(
    id: string,
    dto: RejectFinanceRequestDto,
  ): ResultAsync<void, DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        const token = getCookie(AUTH_COOKIE_NAME);
        const url = `${this.baseUrl}/events/admin/settlements/${encodeURIComponent(id)}/reject`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(dto),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new DomainError(
            (data && (data.message || data.error)) ||
              "No se pudo rechazar la solicitud de liquidación",
            ERROR_CODES.BUSINESS_RULE.code,
          );
        }
      })(),
      (error) =>
        error instanceof DomainError
          ? error
          : new DomainError(String(error), ERROR_CODES.INTERNAL_ERROR.code),
    );
  }
}

export const financeRepository = new FinanceRepositoryImpl();
