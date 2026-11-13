import { AuthRepository } from '../repositories/auth.repository';
import { AuthSession } from '../models/auth.model';

export class GetStoredSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): AuthSession | null {
    return this.authRepository.getStoredSession();
  }
}

