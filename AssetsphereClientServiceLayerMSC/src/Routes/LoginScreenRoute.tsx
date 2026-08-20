import React from 'react';
import LoginScreenController from '../Features/LoginScreen/LoginScreenController';
import { LoginAuthState } from '../Features/LoginScreen/Models/LoginScreenModel';

export interface LoginScreenRouteProps {
  currentTheme: string;
  onToggleTheme: () => void;
  onLoginSuccess: (authState: LoginAuthState) => void;
  onNavigateSignup?: () => void;
}

export default function LoginScreenRoute({
  currentTheme,
  onToggleTheme,
  onLoginSuccess,
  onNavigateSignup,
}: LoginScreenRouteProps): React.JSX.Element {
  return (
    <LoginScreenController
      currentTheme={currentTheme}
      onToggleTheme={onToggleTheme}
      onLoginSuccess={onLoginSuccess}
      onNavigateSignup={onNavigateSignup}
    />
  );
}
