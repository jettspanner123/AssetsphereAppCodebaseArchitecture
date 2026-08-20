import React from 'react';
import LoginScreenController from '../Features/LoginScreen/LoginScreenController';
import { LoginAuthState } from '../Features/LoginScreen/Models/LoginScreenModel';

export interface LoginScreenRouteProps {
  currentTheme: string;
  onToggleTheme: () => void;
  onLoginSuccess: (authState: LoginAuthState) => void;
  onNavigateSignup?: () => void;
  onNavigateForgotPassword?: () => void;
}

export default function LoginScreenRoute({
  currentTheme,
  onToggleTheme,
  onLoginSuccess,
  onNavigateSignup,
  onNavigateForgotPassword,
}: LoginScreenRouteProps): React.JSX.Element {
  return (
    <LoginScreenController
      currentTheme={currentTheme}
      onToggleTheme={onToggleTheme}
      onLoginSuccess={onLoginSuccess}
      onNavigateSignup={onNavigateSignup}
      onNavigateForgotPassword={onNavigateForgotPassword}
    />
  );
}
