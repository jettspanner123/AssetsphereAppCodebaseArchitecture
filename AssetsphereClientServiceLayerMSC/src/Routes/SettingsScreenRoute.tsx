import React from 'react';
import SettingsScreenController from '../Features/Settings/SettingsScreenController';

export interface SettingsScreenRouteProps {
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  currentTheme: string;
  onToggleTheme: () => void;
}

export default function SettingsScreenRoute({
  deploymentMode,
  onToggleDeploymentMode,
  currentTheme,
  onToggleTheme,
}: SettingsScreenRouteProps): React.JSX.Element {
  return (
    <SettingsScreenController
      deploymentMode={deploymentMode}
      onToggleDeploymentMode={onToggleDeploymentMode}
      currentTheme={currentTheme}
      onToggleTheme={onToggleTheme}
    />
  );
}
