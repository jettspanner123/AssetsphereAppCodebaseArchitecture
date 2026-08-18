import React from 'react';
import { SoftwareLicense } from '../../types';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';

export interface SoftwareLicensesScreenControllerProps {
  licenses: SoftwareLicense[];
}

export default function SoftwareLicensesScreenController({
  licenses,
}: SoftwareLicensesScreenControllerProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          Software & SaaS Licenses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Seat utilization, enterprise license keys, expiration schedules, and annual SaaS spend
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {licenses.map((lic) => {
          const utilPct = Math.round((lic.allocatedSeats / (lic.totalSeats || 1)) * 100);
          const annualCost = lic.costPerSeat * lic.totalSeats;

          return (
            <CardSharedComponent key={lic.id} glow={utilPct > 90 ? 'orange' : 'none'}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                    {lic.softwareName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{lic.publisher}</p>
                </div>
                <BadgeSharedComponent variant={lic.licenseType === 'Enterprise Subscription' ? 'info' : 'neutral'} size="sm">
                  {lic.licenseType}
                </BadgeSharedComponent>
              </div>

              <div className="mt-4 space-y-3">
                {/* Seat Bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-500 dark:text-zinc-400">Seat Utilization</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {lic.allocatedSeats} / {lic.totalSeats} ({utilPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        utilPct > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">License Key:</span>
                    <span className="text-slate-900 dark:text-zinc-200">{lic.licenseKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Renewal Expiration:</span>
                    <span className="text-slate-900 dark:text-zinc-200">{lic.expirationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Cost:</span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      ${annualCost?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardSharedComponent>
          );
        })}
      </div>
    </div>
  );
}
