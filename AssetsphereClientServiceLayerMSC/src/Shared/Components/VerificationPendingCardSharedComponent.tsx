import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import ButtonSharedComponent from './ButtonSharedComponent';
import OrbAnimationComponent from '../../Animations/OrbAnimationComponent';

export interface VerificationPendingCardSharedComponentProps {
  email: string;
  fullName?: string | null;
  role?: string;
  onBackToSignIn: () => void;
  maxWidthClassName?: string;
}

export default function VerificationPendingCardSharedComponent({
  email,
  fullName,
  role = 'USER',
  onBackToSignIn,
  maxWidthClassName = 'max-w-xl',
}: VerificationPendingCardSharedComponentProps): React.JSX.Element {
  return (
    <div
      style={{ viewTransitionName: 'auth-card' }}
      className={`w-full ${maxWidthClassName} bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 transition-colors text-center`}
    >
      {/* Orb Animation Container */}
      <div
        style={{ viewTransitionName: 'auth-logo' }}
        className="w-48 h-48 sm:w-56 sm:h-56 mx-auto -my-2 relative flex items-center justify-center pointer-events-auto"
      >
        <OrbAnimationComponent
          hue={0}
          hoverIntensity={0.4}
          rotateOnHover={true}
          forceHoverState={true}
        />
      </div>

      {/* Title with preserved margin top */}
      <h2
        style={{ viewTransitionName: 'auth-title' }}
        className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 font-serif-headline mt-[1rem]"
      >
        Account Request Sent to Operator
      </h2>

      {/* Description */}
      <p
        style={{ viewTransitionName: 'auth-description' }}
        className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed"
      >
        Your account creation request has been submitted to the Operator for review. Please wait for approval or contact your administrator before logging in.
      </p>

      {/* Summary Box without chips */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800/80 text-left space-y-2 text-xs">
        {fullName && (
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-zinc-800">
            <span className="text-slate-500 dark:text-zinc-400 font-medium">Applicant Name:</span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100">{fullName}</span>
          </div>
        )}
        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-zinc-800">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Email Address:</span>
          <span className="font-mono text-slate-900 dark:text-zinc-100">{email}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-zinc-800">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Assigned Role:</span>
          <span className="font-mono font-medium text-slate-700 dark:text-zinc-300">{role}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Approval Status:</span>
          <span className="font-medium text-amber-600 dark:text-amber-400 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
            Pending Operator Review
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-2">
        <ButtonSharedComponent
          variant="primary"
          size="md"
          onClick={onBackToSignIn}
          className="w-full justify-center !bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-md font-semibold py-2.5 rounded-xl cursor-pointer"
          icon={<ArrowRight className="w-4 h-4 !text-white" />}
        >
          <span className="!text-white font-medium">Back to Sign In</span>
        </ButtonSharedComponent>
      </div>

      {/* Security Footnote */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Enterprise-grade AES-256 Cloud Infrastructure</span>
      </div>
    </div>
  );
}
