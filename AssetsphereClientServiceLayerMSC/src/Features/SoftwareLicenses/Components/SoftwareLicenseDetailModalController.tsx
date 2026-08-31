import React, { useState, useRef, useMemo } from 'react';
import { SoftwareLicense } from '../../../Types/SoftwareLicenseType';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../../Shared/Components/BadgeSharedComponent';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';
import EmptyStateSharedComponent from '../../../Shared/Components/EmptyStateSharedComponent';
import ConfirmationModalSharedComponent from '../../../Shared/Components/ConfirmationModalSharedComponent';
import PermissionGuardSharedComponent from '../../../Shared/Components/PermissionGuardSharedComponent';
import CustomSelectSharedComponent from '../../../Shared/Components/CustomSelectSharedComponent';
import ApplicationPermissionCON from '@/src/Constants/ApplicationPermissionCON';
import CurrencyFormatterUtility from '../../../Utilities/CurrencyFormatterUtility';
import TanstackQueryClientService from '../../../Services/TanstackQueryClientService';
import {
  KeyRound,
  Building,
  DollarSign,
  Calendar,
  Layers,
  Users,
  UserPlus,
  UserMinus,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  Clock,
  Tag,
  Search,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export interface SoftwareLicenseDetailModalControllerProps {
  license: SoftwareLicense | null;
  onClose: () => void;
  onDeleteSuccess?: (deletedId: string) => void;
  zIndex?: number;
}

type DetailTab = 'overview' | 'roster' | 'commercials';

interface AssignedUserObj {
  id: string;
  name: string;
  email: string;
  department?: string;
  designation?: string;
}

export default function SoftwareLicenseDetailModalController({
  license,
  onClose,
  onDeleteSuccess,
  zIndex = 60,
}: SoftwareLicenseDetailModalControllerProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [copiedKey, setCopiedKey] = useState(false);
  const [rosterSearchQuery, setRosterSearchQuery] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down');

  // Add / Remove employee states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalExitDirection, setAssignModalExitDirection] = useState<'down' | 'up'>('down');
  const [assignSearchQuery, setAssignSearchQuery] = useState('');
  const [assignDeptFilter, setAssignDeptFilter] = useState('ALL');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [employeeToUnassign, setEmployeeToUnassign] = useState<AssignedUserObj | null>(null);

  // Live queries
  const { data: allEmployees = [] } = TanstackQueryClientService.current.employees.useEmployeesQuery();
  const { data: designationsMap = {} } = TanstackQueryClientService.current.configuration.useDesignationsQuery();

  const prevIsOpenRef = useRef(Boolean(license));
  const lastLicenseRef = useRef<SoftwareLicense | null>(license);
  if (license) {
    lastLicenseRef.current = license;
  }
  const displayLicense = license || lastLicenseRef.current;

  React.useEffect(() => {
    const isOpening = Boolean(license) && !prevIsOpenRef.current;
    if (isOpening) {
      setExitDirection('down');
      setActiveTab('overview');
      setRosterSearchQuery('');
      setIsAssignModalOpen(false);
      setSelectedCandidateIds([]);
      setEmployeeToUnassign(null);
    }
    prevIsOpenRef.current = Boolean(license);
  }, [license]);

  const deleteLicenseMutation =
    TanstackQueryClientService.current.softwareLicenses.useDeleteSoftwareLicenseMutation({
      onSuccess: () => {
        toast.success('Subscription Deleted Successfully', {
          description: `${displayLicense?.softwareName || 'Subscription'} has been permanently removed.`,
        });
        setIsDeleteConfirmationOpen(false);
        if (displayLicense && onDeleteSuccess) {
          onDeleteSuccess(displayLicense.id);
        }
        handleCloseModal();
      },
      onError: (err: Error) => {
        toast.error('Failed to Delete Subscription', {
          description: err.message || 'An error occurred while deleting the subscription.',
        });
      },
    });

  const updateLicenseMutation =
    TanstackQueryClientService.current.softwareLicenses.useUpdateSoftwareLicenseMutation({
      onError: (err: Error) => {
        toast.error('Failed to Update Subscription Seats', {
          description: err.message || 'An error occurred while updating the subscription.',
        });
      },
    });

  const handleCloseModal = () => {
    setExitDirection('up');
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleCopyKey = () => {
    if (displayLicense?.licenseKey) {
      navigator.clipboard.writeText(displayLicense.licenseKey);
      setCopiedKey(true);
      toast.success('License Key Copied to Clipboard');
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Parse assigned users roster from real database JSON property
  const parsedAssignedUsers: AssignedUserObj[] = useMemo(() => {
    if (!displayLicense?.assignedUsersJson) return [];
    try {
      const parsed = JSON.parse(displayLicense.assignedUsersJson);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === 'string') {
            return { id: item, name: item, email: '' };
          }
          return item as AssignedUserObj;
        });
      }
    } catch {
      // Fallback
    }
    return [];
  }, [displayLicense?.assignedUsersJson]);

  // Filtered assigned users roster by search
  const filteredRoster = useMemo(() => {
    if (!rosterSearchQuery.trim()) return parsedAssignedUsers;
    const q = rosterSearchQuery.toLowerCase();
    return parsedAssignedUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.designation && u.designation.toLowerCase().includes(q))
    );
  }, [parsedAssignedUsers, rosterSearchQuery]);

  // Candidate unassigned employees for assignment modal
  const candidateEmployees = useMemo(() => {
    const assignedIds = new Set(parsedAssignedUsers.map((u) => u.id));
    return allEmployees.filter((emp) => !assignedIds.has(emp.id) && !assignedIds.has(emp.employeeCode));
  }, [allEmployees, parsedAssignedUsers]);

  // Filtered candidate employees by search & department
  const filteredCandidates = useMemo(() => {
    return candidateEmployees.filter((emp) => {
      if (assignDeptFilter !== 'ALL' && emp.department !== assignDeptFilter) return false;
      if (!assignSearchQuery.trim()) return true;
      const q = assignSearchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        (emp.department && emp.department.toLowerCase().includes(q)) ||
        (emp.designation && emp.designation.toLowerCase().includes(q)) ||
        (emp.employeeCode && emp.employeeCode.toLowerCase().includes(q))
      );
    });
  }, [candidateEmployees, assignDeptFilter, assignSearchQuery]);

  const availableCapacity = Math.max(0, (displayLicense?.totalSeats || 0) - parsedAssignedUsers.length);
  const remainingAssignableSlots = Math.max(0, availableCapacity - selectedCandidateIds.length);

  // Toggle selection for candidate employee
  const handleToggleCandidate = (empId: string) => {
    if (selectedCandidateIds.includes(empId)) {
      setSelectedCandidateIds((prev) => prev.filter((id) => id !== empId));
    } else {
      if (selectedCandidateIds.length >= availableCapacity) {
        toast.warning('Seat Capacity Limit Reached', {
          description: `You have reached the maximum available capacity of ${availableCapacity} seats.`,
        });
        return;
      }
      setSelectedCandidateIds((prev) => [...prev, empId]);
    }
  };

  // Bulk select visible candidates up to available capacity
  const handleSelectVisibleCandidates = () => {
    const unselectedVisible = filteredCandidates
      .map((e) => e.id)
      .filter((id) => !selectedCandidateIds.includes(id));
    const slots = availableCapacity - selectedCandidateIds.length;
    if (slots <= 0) return;
    const toAdd = unselectedVisible.slice(0, slots);
    setSelectedCandidateIds((prev) => [...prev, ...toAdd]);
  };

  // Submit newly assigned employees to backend
  const handleConfirmAssignEmployees = async () => {
    if (!displayLicense || selectedCandidateIds.length === 0) return;

    const newlySelectedObjs: AssignedUserObj[] = selectedCandidateIds
      .map((id) => allEmployees.find((e) => e.id === id))
      .filter(Boolean)
      .map((emp) => ({
        id: emp!.id,
        name: emp!.name,
        email: emp!.email,
        department: emp!.department,
        designation: emp!.designation,
      }));

    const updatedRoster: AssignedUserObj[] = [...parsedAssignedUsers, ...newlySelectedObjs];

    try {
      await updateLicenseMutation.mutateAsync({
        id: displayLicense.id,
        request: {
          assignedUsersJson: JSON.stringify(updatedRoster),
          assignedSeats: updatedRoster.length,
        },
      });

      toast.success('Employees Assigned Successfully', {
        description: `Added ${newlySelectedObjs.length} employees to ${displayLicense.softwareName}.`,
      });

      setAssignModalExitDirection('up');
      setTimeout(() => {
        setIsAssignModalOpen(false);
        setSelectedCandidateIds([]);
        setAssignSearchQuery('');
      }, 0);
    } catch {
      // Error handled by mutation
    }
  };

  // Confirm unassigning an employee from seat
  const handleConfirmUnassign = async () => {
    if (!displayLicense || !employeeToUnassign) return;

    const updatedRoster = parsedAssignedUsers.filter((u) => u.id !== employeeToUnassign.id);

    try {
      await updateLicenseMutation.mutateAsync({
        id: displayLicense.id,
        request: {
          assignedUsersJson: JSON.stringify(updatedRoster),
          assignedSeats: updatedRoster.length,
        },
      });

      toast.success('Employee Unassigned Successfully', {
        description: `${employeeToUnassign.name} was removed from ${displayLicense.softwareName}. 1 seat freed up.`,
      });

      setEmployeeToUnassign(null);
    } catch {
      // Error handled by mutation
    }
  };

  // Days remaining calculation
  const expirationDaysData = useMemo(() => {
    if (!displayLicense?.expirationDate) return null;
    const expDate = new Date(displayLicense.expirationDate);
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      days: diffDays,
      isExpired: diffDays < 0,
      isExpiringSoon: diffDays >= 0 && diffDays <= 30,
      formattedDate: expDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };
  }, [displayLicense?.expirationDate]);

  if (!displayLicense) return <React.Fragment />;

  const complianceVariant =
    displayLicense.complianceStatus === 'Compliant'
      ? 'success'
      : displayLicense.complianceStatus === 'Expiring Soon'
      ? 'warning'
      : 'danger';

  const tabsList: { id: DetailTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview & Specs' },
    { id: 'roster', label: 'Assigned Employees Roster', count: parsedAssignedUsers.length },
    { id: 'commercials', label: 'Commercials & Terms' },
  ];

  const departmentOptions = [
    { value: 'ALL', label: 'All Departments' },
    ...Object.keys(designationsMap).map((d) => ({ value: d, label: d })),
  ];

  return (
    <ModalSharedComponent
      isOpen={Boolean(license)}
      onClose={onClose}
      exitDirection={exitDirection}
      zIndex={zIndex}
      title={displayLicense.softwareName}
      subtitle={`${displayLicense.publisher} • ${displayLicense.version || 'Enterprise Edition'}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Action Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <BadgeSharedComponent variant={complianceVariant} size="md" showDot>
              {displayLicense.complianceStatus}
            </BadgeSharedComponent>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
              Annual Valuation:{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {CurrencyFormatterUtility.current.format(
                  displayLicense.annualCost || (displayLicense.costPerSeat * displayLicense.totalSeats),
                  displayLicense.currency
                )}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PermissionGuardSharedComponent permission={ApplicationPermissionCON.CAN_WRITE_CORE_LICENSES}>
              <ButtonSharedComponent
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteConfirmationOpen(true)}
                icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                className="!text-rose-600 dark:!text-rose-400 hover:!bg-rose-50 dark:hover:!bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60"
              >
                Delete Subscription
              </ButtonSharedComponent>
            </PermissionGuardSharedComponent>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-200 dark:border-zinc-800">
          {tabsList.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'border-zinc-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW & SPECS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Software & Publisher Specs */}
              <CardSharedComponent className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  Software Specification
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono text-[11px] block">Product Name</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{displayLicense.softwareName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[11px] block">Publisher / Vendor</span>
                    <span className="font-medium text-slate-700 dark:text-zinc-200">{displayLicense.publisher}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[11px] block">Release / Version</span>
                    <span className="font-mono text-slate-700 dark:text-zinc-300">{displayLicense.version || 'Enterprise'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[11px] block">Software Category</span>
                    <span className="font-medium text-slate-700 dark:text-zinc-200">{displayLicense.category || 'Productivity'}</span>
                  </div>
                </div>
              </CardSharedComponent>

              {/* Card 2: License Key & Agreement Details */}
              <CardSharedComponent className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  License Key & Agreement
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono text-[11px] block mb-1">License Key / Agreement ID</span>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 font-mono text-xs">
                      <span className="text-slate-900 dark:text-white truncate select-all">{displayLicense.licenseKey}</span>
                      <button
                        type="button"
                        onClick={handleCopyKey}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors ml-2 shrink-0 cursor-pointer"
                        title="Copy Key"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 font-mono text-[11px] block">License Type</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{displayLicense.licenseType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[11px] block">Compliance Status</span>
                      <BadgeSharedComponent variant={complianceVariant} size="sm">
                        {displayLicense.complianceStatus}
                      </BadgeSharedComponent>
                    </div>
                  </div>
                </div>
              </CardSharedComponent>
            </div>

            {/* Card 3: Seat Capacity & Progress Utilization */}
            <CardSharedComponent className="p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  Seat Allocation & Capacity
                </h4>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {displayLicense.allocatedSeats} / {displayLicense.totalSeats} Seats ({Math.round((displayLicense.allocatedSeats / (displayLicense.totalSeats || 1)) * 100)}%)
                </span>
              </div>

              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      displayLicense.allocatedSeats > displayLicense.totalSeats
                        ? 'bg-rose-500'
                        : displayLicense.allocatedSeats === displayLicense.totalSeats
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (displayLicense.allocatedSeats / (displayLicense.totalSeats || 1)) * 100)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80">
                    <span className="text-[10px] text-slate-400 block">Total Capacity</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{displayLicense.totalSeats}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80">
                    <span className="text-[10px] text-slate-400 block">Allocated Seats</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{displayLicense.allocatedSeats}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80">
                    <span className="text-[10px] text-slate-400 block">Available Seats</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.max(0, displayLicense.totalSeats - displayLicense.allocatedSeats)}
                    </span>
                  </div>
                </div>
              </div>
            </CardSharedComponent>

            {/* Card 4: Target Allocated Departments */}
            {displayLicense.assignedDepartments && displayLicense.assignedDepartments.length > 0 && (
              <CardSharedComponent className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <Building className="w-3.5 h-3.5 text-amber-500" />
                  Target Department Allocations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {displayLicense.assignedDepartments.map((dept) => (
                    <span
                      key={dept}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/60 font-mono"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </CardSharedComponent>
            )}
          </div>
        )}

        {/* ================= TAB 2: ASSIGNED EMPLOYEES ROSTER ================= */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-zinc-400">
                  Seat Status:
                </span>
                <BadgeSharedComponent variant="info" size="sm">
                  {parsedAssignedUsers.length} / {displayLicense.totalSeats} Seats Allocated
                </BadgeSharedComponent>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  ({availableCapacity} Available)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <PermissionGuardSharedComponent permission={ApplicationPermissionCON.CAN_WRITE_CORE_LICENSES}>
                  <ButtonSharedComponent
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setAssignModalExitDirection('down');
                      setSelectedCandidateIds([]);
                      setAssignSearchQuery('');
                      setAssignDeptFilter('ALL');
                      setIsAssignModalOpen(true);
                    }}
                    disabled={availableCapacity <= 0 || updateLicenseMutation.isPending}
                    icon={<UserPlus className="w-3.5 h-3.5 text-white" />}
                    className="!bg-[#0C2086] hover:!bg-[#081765] !text-white text-xs font-medium cursor-pointer"
                  >
                    Assign Employee
                  </ButtonSharedComponent>
                </PermissionGuardSharedComponent>
              </div>
            </div>

            {/* Search Filter for Current Roster */}
            {parsedAssignedUsers.length > 0 && (
              <div className="relative max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={rosterSearchQuery}
                  onChange={(e) => setRosterSearchQuery(e.target.value)}
                  placeholder="Search assigned employees by name, email, or department..."
                  className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#121216] text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>
            )}

            {/* Roster Cards List */}
            {parsedAssignedUsers.length === 0 ? (
              <EmptyStateSharedComponent
                icon={<Users className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
                title="No Employees Assigned"
                description="This software license currently has 0 assigned employee seats configured in the database. Click 'Assign Employee' to allocate seats."
              />
            ) : filteredRoster.length === 0 ? (
              <EmptyStateSharedComponent
                icon={<Search className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
                title="No Matching Employees Found"
                description={`No assigned employees matched your query "${rosterSearchQuery}".`}
              />
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-vertical-scrollbar">
                {filteredRoster.map((user, idx) => (
                  <div
                    key={user.id || `emp-${idx}`}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-[#121216] flex items-center justify-between gap-3 group hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar initials */}
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-zinc-200 shrink-0 font-mono">
                        {(user.name || 'User')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                          {user.name}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          {user.email || 'No email registered'} {user.designation ? `• ${user.designation}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {user.department && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-mono">
                          {user.department}
                        </span>
                      )}

                      <PermissionGuardSharedComponent permission={ApplicationPermissionCON.CAN_WRITE_CORE_LICENSES}>
                        <ButtonSharedComponent
                          variant="ghost"
                          size="sm"
                          onClick={() => setEmployeeToUnassign(user)}
                          disabled={updateLicenseMutation.isPending}
                          icon={<UserMinus className="w-3.5 h-3.5 text-rose-500" />}
                          className="!text-rose-600 dark:!text-rose-400 hover:!bg-rose-50 dark:hover:!bg-rose-950/40 text-xs !py-1 !px-2 font-medium"
                          title="Unassign employee from seat"
                        >
                          Unassign
                        </ButtonSharedComponent>
                      </PermissionGuardSharedComponent>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: COMMERCIALS & TERMS ================= */}
        {activeTab === 'commercials' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Investment & Unit Economics */}
              <CardSharedComponent className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Unit Economics & Pricing
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/60 font-mono">
                    <span className="text-slate-500">Cost Per Seat</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {CurrencyFormatterUtility.current.format(displayLicense.costPerSeat, displayLicense.currency)} / seat
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/60 font-mono">
                    <span className="text-slate-500">Billing Currency</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{displayLicense.currency}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 font-mono">
                    <span className="text-slate-500">Total Annual Investment</span>
                    <span className="font-bold text-sm text-[#0C2086] dark:text-blue-400">
                      {CurrencyFormatterUtility.current.format(
                        displayLicense.annualCost || (displayLicense.costPerSeat * displayLicense.totalSeats),
                        displayLicense.currency
                      )}
                    </span>
                  </div>
                </div>
              </CardSharedComponent>

              {/* Card 2: Contract Timeline & Renewal Lifecycle */}
              <CardSharedComponent className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Contract Term & Expiration
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/60 font-mono">
                    <span className="text-slate-500">Purchase / Start Date</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {displayLicense.purchaseDate
                        ? new Date(displayLicense.purchaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-zinc-800/60 font-mono">
                    <span className="text-slate-500">Expiration / Renewal Date</span>
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {expirationDaysData?.formattedDate || displayLicense.expirationDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 font-mono">
                    <span className="text-slate-500">Term Status</span>
                    {expirationDaysData && (
                      <BadgeSharedComponent
                        variant={
                          expirationDaysData.isExpired
                            ? 'danger'
                            : expirationDaysData.isExpiringSoon
                            ? 'warning'
                            : 'success'
                        }
                        size="sm"
                      >
                        {expirationDaysData.isExpired
                          ? `Expired (${Math.abs(expirationDaysData.days)}d ago)`
                          : `${expirationDaysData.days} days remaining`}
                      </BadgeSharedComponent>
                    )}
                  </div>
                </div>
              </CardSharedComponent>
            </div>
          </div>
        )}

        {/* Footer Close Button (Always Dismisses Upwards) */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-zinc-800">
          <ButtonSharedComponent variant="outline" size="sm" onClick={handleCloseModal}>
            Close
          </ButtonSharedComponent>
        </div>
      </div>

      {/* ================= MODAL: ASSIGN EMPLOYEES ================= */}
      <ModalSharedComponent
        isOpen={isAssignModalOpen}
        onClose={() => {
          setAssignModalExitDirection('up');
          setTimeout(() => {
            setIsAssignModalOpen(false);
            setSelectedCandidateIds([]);
          }, 0);
        }}
        exitDirection={assignModalExitDirection}
        zIndex={zIndex + 10}
        title="Assign Employees to Subscription"
        subtitle={`${displayLicense.softwareName} • Available Capacity: ${availableCapacity} Seats`}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {/* Capacity and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-zinc-400">
                Selected:
              </span>
              <BadgeSharedComponent
                variant={selectedCandidateIds.length >= availableCapacity ? 'warning' : 'info'}
                size="sm"
              >
                {selectedCandidateIds.length} / {availableCapacity} Available Seats
              </BadgeSharedComponent>
            </div>

            <div className="flex items-center gap-2">
              <ButtonSharedComponent
                variant="ghost"
                size="sm"
                onClick={handleSelectVisibleCandidates}
                disabled={remainingAssignableSlots <= 0 || filteredCandidates.length === 0}
                className="text-xs !py-1 !px-2"
              >
                Select Visible
              </ButtonSharedComponent>
              {selectedCandidateIds.length > 0 && (
                <ButtonSharedComponent
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCandidateIds([])}
                  className="text-xs !py-1 !px-2 !text-slate-500"
                >
                  Clear Selection
                </ButtonSharedComponent>
              )}
            </div>
          </div>

          {/* Search & Department Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={assignSearchQuery}
                onChange={(e) => setAssignSearchQuery(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full h-9 pl-8 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#121216] text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
              />
            </div>

            <CustomSelectSharedComponent
              value={assignDeptFilter}
              options={departmentOptions}
              onChange={(val) => setAssignDeptFilter(val)}
              size="sm"
              className="w-full"
            />
          </div>

          {/* Candidates List */}
          {candidateEmployees.length === 0 ? (
            <EmptyStateSharedComponent
              icon={<Users className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
              title="All Employees Assigned"
              description="Every employee in the organization is already assigned to this software subscription."
            />
          ) : filteredCandidates.length === 0 ? (
            <EmptyStateSharedComponent
              icon={<Search className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
              title="No Matching Employees"
              description="No unassigned employees matched your search or department filter."
            />
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-vertical-scrollbar">
              {filteredCandidates.map((emp) => {
                const isSelected = selectedCandidateIds.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => handleToggleCandidate(emp.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#0C2086] bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/30'
                        : 'border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-[#121216] hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Selection Checkbox */}
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-[#0C2086] border-[#0C2086] text-white dark:bg-blue-600 dark:border-blue-600'
                            : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>

                      {/* Avatar initials */}
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-zinc-200 shrink-0 font-mono">
                        {(emp.name || 'User')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                          {emp.name}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          {emp.email} {emp.designation ? `• ${emp.designation}` : ''}
                        </p>
                      </div>
                    </div>

                    {emp.department && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-mono shrink-0">
                        {emp.department}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
            <ButtonSharedComponent
              variant="outline"
              size="sm"
              onClick={() => {
                setAssignModalExitDirection('up');
                setTimeout(() => {
                  setIsAssignModalOpen(false);
                  setSelectedCandidateIds([]);
                }, 0);
              }}
              disabled={updateLicenseMutation.isPending}
            >
              Cancel
            </ButtonSharedComponent>

            <ButtonSharedComponent
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirmAssignEmployees}
              disabled={selectedCandidateIds.length === 0 || updateLicenseMutation.isPending}
              isLoading={updateLicenseMutation.isPending}
              className="!bg-[#0C2086] hover:!bg-[#081765] !text-white font-medium"
            >
              Assign Selected ({selectedCandidateIds.length}) Seats
            </ButtonSharedComponent>
          </div>
        </div>
      </ModalSharedComponent>

      {/* ================= MODAL: UNASSIGN EMPLOYEE CONFIRMATION ================= */}
      <ConfirmationModalSharedComponent
        isOpen={Boolean(employeeToUnassign)}
        onClose={() => setEmployeeToUnassign(null)}
        onConfirm={handleConfirmUnassign}
        isLoading={updateLicenseMutation.isPending}
        title="Unassign Employee from License"
        subtitle={`${displayLicense.softwareName} • Seat Deallocation`}
        variant="warning"
        confirmText="Unassign Employee"
        description={
          <div className="space-y-2">
            <p>
              Are you sure you want to unassign{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {employeeToUnassign?.name}
              </strong>{' '}
              from{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {displayLicense.softwareName}
              </strong>
              ?
            </p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs">
              This action will release 1 allocated seat back to the subscription pool ({availableCapacity + 1} seats will become available).
            </p>
          </div>
        }
      />

      {/* ================= MODAL: DELETE SUBSCRIPTION CONFIRMATION ================= */}
      <ConfirmationModalSharedComponent
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={async () => {
          await deleteLicenseMutation.mutateAsync(displayLicense.id);
        }}
        isLoading={deleteLicenseMutation.isPending}
        title="Delete Software Subscription"
        subtitle={`License Agreement: ${displayLicense.licenseKey}`}
        variant="danger"
        confirmText="Delete Subscription"
        description={
          <div className="space-y-2">
            <p>
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {displayLicense.softwareName} ({displayLicense.publisher})
              </strong>
              ?
            </p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs">
              This action will remove the software subscription record, seat allocations ({displayLicense.allocatedSeats} assigned seats), and billing metrics from the database. This action cannot be undone.
            </p>
          </div>
        }
      />
    </ModalSharedComponent>
  );
}
