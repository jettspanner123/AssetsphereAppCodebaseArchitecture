import React from 'react';
import ComplianceScreenController from '../Features/Compliance/ComplianceScreenController';
import { Asset } from '../Types/AssetType';

export interface ComplianceScreenRouteProps {
  assets: Asset[];
}

export default function ComplianceScreenRoute({
  assets,
}: ComplianceScreenRouteProps): React.JSX.Element {
  return <ComplianceScreenController assets={assets} />;
}
