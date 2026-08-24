import React from 'react';
import { SoftwareLicense } from '../Types/SoftwareLicenseType';
import { Key, AlertTriangle, CheckCircle2, ShieldAlert, DollarSign } from 'lucide-react';

interface SoftwareLicensesViewProps {
  licenses: SoftwareLicense[];
}

export const SoftwareLicensesView: React.FC<SoftwareLicensesViewProps> = ({ licenses }) => {
  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Software Asset Management (SAM)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Software licenses, seat allocations, SaaS subscriptions, renewal count-downs & audit compliance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Licenses</span>
          <div className="text-2xl font-bold text-white mt-1">{licenses.length}</div>
        </div>
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Allocated Seats</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            {licenses.reduce((sum, l) => sum + l.allocatedSeats, 0)}
          </div>
        </div>
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance Risk</span>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            {licenses.filter((l) => l.complianceStatus !== 'Compliant').length} Flagged
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {licenses.map((lic) => {
          const usagePct = Math.round((lic.allocatedSeats / lic.totalSeats) * 100);
          return (
            <div
              key={lic.id}
              className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{lic.softwareName}</h3>
                    <div className="text-[10px] text-slate-500">
                      Publisher: {lic.publisher} • Type: {lic.licenseType}
                    </div>
                  </div>
                </div>

                <div className="font-mono">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      lic.complianceStatus === 'Compliant'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                        : 'bg-amber-950 text-amber-500 border border-amber-900'
                    }`}
                  >
                    {lic.complianceStatus}
                  </span>
                </div>
              </div>

              {/* Progress Bar for Seats */}
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Seats Utilized</span>
                  <span className="font-bold text-white">
                    {lic.allocatedSeats} / {lic.totalSeats} ({usagePct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${usagePct > 100 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                    style={{ width: `${Math.min(usagePct, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <span>Key: <strong className="text-slate-300 font-mono">{lic.licenseKey}</strong></span>
                <span>Renewal: <strong className="text-amber-400">{lic.expirationDate}</strong></span>
                <span>Cost / Seat: <strong className="text-white font-mono">${lic.costPerSeat}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
