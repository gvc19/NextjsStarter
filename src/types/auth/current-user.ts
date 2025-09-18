export interface CurrentUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
  tokenType?: string;
  expiresAt?: string;
}
