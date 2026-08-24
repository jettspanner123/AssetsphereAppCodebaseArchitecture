import { toast } from 'sonner';
import {
  SignupFormData,
  SignupFormErrors,
  SignupAuthState,
  BackendAuthResponseDTO,
  BackendApiResponseEnvelope,
} from '../Models/SignupScreenModel';
import SignupScreenCON from '../Constants/SignupScreenCON';
import ApplicationNetworkAPIConfiguration from '../../../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from '@/src/Services/ApplicationLocalStorageService';

export default class SignupScreenService {
  public static current: SignupScreenService = new SignupScreenService();

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
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const registerEndpoint = config.endpoints.authentication.register;

    // Split full name by first space into FirstName and LastName
    const trimmedName = formData.fullName.trim();
    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts[0] || 'Enterprise';
    const lastName = nameParts.slice(1).join(' ') || '';

    let response: Response;
    try {
      response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          firstName,
          lastName,
          role: 'USER',
        }),
      });
    } catch (networkError) {
      console.error('Backend registration network error:', networkError);
      toast.error('Authentication Server Unreachable', {
        description: `Unable to connect to orchestrator service at ${config.baseUrl}. Please verify the backend is running.`,
      });
      throw new Error('Authentication server is offline or unreachable.');
    }

    let payload: BackendApiResponseEnvelope<BackendAuthResponseDTO> | null = null;
    try {
      payload = (await response.json()) as BackendApiResponseEnvelope<BackendAuthResponseDTO>;
    } catch {
      toast.error('Invalid Server Response', {
        description: 'Received an unexpected response format from the server.',
      });
      throw new Error('Invalid response received from authentication server.');
    }

    if (!response.ok || !payload || !payload.success || !payload.data) {
      const errorMessage =
        payload?.message ||
        payload?.errors?.join(', ') ||
        'Registration failed. Please try again.';

      toast.error('Registration Failed', {
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }

    const authData: BackendAuthResponseDTO = payload.data;

    // Save tokens via dedicated LocalStorage Service
    ApplicationLocalStorageService.current.setAuthTokens({
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      expiresAt: authData.expiresAt,
    });

    const userProfile = authData.user;
    const authState: SignupAuthState = {
      isAuthenticated: true,
      userEmail: userProfile.email,
      userName: userProfile.fullName || `${userProfile.firstName} ${userProfile.lastName}`.trim() || 'Enterprise User',
      userRole: String(userProfile.role || 'USER'),
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
    };

    // Persist authenticated session
    ApplicationLocalStorageService.current.setAuthSession(authState);

    toast.success('Registration Successful', {
      description: `Welcome to AssetSphere, ${authState.userName}!`,
    });

    return authState;
  }

  public async authenticateWithMicrosoft(): Promise<SignupAuthState> {
    toast.info('Microsoft SSO Integration', {
      description: 'Redirecting to corporate identity provider...',
    });
    throw new Error('Microsoft Single Sign-On requires Azure Active Directory setup.');
  }
}

