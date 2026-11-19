import { ResultAsync, ok, err } from "neverthrow";
import { DomainError, ERROR_CODES } from "@/app/shared/errors/domain-error";
import { resolveApiBaseUrl } from "@/app/shared/utils/api-url";
import { AuthRepository } from "./auth.repository";
import { LoginRequestDto, LoginResponseDto } from "../dto/auth.dto";
import { AuthSession } from "../models/auth.model";
import { AuthMapper } from "../mappers/auth.mapper";
import {
  AUTH_COOKIE_NAME,
  AUTH_STORAGE_USER_KEY,
  setCookie,
  getCookie,
  removeCookie,
} from "../utils/auth-cookies";

export class AuthRepositoryImpl implements AuthRepository {
  private get baseUrl(): string {
    return resolveApiBaseUrl();
  }

  login(request: LoginRequestDto): ResultAsync<AuthSession, DomainError> {
    return ResultAsync.fromPromise(
      fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: request.username,
          password: request.password,
          origin: request.origin || "backoffice",
        }),
      }).then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const message =
            (data && (data.message || data.error)) ||
            (res.status === 401
              ? "Usuario o contraseña incorrectos"
              : res.status === 403
                ? "Acceso denegado: Se requiere rol de Administrador para acceder al Backoffice"
                : "Error al iniciar sesión");

          throw new DomainError(
            message,
            res.status === 401
              ? ERROR_CODES.UNAUTHORIZED.code
              : res.status === 403
                ? ERROR_CODES.BUSINESS_RULE.code
                : ERROR_CODES.NETWORK_ERROR.code,
          );
        }

        const session = AuthMapper.toDomainSession(data as LoginResponseDto);

        // Guardar token en cookie para Next.js Middleware y localStorage para cliente
        setCookie(AUTH_COOKIE_NAME, session.token, session.expiresInSeconds);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            AUTH_STORAGE_USER_KEY,
            JSON.stringify(session.user),
          );
        }

        return session;
      }),
      (error) => {
        if (error instanceof DomainError) return error;
        return new DomainError(
          "No se pudo conectar con el servidor de autenticación",
          ERROR_CODES.NETWORK_ERROR.code,
          error,
        );
      },
    );
  }

  logout(): ResultAsync<void, DomainError> {
    return ResultAsync.fromPromise(
      (async () => {
        try {
          await fetch(`${this.baseUrl}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-origin": "backoffice",
            },
            credentials: "include",
            body: JSON.stringify({ origin: "backoffice" }),
          });
        } catch {
          // Si falla el endpoint, continuamos con la limpieza local
        }
        removeCookie(AUTH_COOKIE_NAME);
        if (typeof window !== "undefined") {
          localStorage.removeItem(AUTH_STORAGE_USER_KEY);
        }
      })(),
      (error) =>
        new DomainError(
          "Error al cerrar sesión",
          ERROR_CODES.INTERNAL_ERROR.code,
          error,
        ),
    );
  }

  getStoredSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    const token = getCookie(AUTH_COOKIE_NAME);
    const rawUser = localStorage.getItem(AUTH_STORAGE_USER_KEY);

    if (!token || !rawUser) return null;

    try {
      const user = JSON.parse(rawUser);
      return {
        token,
        user,
        expiresInSeconds: 900,
      };
    } catch {
      return null;
    }
  }
}

export const authRepository = new AuthRepositoryImpl();
