import React, { useState } from 'react';
import { SoftwareLicense } from '../../Types/SoftwareLicenseType';
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
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import EmptyStateSharedComponent from '../../Shared/Components/EmptyStateSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../Shared/Components/CustomSelectSharedComponent';
import PrimaryActionButtonSharedComponent from '../../Shared/Components/PrimaryActionButtonSharedComponent';
import PermissionGuardSharedComponent from '../../Shared/Components/PermissionGuardSharedComponent';
import ApplicationPermissionCON from '@/src/Constants/ApplicationPermissionCON';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';
import SoftwareLicenseFormModalController from './Components/SoftwareLicenseFormModalController';
import SoftwareLicenseDetailModalController from './Components/SoftwareLicenseDetailModalController';

export interface SoftwareLicensesScreenControllerProps {
  licenses: SoftwareLicense[];
  isLoading?: boolean;
  onOpenAddModal?: () => void;
  onSelectLicense?: (license: SoftwareLicense) => void;
}

const COMPLIANCE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'Compliant', label: 'Compliant' },
  { value: 'Over Allocated', label: 'Over Allocated' },
  { value: 'Under Utilized', label: 'Under Utilized' },
  { value: 'Expiring Soon', label: 'Expiring Soon' },
];

const LICENSE_TYPE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'All License Types' },
  { value: 'Enterprise Subscription', label: 'Enterprise Subscription' },
  { value: 'Named User', label: 'Named User' },
  { value: 'Floating', label: 'Floating' },
  { value: 'Per Core', label: 'Per Core' },
  { value: 'Perpetual', label: 'Perpetual' },
];

export default function SoftwareLicensesScreenController({
  licenses,
  isLoading = false,
  onOpenAddModal,
  onSelectLicense,
}: SoftwareLicensesScreenControllerProps): React.JSX.Element {
  const [isInternalAddModalOpen, setIsInternalAddModalOpen] = useState(false);
  const [selectedLicenseForDetail, setSelectedLicenseForDetail] = useState<SoftwareLicense | null>(null);

  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getSoftwareViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getSoftwareGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getSoftwareSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [complianceFilter, setComplianceFilter] = useState<string>('ALL');
  const [licenseTypeFilter, setLicenseTypeFilter] = useState<string>('ALL');

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

  const handleOpenAddModal = () => {
    if (onOpenAddModal) {
      onOpenAddModal();
    } else {
      setIsInternalAddModalOpen(true);
    }
  };

  const filteredLicenses = licenses.filter((lic) => {
    if (complianceFilter !== 'ALL' && lic.complianceStatus !== complianceFilter) return false;
    if (licenseTypeFilter !== 'ALL' && lic.licenseType !== licenseTypeFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lic.softwareName.toLowerCase().includes(q) ||
      lic.publisher.toLowerCase().includes(q) ||
      lic.licenseKey.toLowerCase().includes(q) ||
      lic.licenseType.toLowerCase().includes(q) ||
      (lic.category && lic.category.toLowerCase().includes(q))
    );
  });

  const totalSpend = filteredLicenses.reduce(
    (acc, l) => acc + (l.annualCost || (l.costPerSeat || 0) * (l.totalSeats || 0)),
    0
  );
  const totalAllocatedSeats = filteredLicenses.reduce(
    (acc, l) => acc + (l.allocatedSeats || 0),
    0
  );
  const totalCapacitySeats = filteredLicenses.reduce(
    (acc, l) => acc + (l.totalSeats || 0),
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
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ${totalSpend.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Annual Spend
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

      {/* Control Toolbar Card (Search, Filters, Divider, Switchers & Add Action) */}
      <CardSharedComponent className="p-3 space-y-3">
        {/* Row 1: Search + Add Subscription */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by software name, publisher, key, category..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
          </div>

          <PermissionGuardSharedComponent
            permission={ApplicationPermissionCON.CAN_WRITE_CORE_LICENSES}
          >
            <PrimaryActionButtonSharedComponent
              label="Add Subscription"
              onClick={handleOpenAddModal}
            />
          </PermissionGuardSharedComponent>
        </div>

        {/* Row 2: Relevant Filters + View Options (with divider) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs">
          {/* Left: Status & License Type Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Status:</span>
              <CustomSelectSharedComponent
                value={complianceFilter}
                options={COMPLIANCE_FILTER_OPTIONS}
                onChange={(val) => setComplianceFilter(val)}
                size="sm"
                className="w-36 sm:w-40"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Type:</span>
              <CustomSelectSharedComponent
                value={licenseTypeFilter}
                options={LICENSE_TYPE_FILTER_OPTIONS}
                onChange={(val) => setLicenseTypeFilter(val)}
                size="sm"
                className="w-44 sm:w-48"
              />
            </div>
          </div>

          {/* Right: Uniform Height Control Switchers */}
          <div className="flex flex-wrap items-center justify-end gap-3">
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
        <EmptyStateSharedComponent
          icon={<KeyRound className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
          title={searchQuery || complianceFilter !== 'ALL' || licenseTypeFilter !== 'ALL' ? 'No Subscriptions Match Filters' : 'No Software Licenses Registered'}
          description={
            searchQuery || complianceFilter !== 'ALL' || licenseTypeFilter !== 'ALL'
              ? `No enterprise software licenses or SaaS subscriptions match your search "${searchQuery}" or filter settings.`
              : 'There are no active software licenses or SaaS subscriptions registered in the directory. Click "Add Subscription" above to register your first enterprise contract.'
          }
        />
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
            const annualCost = lic.annualCost || (lic.costPerSeat * lic.totalSeats);

            return (
              <CardSharedComponent
                key={lic.id}
                hoverable
                onClick={() => {
                  if (onSelectLicense) {
                    onSelectLicense(lic);
                  } else {
                    setSelectedLicenseForDetail(lic);
                  }
                }}
                className="p-6 flex flex-col justify-between space-y-5 cursor-pointer"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline leading-snug truncate">
                      {lic.softwareName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold shrink-0 ${
                        lic.complianceStatus === 'Compliant'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                          : lic.complianceStatus === 'Expiring Soon'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/60 dark:border-red-800/60'
                      }`}
                    >
                      {lic.complianceStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    {lic.publisher} {lic.version ? `• ${lic.version}` : ''} • <span className="font-mono text-slate-400">{lic.licenseType}</span>
                  </p>
                </div>

                {/* Main Metric: Price & Seats */}
                <div className="py-3 border-y border-slate-100 dark:border-zinc-800/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                      {lic.currency === 'INR' ? '₹' : lic.currency === 'EUR' ? '€' : lic.currency === 'GBP' ? '£' : '$'}
                      {annualCost.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                      {lic.costPerSeat > 0 ? `@ $${lic.costPerSeat}/seat • ` : ''}/ year
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
                  const annualCost = lic.annualCost || (lic.costPerSeat * lic.totalSeats);

                  return (
                    <tr
                      key={lic.id}
                      onClick={() => {
                        if (onSelectLicense) {
                          onSelectLicense(lic);
                        } else {
                          setSelectedLicenseForDetail(lic);
                        }
                      }}
                      className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white font-serif-headline text-sm">
                        <div className="flex items-center gap-2">
                          <span>{lic.softwareName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                              lic.complianceStatus === 'Compliant'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : lic.complianceStatus === 'Expiring Soon'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            }`}
                          >
                            {lic.complianceStatus}
                          </span>
                        </div>
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
                        {lic.currency === 'INR' ? '₹' : lic.currency === 'EUR' ? '€' : lic.currency === 'GBP' ? '£' : '$'}
                        {annualCost.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardSharedComponent>
      )}

      {/* Add Subscription Modal Controller */}
      <SoftwareLicenseFormModalController
        isOpen={isInternalAddModalOpen}
        onClose={() => setIsInternalAddModalOpen(false)}
      />

      {/* Software License Detail Modal Controller */}
      <SoftwareLicenseDetailModalController
        license={selectedLicenseForDetail}
        onClose={() => setSelectedLicenseForDetail(null)}
      />
    </div>
  );
}
