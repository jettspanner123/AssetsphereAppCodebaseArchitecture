import React from 'react';
import VerificationCampaignScreenController from '../Features/VerificationCampaign/VerificationCampaignScreenController';
import { VerificationCampaign } from '../types';

export interface VerificationCampaignScreenRouteProps {
  campaign: VerificationCampaign;
  onOpenScanner: () => void;
}

export default function VerificationCampaignScreenRoute({
  campaign,
  onOpenScanner,
}: VerificationCampaignScreenRouteProps): React.JSX.Element {
  return (
    <VerificationCampaignScreenController
      campaign={campaign}
      onOpenScanner={onOpenScanner}
    />
  );
}
