import { ResultAsync } from 'neverthrow';
import { DomainError } from '@/app/shared/errors/domain-error';
import { LoginRequestDto } from '../dto/auth.dto';
import { AuthSession } from '../models/auth.model';

export interface AuthRepository {
  login(request: LoginRequestDto): ResultAsync<AuthSession, DomainError>;
  logout(): ResultAsync<void, DomainError>;
  getStoredSession(): AuthSession | null;
}

