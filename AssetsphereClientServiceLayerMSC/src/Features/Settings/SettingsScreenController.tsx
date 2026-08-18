import React from 'react';
import { Settings, Shield, Cloud, Key, Database } from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';

export interface SettingsScreenControllerProps {
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode: () => void;
  currentTheme: string;
  onToggleTheme: () => void;
}

export default function SettingsScreenController({
  deploymentMode,
  onToggleDeploymentMode,
  currentTheme,
  onToggleTheme,
}: SettingsScreenControllerProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          System & Enterprise Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Deployment architecture, AI Copilot configuration, and theme preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSharedComponent>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                Deployment Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Current environment security model</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-900 hairline-border flex items-center justify-between text-xs mb-4">
            <span className="font-mono font-medium text-slate-900 dark:text-zinc-100">{deploymentMode}</span>
            <ButtonSharedComponent variant="outline" size="sm" onClick={onToggleDeploymentMode}>
              Switch Mode
            </ButtonSharedComponent>
          </div>
        </CardSharedComponent>

        <CardSharedComponent>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                Appearance & Theme
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Default application visual style</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-900 hairline-border flex items-center justify-between text-xs mb-4">
            <span className="font-mono font-medium text-slate-900 dark:text-zinc-100 capitalize">
              {currentTheme} Mode
            </span>
            <ButtonSharedComponent variant="outline" size="sm" onClick={onToggleTheme}>
              Toggle Light/Dark
            </ButtonSharedComponent>
          </div>
        </CardSharedComponent>
      </div>
    </div>
  );
}
