import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { AuthRepository } from '../repositories/auth.repository';
import { LoginRequestDto } from '../dto/auth.dto';
import { AuthSession } from '../models/auth.model';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(request: LoginRequestDto): ResultAsync<AuthSession, DomainError> {
    return this.authRepository.login({
      ...request,
      origin: 'backoffice',
    });
  }
}

