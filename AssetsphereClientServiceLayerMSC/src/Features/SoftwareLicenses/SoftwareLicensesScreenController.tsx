import React, { useState } from 'react';
import { SoftwareLicense } from '../../types';
import {
  Calendar,
  Users,
  DollarSign,
  Grid,
  List,
  Search,
  KeyRound,
  Maximize2,
  WrapText,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';

export interface SoftwareLicensesScreenControllerProps {
  licenses: SoftwareLicense[];
}

export default function SoftwareLicensesScreenController({
  licenses,
}: SoftwareLicensesScreenControllerProps): React.JSX.Element {
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getSoftwareViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getSoftwareGridColumns(3)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getSoftwareSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setSoftwareViewMode(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setSoftwareGridColumns(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setSoftwareSingleLine(val);
  };

  const filteredLicenses = licenses.filter((lic) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lic.softwareName.toLowerCase().includes(q) ||
      lic.publisher.toLowerCase().includes(q) ||
      lic.licenseKey.toLowerCase().includes(q) ||
      lic.licenseType.toLowerCase().includes(q)
    );
  });

  const totalSpend = filteredLicenses.reduce(
    (acc, l) => acc + l.costPerSeat * l.totalSeats,
    0
  );
  const totalAllocatedSeats = filteredLicenses.reduce(
    (acc, l) => acc + l.allocatedSeats,
    0
  );
  const totalCapacitySeats = filteredLicenses.reduce(
    (acc, l) => acc + l.totalSeats,
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Software & SaaS Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Enterprise software seat allocation, contract renewals, and annual SaaS investment
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ${totalSpend.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Annual SaaS Spend
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {totalAllocatedSeats} / {totalCapacitySeats}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Seat Utilization
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar (Search, Grid Density, Single Line & View Mode Controls) */}
      <CardSharedComponent className="p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by software name, publisher, key..."
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
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </CardSharedComponent>

      {/* Fallback Empty State */}
      {filteredLicenses.length === 0 && (
        <CardSharedComponent className="p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white font-serif-headline">
            No Software Subscriptions Found
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            No items matched "{searchQuery}". Try clearing your search query.
          </p>
        </CardSharedComponent>
      )}

      {/* Grid View Mode with Dynamic Column Density (2 vs 3 per row) */}
      {viewMode === 'grid' && filteredLicenses.length > 0 && (
        <div
          className={`grid grid-cols-1 ${
            gridColumns === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {filteredLicenses.map((lic) => {
            const utilPct = Math.round(
              (lic.allocatedSeats / (lic.totalSeats || 1)) * 100
            );
            const annualCost = lic.costPerSeat * lic.totalSeats;

            return (
              <CardSharedComponent
                key={lic.id}
                className="p-6 flex flex-col justify-between space-y-5"
              >
                {/* Header */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline leading-snug truncate">
                    {lic.softwareName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {lic.publisher} • <span className="font-mono text-slate-400">{lic.licenseType}</span>
                  </p>
                </div>

                {/* Main Metric: Price & Seats */}
                <div className="py-3 border-y border-slate-100 dark:border-zinc-800/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                      ${annualCost.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                      / year
                    </span>
                  </div>

                  {/* Seat Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      <span>Seats Utilized</span>
                      <span className="font-mono text-slate-900 dark:text-white font-semibold">
                        {lic.allocatedSeats} / {lic.totalSeats} ({utilPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          utilPct > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${utilPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{lic.licenseKey}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lic.expirationDate}</span>
                  </div>
                </div>
              </CardSharedComponent>
            );
          })}
        </div>
      )}

      {/* List / Table View Mode */}
      {viewMode === 'list' && filteredLicenses.length > 0 && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className={`w-full text-left text-xs min-w-[900px] ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-5">Software Name</th>
                  <th className="py-3.5 px-5">Publisher & Licensing Model</th>
                  <th className="py-3.5 px-5">Seat Capacity</th>
                  <th className="py-3.5 px-5">License Key</th>
                  <th className="py-3.5 px-5">Expiration</th>
                  <th className="py-3.5 px-5 text-right">Annual Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredLicenses.map((lic) => {
                  const utilPct = Math.round(
                    (lic.allocatedSeats / (lic.totalSeats || 1)) * 100
                  );
                  const annualCost = lic.costPerSeat * lic.totalSeats;

                  return (
                    <tr
                      key={lic.id}
                      className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white font-serif-headline text-sm">
                        {lic.softwareName}
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-zinc-400 font-mono">
                        {lic.publisher} • <span className="text-slate-400">{lic.licenseType}</span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                utilPct > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${utilPct}%` }}
                            />
                          </div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            {lic.allocatedSeats} / {lic.totalSeats} ({utilPct}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-600 dark:text-zinc-300">
                        {lic.licenseKey}
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-500 dark:text-zinc-400">
                        {lic.expirationDate}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ${annualCost.toLocaleString()}
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
