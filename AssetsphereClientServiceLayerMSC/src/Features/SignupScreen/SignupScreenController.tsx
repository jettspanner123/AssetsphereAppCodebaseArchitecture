import React, { useState } from 'react';
import SignupScreenCardStaticComponent from './Components/static/SignupScreenCardStaticComponent';
import SignupScreenCON from './Constants/SignupScreenCON';
import { SignupFormData, SignupFormErrors, SignupAuthState } from './Models/SignupScreenModel';
import SignupScreenService from './Services/SignupScreenService';
import TanstackQueryClientService from '../../Services/TanstackQueryClientService';
import AnimatedThemeToggleSharedComponent from '../../Shared/Components/AnimatedThemeToggleSharedComponent';

export interface SignupScreenControllerProps {
  currentTheme: string;
  onToggleTheme: () => void;
  onSignupSuccess: (authState: SignupAuthState) => void;
  onNavigateLogin?: () => void;
}

export default function SignupScreenController({
  currentTheme,
  onToggleTheme,
  onSignupSuccess,
  onNavigateLogin,
}: SignupScreenControllerProps): React.JSX.Element {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});

  // TanStack Query Mutation for user registration via centralized service
  const registerMutation = TanstackQueryClientService.current.authentication.registerMutation({
    onSuccess: (authState: SignupAuthState) => {
      onSignupSuccess(authState);
    },
    onError: (err: unknown) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again or contact IT support.';
      setErrors({ general: errorMessage });
    },
  });

  // TanStack Query Mutation for Microsoft SSO via centralized service
  const microsoftSignupMutation = TanstackQueryClientService.current.authentication.microsoftSignupMutation({
    onSuccess: (authState: SignupAuthState) => {
      onSignupSuccess(authState);
    },
    onError: (err: unknown) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Microsoft Single Sign-On failed. Please contact IT Helpdesk.';
      setErrors({ general: errorMessage });
    },
  });

  const handleFieldChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof SignupFormErrors] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = SignupScreenService.current.validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleMicrosoftLogin = () => {
    microsoftSignupMutation.mutate();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-zinc-100 flex flex-col justify-between relative overflow-hidden transition-colors selection:bg-[#0C2086]/20">
      {/* Ambient background glow effects */}
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
        <SignupScreenCardStaticComponent
          formData={formData}
          errors={errors}
          isLoading={registerMutation.isPending}
          isMicrosoftLoading={microsoftSignupMutation.isPending}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onMicrosoftLogin={handleMicrosoftLogin}
          onNavigateLogin={onNavigateLogin}
        />
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-xs text-slate-400 dark:text-zinc-600 font-mono">
        <p>{SignupScreenCON.COPYRIGHT_TEXT}</p>
      </footer>
    </div>
  );
}
