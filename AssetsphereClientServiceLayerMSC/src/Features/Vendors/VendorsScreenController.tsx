import React from 'react';
import { Vendor } from '../../types';
import { Mail, Phone } from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';

export interface VendorsScreenControllerProps {
  vendors: Vendor[];
}

export default function VendorsScreenController({
  vendors,
}: VendorsScreenControllerProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          Vendors & Service Level Agreements
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Hardware OEMs, VAR suppliers, warranty contacts, and SLA performance ratings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <CardSharedComponent key={v.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                  {v.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">{v.contactPerson}</p>
              </div>
              <BadgeSharedComponent variant="success" size="sm">
                Rating {v.ratingScore}/5
              </BadgeSharedComponent>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{v.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{v.phone}</span>
              </div>
            </div>
          </CardSharedComponent>
        ))}
      </div>
    </div>
  );
}
