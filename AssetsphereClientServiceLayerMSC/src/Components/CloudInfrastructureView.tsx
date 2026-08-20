import React from 'react';
import { Asset } from '../types';
import { Cloud, Server, ShieldCheck, Cpu } from 'lucide-react';

interface CloudInfrastructureViewProps {
  assets: Asset[];
}

export const CloudInfrastructureView: React.FC<CloudInfrastructureViewProps> = ({ assets }) => {
  const cloudAssets = assets.filter((a) => a.category === 'Cloud Assets');

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Cloud & Virtual Infrastructure Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            AWS EKS clusters, Azure Virtual Machines, GCP instances, containers & cloud databases
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {cloudAssets.map((ast) => (
          <div key={ast.id} className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">{ast.deviceName}</h3>
                  <div className="text-[10px] text-slate-500">{ast.model}</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-bold font-mono text-[10px]">
                {ast.lifecycleStatus}
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Region / VPC:</span>
                <span className="text-slate-300 font-mono">{ast.currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly OPEX:</span>
                <span className="text-white font-bold font-mono">${ast.procurement?.purchaseCost.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Baseline:</span>
                <span className="text-indigo-400 font-bold font-mono">{ast.security?.securityBaselineScore}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
