import React, { useState } from 'react';
import { Vendor } from '../../types';
import {
  Search,
  Mail,
  Phone,
  Grid,
  List,
  Maximize2,
  WrapText,
  User,
  Award,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';

export interface VendorsScreenControllerProps {
  vendors: Vendor[];
}

export default function VendorsScreenController({
  vendors,
}: VendorsScreenControllerProps): React.JSX.Element {
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getVendorsViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getVendorsGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getVendorsSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setVendorsViewMode(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setVendorsGridColumns(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setVendorsSingleLine(val);
  };

  const filteredVendors = vendors.filter(
    (v) =>
      (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgSlaRating =
    filteredVendors.length > 0
      ? (
          filteredVendors.reduce((sum, v) => sum + (v.ratingScore || 0), 0) /
          filteredVendors.length
        ).toFixed(1)
      : '0.0';

  const getSLAColorStyles = (score: number) => {
    if (score >= 4.0) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        icon: 'text-emerald-500',
        bar: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
      };
    }
    if (score >= 3.0) {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        icon: 'text-amber-500',
        bar: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
      };
    }
    return {
      text: 'text-rose-600 dark:text-rose-400',
      icon: 'text-rose-500',
      bar: 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]',
    };
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Vendors & Service Level Agreements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Supplier performance metrics, contract renewals, SLA compliance scores, and vendor contacts
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {filteredVendors.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Approved Vendors
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {avgSlaRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Avg SLA Rating
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
              placeholder="Search by vendor name, contact, email, phone..."
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
      {filteredVendors.length === 0 && (
        <CardSharedComponent className="p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white font-serif-headline">
            No Vendors Found
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            No vendor partners matched your search query "{searchQuery}".
          </p>
        </CardSharedComponent>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && filteredVendors.length > 0 && (
        <div
          className={`grid grid-cols-1 ${
            gridColumns === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {filteredVendors.map((v) => {
            const slaStyles = getSLAColorStyles(v.ratingScore || 0);
            return (
              <CardSharedComponent key={v.id} hoverable className="p-6 flex flex-col justify-between space-y-5">
                {/* Header */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline truncate leading-tight">
                    {v.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {v.contactPerson}
                  </p>
                </div>

                {/* Contact Details & SLA Score */}
                <div className="py-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-2 font-mono">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{v.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{v.phone}</span>
                  </div>

                  {/* Dynamic Color SLA Rating Gauge & Score Bar */}
                  <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-500 dark:text-zinc-400 font-sans font-semibold flex items-center gap-1.5">
                        <Award className={`w-4 h-4 ${slaStyles.icon}`} /> SLA Rating Score
                      </span>
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className={`text-2xl font-extrabold tracking-tight ${slaStyles.text}`}>
                          {v.ratingScore}
                        </span>
                        <span className="text-slate-400 font-medium text-xs">/ 5.0</span>
                      </div>
                    </div>

                    {/* Dynamic Color SLA Rating Progress Meter Bar */}
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-zinc-700/60">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${slaStyles.bar}`}
                        style={{ width: `${((v.ratingScore || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardSharedComponent>
            );
          })}
        </div>
      )}

      {/* List / Table View Mode */}
      {viewMode === 'list' && filteredVendors.length > 0 && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className={`w-full text-left text-xs ${isSingleLineMode ? 'min-w-[900px] whitespace-nowrap' : ''}`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-5">Vendor Name</th>
                  <th className="py-3.5 px-5">Account Manager / Contact</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-5">Phone Number</th>
                  <th className="py-3.5 px-5 text-right">SLA Rating Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredVendors.map((v) => {
                  const slaStyles = getSLAColorStyles(v.ratingScore || 0);
                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-serif-headline font-bold text-slate-900 dark:text-white text-sm">
                        {v.name}
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-zinc-300">
                        {v.contactPerson}
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-500 dark:text-zinc-400">
                        {v.email}
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-600 dark:text-zinc-300">
                        {v.phone}
                      </td>
                      <td className={`py-4 px-5 text-right font-mono font-bold text-sm ${slaStyles.text}`}>
                        ★ SLA {v.ratingScore} / 5.0
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
