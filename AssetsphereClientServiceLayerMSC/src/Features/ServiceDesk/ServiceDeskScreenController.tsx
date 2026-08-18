import React from 'react';
import { ServiceTicket } from '../../types';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';

export interface ServiceDeskScreenControllerProps {
  tickets: ServiceTicket[];
}

export default function ServiceDeskScreenController({
  tickets,
}: ServiceDeskScreenControllerProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          Service Desk & IT Repair Tickets
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Hardware repair queue, warranty claims, battery replacements, and resolution SLAs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tickets.map((t) => (
          <CardSharedComponent key={t.id} glow={t.priority === 'Critical' ? 'red' : 'none'}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{t.ticketNumber}</span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline mt-0.5">
                  {t.problemDescription}
                </h3>
              </div>
              <BadgeSharedComponent
                variant={t.priority === 'Critical' || t.priority === 'High' ? 'danger' : 'info'}
                size="sm"
              >
                {t.priority}
              </BadgeSharedComponent>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Asset:</span>
                <span className="text-slate-900 dark:text-zinc-200">{t.assetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assignee Engineer:</span>
                <span className="text-slate-700 dark:text-zinc-300">{t.assignedEngineer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-sky-600 dark:text-sky-400 font-medium">{t.status}</span>
              </div>
            </div>
          </CardSharedComponent>
        ))}
      </div>
    </div>
  );
}
