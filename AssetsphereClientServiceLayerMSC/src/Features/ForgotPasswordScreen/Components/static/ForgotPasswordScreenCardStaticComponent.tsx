import React from 'react';
import { Mail, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ButtonSharedComponent from '../../../../Shared/Components/ButtonSharedComponent';
import ForgotPasswordScreenCON from '../../Constants/ForgotPasswordScreenCON';
import { ForgotPasswordFormData, ForgotPasswordFormErrors, ForgotPasswordState } from '../../Models/ForgotPasswordScreenModel';
import weplmLogo from '../../../../assets/weplm.jpeg';

export interface ForgotPasswordScreenCardStaticComponentProps {
  formData: ForgotPasswordFormData;
  errors: ForgotPasswordFormErrors;
  statusState: ForgotPasswordState;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onNavigateLogin?: () => void;
}

export default function ForgotPasswordScreenCardStaticComponent({
  formData,
  errors,
  statusState,
  isLoading,
  onEmailChange,
  onSubmit,
  onResend,
  onNavigateLogin,
}: ForgotPasswordScreenCardStaticComponentProps): React.JSX.Element {
  return (
    <div
      style={{ viewTransitionName: 'auth-card' }}
      className="w-full max-w-md bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 transition-colors"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div
          style={{ viewTransitionName: 'auth-logo' }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 mb-3 shadow-md bg-white dark:bg-zinc-900"
        >
          <img src={weplmLogo} alt="Assetsphere Logo" className="w-full h-full object-cover" />
        </div>
        <h2
          style={{ viewTransitionName: 'auth-title' }}
          className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-serif-headline"
        >
          {statusState.isSubmitted ? ForgotPasswordScreenCON.SUCCESS_TITLE : ForgotPasswordScreenCON.CARD_TITLE}
        </h2>
        <p
          style={{ viewTransitionName: 'auth-description' }}
          className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto"
        >
          {statusState.isSubmitted
            ? ForgotPasswordScreenCON.SUCCESS_DESCRIPTION
            : ForgotPasswordScreenCON.CARD_DESCRIPTION}
        </p>
      </div>

      {/* General Error Banner */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {errors.general}
        </div>
      )}

      {/* Success Confirmation or Reset Form */}
      {statusState.isSubmitted ? (
        <div className="space-y-5 text-center">
          {/* Highlighted Email Badge */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 font-mono">
              {statusState.emailSentTo}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed">
            {ForgotPasswordScreenCON.SUCCESS_FOOTNOTE}
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <ButtonSharedComponent
              variant="outline"
              size="md"
              type="button"
              disabled={isLoading}
              onClick={onResend}
              className="w-full justify-center text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
            >
              {isLoading ? ForgotPasswordScreenCON.SUBMIT_BUTTON_LOADING : ForgotPasswordScreenCON.RESEND_BUTTON_LABEL}
            </ButtonSharedComponent>

            {onNavigateLogin && (
              <button
                type="button"
                onClick={onNavigateLogin}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{ForgotPasswordScreenCON.RETURN_TO_LOGIN_LABEL}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 text-left">
          {/* Email Input */}
          <div style={{ viewTransitionName: 'auth-field-email' }}>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-sans">
              {ForgotPasswordScreenCON.EMAIL_LABEL}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder={ForgotPasswordScreenCON.EMAIL_PLACEHOLDER}
                autoComplete="email"
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-zinc-900/60 border rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0C2086]/50 transition-all font-sans ${
                  errors.email
                    ? 'border-rose-400 dark:border-rose-600'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Blue Button with view-transition */}
          <div style={{ viewTransitionName: 'auth-submit-btn' }} className="pt-2">
            <ButtonSharedComponent
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading}
              className="w-full justify-center !bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-md font-semibold py-2.5 rounded-xl cursor-pointer"
            >
              <span className="!text-white font-medium">
                {isLoading ? ForgotPasswordScreenCON.SUBMIT_BUTTON_LOADING : ForgotPasswordScreenCON.SUBMIT_BUTTON_LABEL}
              </span>
            </ButtonSharedComponent>
          </div>

          {/* Back to login navigation link */}
          <div className="text-center pt-2">
            {onNavigateLogin && (
              <button
                type="button"
                onClick={onNavigateLogin}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{ForgotPasswordScreenCON.RETURN_TO_LOGIN_LABEL}</span>
              </button>
            )}
          </div>
        </form>
      )}

      {/* Security Footnote */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>{ForgotPasswordScreenCON.SECURITY_BADGE_TEXT}</span>
      </div>
    </div>
  );
}
