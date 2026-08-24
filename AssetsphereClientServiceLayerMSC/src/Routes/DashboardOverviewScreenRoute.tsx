import React from 'react';
import DashboardScreenController from '../Features/Dashboard/DashboardScreenController';
import { Asset } from '../Types/AssetType';
import { ServiceTicket } from '../Types/ServiceTicketType';
import { AIRecommendation } from '../Types/AIAssistantType';
import { VerificationCampaign } from '../Types/VerificationCampaignType';

export interface DashboardOverviewScreenRouteProps {
  assets: Asset[];
  tickets: ServiceTicket[];
  recommendations: AIRecommendation[];
  campaign: VerificationCampaign;
  onSelectAsset: (asset: Asset) => void;
  onOpenAIAssistant: () => void;
  onNavigateTab: (tab: any) => void;
}

export default function DashboardOverviewScreenRoute({
  assets,
  tickets,
  recommendations,
  campaign,
  onSelectAsset,
  onOpenAIAssistant,
  onNavigateTab,
}: DashboardOverviewScreenRouteProps): React.JSX.Element {
  return (
    <DashboardScreenController
      assets={assets}
      tickets={tickets}
      recommendations={recommendations}
      campaign={campaign}
      onSelectAsset={onSelectAsset}
      onOpenAIAssistant={onOpenAIAssistant}
      onNavigateTab={onNavigateTab}
    />
  );
}
