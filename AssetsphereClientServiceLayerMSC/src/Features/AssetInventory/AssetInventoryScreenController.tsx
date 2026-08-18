import React, { useState } from 'react';
import { Asset } from '../../types';
import {
  Search,
  Plus,
  Download,
  QrCode,
  Grid,
  List,
  Columns,
  ShieldCheck,
  ShieldAlert,
  User,
  Maximize2,
  WrapText,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import AssetInventoryCON from './Constants/AssetInventoryCON';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';

export interface AssetInventoryScreenControllerProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onOpenAddModal: () => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onExportCSV: () => void;
}

export default function AssetInventoryScreenController({
  assets,
  onSelectAsset,
  onOpenAddModal,
  onOpenQRBadgeModal,
  onExportCSV,
}: AssetInventoryScreenControllerProps): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLifecycle, setSelectedLifecycle] = useState<string>('ALL');
  const [complianceFilter, setComplianceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [viewMode, setViewModeState] = useState<'table' | 'grid' | 'kanban'>(() =>
    UserPreferencesUtility.current.getInventoryViewMode('table')
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getInventorySingleLine(true)
  );

  const setViewMode = (mode: 'table' | 'grid' | 'kanban') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setInventoryViewMode(mode);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setInventorySingleLine(val);
  };

  const filteredAssets = assets.filter((ast) => {
    if (selectedCategory !== 'ALL' && ast.category !== selectedCategory) return false;
    if (selectedLifecycle !== 'ALL' && ast.lifecycleStatus !== selectedLifecycle) return false;
    if (complianceFilter === 'COMPLIANT' && !ast.security?.isCompliant) return false;
    if (complianceFilter === 'NON_COMPLIANT' && ast.security?.isCompliant) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ast.deviceName.toLowerCase().includes(q);
      const matchNumber = ast.assetNumber.toLowerCase().includes(q);
      const matchSerial = ast.serialNumber.toLowerCase().includes(q);
      const matchHost = ast.hostname?.toLowerCase().includes(q);
      const matchOwner = ast.assignedToEmployeeName?.toLowerCase().includes(q);
      return matchName || matchNumber || matchSerial || matchHost || matchOwner;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            {AssetInventoryCON.TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {AssetInventoryCON.SUBTITLE}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Switchers */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 hairline-border">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Kanban Board"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

          <ButtonSharedComponent
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </ButtonSharedComponent>
          <ButtonSharedComponent
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Register Device
          </ButtonSharedComponent>
        </div>
      </div>

      {/* Filtering Bar */}
      <CardSharedComponent className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {AssetInventoryCON.CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                    : 'bg-slate-100 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, serial, user..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-md bg-white dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 hairline-border-strong focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Secondary Filter Dropdowns & Single-Line Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Lifecycle:</span>
              <select
                value={selectedLifecycle}
                onChange={(e) => setSelectedLifecycle(e.target.value)}
                className="h-8 px-2.5 rounded-md bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 hairline-border focus:outline-none"
              >
                {AssetInventoryCON.LIFECYCLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Security Compliance:</span>
              <select
                value={complianceFilter}
                onChange={(e) => setComplianceFilter(e.target.value)}
                className="h-8 px-2.5 rounded-md bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 hairline-border focus:outline-none"
              >
                <option value="ALL">All Devices</option>
                <option value="COMPLIANT">Compliant Only</option>
                <option value="NON_COMPLIANT">Non-Compliant Only</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Single Line Scroll Toggle */}
            {viewMode === 'table' && (
              <button
                onClick={() => setIsSingleLineMode(!isSingleLineMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium hairline-border transition-colors cursor-pointer ${
                  isSingleLineMode
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                }`}
                title="Toggle Single-Line No-Wrap Table Mode"
              >
                {isSingleLineMode ? <Maximize2 className="w-3.5 h-3.5" /> : <WrapText className="w-3.5 h-3.5" />}
                <span>{isSingleLineMode ? 'Single-Line Mode: ON' : 'Wrap Text'}</span>
              </button>
            )}

            <div className="text-slate-400 dark:text-zinc-500 font-mono text-[11px]">
              Showing {filteredAssets.length} of {assets.length} items
            </div>
          </div>
        </div>
      </CardSharedComponent>

      {/* Main Content Area View Modes */}
      {viewMode === 'table' && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className={`w-full text-left text-xs ${isSingleLineMode ? 'min-w-[1100px] whitespace-nowrap' : ''}`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-4">Asset Tag</th>
                  <th className="py-3.5 px-4">Device Specifications</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Owner / Assigned</th>
                  <th className="py-3.5 px-4">Valuation</th>
                  <th className="py-3.5 px-4">Compliance</th>
                  <th className="py-3.5 px-4">Health</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    <td className={`py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-zinc-100 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      {asset.assetNumber}
                    </td>
                    <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      {isSingleLineMode ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {asset.deviceName}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                            (S/N: {asset.serialNumber} • {asset.subtype || asset.category})
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {asset.deviceName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                            S/N: {asset.serialNumber} • {asset.subtype || asset.category}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      <BadgeSharedComponent variant="neutral" size="sm">
                        {asset.category}
                      </BadgeSharedComponent>
                    </td>
                    <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                        <User className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
                        <span className="truncate">{asset.assignedToEmployeeName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-white ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      ${asset.currentValue?.toLocaleString() || 0}
                    </td>
                    <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      {asset.security?.isCompliant ? (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Encrypted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span>Action Reqd</span>
                        </div>
                      )}
                    </td>
                    <td className={`py-3.5 px-4 font-mono ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      <span
                        className={`font-semibold ${
                          (asset.health?.overallScore || 0) < 70
                            ? 'text-rose-500'
                            : (asset.health?.overallScore || 0) < 85
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {asset.health?.overallScore || 0}%
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 text-right ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenQRBadgeModal(asset)}
                          title="Generate QR Asset Badge"
                          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardSharedComponent>
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <CardSharedComponent key={asset.id} hoverable onClick={() => onSelectAsset(asset)}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                    {asset.assetNumber}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline mt-0.5">
                    {asset.deviceName}
                  </h3>
                </div>
                <BadgeSharedComponent
                  variant={asset.security?.isCompliant ? 'success' : 'danger'}
                  size="sm"
                >
                  {asset.lifecycleStatus}
                </BadgeSharedComponent>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Serial:</span>
                  <span className="font-mono text-slate-700 dark:text-zinc-300">{asset.serialNumber}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Assigned To:</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-medium">
                    {asset.assignedToEmployeeName || 'Unassigned'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Current Valuation:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-semibold">
                    ${asset.currentValue?.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardSharedComponent>
          ))}
        </div>
      )}
    </div>
  );
}
