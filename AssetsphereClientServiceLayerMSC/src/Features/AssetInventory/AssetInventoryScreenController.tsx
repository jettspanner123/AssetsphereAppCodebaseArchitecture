import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Asset } from '../../Types/AssetType';
import {
  Search,
  Plus,
  Download,
  Upload,
  QrCode,
  Grid,
  List,
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
  ChevronDown,
  FilePlus2,
  LayoutTemplate,
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
import AssetTemplateSelectionModalController from './Components/AssetTemplateSelectionModalController';
import { ImportExecutionSummary } from './Services/AssetImportProcessorService';
import CustomSelectSharedComponent, { SelectOption } from '../../Shared/Components/CustomSelectSharedComponent';
import PermissionGuardSharedComponent from '../../Shared/Components/PermissionGuardSharedComponent';
import PrimaryActionButtonSharedComponent from '../../Shared/Components/PrimaryActionButtonSharedComponent';
import ApplicationPermissionCON from '@/src/Constants/ApplicationPermissionCON';
import ApplicationPermissionService from '@/src/Services/ApplicationPermissionService';
import useAuthenticationStateStore from '../../Store/AuthenticationStateStore';
import CurrencyFormatterUtility from '../../Utilities/CurrencyFormatterUtility';
import TanstackQueryClientService from '../../Services/TanstackQueryClientService';
import TanstackQueryKeysCON from '../../Constants/TanstackQueryKeysCON';
import { toast } from 'sonner';

export interface AssetInventoryScreenControllerProps {
  assets: Asset[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenAddModal: (templateAsset?: Asset) => void;
  onOpenEditModal?: (asset: Asset) => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onExportCSV: () => void;
  onImportAssets?: (importedAssets: Asset[]) => void;
  onDeleteAsset?: (asset: Asset) => void;
  overrideViewMode?: 'table' | 'grid';
  overrideGridColumns?: 2 | 3;
  overrideSingleLine?: boolean;
  overrideComplianceFilter?: string;
  overrideSearchQuery?: string;
  onViewModeChange?: (mode: 'table' | 'grid') => void;
  onGridColumnsChange?: (cols: 2 | 3) => void;
  onSingleLineChange?: (val: boolean) => void;
}

export default function AssetInventoryScreenController({
  assets,
  isLoading = false,
  onRefresh,
  onSelectAsset,
  onOpenAddModal,
  onOpenEditModal,
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

  const user = useAuthenticationStateStore((state) => state.user);
  const isStandardUser = user?.role?.toUpperCase() === 'USER';

  // Live Database Employees Query for dynamic user profile reconciliation
  const { data: dbEmployees = [] } =
    TanstackQueryClientService.current.employees.useEmployeesQuery();

  const userMatchedEmployee = useMemo(() => {
    if (!user) return null;
    return dbEmployees.find(
      (emp) =>
        (user.email && emp.email?.toLowerCase().trim() === user.email.toLowerCase().trim()) ||
        (user.id && emp.id === user.id) ||
        (user.id && emp.employeeCode === user.id)
    );
  }, [user, dbEmployees]);

  const activeAssets = useMemo(() => {
    if (!isStandardUser) return assets;
    if (!user) return [];

    const targetUserIds = new Set<string>();
    if (user.id) targetUserIds.add(user.id);
    if (userMatchedEmployee?.id) targetUserIds.add(userMatchedEmployee.id);
    if (userMatchedEmployee?.employeeCode) targetUserIds.add(userMatchedEmployee.employeeCode);

    const targetUserNames = new Set<string>();
    if (user.fullName && user.fullName !== 'Enterprise User' && user.fullName.trim()) {
      targetUserNames.add(user.fullName.toLowerCase().trim());
    }
    if (userMatchedEmployee?.name && userMatchedEmployee.name.trim()) {
      targetUserNames.add(userMatchedEmployee.name.toLowerCase().trim());
    }

    const targetUserEmails = new Set<string>();
    if (user.email && user.email.trim()) targetUserEmails.add(user.email.toLowerCase().trim());
    if (userMatchedEmployee?.email && userMatchedEmployee.email.trim()) {
      targetUserEmails.add(userMatchedEmployee.email.toLowerCase().trim());
    }

    return assets.filter((ast) => {
      // 1. Match by verified employee ID
      if (ast.assignedToEmployeeId && targetUserIds.has(ast.assignedToEmployeeId)) {
        return true;
      }
      // 2. Match by verified employee full name
      if (
        ast.assignedToEmployeeName &&
        ast.assignedToEmployeeName.trim() &&
        ast.assignedToEmployeeName.toLowerCase() !== 'unassigned' &&
        targetUserNames.has(ast.assignedToEmployeeName.toLowerCase().trim())
      ) {
        return true;
      }
      // 3. Match by verified employee email if present on asset
      if (
        (ast as any).assignedEmployeeEmail &&
        targetUserEmails.has(String((ast as any).assignedEmployeeEmail).toLowerCase().trim())
      ) {
        return true;
      }
      return false;
    });
  }, [assets, isStandardUser, user, userMatchedEmployee]);

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

  const [viewMode, setViewModeState] = useState<'table' | 'grid'>(
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

  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const registerDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        registerDropdownRef.current &&
        !registerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRegisterDropdownOpen(false);
      }
    }
    if (isRegisterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRegisterDropdownOpen]);

  const setViewMode = (mode: 'table' | 'grid') => {
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

  const canWrite = ApplicationPermissionService.current.canWriteCore();

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
        ...(canWrite
          ? [
              {
                id: 'edit',
                label: 'Edit',
                icon: <Edit3 className="w-3.5 h-3.5" />,
                onClick: () => {
                  if (contextMenu.asset) {
                    if (onOpenEditModal) {
                      onOpenEditModal(contextMenu.asset);
                    } else {
                      onOpenAddModal(contextMenu.asset);
                    }
                  }
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
          : []),
      ]
    : [
        ...(canWrite
          ? [
              {
                id: 'create',
                label: 'Create / Register Asset',
                icon: <Plus className="w-3.5 h-3.5" />,
                shortcut: 'N',
                onClick: () => {
                  onOpenAddModal();
                },
              },
            ]
          : []),
        {
          id: 'refresh',
          label: 'Refresh',
          icon: <RotateCw className="w-3.5 h-3.5" />,
          shortcut: 'R',
          onClick: () => {
            if (onRefresh) {
              onRefresh();
            } else {
              TanstackQueryClientService.current.client.invalidateQueries({
                queryKey: TanstackQueryKeysCON.ASSETS,
              });
            }
            toast.success('Asset Inventory Refreshed', {
              description: 'Fetched latest hardware assets from server.',
            });
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

  const filteredAssetIds = React.useMemo(() => {
    return filteredAssets.map((a) => a.id);
  }, [filteredAssets]);

  const { data: valuationSummary } = TanstackQueryClientService.current.assets.useAssetValuationSummaryQuery(
    filteredAssetIds,
    { enabled: !isStandardUser }
  );

  const totalValuation = filteredAssets.reduce(
    (acc, a) => acc + (a.currentValue || 0),
    0
  );

  const dominantCurrency = CurrencyFormatterUtility.current.getDominantCurrency(
    filteredAssets.map((a) => a.procurement?.currency || a.currency)
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
            {isStandardUser ? 'My Assigned Devices & Assets' : AssetInventoryCON.TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {isStandardUser
              ? 'View and inspect enterprise hardware and computing equipment assigned directly to your custody.'
              : AssetInventoryCON.SUBTITLE}
          </p>
        </div>

        {/* Executive Typographic Metric Counters (Hidden for standard USER role) */}
        {!isStandardUser && (
          <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {valuationSummary
                  ? `${valuationSummary.targetCurrencySymbol}${valuationSummary.convertedTotalValuation.toLocaleString()}`
                  : CurrencyFormatterUtility.current.format(totalValuation, dominantCurrency)}
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
        )}
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
            <PermissionGuardSharedComponent permission={ApplicationPermissionCON.CAN_WRITE_CORE_ASSETS}>
              <ButtonSharedComponent
                variant="outline"
                size="sm"
                onClick={() => setIsImportModalOpen(true)}
                icon={<Upload className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />}
              >
                Import CSV
              </ButtonSharedComponent>
            </PermissionGuardSharedComponent>

            <ButtonSharedComponent
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </ButtonSharedComponent>

            <PermissionGuardSharedComponent permission={ApplicationPermissionCON.CAN_WRITE_CORE_ASSETS}>
              <div className="relative" ref={registerDropdownRef}>
                <PrimaryActionButtonSharedComponent
                  label="Register Device"
                  onClick={() => setIsRegisterDropdownOpen((prev) => !prev)}
                  icon={<ChevronDown className={`w-3.5 h-3.5 !text-white transition-transform duration-200 ${isRegisterDropdownOpen ? 'rotate-180' : ''}`} />}
                />

                <AnimatePresence>
                  {isRegisterDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 p-1.5 space-y-1 divide-y divide-slate-100 dark:divide-zinc-800/60 font-sans"
                    >
                      <div className="p-1 space-y-1">
                        {/* Option 1: Create From Scratch */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegisterDropdownOpen(false);
                            onOpenAddModal();
                          }}
                          className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
                        >
                          <div className="p-2 bg-slate-100 dark:bg-zinc-900 rounded-lg text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors shrink-0 mt-0.5">
                            <FilePlus2 className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-[#0C2086] dark:group-hover:text-indigo-400 transition-colors">
                              Create From Scratch
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                              Start with an empty registration form to manually configure all specifications.
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="p-1 pt-1.5 space-y-1">
                        {/* Option 2: Create From Template */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegisterDropdownOpen(false);
                            setIsTemplateModalOpen(true);
                          }}
                          className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
                        >
                          <div className="p-2 bg-slate-100 dark:bg-zinc-900 rounded-lg text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors shrink-0 mt-0.5">
                            <LayoutTemplate className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-[#0C2086] dark:group-hover:text-indigo-400 transition-colors">
                              Create From Template
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                              Pre-fill specifications using enterprise hardware presets and configurations.
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PermissionGuardSharedComponent>
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

            {/* View Mode Segmented Control (Table, Grid) */}
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
            </div>
          </div>
        </div>
      </CardSharedComponent>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800/60 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-48 bg-slate-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
                  <div className="h-6 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardSharedComponent>
      )}

      {/* Fallback Empty State */}
      {!isLoading && filteredAssets.length === 0 && (
        <EmptyStateSharedComponent
          icon={<Laptop className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
          title={
            isStandardUser
              ? searchQuery || selectedCategory !== 'ALL' || selectedLifecycle !== 'ALL' || complianceFilter !== 'ALL'
                ? 'No Matching Assigned Assets'
                : 'No Assigned Assets Found'
              : searchQuery || selectedCategory !== 'ALL' || selectedLifecycle !== 'ALL' || complianceFilter !== 'ALL'
                ? 'No Matching Hardware Assets'
                : 'No Hardware Assets in Registry'
          }
          description={
            isStandardUser
              ? searchQuery || selectedCategory !== 'ALL' || selectedLifecycle !== 'ALL' || complianceFilter !== 'ALL'
                ? 'No assigned assets matched your search query or active filter criteria. Try clearing search filters.'
                : 'You do not currently have any devices or hardware assets assigned to your account. Contact IT Operations to request device provisioning.'
              : searchQuery || selectedCategory !== 'ALL' || selectedLifecycle !== 'ALL' || complianceFilter !== 'ALL'
                ? 'No assets matched your search query or active filter criteria. Try clearing search filters or changing parameters.'
                : 'Your enterprise hardware asset registry is currently empty. Register your first device or import assets via CSV.'
          }
        />
      )}

      {/* Main Content Area View Modes */}
      {!isLoading && viewMode === 'table' && filteredAssets.length > 0 && (
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
                      {CurrencyFormatterUtility.current.format(
                        asset.currentValue,
                        asset.procurement?.currency || asset.currency
                      )}
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
      {!isLoading && viewMode === 'grid' && filteredAssets.length > 0 && (
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
                    {CurrencyFormatterUtility.current.format(
                      asset.currentValue,
                      asset.procurement?.currency || asset.currency
                    )}
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
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  title="View / Print QR Asset Tag"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardSharedComponent>
          ))}
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

      {/* Register Device from Template Modal Shell */}
      <AssetTemplateSelectionModalController
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(template) => {
          setIsTemplateModalOpen(false);
          onOpenAddModal(template as Asset);
        }}
      />
    </div>
  );
}
