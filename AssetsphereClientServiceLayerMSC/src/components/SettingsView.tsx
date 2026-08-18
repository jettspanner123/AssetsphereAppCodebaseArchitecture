import React from 'react';
import { Server, Cloud, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  deploymentMode: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  setDeploymentMode: (m: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  deploymentMode,
  setDeploymentMode,
}) => {
  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Deployment & MDM Integration Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Air-gapped on-premises configuration, Microsoft Intune, Jamf Pro & ServiceNow connectors
          </p>
        </div>
      </div>

      <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-white font-sans">Deployment Mode Architecture</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => setDeploymentMode('Self-Hosted Air-Gapped')}
            className={`p-5 rounded-xl border cursor-pointer transition-colors ${
              deploymentMode === 'Self-Hosted Air-Gapped'
                ? 'bg-slate-900 border-emerald-500/50 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Server className="w-5 h-5 text-emerald-400 mb-3" />
            <h4 className="font-semibold text-sm font-sans text-white">Self-Hosted / Air-Gapped On-Premises</h4>
            <p className="text-xs font-sans mt-1 text-slate-500 leading-relaxed">
              Zero outbound network traffic. Complete local data sovereignty for secure high-compliance facilities.
            </p>
          </div>

          <div
            onClick={() => setDeploymentMode('Enterprise Cloud Sync')}
            className={`p-5 rounded-xl border cursor-pointer transition-colors ${
              deploymentMode === 'Enterprise Cloud Sync'
                ? 'bg-slate-900 border-indigo-500/50 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Cloud className="w-5 h-5 text-indigo-400 mb-3" />
            <h4 className="font-semibold text-sm font-sans text-white">Enterprise Multi-Cloud Sync</h4>
            <p className="text-xs font-sans mt-1 text-slate-500 leading-relaxed">
              Bi-directional sync with Microsoft Intune, Jamf Pro, AWS Config, Azure Resource Manager & ServiceNow.
            </p>
          </div>
        </div>
      </div>

      {/* Connectors */}
      <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-white font-sans">Active Enterprise Connectors</h3>

        <div className="space-y-2.5">
          {[
            { name: 'Microsoft Intune MDM', status: 'Connected', icon: ShieldCheck },
            { name: 'Jamf Pro Apple Fleet', status: 'Connected', icon: ShieldCheck },
            { name: 'ServiceNow CMDB Sync', status: 'Active', icon: ShieldCheck },
            { name: 'Active Directory / Entra ID SSO', status: 'Configured', icon: CheckCircle2 },
          ].map((c, idx) => (
            <div key={idx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
              <span className="font-medium text-slate-200">{c.name}</span>
              <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-bold font-mono text-[10px]">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
