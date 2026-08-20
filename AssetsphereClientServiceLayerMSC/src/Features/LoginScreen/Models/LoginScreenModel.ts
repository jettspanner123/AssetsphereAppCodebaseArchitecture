export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginAuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
}
