import React from 'react';
import { ServiceTicket } from '../types';
import { Wrench, Clock, CheckCircle2, AlertTriangle, User } from 'lucide-react';

interface ServiceDeskViewProps {
  tickets: ServiceTicket[];
}

export const ServiceDeskView: React.FC<ServiceDeskViewProps> = ({ tickets }) => {
  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Repair & Service Desk Operations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hardware repair queue, warranty claims, vendor RMA, MTTR & MTBF lifecycle telemetry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Active Repair Tickets</span>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            {tickets.filter((t) => t.status !== 'Closed').length}
          </div>
        </div>
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">MTTR</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">18.4 Hours</div>
        </div>
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">SLA Breach Rate</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">0.0%</div>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {tickets.map((t) => (
          <div key={t.id} className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-bold shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-sm text-white font-sans">{t.ticketNumber}</span>
                    <span className="text-slate-500 text-[10px]">Asset: {t.assetNumber}</span>
                  </div>
                  <div className="text-slate-200 font-medium">{t.issueTitle}</div>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-amber-950 text-amber-500 border border-amber-900 rounded font-bold font-mono text-[10px] self-start sm:self-auto">
                {t.status}
              </span>
            </div>

            <p className="text-slate-400 text-xs">{t.issueDescription}</p>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Technician: <strong className="text-slate-300 font-medium">{t.assignedTechnician}</strong></span>
              <span>EST Cost: <strong className="text-white font-mono">${t.estimatedRepairCost}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
