export interface LoginRequestDto {
  username: string;
  password: string;
  origin?: 'web' | 'backoffice';
}

export interface AuthUserDto {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isOrganizer?: boolean;
}

export interface LoginResponseDto {
  token: string;
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds: number;
  user: AuthUserDto;
  userProfile?: AuthUserDto;
  message: string;
}

