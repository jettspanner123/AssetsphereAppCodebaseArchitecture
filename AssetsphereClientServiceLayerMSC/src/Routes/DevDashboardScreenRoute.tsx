import React from 'react';
import DevDashboardScreenController from '../Features/DevDashboard/DevDashboardScreenController';

export interface DevDashboardScreenRouteProps {
  currentTheme: string;
  onToggleTheme: () => void;
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  showMockData: boolean;
  onToggleShowMockData: () => void;
  onNavigateAppDashboard: () => void;
  onNavigateSettings: () => void;
  onSignOut: () => void;
}

export default function DevDashboardScreenRoute(props: DevDashboardScreenRouteProps): React.JSX.Element {
  return <DevDashboardScreenController {...props} />;
}
