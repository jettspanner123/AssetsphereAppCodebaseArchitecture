export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface SignupFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

import { UserProfileType } from '@/src/Types';

export interface SignupAuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: UserProfileType | null;
}

export interface BackendUserProfileDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string | number;
  department?: string | number | null;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
}

export interface BackendAuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: BackendUserProfileDTO;
}

export interface BackendApiResponseEnvelope<T> {
  data: T | null;
  success: boolean;
  message: string;
  errors: string[] | null;
  statusCode: number;
}

