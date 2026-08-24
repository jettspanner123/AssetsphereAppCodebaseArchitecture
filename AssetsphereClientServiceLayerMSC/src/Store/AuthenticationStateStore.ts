import { create } from 'zustand';
import AuthenticationStateStoreInterface from './Interface/AuthenticationStateStoreInterface';
import ApplicationLocalStorageService from '../Services/ApplicationLocalStorageService';
import { UserProfileType, AuthTokensType } from '@/src/Types';

// Initial state hydrated from local storage (if available)
const initialAccessToken = ApplicationLocalStorageService.current.getAccessToken();
const initialRefreshToken = ApplicationLocalStorageService.current.getRefreshToken();
const initialSession = ApplicationLocalStorageService.current.getAuthSession();

const initialUser: UserProfileType | null = initialSession?.user || (initialSession?.userEmail ? {
  id: '',
  email: initialSession.userEmail,
  firstName: initialSession.userName?.split(' ')[0] || '',
  lastName: initialSession.userName?.split(' ').slice(1).join(' ') || '',
  fullName: initialSession.userName || '',
  role: initialSession.userRole || 'USER',
} : null);

const useAuthenticationStateStore = create<AuthenticationStateStoreInterface>((set) => ({
  isAuthenticated: Boolean(initialAccessToken && (initialUser || initialSession?.isAuthenticated)),
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  expiresAt: null,
  user: initialUser,

  setAuth: (tokens: AuthTokensType, user: UserProfileType) => {
    set({
      isAuthenticated: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt || null,
      user,
    });
  },

  setTokens: (tokens: AuthTokensType) => {
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt || null,
      isAuthenticated: Boolean(tokens.accessToken),
    });
  },

  setUser: (user: UserProfileType | null) => {
    set({ user });
  },

  clearAuth: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
    });
  },
}));

export default useAuthenticationStateStore;
