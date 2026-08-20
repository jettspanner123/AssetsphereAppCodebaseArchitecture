import React from 'react';
import ForgotPasswordScreenController from '../Features/ForgotPasswordScreen/ForgotPasswordScreenController';

export interface ForgotPasswordScreenRouteProps {
  currentTheme: string;
  onToggleTheme: () => void;
  onNavigateLogin?: () => void;
}

export default function ForgotPasswordScreenRoute({
  currentTheme,
  onToggleTheme,
  onNavigateLogin,
}: ForgotPasswordScreenRouteProps): React.JSX.Element {
  return (
    <ForgotPasswordScreenController
      currentTheme={currentTheme}
      onToggleTheme={onToggleTheme}
      onNavigateLogin={onNavigateLogin}
    />
  );
}
