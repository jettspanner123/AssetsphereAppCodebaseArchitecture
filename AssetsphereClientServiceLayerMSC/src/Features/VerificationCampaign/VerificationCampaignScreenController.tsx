import React from 'react';
import { VerificationCampaign } from '../../types';
import { QrCode } from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';

export interface VerificationCampaignScreenControllerProps {
  campaign: VerificationCampaign;
  onOpenScanner: () => void;
}

export default function VerificationCampaignScreenController({
  campaign,
  onOpenScanner,
}: VerificationCampaignScreenControllerProps): React.JSX.Element {
  const pct = Math.round((campaign.verifiedAssetsCount / (campaign.totalTargetAssets || 1)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Physical Verification Audit Campaign
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Barcode scan auditing, location validation, and physical custody checks
          </p>
        </div>
        <ButtonSharedComponent
          variant="primary"
          size="md"
          onClick={onOpenScanner}
          icon={<QrCode className="w-4 h-4" />}
        >
          Launch Barcode Scanner
        </ButtonSharedComponent>
      </div>

      <CardSharedComponent glow="blue" variant="elevated" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <BadgeSharedComponent variant="info" size="sm">
              ACTIVE AUDIT
            </BadgeSharedComponent>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif-headline mt-1">
              {campaign.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Target Department: {campaign.targetDepartment} • Discrepancies Flagged: {campaign.flaggedDiscrepancies}
            </p>
          </div>
          <span className="text-2xl font-bold font-mono text-sky-500">{pct}%</span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
            <span>Verified: {campaign.verifiedAssetsCount} devices</span>
            <span>Target: {campaign.totalTargetAssets} devices</span>
          </div>
        </div>
      </CardSharedComponent>
    </div>
  );
}
