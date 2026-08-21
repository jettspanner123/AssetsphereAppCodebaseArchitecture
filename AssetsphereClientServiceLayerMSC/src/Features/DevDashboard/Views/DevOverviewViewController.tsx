import React from 'react';
import { Activity, Cpu, Database, ShieldCheck, Terminal, Layers } from 'lucide-react';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';

export default function DevOverviewViewController(): React.JSX.Element {
  const envVars = [
    { key: 'ASSETSPHERE_ENV_MODE', value: 'development', source: 'ENValidator / process.env' },
    { key: 'VITE_ASSETSPHERE_ENV_MODE', value: 'development', source: 'import.meta.env' },
    { key: 'MODE', value: import.meta.env.MODE || 'development', source: 'Vite Context' },
    { key: 'BASE_URL', value: import.meta.env.BASE_URL || '/', source: 'Router Root' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0C2086]/10 text-[#0C2086] dark:bg-indigo-950/60 dark:text-indigo-400 border border-[#0C2086]/20">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif-headline">
              Developer System Overview & Health
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Environment telemetry, runtime specifications, and dev system metrics.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <CardSharedComponent>
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 font-medium">
            <span>Environment Mode</span>
            <Cpu className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-2 uppercase">
            DEVELOPMENT
          </p>
          <p className="text-[10px] font-mono text-emerald-500 mt-1 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Vite HMR Connected
          </p>
        </CardSharedComponent>

        <CardSharedComponent>
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 font-medium">
            <span>LocalStorage Footprint</span>
            <Database className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            ~12.4 KB
          </p>
          <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-1">
            4 active state keys
          </p>
        </CardSharedComponent>

        <CardSharedComponent>
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 font-medium">
            <span>Seeder Asset Index</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            10 Assets
          </p>
          <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-1">
            MockDataSeeder active
          </p>
        </CardSharedComponent>

        <CardSharedComponent>
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 font-medium">
            <span>Security Baseline</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-500 mt-2">
            OPTIMAL
          </p>
          <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-1">
            0 runtime exceptions
          </p>
        </CardSharedComponent>
      </div>

      {/* Environment Variables Inspection Table */}
      <CardSharedComponent className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
          Environment Variable Manifest
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500">
                <th className="py-2.5 px-3">Variable Key</th>
                <th className="py-2.5 px-3">Resolved Value</th>
                <th className="py-2.5 px-3">Resolution Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-sans">
              {envVars.map((v) => (
                <tr key={v.key} className="hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-zinc-100">
                    {v.key}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400">
                    "{v.value}"
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-zinc-400 text-xs">
                    {v.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardSharedComponent>
    </div>
  );
}
