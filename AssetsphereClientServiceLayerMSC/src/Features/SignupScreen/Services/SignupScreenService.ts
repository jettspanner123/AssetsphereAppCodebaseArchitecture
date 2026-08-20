import { SignupFormData, SignupFormErrors, SignupAuthState } from '../Models/SignupScreenModel';
import SignupScreenCON from '../Constants/SignupScreenCON';

export default class SignupScreenService {
  public static current: SignupScreenService = new SignupScreenService();

  private authStorageKey: string = 'assetsphere_auth_session';

  public validate(formData: SignupFormData): SignupFormErrors {
    const errors: SignupFormErrors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = SignupScreenCON.ERROR_FULL_NAME_REQUIRED;
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = SignupScreenCON.ERROR_FULL_NAME_LENGTH;
    }

    if (!formData.email.trim()) {
      errors.email = SignupScreenCON.ERROR_EMAIL_REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = SignupScreenCON.ERROR_EMAIL_INVALID;
    }

    if (!formData.password) {
      errors.password = SignupScreenCON.ERROR_PASSWORD_REQUIRED;
    } else if (formData.password.length < 6) {
      errors.password = SignupScreenCON.ERROR_PASSWORD_LENGTH;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = SignupScreenCON.ERROR_CONFIRM_PASSWORD_REQUIRED;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = SignupScreenCON.ERROR_PASSWORD_MISMATCH;
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = SignupScreenCON.ERROR_TERMS_REQUIRED;
    }

    return errors;
  }

  public async registerWithCredentials(formData: SignupFormData): Promise<SignupAuthState> {
    // Simulate registration network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const authState: SignupAuthState = {
      isAuthenticated: true,
      userEmail: formData.email.trim(),
      userName: formData.fullName.trim() || formData.email.split('@')[0] || 'Enterprise User',
      userRole: 'Enterprise Admin',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.authStorageKey, JSON.stringify(authState));
    }

    return authState;
  }

  public async authenticateWithMicrosoft(): Promise<SignupAuthState> {
    // Simulate Microsoft SSO OAuth handshake
    await new Promise((resolve) => setTimeout(resolve, 800));

    const authState: SignupAuthState = {
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
}
