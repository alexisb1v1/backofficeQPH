export interface AdminSessionUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isOrganizer: boolean;
}

export interface AuthSession {
  token: string;
  user: AdminSessionUser;
  expiresInSeconds: number;
}
