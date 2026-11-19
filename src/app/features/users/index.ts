import { UserRepositoryImpl } from "./repositories/user.repository.impl";
import { GetUsersUseCase } from "./use-cases/get-users.use-case";
import { ToggleUserStatusUseCase } from "./use-cases/toggle-user-status.use-case";

const userRepository = new UserRepositoryImpl();

export const getUsersUseCase = new GetUsersUseCase(userRepository);
export const toggleUserStatusUseCase = new ToggleUserStatusUseCase(
  userRepository,
);

export * from "./models/user.model";
export * from "./dto/user.dto";
