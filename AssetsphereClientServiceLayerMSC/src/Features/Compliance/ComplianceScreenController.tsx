import React, { useState } from 'react';
import { Asset } from '../../types';
import {
  Search,
  Grid,
  List,
  Maximize2,
  WrapText,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Lock,
  Radio,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';

export interface ComplianceScreenControllerProps {
  assets: Asset[];
}

export default function ComplianceScreenController({
  assets,
}: ComplianceScreenControllerProps): React.JSX.Element {
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getComplianceViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getComplianceGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getComplianceSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setComplianceViewMode(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setComplianceGridColumns(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setComplianceSingleLine(val);
  };

  const filteredAssets = assets.filter(
    (a) =>
      (a.deviceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.assetNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.security?.encryptionStatus || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.security?.antivirusStatus || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.security?.patchLevel || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const compliantCount = filteredAssets.filter((a) => a.security?.isCompliant).length;
  const nonCompliantCount = filteredAssets.length - compliantCount;
  const compliancePercentage =
    filteredAssets.length > 0
      ? Math.round((compliantCount / filteredAssets.length) * 100)
      : 100;

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Security & ISO/SOC2 Compliance Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Endpoint encryption status, EDR agents, OS patch levels, and security risk scores
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
              {compliancePercentage}%
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              SOC2 Pass Rate
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {compliantCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Compliant
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono">
              {nonCompliantCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Remediation Needed
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar Card */}
      <CardSharedComponent className="p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search asset, encryption status, EDR, patch level..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
          </div>

          {/* Uniform Height Control Switchers */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            {/* Grid Column Density Switcher (2 Col vs 3 Col) */}
            {viewMode === 'grid' && (
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
                <button
                  onClick={() => setGridColumns(2)}
                  className={`px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    gridColumns === 2
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Show 2 Items Per Row"
                >
                  2 Per Row
                </button>
                <button
                  onClick={() => setGridColumns(3)}
                  className={`px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    gridColumns === 3
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Show 3 Items Per Row"
                >
                  3 Per Row
                </button>
              </div>
            )}

            {/* List Single-Line Segmented Control */}
            {viewMode === 'list' && (
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
                <button
                  onClick={() => setIsSingleLineMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isSingleLineMode
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Single-Line Table Mode"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Single-Line</span>
                </button>
                <button
                  onClick={() => setIsSingleLineMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    !isSingleLineMode
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Wrap Text Table Mode"
                >
                  <WrapText className="w-3.5 h-3.5" />
                  <span>Wrap Text</span>
                </button>
              </div>
            )}

            {/* View Mode Segmented Control (Grid vs List) */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </CardSharedComponent>

      {/* Fallback Empty State */}
      {filteredAssets.length === 0 && (
        <CardSharedComponent className="p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white font-serif-headline">
            No Security Endpoints Found
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            No audit records matched your search query "{searchQuery}".
          </p>
        </CardSharedComponent>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && filteredAssets.length > 0 && (
        <div
          className={`grid grid-cols-1 ${
            gridColumns === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {filteredAssets.map((a) => {
            const isCompliant = a.security?.isCompliant;
            return (
              <CardSharedComponent
                key={a.id}
                hoverable
                className="p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Top Ambient Compliance Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    isCompliant
                      ? 'from-emerald-500 via-teal-400 to-emerald-500'
                      : 'from-rose-500 via-red-500 to-rose-500'
                  }`}
                  title={isCompliant ? 'Compliant Endpoint' : 'Non-Compliant - Action Needed'}
                />

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">{a.assetNumber}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline mt-0.5 truncate">
                      {a.deviceName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold shrink-0">
                    {isCompliant ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Compliant
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> Flagged
                      </span>
                    )}
                  </span>
                </div>

                {/* Security Matrix Details */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-400 font-sans font-medium">
                      <Lock className="w-3.5 h-3.5" /> BitLocker / FileVault:
                    </span>
                    <span
                      className={`font-bold ${
                        a.security?.encryptionStatus === 'Encrypted'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {a.security?.encryptionStatus || 'Unencrypted'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-400 font-sans font-medium">
                      <Radio className="w-3.5 h-3.5" /> CrowdStrike EDR Agent:
                    </span>
                    <span
                      className={`font-bold ${
                        a.security?.antivirusStatus === 'Active'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {a.security?.antivirusStatus || 'Missing'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-400 font-sans font-medium">
                      <Cpu className="w-3.5 h-3.5" /> OS Security Patch:
                    </span>
                    <span className="text-slate-700 dark:text-zinc-300 font-medium">
                      {a.security?.patchLevel || 'Outdated'}
                    </span>
                  </div>
                </div>
              </CardSharedComponent>
            );
          })}
        </div>
      )}

      {/* List / Table View Mode */}
      {viewMode === 'list' && filteredAssets.length > 0 && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className={`w-full text-left text-xs ${isSingleLineMode ? 'min-w-[900px] whitespace-nowrap' : ''}`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-5">Asset Tag ID</th>
                  <th className="py-3.5 px-5">Device Name</th>
                  <th className="py-3.5 px-5">Disk Encryption</th>
                  <th className="py-3.5 px-5">EDR Antivirus Status</th>
                  <th className="py-3.5 px-5">OS Security Patch</th>
                  <th className="py-3.5 px-5 text-right">SOC2 Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-mono">
                {filteredAssets.map((a) => {
                  const isCompliant = a.security?.isCompliant;
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        {a.assetNumber}
                      </td>
                      <td className="py-4 px-5 font-serif-headline font-bold text-slate-900 dark:text-white text-sm">
                        {a.deviceName}
                      </td>
                      <td
                        className={`py-4 px-5 font-bold ${
                          a.security?.encryptionStatus === 'Encrypted'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {a.security?.encryptionStatus || 'Unencrypted'}
                      </td>
                      <td
                        className={`py-4 px-5 font-bold ${
                          a.security?.antivirusStatus === 'Active'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {a.security?.antivirusStatus || 'Missing'}
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-zinc-300">
                        {a.security?.patchLevel || 'Outdated'}
                      </td>
                      <td className="py-4 px-5 text-right font-bold">
                        {isCompliant ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                            <ShieldCheck className="w-4 h-4" /> Compliant
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 flex items-center justify-end gap-1">
                            <ShieldAlert className="w-4 h-4" /> Action Needed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardSharedComponent>
      )}
    </div>
  );
}
