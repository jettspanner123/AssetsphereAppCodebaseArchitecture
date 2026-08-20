import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import ButtonSharedComponent from '../../../../Shared/Components/ButtonSharedComponent';
import SignupScreenCON from '../../Constants/SignupScreenCON';
import { SignupFormData, SignupFormErrors } from '../../Models/SignupScreenModel';
import weplmLogo from '../../../../assets/weplm.jpeg';

export interface SignupScreenCardStaticComponentProps {
  formData: SignupFormData;
  errors: SignupFormErrors;
  isLoading: boolean;
  isMicrosoftLoading: boolean;
  onFieldChange: (field: keyof SignupFormData, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onMicrosoftLogin: () => void;
  onNavigateLogin?: () => void;
}

export default function SignupScreenCardStaticComponent({
  formData,
  errors,
  isLoading,
  isMicrosoftLoading,
  onFieldChange,
  onSubmit,
  onMicrosoftLogin,
  onNavigateLogin,
}: SignupScreenCardStaticComponentProps): React.JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  return (
    <div
      style={{ viewTransitionName: 'auth-card' }}
      className="w-full max-w-xl bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 transition-colors"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 mb-3 shadow-md bg-white dark:bg-zinc-900">
          <img src={weplmLogo} alt="Assetsphere Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-serif-headline">
          {SignupScreenCON.CARD_TITLE}
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          {SignupScreenCON.CARD_DESCRIPTION}
        </p>
      </div>

      {/* General Error Banner */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {errors.general}
        </div>
      )}

      {/* Microsoft SSO Action */}
      <div className="mb-5">
        <button
          type="button"
          onClick={onMicrosoftLogin}
          disabled={isLoading || isMicrosoftLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 text-slate-700 dark:text-zinc-200 text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Microsoft 4-Color Tile Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
            <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
          </svg>
          <span>{isMicrosoftLoading ? 'Connecting to Microsoft Azure...' : SignupScreenCON.MICROSOFT_SSO_LABEL}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
        </div>
        <span className="relative px-3 bg-white dark:bg-[#0a0a0c] text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-zinc-500">
          {SignupScreenCON.DIVIDER_TEXT}
        </span>
      </div>

      {/* Registration Form */}
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        {/* Row 1: Full Name and Email side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-sans">
              {SignupScreenCON.FULL_NAME_LABEL}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => onFieldChange('fullName', e.target.value)}
                placeholder={SignupScreenCON.FULL_NAME_PLACEHOLDER}
                autoComplete="name"
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-zinc-900/60 border rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0C2086]/50 transition-all font-sans ${
                  errors.fullName
                    ? 'border-rose-400 dark:border-rose-600'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div style={{ viewTransitionName: 'auth-field-email' }}>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-sans">
              {SignupScreenCON.EMAIL_LABEL}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder={SignupScreenCON.EMAIL_PLACEHOLDER}
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
        </div>

        {/* Row 2: Password and Confirm Password side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password Input */}
          <div style={{ viewTransitionName: 'auth-field-password' }}>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-sans">
              {SignupScreenCON.PASSWORD_LABEL}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => onFieldChange('password', e.target.value)}
                placeholder={SignupScreenCON.PASSWORD_PLACEHOLDER}
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-zinc-900/60 border rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0C2086]/50 transition-all font-sans ${
                  errors.password
                    ? 'border-rose-400 dark:border-rose-600'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-sans">
              {SignupScreenCON.CONFIRM_PASSWORD_LABEL}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
                placeholder={SignupScreenCON.CONFIRM_PASSWORD_PLACEHOLDER}
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-zinc-900/60 border rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0C2086]/50 transition-all font-sans ${
                  errors.confirmPassword
                    ? 'border-rose-400 dark:border-rose-600'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Accept Terms Checkbox */}
        <div className="pt-1">
          <div className="flex items-start gap-2">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => onFieldChange('acceptTerms', e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-zinc-700 text-[#0C2086] focus:ring-[#0C2086]/50 bg-slate-50 dark:bg-zinc-900 cursor-pointer"
            />
            <label htmlFor="acceptTerms" className="text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none leading-tight">
              {SignupScreenCON.ACCEPT_TERMS_LABEL}
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <ButtonSharedComponent
            variant="primary"
            size="md"
            type="submit"
            disabled={isLoading || isMicrosoftLoading}
            className="w-full justify-center !bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-md font-semibold py-2.5 rounded-xl cursor-pointer"
            icon={<ArrowRight className="w-4 h-4 !text-white" />}
          >
            <span className="!text-white font-medium">
              {isLoading ? SignupScreenCON.SUBMIT_BUTTON_LOADING : SignupScreenCON.SUBMIT_BUTTON_LABEL}
            </span>
          </ButtonSharedComponent>
        </div>

        {/* Already have an account navigation link */}
        <div className="text-center pt-2">
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            {SignupScreenCON.ALREADY_HAVE_ACCOUNT_TEXT}{' '}
          </span>
          {onNavigateLogin && (
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 cursor-pointer transition-colors"
            >
              {SignupScreenCON.SIGN_IN_LINK_TEXT}
            </button>
          )}
        </div>
      </form>

      {/* Security Footnote */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>{SignupScreenCON.SECURITY_BADGE_TEXT}</span>
      </div>
    </div>
  );
}
