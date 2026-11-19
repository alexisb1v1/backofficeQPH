import { authRepository } from "./repositories/auth.repository.impl";
import { LoginUseCase } from "./use-cases/login.use-case";
import { LogoutUseCase } from "./use-cases/logout.use-case";
import { GetStoredSessionUseCase } from "./use-cases/get-stored-session.use-case";

export * from "./dto/auth.dto";
export * from "./models/auth.model";
export * from "./repositories/auth.repository";
export * from "./repositories/auth.repository.impl";
export * from "./utils/auth-cookies";
export * from "./use-cases/login.use-case";
export * from "./use-cases/logout.use-case";
export * from "./use-cases/get-stored-session.use-case";

export const loginUseCase = new LoginUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export const getStoredSessionUseCase = new GetStoredSessionUseCase(
  authRepository,
);
