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
import useAuthenticationStateStore from '@/src/Store/AuthenticationStateStore';
import { UserProfileType } from '@/src/Types';

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

    const responseData: any = payload.data;
    const userProfile = responseData.user || responseData;

    const typedUser: UserProfileType = {
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      fullName: userProfile.fullName || `${userProfile.firstName} ${userProfile.lastName}`.trim() || 'Enterprise User',
      role: String(userProfile.role || 'USER'),
      department: userProfile.department ? String(userProfile.department) : null,
      avatarUrl: userProfile.avatarUrl || null,
      isVerified: Boolean(responseData.isVerified ?? userProfile.isVerified ?? false),
      lastLoginAt: userProfile.lastLoginAt || null,
    };

    // If account is pending operator verification, return pending state without storing auth tokens
    if (!typedUser.isVerified || responseData.isPendingApproval) {
      const authState: SignupAuthState = {
        isAuthenticated: false,
        isVerified: false,
        isPendingApproval: true,
        message:
          responseData.message ||
          payload.message ||
          'Your account creation request has been submitted to the Operator for review. Please wait for approval before logging in.',
        userEmail: typedUser.email,
        userName: typedUser.fullName,
        userRole: typedUser.role,
        user: typedUser,
      };

      toast.info('Account Request Submitted', {
        description: authState.message,
      });

      return authState;
    }

    // Otherwise, if verified (e.g. admin creation / direct verification)
    if (responseData.accessToken) {
      ApplicationLocalStorageService.current.setAuthTokens({
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
        expiresAt: responseData.expiresAt,
      });

      useAuthenticationStateStore.getState().setAuth(
        {
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken,
          expiresAt: responseData.expiresAt,
        },
        typedUser
      );
    }

    const authState: SignupAuthState = {
      isAuthenticated: true,
      isVerified: true,
      isPendingApproval: false,
      userEmail: typedUser.email,
      userName: typedUser.fullName,
      userRole: typedUser.role,
      accessToken: responseData.accessToken,
      refreshToken: responseData.refreshToken,
      user: typedUser,
    };

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

