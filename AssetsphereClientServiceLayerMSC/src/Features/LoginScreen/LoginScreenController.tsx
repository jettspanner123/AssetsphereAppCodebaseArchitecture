import React, { useState } from 'react';
import LoginScreenCardStaticComponent from './Components/static/LoginScreenCardStaticComponent';
import LoginScreenCON from './Constants/LoginScreenCON';
import { LoginCredentials, LoginFormErrors, LoginAuthState } from './Models/LoginScreenModel';
import LoginScreenService from './Services/LoginScreenService';
import AnimatedThemeToggleSharedComponent from '../../Shared/Components/AnimatedThemeToggleSharedComponent';

export interface LoginScreenControllerProps {
  currentTheme: string;
  onToggleTheme: () => void;
  onLoginSuccess: (authState: LoginAuthState) => void;
  onNavigateSignup?: () => void;
  onNavigateForgotPassword?: () => void;
}

export default function LoginScreenController({
  currentTheme,
  onToggleTheme,
  onLoginSuccess,
  onNavigateSignup,
  onNavigateForgotPassword,
}: LoginScreenControllerProps): React.JSX.Element {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState<boolean>(false);

  const handleFieldChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof LoginFormErrors] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = LoginScreenService.current.validate(credentials);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const authState = await LoginScreenService.current.authenticateWithCredentials(credentials);
      onLoginSuccess(authState);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify your credentials and try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      setIsMicrosoftLoading(true);
      const authState = await LoginScreenService.current.authenticateWithMicrosoft();
      onLoginSuccess(authState);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Microsoft Single Sign-On failed. Please contact IT Helpdesk.';
      setErrors({ general: errorMessage });
    } finally {
      setIsMicrosoftLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-zinc-100 flex flex-col justify-between relative overflow-hidden transition-colors selection:bg-[#0C2086]/20">
      {/* Ambient background glow effects matching DESIGN.md */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#0C2086]/10 dark:from-[#0C2086]/20 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-sky-500/5 dark:from-indigo-900/10 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Magic UI Animated Theme Toggle */}
      <AnimatedThemeToggleSharedComponent
        currentTheme={currentTheme}
        onToggleTheme={onToggleTheme}
        variant="circle"
        duration={450}
        className="absolute top-5 right-5 z-20"
      />

      {/* Main Centered Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <LoginScreenCardStaticComponent
          credentials={credentials}
          errors={errors}
          isLoading={isLoading}
          isMicrosoftLoading={isMicrosoftLoading}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onMicrosoftLogin={handleMicrosoftLogin}
          onNavigateSignup={onNavigateSignup}
          onNavigateForgotPassword={onNavigateForgotPassword}
        />
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-xs text-slate-400 dark:text-zinc-600 font-mono">
        <p>{LoginScreenCON.COPYRIGHT_TEXT}</p>
      </footer>
    </div>
  );
}
