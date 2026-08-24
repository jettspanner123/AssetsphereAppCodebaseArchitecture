import { toast } from 'sonner';
import {
  LoginCredentials,
  LoginFormErrors,
  LoginAuthState,
  BackendAuthResponseDTO,
  BackendApiResponseEnvelope,
} from '../Models/LoginScreenModel';
import LoginScreenCON from '../Constants/LoginScreenCON';
import ApplicationNetworkAPIConfiguration from '../../../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from '@/src/Services/ApplicationLocalStorageService';
import useAuthenticationStateStore from '@/src/Store/AuthenticationStateStore';
import { UserProfileType } from '@/src/Types';

export default class LoginScreenService {
  public static current: LoginScreenService = new LoginScreenService();

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
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const loginEndpoint = config.endpoints.authentication.login;

    let response: Response;
    try {
      response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });
    } catch (networkError) {
      console.error('Backend authentication network error:', networkError);
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
        'Authentication failed. Please verify your credentials.';
      
      toast.error('Sign In Failed', {
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
    const typedUser: UserProfileType = {
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      fullName: userProfile.fullName || `${userProfile.firstName} ${userProfile.lastName}`.trim() || 'Enterprise User',
      role: String(userProfile.role || 'USER'),
      department: userProfile.department ? String(userProfile.department) : null,
      avatarUrl: userProfile.avatarUrl || null,
      lastLoginAt: userProfile.lastLoginAt || null,
    };

    // Save to Zustand State Store
    useAuthenticationStateStore.getState().setAuth(
      {
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt,
      },
      typedUser
    );

    const authState: LoginAuthState = {
      isAuthenticated: true,
      userEmail: typedUser.email,
      userName: typedUser.fullName,
      userRole: typedUser.role,
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      user: typedUser,
    };

    // Save session via dedicated LocalStorage Service
    if (credentials.rememberMe) {
      ApplicationLocalStorageService.current.setAuthSession(authState);
    }

    toast.success('Signed In Successfully', {
      description: `Welcome back, ${authState.userName}!`,
    });

    return authState;
  }

  public async authenticateWithMicrosoft(): Promise<LoginAuthState> {
    toast.info('Microsoft SSO Integration', {
      description: 'Redirecting to corporate identity provider...',
    });
    // SSO placeholder
    throw new Error('Microsoft Single Sign-On requires Azure Active Directory setup.');
  }

  public getSavedSession(): LoginAuthState | null {
    return ApplicationLocalStorageService.current.getAuthSession();
  }

  public clearSession(): void {
    ApplicationLocalStorageService.current.clearAllAuthData();
    useAuthenticationStateStore.getState().clearAuth();
  }
}
