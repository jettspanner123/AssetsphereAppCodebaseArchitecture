import React, { useState, useRef } from 'react';
import { Asset } from '../../types';
import {
  Search,
  Plus,
  Download,
  Upload,
  QrCode,
  Grid,
  List,
  Columns,
  ShieldCheck,
  ShieldAlert,
  User,
  Maximize2,
  WrapText,
  DollarSign,
  HardDrive,
  Eye,
  CheckSquare,
  Edit3,
  Trash2,
  RotateCw,
  Settings,
  Laptop,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import EmptyStateSharedComponent from '../../Shared/Components/EmptyStateSharedComponent';
import ContextMenuSharedComponent, { ContextMenuItem } from '../../Shared/Components/ContextMenuSharedComponent';
import ConfirmationModalSharedComponent from '../../Shared/Components/ConfirmationModalSharedComponent';
import AssetInventoryCON from './Constants/AssetInventoryCON';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';
import AssetImportModalController from './Components/AssetImportModalController';
import { ImportExecutionSummary } from './Services/AssetImportProcessorService';
import CustomSelectSharedComponent, { SelectOption } from '../../Shared/Components/CustomSelectSharedComponent';

export interface AssetInventoryScreenControllerProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onOpenAddModal: () => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onExportCSV: () => void;
  onImportAssets?: (importedAssets: Asset[]) => void;
  onDeleteAsset?: (asset: Asset) => void;
  overrideViewMode?: 'table' | 'grid' | 'kanban';
  overrideGridColumns?: 2 | 3;
  overrideSingleLine?: boolean;
  overrideComplianceFilter?: string;
  overrideSearchQuery?: string;
  onViewModeChange?: (mode: 'table' | 'grid' | 'kanban') => void;
  onGridColumnsChange?: (cols: 2 | 3) => void;
  onSingleLineChange?: (val: boolean) => void;
}

export default function AssetInventoryScreenController({
  assets,
  onSelectAsset,
  onOpenAddModal,
  onOpenQRBadgeModal,
  onExportCSV,
  onImportAssets,
  onDeleteAsset,
  overrideViewMode,
  overrideGridColumns,
  overrideSingleLine,
  overrideComplianceFilter,
  overrideSearchQuery,
  onViewModeChange,
  onGridColumnsChange,
  onSingleLineChange,
}: AssetInventoryScreenControllerProps): React.JSX.Element {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const activeAssets = assets;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLifecycle, setSelectedLifecycle] = useState<string>('ALL');
  const [complianceFilter, setComplianceFilter] = useState<string>(
    () => overrideComplianceFilter || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    () => overrideSearchQuery || ''
  );

  const handleImportComplete = (processedAssets: Asset[], summary: ImportExecutionSummary) => {
    onImportAssets?.(processedAssets);
  };

  const [viewMode, setViewModeState] = useState<'table' | 'grid' | 'kanban'>(
    () => overrideViewMode || UserPreferencesUtility.current.getInventoryViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(
    () => overrideGridColumns || UserPreferencesUtility.current.getInventoryGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    overrideSingleLine !== undefined
      ? overrideSingleLine
      : UserPreferencesUtility.current.getInventorySingleLine(true)
  );

  const setViewMode = (mode: 'table' | 'grid' | 'kanban') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setInventoryViewMode(mode);
    onViewModeChange?.(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setInventoryGridColumns(cols);
    onGridColumnsChange?.(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setInventorySingleLine(val);
    onSingleLineChange?.(val);
  };

  // Right-Click Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    asset: Asset | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    asset: null,
  });

  // Delete Confirmation State
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  // Disable default native browser context menu across the page
  React.useEffect(() => {
    const disableNativeContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', disableNativeContextMenu);
    return () => {
      window.removeEventListener('contextmenu', disableNativeContextMenu);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent, asset: Asset) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      asset,
    });
  };

  const handleContainerContextMenu = (e: React.MouseEvent) => {
    // Completely disable default native browser context menu
    e.preventDefault();

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Suppress custom context menu if right-clicking on buttons, inputs, toolbar cards, page headers, or table headers
    const isInteractiveOrHeader = Boolean(
      target.closest(
        'button, input, select, textarea, a, th, [role="button"], [role="menuitem"], [data-no-context-menu], [data-toolbar], [data-header-summary]'
      )
    );

    if (isInteractiveOrHeader) {
      // Close any active menu and suppress opening
      setContextMenu((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      asset: null,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  const contextMenuItems: ContextMenuItem[] = contextMenu.asset
    ? [
        {
          id: 'view',
          label: 'View Details',
          icon: <Eye className="w-3.5 h-3.5" />,
          onClick: () => {
            if (contextMenu.asset) {
              onSelectAsset(contextMenu.asset);
            }
          },
        },
        {
          id: 'select',
          label: 'Select',
          icon: <CheckSquare className="w-3.5 h-3.5" />,
          onClick: () => {
            // UI placeholder action
          },
        },
        {
          id: 'qr',
          label: 'Generate QR Badge',
          icon: <QrCode className="w-3.5 h-3.5" />,
          onClick: () => {
            if (contextMenu.asset) {
              onOpenQRBadgeModal(contextMenu.asset);
            }
          },
        },
        {
          id: 'edit',
          label: 'Edit',
          icon: <Edit3 className="w-3.5 h-3.5" />,
          onClick: () => {
            // UI placeholder action
          },
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: <Trash2 className="w-3.5 h-3.5" />,
          isDestructive: true,
          divider: true,
          onClick: () => {
            if (contextMenu.asset) {
              setAssetToDelete(contextMenu.asset);
            }
          },
        },
      ]
    : [
        {
          id: 'create',
          label: 'Create / Register Asset',
          icon: <Plus className="w-3.5 h-3.5" />,
          shortcut: 'N',
          onClick: () => {
            onOpenAddModal();
          },
        },
        {
          id: 'selection-mode',
          label: 'Selection Mode',
          icon: <CheckSquare className="w-3.5 h-3.5" />,
          onClick: () => {
            // UI placeholder action
          },
        },
        {
          id: 'refresh',
          label: 'Refresh',
          icon: <RotateCw className="w-3.5 h-3.5" />,
          shortcut: 'R',
          onClick: () => {
            // UI placeholder action
          },
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="w-3.5 h-3.5" />,
          divider: true,
          onClick: () => {
            // UI placeholder action
          },
        },
      ];

  const filteredAssets = activeAssets.filter((ast) => {
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

  const totalValuation = filteredAssets.reduce(
    (acc, a) => acc + (a.currentValue || 0),
    0
  );

  const lifecycleOptions: SelectOption[] = AssetInventoryCON.LIFECYCLE_OPTIONS.map((opt) => ({
    value: opt,
    label: opt === 'ALL' ? 'All Lifecycles' : opt,
  }));

  const securityOptions: SelectOption[] = [
    { value: 'ALL', label: 'All Devices' },
    { value: 'COMPLIANT', label: 'Compliant Only' },
    { value: 'NON_COMPLIANT', label: 'Non-Compliant Only' },
  ];

  return (
    <div
      className="space-y-6 min-h-[calc(100vh-140px)]"
      onContextMenu={handleContainerContextMenu}
    >
      {/* Page Title & Hero Summary Banner */}
      <div
        data-header-summary="true"
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            {AssetInventoryCON.TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {AssetInventoryCON.SUBTITLE}
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ${totalValuation.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Portfolio Valuation
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {filteredAssets.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Total Devices
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar Card */}
      <div data-toolbar="true">
        <CardSharedComponent className="space-y-4 p-4">
        {/* Row 1: Search Input & Primary Actions on Same Line */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, serial, user..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <ButtonSharedComponent
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              icon={<Upload className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />}
            >
              Import CSV
            </ButtonSharedComponent>

            <ButtonSharedComponent
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </ButtonSharedComponent>

            <ButtonSharedComponent
              variant="primary"
              size="sm"
              onClick={onOpenAddModal}
              className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
              icon={<Plus className="w-3.5 h-3.5 !text-white" />}
            >
              <span className="!text-white font-medium">Register Device</span>
            </ButtonSharedComponent>
          </div>
        </div>

        {/* Row 2: Horizontally Scrollable Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs border-t border-slate-200/60 dark:border-zinc-800/60 pt-3">
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

        {/* Row 3: Secondary Dropdowns & Uniform View Switchers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs">
          {/* Left: Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Lifecycle:</span>
              <CustomSelectSharedComponent
                value={selectedLifecycle}
                options={lifecycleOptions}
                onChange={(val) => setSelectedLifecycle(val)}
                size="sm"
                className="w-36 sm:w-40"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Security:</span>
              <CustomSelectSharedComponent
                value={complianceFilter}
                options={securityOptions}
                onChange={(val) => setComplianceFilter(val)}
                size="sm"
                className="w-40 sm:w-44"
              />
            </div>
          </div>

          {/* Right: Uniform Switchers */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Grid Density Switcher (2 Col vs 3 Col) */}
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

            {/* Table Single-Line Segmented Control */}
            {viewMode === 'table' && (
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

            {/* View Mode Segmented Control (Table, Grid, Kanban) */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
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
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Kanban Board"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
            </div>
          </div>
        </div>
      </CardSharedComponent>
      </div>

      {/* Fallback Empty State */}
      {filteredAssets.length === 0 && (
        <EmptyStateSharedComponent
          icon={<Laptop className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
          title={
            searchQuery || selectedCategory !== 'ALL' || selectedLifecycle !== 'ALL' || complianceFilter !== 'ALL'
              ? 'No Matching Hardware Assets'
              : 'No Hardware Assets in Registry'
          }
          description={
            searchQuery || selectedCategory !== 'ALL' || selectedLifecycle !== 'ALL' || complianceFilter !== 'ALL'
              ? 'No assets matched your search query or active filter criteria. Try clearing search filters or changing parameters.'
              : 'Your enterprise hardware asset registry is currently empty. Register your first device or import assets via CSV.'
          }
        />
      )}

      {/* Main Content Area View Modes */}
      {viewMode === 'table' && filteredAssets.length > 0 && (
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
                    onContextMenu={(e) => handleContextMenu(e, asset)}
                    className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors group cursor-context-menu"
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
                    <td className={`py-3.5 px-4 font-medium text-slate-700 dark:text-zinc-300 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                      {asset.category}
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
                          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity cursor-pointer"
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

      {/* Grid View Mode with Dynamic Column Density (2 vs 3 per row) */}
      {viewMode === 'grid' && filteredAssets.length > 0 && (
        <div
          onContextMenu={(e) => handleContainerContextMenu(e)}
          className={`grid grid-cols-1 ${
            gridColumns === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {filteredAssets.map((asset) => (
            <CardSharedComponent
              key={asset.id}
              hoverable
              onClick={() => onSelectAsset(asset)}
              onContextMenu={(e) => handleContextMenu(e, asset)}
              className="p-6 flex flex-col justify-between space-y-6"
            >
              {/* 1. Header: Device Name & Manufacturer/Category */}
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline truncate leading-tight">
                  {asset.deviceName}
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono mt-0.5 truncate">
                  {asset.manufacturer} {asset.model} • <span className="text-slate-500 dark:text-zinc-400 font-sans">{asset.category}</span>
                </p>
              </div>

              {/* 2. Hero Metric: Valuation & Asset Tag */}
              <div className="py-3 border-y border-slate-100 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                    ${asset.currentValue?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                    {asset.assetNumber}
                  </span>
                </div>

                {/* Assigned Owner Row */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Owner
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                    {asset.assignedToEmployeeName || 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* 3. Footer Metadata: Repositioned Badge Tag, Compliance & QR Action */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-1 gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono font-medium text-slate-500 dark:text-zinc-400 text-xs">
                    {asset.lifecycleStatus}
                  </span>

                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 truncate">
                    {asset.security?.isCompliant ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className="truncate">{asset.security?.isCompliant ? 'Encrypted' : 'Alert'}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQRBadgeModal(asset);
                  }}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Generate QR Badge"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardSharedComponent>
          ))}
        </div>
      )}

      {/* Kanban Board View Mode */}
      {viewMode === 'kanban' && filteredAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AssetInventoryCON.LIFECYCLE_OPTIONS.filter((opt) => opt !== 'ALL').map((status) => {
            const statusAssets = filteredAssets.filter((a) => a.lifecycleStatus === status);

            return (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                    {status}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-mono text-[11px]">
                    {statusAssets.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusAssets.map((asset) => (
                    <CardSharedComponent
                      key={asset.id}
                      hoverable
                      onClick={() => onSelectAsset(asset)}
                      onContextMenu={(e) => handleContextMenu(e, asset)}
                      className="p-4 space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 block">
                          {asset.assetNumber}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white font-serif-headline truncate">
                          {asset.deviceName}
                        </h5>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>${asset.currentValue?.toLocaleString()}</span>
                        <span className="truncate max-w-[100px]">{asset.assignedToEmployeeName || 'Unassigned'}</span>
                      </div>
                    </CardSharedComponent>
                  ))}
                  {statusAssets.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400 font-mono">
                      No assets
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Right-Click Context Menu */}
      <ContextMenuSharedComponent
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={handleCloseContextMenu}
        items={contextMenuItems}
        header={
          contextMenu.asset ? (
            <span className="font-mono text-[10px]">
              {contextMenu.asset.assetNumber} • {contextMenu.asset.deviceName}
            </span>
          ) : (
            <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
              Inventory Actions
            </span>
          )
        }
      />

      {/* Delete Asset Confirmation Modal */}
      <ConfirmationModalSharedComponent
        isOpen={Boolean(assetToDelete)}
        onClose={() => setAssetToDelete(null)}
        onConfirm={() => {
          if (assetToDelete) {
            onDeleteAsset?.(assetToDelete);
            setAssetToDelete(null);
          }
        }}
        title="Delete Hardware IT Asset"
        subtitle={assetToDelete ? `Asset Tag: ${assetToDelete.assetNumber}` : undefined}
        description={
          assetToDelete
            ? `Are you sure you want to permanently delete "${assetToDelete.deviceName}" (S/N: ${assetToDelete.serialNumber}) from the enterprise asset inventory registry? This action cannot be undone.`
            : ''
        }
        confirmText="Delete Asset"
        cancelText="Cancel"
        variant="danger"
      />

      {/* CSV Asset Import Multi-Step Wizard Modal */}
      <AssetImportModalController
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingAssets={activeAssets}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}
