import React from 'react';
import AnalyticsScreenController from '../Features/Analytics/AnalyticsScreenController';
import { Asset } from '../types';

export interface AnalyticsScreenRouteProps {
  assets: Asset[];
}

export default function AnalyticsScreenRoute({
  assets,
}: AnalyticsScreenRouteProps): React.JSX.Element {
  return <AnalyticsScreenController assets={assets} />;
}
