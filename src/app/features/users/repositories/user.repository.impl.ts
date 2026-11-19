import { ResultAsync, ok, err } from "neverthrow";
import { DomainError, ERROR_CODES } from "@/app/shared/errors/domain-error";
import { resolveApiBaseUrl } from "@/app/shared/utils/api-url";
import { UserRepository } from "./user.repository";
import { ListUsersFiltersDto, ListUsersApiResponseDto } from "../dto/user.dto";
import { PaginatedUsersModel, UserModel } from "../models/user.model";
import { apiResponseToPaginatedModel } from "../mappers/user.mapper";
import { AUTH_COOKIE_NAME, getCookie } from "@/app/features/auth";

export class UserRepositoryImpl implements UserRepository {
  private get baseUrl(): string {
    return resolveApiBaseUrl();
  }

  getUsers(
    filters: ListUsersFiltersDto,
  ): ResultAsync<PaginatedUsersModel, DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        const token = getCookie(AUTH_COOKIE_NAME);
        const params = new URLSearchParams();

        if (filters.role) params.set("role", filters.role);
        if (filters.search) params.set("search", filters.search);
        if (typeof filters.isOrganizer === "boolean") {
          params.set("isOrganizer", String(filters.isOrganizer));
        }
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const url = `${this.baseUrl}/users${queryString}`;

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
              ? "Sesión expirada o no autorizada"
              : res.status === 403
                ? "Acceso denegado a este recurso"
                : "Error al consultar usuarios");

          throw new DomainError(
            message,
            res.status === 401
              ? ERROR_CODES.UNAUTHORIZED.code
              : res.status === 403
                ? ERROR_CODES.BUSINESS_RULE.code
                : ERROR_CODES.NETWORK_ERROR.code,
          );
        }

        return apiResponseToPaginatedModel(data as ListUsersApiResponseDto);
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

  toggleUserStatus(
    _userId: number,
    _currentStatus: string,
  ): ResultAsync<UserModel, DomainError> {
    return ResultAsync.fromPromise(
      Promise.reject(
        new DomainError(
          "La acción de suspender/activar usuarios estará disponible próximamente en la API",
          ERROR_CODES.BUSINESS_RULE.code,
        ),
      ),
      (error) =>
        error instanceof DomainError
          ? error
          : new DomainError(String(error), ERROR_CODES.INTERNAL_ERROR.code),
    );
  }
}

export const userRepository = new UserRepositoryImpl();
