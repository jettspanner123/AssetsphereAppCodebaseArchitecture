import React, { useState, useRef } from 'react';
import { Employee } from '../../../Types/EmployeeType';
import { Asset } from '../../../Types/AssetType';
import EmployeesCON, { EmployeeDetailTabKey } from '../Constants/EmployeesCON';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../../Shared/Components/BadgeSharedComponent';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';
import EmptyStateSharedComponent from '../../../Shared/Components/EmptyStateSharedComponent';
import PermissionGuardSharedComponent from '../../../Shared/Components/PermissionGuardSharedComponent';
import ApplicationPermissionCON from '../../../Constants/ApplicationPermissionCON';
import CurrencyFormatterUtility from '../../../Utilities/CurrencyFormatterUtility';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Briefcase,
  Calendar,
  ShieldCheck,
  Laptop,
  Smartphone,
  HardDrive,
  Monitor,
  Cpu,
  Activity,
  Edit,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface EmployeeDetailModalControllerProps {
  employee: Employee | null;
  assets: Asset[];
  isOpen: boolean;
  onClose: () => void;
  onEditEmployee: (employee: Employee) => void;
  onInspectAsset: (asset: Asset) => void;
}

export default function EmployeeDetailModalController({
  employee,
  assets,
  isOpen,
  onClose,
  onEditEmployee,
  onInspectAsset,
}: EmployeeDetailModalControllerProps): React.JSX.Element {
  const lastEmployeeRef = useRef<Employee | null>(employee);
  if (employee) {
    lastEmployeeRef.current = employee;
  }
  const displayEmployee = employee || lastEmployeeRef.current;

  const [activeTab, setActiveTab] = useState<EmployeeDetailTabKey>(EmployeesCON.TAB_OVERVIEW);

  if (!displayEmployee) return <React.Fragment />;

  // Live Assigned Asset Correlation matching id, employeeCode, or name
  const assignedAssets = assets.filter(
    (a) =>
      a.assignedToEmployeeId === displayEmployee.id ||
      a.assignedToEmployeeId === displayEmployee.employeeCode ||
      (a.assignedToEmployeeName &&
        a.assignedToEmployeeName.toLowerCase() === displayEmployee.name.toLowerCase())
  );

  // Financial and Telemetry Aggregates
  const totalValuation = assignedAssets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const dominantCurrency = CurrencyFormatterUtility.current.getDominantCurrency(
    assignedAssets.map((a) => a.procurement?.currency || a.currency)
  );
  const avgHealthScore =
    assignedAssets.length > 0
      ? Math.round(
          assignedAssets.reduce((sum, a) => sum + (a.health?.overallScore || 100), 0) /
            assignedAssets.length
        )
      : 100;

  // Get Category Icon Helper
  const getAssetCategoryIcon = (category?: string, subtype?: string) => {
    const cat = (category || '').toLowerCase();
    const sub = (subtype || '').toLowerCase();
    if (cat.includes('mobile') || sub.includes('phone')) {
      return <Smartphone className="w-4 h-4 text-emerald-500" />;
    }
    if (cat.includes('storage') || sub.includes('ssd') || sub.includes('drive')) {
      return <HardDrive className="w-4 h-4 text-amber-500" />;
    }
    if (cat.includes('peripheral') || sub.includes('monitor') || sub.includes('display')) {
      return <Monitor className="w-4 h-4 text-indigo-500" />;
    }
    return <Laptop className="w-4 h-4 text-sky-500" />;
  };

  // Initials monogram helper
  const initials = displayEmployee.name
    ? displayEmployee.name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'EM';

  return (
    <ModalSharedComponent
      isOpen={isOpen && Boolean(employee)}
      onClose={onClose}
      title={displayEmployee.name}
      subtitle={`${displayEmployee.designation} • ${displayEmployee.department} • ${displayEmployee.officeLocation || 'HQ'}`}
      maxWidth="5xl"
      minHeight="min-h-[540px]"
      animationType="slide-up"
    >
      <div className="space-y-6 text-xs">
        {/* Header Profile Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3.5 min-w-0">
            {displayEmployee.avatarUrl ? (
              <img
                src={displayEmployee.avatarUrl}
                alt={displayEmployee.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-zinc-700 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#0C2086] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm shrink-0">
                {initials}
              </div>
            )}

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif-headline truncate">
                  {displayEmployee.name}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold border border-slate-200/60 dark:border-zinc-700/60">
                  {displayEmployee.employeeCode}
                </span>
                <BadgeSharedComponent
                  variant={displayEmployee.isOffboardingActive ? 'danger' : displayEmployee.isOnboardingPending ? 'warning' : 'success'}
                  size="sm"
                  showDot
                >
                  {displayEmployee.isOffboardingActive
                    ? 'Offboarding Active'
                    : displayEmployee.isOnboardingPending
                    ? 'Onboarding Pending'
                    : 'Active Member'}
                </BadgeSharedComponent>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-slate-500 dark:text-zinc-400 text-xs">
                <span className="flex items-center gap-1 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {displayEmployee.designation}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {displayEmployee.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {displayEmployee.officeLocation || 'HQ Bangalore'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {displayEmployee.email && (
              <a
                href={`mailto:${displayEmployee.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                title={`Send email to ${displayEmployee.email}`}
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Email</span>
              </a>
            )}

            {displayEmployee.phone && (
              <a
                href={`tel:${displayEmployee.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                title={`Call ${displayEmployee.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-200 dark:border-zinc-800">
          {EmployeesCON.TAB_LIST.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-zinc-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'assigned_assets' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {assignedAssets.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Organization */}
        {activeTab === EmployeesCON.TAB_OVERVIEW && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identity & Credentials Card */}
            <CardSharedComponent className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white font-serif-headline flex items-center gap-2">
                <User className="w-4 h-4 text-sky-500" /> Identity & Credentials
              </h4>
              <div className="space-y-2 text-slate-600 dark:text-zinc-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Full Name:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{displayEmployee.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Employee Code:</span>
                  <span className="font-mono font-semibold">{displayEmployee.employeeCode}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Corporate Email:</span>
                  <span className="font-mono text-slate-900 dark:text-zinc-100">{displayEmployee.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Contact Phone:</span>
                  <span className="font-mono">{displayEmployee.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Employment Type:</span>
                  <BadgeSharedComponent variant="info" size="sm">
                    {displayEmployee.employmentType || 'Full-time'}
                  </BadgeSharedComponent>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Joining Date:</span>
                  <span className="font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {displayEmployee.joiningDate || '2024-01-15'}
                  </span>
                </div>
              </div>
            </CardSharedComponent>

            {/* Organization Hierarchy Card */}
            <CardSharedComponent className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white font-serif-headline flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" /> Organization & Seat Allocation
              </h4>
              <div className="space-y-2 text-slate-600 dark:text-zinc-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{displayEmployee.department}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Business Unit:</span>
                  <span>{displayEmployee.businessUnit || 'Global Operations'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Cost Center:</span>
                  <span className="font-mono text-slate-700 dark:text-zinc-300 font-medium">
                    {EmployeesCON.COST_CENTER_MAP[displayEmployee.department] || displayEmployee.costCenter || 'CC-GEN-100'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Reporting Manager:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {displayEmployee.managerName || 'David Vance (VP Engineering)'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Primary Office:</span>
                  <span className="font-medium">{displayEmployee.officeLocation || 'HQ Bangalore'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Floor & Desk:</span>
                  <span className="font-mono">
                    {displayEmployee.floor || 'Floor 4'} • {displayEmployee.desk || 'D-402'}
                  </span>
                </div>
              </div>
            </CardSharedComponent>
          </div>
        )}

        {/* Tab 2: Assigned Hardware Assets */}
        {activeTab === EmployeesCON.TAB_ASSIGNED_ASSETS && (
          <div className="space-y-4">
            {/* Live Asset Valuation Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Allocated Hardware</span>
                  <p className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {assignedAssets.length} {assignedAssets.length === 1 ? 'Device' : 'Devices'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Combined Asset Value</span>
                  <p className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {CurrencyFormatterUtility.current.format(totalValuation, dominantCurrency)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Avg Fleet Health</span>
                  <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {avgHealthScore}%
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Items or Empty State */}
            {assignedAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedAssets.map((asset) => (
                  <CardSharedComponent
                    key={asset.id}
                    hoverable
                    className="p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 shrink-0">
                            {getAssetCategoryIcon(asset.category, asset.subtype)}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-900 dark:text-white font-serif-headline truncate">
                              {asset.deviceName || asset.model}
                            </h5>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono truncate">
                              {asset.manufacturer} {asset.model}
                            </p>
                          </div>
                        </div>

                        <BadgeSharedComponent
                          variant={asset.security?.isCompliant ? 'success' : 'warning'}
                          size="sm"
                          showDot
                        >
                          {asset.lifecycleStatus || 'In Use'}
                        </BadgeSharedComponent>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-300">
                        <div>
                          <span className="text-slate-400 font-medium">Asset Tag:</span>
                          <p className="font-mono font-semibold">{asset.assetNumber}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Serial No:</span>
                          <p className="font-mono truncate">{asset.serialNumber}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Valuation:</span>
                          <p className="font-mono font-medium">
                            {CurrencyFormatterUtility.current.format(
                              asset.currentValue,
                              asset.procurement?.currency || asset.currency
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Health Score:</span>
                          <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {asset.health?.overallScore || 100}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {asset.security?.encryptionStatus || 'BitLocker Encrypted'}
                      </span>
                      <ButtonSharedComponent
                        variant="ghost"
                        size="sm"
                        onClick={() => onInspectAsset(asset)}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                      >
                        Inspect Device
                      </ButtonSharedComponent>
                    </div>
                  </CardSharedComponent>
                ))}
              </div>
            ) : (
              <EmptyStateSharedComponent
                icon={<Laptop className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
                title="No Hardware Assets Assigned"
                description={`No active physical computing devices or peripherals are currently checked out to ${displayEmployee.name}.`}
              />
            )}
          </div>
        )}

        {/* Tab 3: Activity & Access Roles */}
        {activeTab === EmployeesCON.TAB_ACTIVITY && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Access Roles & Governance Card */}
            <CardSharedComponent className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white font-serif-headline flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Role & Access Governance
              </h4>
              <div className="space-y-2.5 text-slate-600 dark:text-zinc-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">RBAC Role Profile:</span>
                  <BadgeSharedComponent variant="info" size="sm">
                    Organization Member
                  </BadgeSharedComponent>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">ITAM Custody Rights:</span>
                  <span className="font-medium text-slate-900 dark:text-zinc-100">Direct Custodian</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Clearance Level:</span>
                  <span className="font-mono text-slate-700 dark:text-zinc-300">L1 Corporate Security</span>
                </div>

                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                    Authorized Self-Service Permissions:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-500 dark:text-zinc-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      Hardware Custody Acknowledgment & Digital Signatures
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      QR Badge Physical Asset Verification
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      Hardware Issue & Service Desk Ticket Dispatch
                    </li>
                  </ul>
                </div>
              </div>
            </CardSharedComponent>

            {/* Lifecycle & Telemetry Milestones Card */}
            <CardSharedComponent className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white font-serif-headline flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" /> Lifecycle & Telemetry Status
              </h4>
              <div className="space-y-2.5 text-slate-600 dark:text-zinc-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Onboarding Status:</span>
                  <BadgeSharedComponent
                    variant={displayEmployee.isOnboardingPending ? 'warning' : 'success'}
                    size="sm"
                    showDot
                  >
                    {displayEmployee.isOnboardingPending ? 'In Progress' : 'Completed'}
                  </BadgeSharedComponent>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Offboarding Status:</span>
                  <BadgeSharedComponent
                    variant={displayEmployee.isOffboardingActive ? 'danger' : 'neutral'}
                    size="sm"
                  >
                    {displayEmployee.isOffboardingActive ? 'Active Handshake' : 'None Active'}
                  </BadgeSharedComponent>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Active Hardware Fleet:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {assignedAssets.length} Assets
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-400 font-medium">Directory Record Sync:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Last Physical Verification:</span>
                  <span className="font-mono">{displayEmployee.joiningDate || '2024-01-15'}</span>
                </div>
              </div>
            </CardSharedComponent>
          </div>
        )}

        {/* Modal Action Buttons Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800 shrink-0">
          <ButtonSharedComponent variant="outline" size="sm" onClick={onClose}>
            Close
          </ButtonSharedComponent>
          <PermissionGuardSharedComponent
            permission={ApplicationPermissionCON.CAN_WRITE_ORGANIZATION}
          >
            <ButtonSharedComponent
              variant="primary"
              size="sm"
              onClick={() => onEditEmployee(displayEmployee)}
              className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
              icon={<Edit className="w-3.5 h-3.5 !text-white" />}
            >
              <span className="!text-white font-medium">Edit Profile</span>
            </ButtonSharedComponent>
          </PermissionGuardSharedComponent>
        </div>
      </div>
    </ModalSharedComponent>
  );
}
