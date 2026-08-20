import React from 'react';
import SignupScreenController from '../Features/SignupScreen/SignupScreenController';
import { SignupAuthState } from '../Features/SignupScreen/Models/SignupScreenModel';

export interface SignupScreenRouteProps {
  currentTheme: string;
  onToggleTheme: () => void;
  onSignupSuccess: (authState: SignupAuthState) => void;
  onNavigateLogin?: () => void;
}

export default function SignupScreenRoute({
  currentTheme,
  onToggleTheme,
  onSignupSuccess,
  onNavigateLogin,
}: SignupScreenRouteProps): React.JSX.Element {
  return (
    <SignupScreenController
      currentTheme={currentTheme}
      onToggleTheme={onToggleTheme}
      onSignupSuccess={onSignupSuccess}
      onNavigateLogin={onNavigateLogin}
    />
  );
}
