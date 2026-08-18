import React from 'react';
import { Cloud } from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';

export default function CloudInfrastructureScreenController(): React.JSX.Element {
  const cloudResources = [
    { id: 'c1', provider: 'AWS', name: 'prod-api-cluster-us-east', type: 'EC2 t4g.xlarge', region: 'us-east-1', cost: 420, status: 'Running' },
    { id: 'c2', provider: 'AWS', name: 'rds-postgres-primary', type: 'db.r6g.2xlarge', region: 'us-east-1', cost: 1250, status: 'Running' },
    { id: 'c3', provider: 'Azure', name: 'vm-ml-training-gpu', type: 'Standard_NC24ads_A100_v4', region: 'eastus2', cost: 3400, status: 'Running' },
    { id: 'c4', provider: 'Google Cloud', name: 'gke-prod-us-central', type: 'n2-standard-8 x 6', region: 'us-central1', cost: 1890, status: 'Running' },
  ];

  const totalMonthlySpend = cloudResources.reduce((sum, r) => sum + r.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Cloud Infrastructure & Compute Nodes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Multi-cloud instance discovery, region mapping, and monthly cloud spend
          </p>
        </div>
        <CardSharedComponent className="py-2 px-4 inline-flex items-center gap-3">
          <Cloud className="w-5 h-5 text-sky-500" />
          <div>
            <span className="text-[11px] text-slate-400 font-mono">Monthly Cloud Spend</span>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
              ${totalMonthlySpend.toLocaleString()}/mo
            </p>
          </div>
        </CardSharedComponent>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cloudResources.map((res) => (
          <CardSharedComponent key={res.id}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{res.provider}</span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline mt-0.5">
                  {res.name}
                </h3>
              </div>
              <BadgeSharedComponent variant="success" size="sm" showDot>
                {res.status}
              </BadgeSharedComponent>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Instance Type:</span>
                <span className="text-slate-900 dark:text-zinc-200">{res.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloud Region:</span>
                <span className="text-slate-900 dark:text-zinc-200">{res.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Burn Rate:</span>
                <span className="text-slate-900 dark:text-white font-bold">${res.cost}/mo</span>
              </div>
            </div>
          </CardSharedComponent>
        ))}
      </div>
    </div>
  );
}
