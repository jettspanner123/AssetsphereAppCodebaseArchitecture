import { LoginAuthState } from '../Features/LoginScreen/Models/LoginScreenModel';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
}

export default class ApplicationLocalStorageService {
  public static current: ApplicationLocalStorageService = new ApplicationLocalStorageService();

  private readonly accessTokenStorageKey: string = 'assetsphere_access_token';
  private readonly refreshTokenStorageKey: string = 'assetsphere_refresh_token';
  private readonly authSessionStorageKey: string = 'assetsphere_auth_session';

  // Access Token Management
  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.accessTokenStorageKey);
    } catch {
      return null;
    }
  }

  public setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.accessTokenStorageKey, token);
      } catch (error) {
        console.error('Failed to save access token to localStorage:', error);
      }
    }
  }

  // Refresh Token Management
  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.refreshTokenStorageKey);
    } catch {
      return null;
    }
  }

  public setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.refreshTokenStorageKey, token);
      } catch (error) {
        console.error('Failed to save refresh token to localStorage:', error);
      }
    }
  }

  // Dual Tokens Helper
  public setAuthTokens(tokens: AuthTokens): void {
    this.setAccessToken(tokens.accessToken);
    this.setRefreshToken(tokens.refreshToken);
  }

  public clearAuthTokens(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.accessTokenStorageKey);
        localStorage.removeItem(this.refreshTokenStorageKey);
      } catch (error) {
        console.error('Failed to clear tokens from localStorage:', error);
      }
    }
  }

  // Auth Session State Management
  public getAuthSession(): LoginAuthState | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.authSessionStorageKey);
      if (data) {
        return JSON.parse(data) as LoginAuthState;
      }
    } catch {
      return null;
    }
    return null;
  }

  public setAuthSession(session: LoginAuthState): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.authSessionStorageKey, JSON.stringify(session));
      } catch (error) {
        console.error('Failed to save auth session to localStorage:', error);
      }
    }
  }

  public clearAuthSession(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.authSessionStorageKey);
      } catch (error) {
        console.error('Failed to clear auth session from localStorage:', error);
      }
    }
  }

  // Clear All Authentication Data
  public clearAllAuthData(): void {
    this.clearAuthTokens();
    this.clearAuthSession();
  }
}
