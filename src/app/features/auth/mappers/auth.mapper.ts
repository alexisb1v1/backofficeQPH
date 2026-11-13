import { LoginResponseDto, AuthUserDto } from '../dto/auth.dto';
import { AuthSession, AdminSessionUser } from '../models/auth.model';

export class AuthMapper {
  static toDomainUser(dto: AuthUserDto): AdminSessionUser {
    const displayName =
      dto.name?.trim() ||
      [dto.firstName, dto.lastName].filter(Boolean).join(' ').trim() ||
      dto.email;

    return {
      id: dto.id,
      email: dto.email,
      displayName,
      role: dto.role,
      isOrganizer: !!dto.isOrganizer,
    };
  }

  static toDomainSession(dto: LoginResponseDto): AuthSession {
    const rawUser = dto.user || dto.userProfile;
    return {
      token: dto.accessToken || dto.token,
      user: this.toDomainUser(rawUser),
      expiresInSeconds: dto.expiresInSeconds || 900,
    };
  }
}

