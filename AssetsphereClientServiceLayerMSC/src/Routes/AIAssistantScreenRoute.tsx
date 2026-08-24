import React from 'react';
import AIAssistantScreenController from '../Features/AIAssistant/AIAssistantScreenController';
import { Asset } from '../Types/AssetType';

export interface AIAssistantScreenRouteProps {
  assets: Asset[];
}

export default function AIAssistantScreenRoute({
  assets,
}: AIAssistantScreenRouteProps): React.JSX.Element {
  return <AIAssistantScreenController assets={assets} />;
}
