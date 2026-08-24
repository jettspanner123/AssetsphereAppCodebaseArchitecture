import { UserProfileType, AuthTokensType } from '@/src/Types';

export default interface AuthenticationStateStoreInterface {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: UserProfileType | null;

  setAuth: (tokens: AuthTokensType, user: UserProfileType) => void;
  setTokens: (tokens: AuthTokensType) => void;
  setUser: (user: UserProfileType | null) => void;
  clearAuth: () => void;
}
