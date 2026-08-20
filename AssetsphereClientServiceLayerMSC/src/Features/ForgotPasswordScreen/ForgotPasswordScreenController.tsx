import React, { useState } from 'react';
import ForgotPasswordScreenCardStaticComponent from './Components/static/ForgotPasswordScreenCardStaticComponent';
import ForgotPasswordScreenCON from './Constants/ForgotPasswordScreenCON';
import { ForgotPasswordFormData, ForgotPasswordFormErrors, ForgotPasswordState } from './Models/ForgotPasswordScreenModel';
import ForgotPasswordScreenService from './Services/ForgotPasswordScreenService';
import AnimatedThemeToggleSharedComponent from '../../Shared/Components/AnimatedThemeToggleSharedComponent';

export interface ForgotPasswordScreenControllerProps {
  currentTheme: string;
  onToggleTheme: () => void;
  onNavigateLogin?: () => void;
}

export default function ForgotPasswordScreenController({
  currentTheme,
  onToggleTheme,
  onNavigateLogin,
}: ForgotPasswordScreenControllerProps): React.JSX.Element {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });

  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [statusState, setStatusState] = useState<ForgotPasswordState>({
    isSubmitted: false,
    emailSentTo: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailChange = (value: string) => {
    setFormData({ email: value });
    if (errors.email || errors.general) {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = ForgotPasswordScreenService.current.validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const result = await ForgotPasswordScreenService.current.sendResetEmail(formData);
      setStatusState(result);
    } catch {
      setErrors({ general: 'Failed to send reset instructions. Please try again or contact IT support.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      const result = await ForgotPasswordScreenService.current.sendResetEmail(formData);
      setStatusState(result);
    } catch {
      setErrors({ general: 'Failed to resend reset instructions.' });
    } finally {
      setIsLoading(false);
    }
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
        <ForgotPasswordScreenCardStaticComponent
          formData={formData}
          errors={errors}
          statusState={statusState}
          isLoading={isLoading}
          onEmailChange={handleEmailChange}
          onSubmit={handleSubmit}
          onResend={handleResend}
          onNavigateLogin={onNavigateLogin}
        />
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-xs text-slate-400 dark:text-zinc-600 font-mono">
        <p>{ForgotPasswordScreenCON.COPYRIGHT_TEXT}</p>
      </footer>
    </div>
  );
}
