import React from 'react';
import { Asset } from '../../types';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';

export interface ComplianceScreenControllerProps {
  assets: Asset[];
}

export default function ComplianceScreenController({
  assets,
}: ComplianceScreenControllerProps): React.JSX.Element {
  const nonCompliantAssets = assets.filter((a) => !a.security?.isCompliant);
  const compliantAssets = assets.filter((a) => a.security?.isCompliant);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          Security & ISO/SOC2 Compliance Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Endpoint encryption status, EDR agents, OS patch levels, and security risk scores
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CardSharedComponent glow="green">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Compliant Endpoints</span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {compliantAssets.length} / {assets.length}
              </p>
            </div>
          </div>
        </CardSharedComponent>

        <CardSharedComponent glow="red">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Non-Compliant Remediation Required</span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {nonCompliantAssets.length} Devices
              </p>
            </div>
          </div>
        </CardSharedComponent>
      </div>

      <CardSharedComponent>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline mb-4">
          Non-Compliant Endpoint Flag Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Asset ID</th>
                <th className="py-2.5 px-3">Device Name</th>
                <th className="py-2.5 px-3">Encryption</th>
                <th className="py-2.5 px-3">EDR Antivirus</th>
                <th className="py-2.5 px-3">OS Patch Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-mono">
              {nonCompliantAssets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-100/50 dark:hover:bg-zinc-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{a.assetNumber}</td>
                  <td className="py-3 px-3">{a.deviceName}</td>
                  <td className="py-3 px-3">
                    <BadgeSharedComponent
                      variant={a.security?.encryptionStatus === 'Encrypted' ? 'success' : 'danger'}
                      size="sm"
                    >
                      {a.security?.encryptionStatus || 'UNENCRYPTED'}
                    </BadgeSharedComponent>
                  </td>
                  <td className="py-3 px-3">
                    <BadgeSharedComponent
                      variant={a.security?.antivirusStatus === 'Active' ? 'success' : 'danger'}
                      size="sm"
                    >
                      {a.security?.antivirusStatus || 'MISSING'}
                    </BadgeSharedComponent>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{a.security?.patchLevel || 'Outdated'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardSharedComponent>
    </div>
  );
}
