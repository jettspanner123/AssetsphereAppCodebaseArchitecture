import React, { useState } from 'react';
import {
  Search,
  Grid,
  List,
  Maximize2,
  WrapText,
  Activity,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';
import MockDataSeederService from '../../services/MockDataSeederService';

export default function CloudInfrastructureScreenController(): React.JSX.Element {
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getCloudViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getCloudGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getCloudSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setCloudViewMode(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setCloudGridColumns(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setCloudSingleLine(val);
  };

  const cloudResources = MockDataSeederService.current.getCloudResources();

  const filteredResources = cloudResources.filter(
    (res) =>
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMonthlySpend = filteredResources.reduce((sum, r) => sum + r.cost, 0);

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Cloud Infrastructure & Compute Nodes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Multi-cloud instance discovery, region mapping, and monthly cloud spend
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ${totalMonthlySpend.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Monthly Burn Rate
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {filteredResources.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Compute Nodes
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
              placeholder="Search by instance name, provider, type, region..."
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

        {/* Cloud Compute Status Color Legend Indicator */}
        <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-xs" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Active Running Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 shadow-xs" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">High Load Scaling</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 shadow-xs" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Stopped / Offline</span>
          </div>
        </div>
      </CardSharedComponent>

      {/* Fallback Empty State */}
      {filteredResources.length === 0 && (
        <CardSharedComponent className="p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white font-serif-headline">
            No Cloud Resources Found
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            No compute instances matched your search query "{searchQuery}".
          </p>
        </CardSharedComponent>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && filteredResources.length > 0 && (
        <div
          className={`grid grid-cols-1 ${
            gridColumns === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {filteredResources.map((res) => (
            <CardSharedComponent key={res.id} hoverable className="p-6 flex flex-col justify-between space-y-5 relative overflow-hidden">
              {/* Top Status Ambient Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

              {/* Header */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">{res.provider}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline mt-0.5 leading-tight truncate">
                  {res.name}
                </h3>
              </div>

              {/* Node Specification & Details */}
              <div className="py-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Instance Type:</span>
                  <span className="text-slate-900 dark:text-zinc-200 font-medium">{res.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cloud Region:</span>
                  <span className="text-slate-900 dark:text-zinc-200 font-medium">{res.region}</span>
                </div>

                {/* Monthly Burn Rate at bottom with top divider */}
                <div className="flex justify-between items-baseline pt-2.5 mt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-sans font-medium">Monthly Burn Rate:</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">${res.cost}/mo</span>
                </div>
              </div>
            </CardSharedComponent>
          ))}
        </div>
      )}

      {/* List / Table View Mode */}
      {viewMode === 'list' && filteredResources.length > 0 && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className={`w-full text-left text-xs ${isSingleLineMode ? 'min-w-[900px] whitespace-nowrap' : ''}`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-5">Provider</th>
                  <th className="py-3.5 px-5">Instance Identifier</th>
                  <th className="py-3.5 px-5">Hardware Specification</th>
                  <th className="py-3.5 px-5">Cloud Region</th>
                  <th className="py-3.5 px-5">State</th>
                  <th className="py-3.5 px-5 text-right">Monthly Burn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredResources.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-4 px-5 font-mono font-bold text-slate-500">
                      {res.provider}
                    </td>
                    <td className="py-4 px-5 font-serif-headline font-bold text-slate-900 dark:text-white text-sm">
                      {res.name}
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-600 dark:text-zinc-300">
                      {res.type}
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-500 dark:text-zinc-400">
                      {res.region}
                    </td>
                    <td className="py-4 px-5 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      ● {res.status}
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ${res.cost}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardSharedComponent>
      )}
    </div>
  );
}
