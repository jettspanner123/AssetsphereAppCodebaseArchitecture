import { LoginCredentials, LoginFormErrors, LoginAuthState } from '../Models/LoginScreenModel';
import LoginScreenCON from '../Constants/LoginScreenCON';

export default class LoginScreenService {
  public static current: LoginScreenService = new LoginScreenService();

  private authStorageKey: string = 'assetsphere_auth_session';

  public validate(credentials: LoginCredentials): LoginFormErrors {
    const errors: LoginFormErrors = {};

    if (!credentials.email.trim()) {
      errors.email = LoginScreenCON.ERROR_EMAIL_REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim())) {
      errors.email = LoginScreenCON.ERROR_EMAIL_INVALID;
    }

    if (!credentials.password) {
      errors.password = LoginScreenCON.ERROR_PASSWORD_REQUIRED;
    } else if (credentials.password.length < 6) {
      errors.password = LoginScreenCON.ERROR_PASSWORD_LENGTH;
    }

    return errors;
  }

  public async authenticateWithCredentials(credentials: LoginCredentials): Promise<LoginAuthState> {
    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const authState: LoginAuthState = {
      isAuthenticated: true,
      userEmail: credentials.email.trim(),
      userName: credentials.email.split('@')[0] || 'Enterprise User',
      userRole: 'Enterprise Admin',
    };

    if (credentials.rememberMe && typeof window !== 'undefined') {
      localStorage.setItem(this.authStorageKey, JSON.stringify(authState));
    }

    return authState;
  }

  public async authenticateWithMicrosoft(): Promise<LoginAuthState> {
    // Simulate Microsoft SSO OAuth handshake
    await new Promise((resolve) => setTimeout(resolve, 800));

    const authState: LoginAuthState = {
      isAuthenticated: true,
      userEmail: 'admin@weplm.enterprise.com',
      userName: 'Microsoft Azure User',
      userRole: 'Global Asset Administrator',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.authStorageKey, JSON.stringify(authState));
    }

    return authState;
  }

  public getSavedSession(): LoginAuthState | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.authStorageKey);
      if (data) {
        return JSON.parse(data) as LoginAuthState;
      }
    } catch {
      return null;
    }
    return null;
  }

  public clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.authStorageKey);
    }
  }
}
