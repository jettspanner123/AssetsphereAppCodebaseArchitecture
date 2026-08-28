import React, { useState, useMemo, useEffect } from 'react';
import {
  Wrench,
  Laptop,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Send,
  User,
  MapPin,
  Flame,
  Layers,
  Cpu,
  Zap,
  ShieldCheck,
  RefreshCw,
  Eye,
  List,
  Grid,
  Maximize2,
  WrapText,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import useAuthenticationStateStore from '../../Store/AuthenticationStateStore';
import TanstackQueryClientService from '../../Services/TanstackQueryClientService';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import CustomSelectSharedComponent, {
  SelectOption,
} from '../../Shared/Components/CustomSelectSharedComponent';
import CreatableCustomSelectSharedComponent, {
  CreatableSelectOption,
} from '../../Shared/Components/CreatableCustomSelectSharedComponent';
import PrimaryActionButtonSharedComponent from '../../Shared/Components/PrimaryActionButtonSharedComponent';
import EmptyStateSharedComponent from '../../Shared/Components/EmptyStateSharedComponent';
import ConfirmationModalSharedComponent from '../../Shared/Components/ConfirmationModalSharedComponent';
import DeviceServiceRequestDetailModalController from './Components/DeviceServiceRequestDetailModalController';
import {
  DeviceServiceRequestItemType,
  ServiceRequestStatusType,
} from '../../Types/DeviceServiceRequestType';

// Static Presets for Dropdowns
const PRESET_SERVICE_CATEGORIES: CreatableSelectOption[] = [
  { value: 'Hardware Malfunction', label: 'Hardware Malfunction', sublabel: 'Component failure, broken hardware', icon: <Cpu className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
  { value: 'Battery & Power Issue', label: 'Battery & Power Issue', sublabel: 'Fast drain, not charging, swelling', icon: <Zap className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
  { value: 'Display & Screen Glitch', label: 'Display & Screen Glitch', sublabel: 'Flickering, lines, broken panel', icon: <Laptop className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
  { value: 'System Performance & Lag', label: 'System Performance & Lag', sublabel: 'Extreme slowdown, freeze, thermal throttling', icon: <Flame className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
  { value: 'Physical Damage & Spill', label: 'Physical Damage & Spill', sublabel: 'Dropped device, liquid contact, cracked case', icon: <AlertCircle className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
  { value: 'Peripheral & Docking Failure', label: 'Peripheral & Docking Failure', sublabel: 'Keyboard, trackpad, dock, hub issue', icon: <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
  { value: 'OS & Software Crash', label: 'OS & Software Crash', sublabel: 'Blue screen, boot loop, OS corruption', icon: <RefreshCw className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
  { value: 'Preventive Maintenance & Cleaning', label: 'Preventive Maintenance & Cleaning', sublabel: 'Fan cleaning, thermal paste, health audit', icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
];

const PRESET_COMPONENT_SUBTYPES: CreatableSelectOption[] = [
  { value: 'Battery / Power Cell', label: 'Battery / Power Cell' },
  { value: 'Display Panel / Screen', label: 'Display Panel / Screen' },
  { value: 'Keyboard & Key Switches', label: 'Keyboard & Key Switches' },
  { value: 'Trackpad & Touchpad', label: 'Trackpad & Touchpad' },
  { value: 'Motherboard / Logic Board', label: 'Motherboard / Logic Board' },
  { value: 'Cooling Fans & Thermals', label: 'Cooling Fans & Thermals' },
  { value: 'Chassis, Hinge & Case', label: 'Chassis, Hinge & Case' },
  { value: 'USB-C / Thunderbolt Ports', label: 'USB-C / Thunderbolt Ports' },
  { value: 'Power Adapter / Charger', label: 'Power Adapter / Charger' },
  { value: 'Webcam & Microphone', label: 'Webcam & Microphone' },
  { value: 'Storage Drive / SSD', label: 'Storage Drive / SSD' },
  { value: 'RAM / System Memory', label: 'RAM / System Memory' },
];

const PRESET_USABILITY_STATES: CreatableSelectOption[] = [
  { value: 'Completely Inoperable / Dead', label: 'Completely Inoperable / Dead', sublabel: 'Cannot power on or unusable' },
  { value: 'Intermittently Usable / Crashes', label: 'Intermittently Usable / Crashes', sublabel: 'Works sporadically but disrupts work' },
  { value: 'Usable with Workarounds', label: 'Usable with Workarounds', sublabel: 'Operational but with noticeable impairments' },
  { value: 'Minor Cosmetic / Non-Blocking', label: 'Minor Cosmetic / Non-Blocking', sublabel: 'Fully functional, cosmetic issue' },
];

const PRESET_SERVICE_CHANNELS: CreatableSelectOption[] = [
  { value: 'On-Site IT Service Desk Drop-Off', label: 'On-Site IT Desk Drop-Off', sublabel: 'Drop off at internal IT counter' },
  { value: 'Courier / Remote Shipping Pickup', label: 'Courier Pickup & Shipping', sublabel: 'Remote employee courier dispatch' },
  { value: 'Desk Field Technician Visit', label: 'Desk Technician Visit', sublabel: 'IT tech inspects at employee desk' },
  { value: 'Loaner Unit Required First', label: 'Loaner Unit Required First', sublabel: 'Issue loaner laptop prior to servicing' },
];

const PRESET_URGENCY_LEVELS: CreatableSelectOption[] = [
  { value: 'LOW', label: 'LOW - Standard Maintenance', sublabel: 'Non-blocking, scheduled service' },
  { value: 'MEDIUM', label: 'MEDIUM - Operational Disruption', sublabel: 'Normal business priority (Default)' },
  { value: 'HIGH', label: 'HIGH - Urgent Work Blocker', sublabel: 'Critical blocker for employee tasks' },
  { value: 'CRITICAL', label: 'CRITICAL - Executive / Outage', sublabel: 'Immediate emergency turnaround' },
];

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending Review' },
  { value: 'IN_REVIEW', label: 'In Review' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const URGENCY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'All Urgencies' },
  { value: 'LOW', label: 'Low Priority' },
  { value: 'MEDIUM', label: 'Medium Priority' },
  { value: 'HIGH', label: 'High Priority' },
  { value: 'CRITICAL', label: 'Critical / Emergency' },
];

export default function DeviceServiceRequestScreenController(): React.JSX.Element {
  const currentUser = useAuthenticationStateStore((state) => state.user);
  const isOperatorOrHigher = currentUser?.role && currentUser.role !== 'USER';

  // Queries
  const { data: employees = [] } =
    TanstackQueryClientService.current.employees.useEmployeesQuery();
  const { data: allAssets = [] } =
    TanstackQueryClientService.current.assets.useAssetsQuery();
  const { data: workLocationsList = [] } =
    TanstackQueryClientService.current.configuration.useWorkLocationsQuery();
  const { data: requests = [], isLoading: isLoadingRequests } =
    TanstackQueryClientService.current.deviceServiceRequests.useDeviceServiceRequestsQuery();

  const createMutation =
    TanstackQueryClientService.current.deviceServiceRequests.useCreateDeviceServiceRequestMutation();
  const updateStatusMutation =
    TanstackQueryClientService.current.deviceServiceRequests.useUpdateDeviceServiceRequestStatusMutation();
  const adminUpdateMutation =
    TanstackQueryClientService.current.deviceServiceRequests.useAdminUpdateDeviceServiceRequestMutation();

  const isAdminOrDeveloper = currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPER';

  // Form State
  const [selectedTargetUserId, setSelectedTargetUserId] = useState<string>(
    currentUser?.id || ''
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [assetTag, setAssetTag] = useState<string>('');
  const [assetName, setAssetName] = useState<string>('');

  const [serviceCategory, setServiceCategory] = useState<string>('Hardware Malfunction');
  const [componentSubtype, setComponentSubtype] = useState<string>('Display Panel / Screen');
  const [usabilityState, setUsabilityState] = useState<string>('Intermittently Usable / Crashes');
  const [serviceChannel, setServiceChannel] = useState<string>('On-Site IT Service Desk Drop-Off');
  const [urgency, setUrgency] = useState<string>('MEDIUM');
  const [workLocation, setWorkLocation] = useState<string>('');
  const [descriptionText, setDescriptionText] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  // Filter and Inspect State
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('ALL');
  const [historyUrgencyFilter, setHistoryUrgencyFilter] = useState<string>('ALL');
  const [inspectingRequest, setInspectingRequest] = useState<DeviceServiceRequestItemType | null>(null);

  // View Modes & Preferences (Table vs Grid)
  const [viewMode, setViewModeState] = useState<'table' | 'grid'>(() =>
    UserPreferencesUtility.current.getDeviceServiceRequestsViewMode('table')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getDeviceServiceRequestsGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getDeviceServiceRequestsSingleLine(true)
  );

  const setViewMode = (mode: 'table' | 'grid') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setDeviceServiceRequestsViewMode(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setDeviceServiceRequestsGridColumns(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setDeviceServiceRequestsSingleLine(val);
  };

  // Handle Status Update (Operator+)
  const handleUpdateStatus = async (newStatus: ServiceRequestStatusType, notes?: string) => {
    if (!inspectingRequest) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: inspectingRequest.id,
        input: {
          status: newStatus,
          resolutionNotes: notes?.trim() || undefined,
        },
      });
      toast.success(`Request ${inspectingRequest.requestNumber} status changed to ${newStatus}.`);
      setInspectingRequest((prev) => (prev ? { ...prev, status: newStatus, resolutionNotes: notes?.trim() || prev.resolutionNotes } : null));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update request status.');
    }
  };

  // Handle Admin & Developer Full Edit
  const handleAdminUpdate = async (input: import('../../Types/DeviceServiceRequestType').AdminUpdateDeviceServiceRequestInput) => {
    if (!inspectingRequest) return;
    try {
      const updated = await adminUpdateMutation.mutateAsync({
        id: inspectingRequest.id,
        input,
      });
      toast.success(`Service request #${updated.requestNumber} updated successfully.`);
      setInspectingRequest(updated);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service request.');
    }
  };

  // Target User Options for Operator+
  const targetUserOptions: CreatableSelectOption[] = useMemo(() => {
    return employees.map((emp) => ({
      value: emp.id,
      label: emp.name,
      sublabel: `${emp.email} • ${emp.department} • ${emp.employeeCode || 'EMP'}`,
      icon: <User className="w-3.5 h-3.5 text-slate-400" />,
    }));
  }, [employees]);

  // Selected Target User Object
  const selectedTargetUser = useMemo(() => {
    if (!isOperatorOrHigher) return currentUser;
    const found = employees.find((e) => e.id === selectedTargetUserId);
    if (found) {
      return {
        id: found.id,
        fullName: found.name,
        email: found.email,
        department: found.department,
      };
    }
    return currentUser;
  }, [isOperatorOrHigher, employees, selectedTargetUserId, currentUser]);

  // Devices assigned to the selected target user
  const assignedDeviceOptions: CreatableSelectOption[] = useMemo(() => {
    const targetId = selectedTargetUser?.id;
    const targetName = selectedTargetUser?.fullName?.toLowerCase();
    const targetEmail = selectedTargetUser?.email?.toLowerCase();

    const userAssets = allAssets.filter((a) => {
      if (targetId && a.assignedToEmployeeId === targetId) return true;
      if (targetName && a.assignedToEmployeeName?.toLowerCase().includes(targetName)) return true;
      if (targetEmail && a.assignedToEmployeeName?.toLowerCase().includes(targetEmail)) return true;
      return false;
    });

    return userAssets.map((asset) => ({
      value: asset.id,
      label: `${asset.assetNumber} - ${asset.model || asset.deviceName || 'Hardware Device'}`,
      sublabel: `${asset.category} • S/N: ${asset.serialNumber || 'N/A'} • ${asset.currentLocation || 'Assigned'}`,
      icon: <Laptop className="w-3.5 h-3.5 text-blue-500" />,
    }));
  }, [allAssets, selectedTargetUser]);

  // Work Location Options
  const workLocationOptions: CreatableSelectOption[] = useMemo(() => {
    if (workLocationsList && workLocationsList.length > 0) {
      return workLocationsList.map((loc: string) => ({
        value: loc,
        label: loc,
        icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />,
      }));
    }
    return [
      { value: 'Austin Silicon Labs - TX', label: 'Austin Silicon Labs - TX', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
      { value: 'San Jose Technology Park - CA', label: 'San Jose Technology Park - CA', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
      { value: 'London High Street Office - UK', label: 'London High Street Office - UK', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
      { value: 'Remote / Work From Home', label: 'Remote / Work From Home', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
    ];
  }, [workLocationsList]);

  // When asset selection changes
  const handleDeviceChange = (selectedVal: string) => {
    setSelectedAssetId(selectedVal);
    const matched = allAssets.find((a) => a.id === selectedVal);
    if (matched) {
      setAssetTag(matched.assetNumber);
      setAssetName(`${matched.manufacturer || ''} ${matched.model || matched.deviceName || 'Device'}`.trim());
    } else {
      setAssetTag(selectedVal);
      setAssetName(selectedVal);
    }
  };

  // Pre-select first assigned device if available
  useEffect(() => {
    if (assignedDeviceOptions.length > 0 && !selectedAssetId) {
      handleDeviceChange(assignedDeviceOptions[0].value);
    }
  }, [assignedDeviceOptions, selectedAssetId]);

  // Pre-select first work location from backend query if not already selected
  useEffect(() => {
    if (workLocationsList && workLocationsList.length > 0 && !workLocation) {
      setWorkLocation(workLocationsList[0]);
    }
  }, [workLocationsList, workLocation]);

  // Step 1: Validate Form & Open Confirmation Modal
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceCategory.trim()) {
      toast.error('Please select a service category.');
      return;
    }
    if (!componentSubtype.trim()) {
      toast.error('Please select a component subtype.');
      return;
    }
    if (!workLocation.trim()) {
      toast.error('Please select a work location.');
      return;
    }
    if (!descriptionText.trim() || descriptionText.trim().length < 10) {
      toast.error('Please provide a detailed technical problem description (at least 10 characters).');
      return;
    }

    setIsConfirmModalOpen(true);
  };

  // Step 2: Finalize Service Request Creation upon Confirmation
  const handleConfirmSubmitRequest = async () => {
    try {
      const newReq = await createMutation.mutateAsync({
        targetUserId: selectedTargetUser?.id || currentUser?.id,
        targetUserName: selectedTargetUser?.fullName || currentUser?.fullName,
        targetUserEmail: selectedTargetUser?.email || currentUser?.email,
        assetId: selectedAssetId || undefined,
        assetTag: assetTag || 'CUSTOM-TAG',
        assetName: assetName || 'Custom Equipment',
        serviceCategory,
        componentSubtype,
        usabilityState,
        serviceChannel,
        urgency,
        workLocation,
        descriptionRichText: descriptionText,
      });

      toast.success(
        `Device service request #${newReq?.requestNumber || ''} submitted successfully! An enterprise ticket has been opened.`
      );
      setDescriptionText('');
      setIsConfirmModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit device service request.');
    }
  };

  // Filtered Past Requests
  const filteredRequests = useMemo(() => {
    let list = requests;
    if (historyStatusFilter !== 'ALL') {
      list = list.filter((r) => r.status.toUpperCase() === historyStatusFilter.toUpperCase());
    }
    if (historyUrgencyFilter !== 'ALL') {
      list = list.filter((r) => r.urgency.toUpperCase() === historyUrgencyFilter.toUpperCase());
    }
    if (historySearchTerm.trim()) {
      const term = historySearchTerm.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.requestNumber.toLowerCase().includes(term) ||
          r.assetTag.toLowerCase().includes(term) ||
          r.assetName.toLowerCase().includes(term) ||
          r.serviceCategory.toLowerCase().includes(term) ||
          r.targetUserName.toLowerCase().includes(term) ||
          r.requesterName.toLowerCase().includes(term) ||
          (r.descriptionRichText && r.descriptionRichText.toLowerCase().includes(term))
      );
    }
    return list;
  }, [requests, historyStatusFilter, historyUrgencyFilter, historySearchTerm]);

  // Counts for metric counters
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status.toUpperCase() === 'PENDING').length;
  const inProgressCount = requests.filter((r) => r.status.toUpperCase() === 'IN_PROGRESS' || r.status.toUpperCase() === 'IN_REVIEW').length;
  const resolvedCount = requests.filter((r) => r.status.toUpperCase() === 'RESOLVED').length;

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-[#0C2086] dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60">
            <Search className="w-3 h-3" /> In Review
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-[#0C2086] dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60">
            <RefreshCw className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
            {status}
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgencyVal: string) => {
    switch (urgencyVal.toUpperCase()) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            HIGH
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700">
            LOW
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            MEDIUM
          </span>
        );
    }
  };

  const getUrgencyGradient = (urgencyVal: string) => {
    switch (urgencyVal?.toUpperCase()) {
      case 'CRITICAL':
        return 'from-rose-500 via-red-500 to-rose-600';
      case 'HIGH':
        return 'from-orange-500 via-amber-500 to-orange-500';
      case 'MEDIUM':
        return 'from-blue-500 via-indigo-500 to-blue-600';
      case 'LOW':
      default:
        return 'from-emerald-500 via-teal-400 to-emerald-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner (Structured identically to Employees & People page) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Device Service Request
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Enterprise hardware maintenance tickets, device repairs, and fulfillment tracking
          </p>
        </div>

        {/* Action Controls & Metric Counters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {isLoadingRequests ? '...' : totalCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Tickets
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 font-mono">
                {isLoadingRequests ? '...' : pendingCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Pending
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block" />

            <div className="hidden sm:flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {isLoadingRequests ? '...' : resolvedCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Full-Width Service Request Form */}
      <form
        onSubmit={handleSubmitRequest}
        className="w-full rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              New Device Service Request Form
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
              Fill in the technical parameters below to register an enterprise hardware service request.
            </p>
          </div>
        </div>

        {/* Row 1: Target Employee (Operator+) vs Requester Profile */}
        {isOperatorOrHigher ? (
          <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-200/80 dark:border-zinc-800">
            <CreatableCustomSelectSharedComponent
              label="Target Employee / Requester"
              required
              value={selectedTargetUserId}
              options={targetUserOptions}
              onChange={(val) => setSelectedTargetUserId(val)}
              placeholder="Select an enterprise employee..."
              searchPlaceholder="Search employees by name, email, department, code..."
              enableCustomCreation={false}
              enableSearch={true}
              helperText="Operator privilege: Select any registered enterprise employee to raise a hardware request on their behalf."
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 text-[#0C2086] dark:text-blue-400 flex items-center justify-center font-bold">
                {currentUser?.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {currentUser?.fullName || currentUser?.email}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  {currentUser?.email} • {currentUser?.role}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 font-medium">
              Self Requester
            </span>
          </div>
        )}

        {/* Row 2: Assigned Device Dropdown (Full Width) */}
        <div>
          <CreatableCustomSelectSharedComponent
            label="Assigned Device / Asset"
            required
            value={selectedAssetId}
            options={assignedDeviceOptions}
            onChange={handleDeviceChange}
            placeholder="Select assigned device or type custom asset tag..."
            searchPlaceholder="Search assigned devices or type custom asset number/serial..."
            helperText={
              assignedDeviceOptions.length === 0
                ? 'No assigned hardware registered for this employee. You can type a custom asset tag inline.'
                : `Displaying hardware assigned to ${selectedTargetUser?.fullName || 'user'}.`
            }
          />
        </div>

        {/* Row 3: Service Category & Component Subtype & Usability State (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreatableCustomSelectSharedComponent
            label="Service Category"
            required
            value={serviceCategory}
            options={PRESET_SERVICE_CATEGORIES}
            onChange={(val) => setServiceCategory(val)}
            placeholder="Select service category..."
            searchPlaceholder="Search categories or type custom..."
          />

          <CreatableCustomSelectSharedComponent
            label="Component Subtype / Fault Area"
            required
            value={componentSubtype}
            options={PRESET_COMPONENT_SUBTYPES}
            onChange={(val) => setComponentSubtype(val)}
            placeholder="Select component..."
            searchPlaceholder="Search components or type custom..."
          />

          <CreatableCustomSelectSharedComponent
            label="Device Usability State"
            required
            value={usabilityState}
            options={PRESET_USABILITY_STATES}
            onChange={(val) => setUsabilityState(val)}
            placeholder="Select usability state..."
          />
        </div>

        {/* Row 4: Service Channel & Urgency & Work Location (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreatableCustomSelectSharedComponent
            label="Preferred Service Channel"
            required
            value={serviceChannel}
            options={PRESET_SERVICE_CHANNELS}
            onChange={(val) => setServiceChannel(val)}
            placeholder="Select fulfillment channel..."
          />

          <CreatableCustomSelectSharedComponent
            label="Issue Urgency / Impact"
            required
            value={urgency}
            options={PRESET_URGENCY_LEVELS}
            onChange={(val) => setUrgency(val)}
            placeholder="Select priority level..."
          />

          <CreatableCustomSelectSharedComponent
            label="Current Work Location"
            required
            value={workLocation}
            options={workLocationOptions}
            onChange={(val) => setWorkLocation(val)}
            placeholder="Select location..."
            enableSearch={false}
            enableCustomCreation={false}
          />
        </div>

        {/* Row 5: Detailed Technical Problem Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-zinc-400 flex items-center justify-between">
            <span>
              Detailed Technical Problem Description & Diagnostic Notes <span className="text-rose-500 font-bold">*</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
              {descriptionText.length} characters
            </span>
          </label>
          <textarea
            rows={5}
            required
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            placeholder="Provide a comprehensive explanation of the issue, error codes, steps to reproduce, or diagnostic observations..."
            className="w-full p-3.5 text-xs bg-slate-50/50 dark:bg-zinc-800/40 border border-slate-300 dark:border-zinc-700/80 rounded-xl text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1.5 focus:ring-[#0C2086]/60 dark:focus:ring-blue-500/60 focus:bg-white dark:focus:bg-zinc-900 transition-all font-sans leading-relaxed resize-y min-h-[120px]"
          />
        </div>

        {/* Submit Footer */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800/80">
          <PrimaryActionButtonSharedComponent
            type="submit"
            label="Submit Service Request"
            disabled={createMutation.isPending}
            isLoading={createMutation.isPending}
            loadingText="Submitting Request..."
            icon={<Send className="w-3.5 h-3.5 !text-white" />}
          />
        </div>
      </form>

      {/* 2. Full-Width Past Requests History Table / Grid */}
      <div className="w-full rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-xs space-y-4">
        {/* History Header & Toolbar */}
        <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isOperatorOrHigher ? 'Enterprise Service Requests History' : 'My Service Requests History'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
              Showing {filteredRequests.length} of {totalCount} registered service ticket(s)
            </p>
          </div>

          {/* Line 1: Search Bar on Left + View Mode Switchers on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
                placeholder="Search ticket #, device, employee, issue..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#0C2086]/50 focus:border-[#0C2086]"
              />
            </div>

            {/* Right: Uniform Switchers (Matching Asset Inventory Management Page) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Grid Density Switcher (2 Col vs 3 Col) */}
              {viewMode === 'grid' && (
                <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
                  <button
                    type="button"
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
                    type="button"
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
                    type="button"
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
                    type="button"
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
                  type="button"
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
                  type="button"
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

          {/* Line 2: Secondary Dropdown Filters (Status & Urgency) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Status:</span>
                <CustomSelectSharedComponent
                  value={historyStatusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={(val) => setHistoryStatusFilter(val)}
                  size="sm"
                  className="w-40 sm:w-44"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Urgency:</span>
                <CustomSelectSharedComponent
                  value={historyUrgencyFilter}
                  options={URGENCY_FILTER_OPTIONS}
                  onChange={(val) => setHistoryUrgencyFilter(val)}
                  size="sm"
                  className="w-40 sm:w-48"
                />
              </div>
            </div>

            {(historyStatusFilter !== 'ALL' || historyUrgencyFilter !== 'ALL' || historySearchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setHistoryStatusFilter('ALL');
                  setHistoryUrgencyFilter('ALL');
                  setHistorySearchTerm('');
                }}
                className="text-xs text-slate-400 hover:text-[#0C2086] dark:hover:text-blue-400 font-medium cursor-pointer transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Urgency Color Legend Indicator (Matching User Registration Requests Page) */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-5 text-xs font-mono">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-semibold">
              Urgency Legend:
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-xs" />
              <span className="text-slate-700 dark:text-zinc-300 font-medium font-sans">Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 shadow-xs" />
              <span className="text-slate-700 dark:text-zinc-300 font-medium font-sans">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 shadow-xs" />
              <span className="text-slate-700 dark:text-zinc-300 font-medium font-sans">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 shadow-xs" />
              <span className="text-slate-700 dark:text-zinc-300 font-medium font-sans">Critical Emergency</span>
            </div>
          </div>
        </div>

        {/* Content Body: Table or Grid */}
        <div>
          {isLoadingRequests ? (
            <div className="p-12 text-center text-xs text-slate-400 dark:text-zinc-500 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0C2086] dark:text-blue-400" />
              <p>Loading service requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <EmptyStateSharedComponent
              icon={<Wrench className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
              title={
                historySearchTerm || historyStatusFilter !== 'ALL' || historyUrgencyFilter !== 'ALL'
                  ? 'No Matching Service Requests'
                  : 'No Service Requests in Registry'
              }
              description={
                historySearchTerm || historyStatusFilter !== 'ALL' || historyUrgencyFilter !== 'ALL'
                  ? 'No service tickets matched your active search query or filter parameters. Try clearing search filters or changing parameters.'
                  : 'Your enterprise hardware maintenance queue is currently empty. Submit your first service ticket using the form above.'
              }
            />
          ) : viewMode === 'table' ? (
            /* ========================================================================= */
            /* TABLE VIEW MODE                                                          */
            /* ========================================================================= */
            <div className="overflow-x-auto w-full">
              <table className={`w-full text-left text-xs border-collapse ${isSingleLineMode ? 'min-w-[1100px] whitespace-nowrap' : ''}`}>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-800/30">
                    <th className="py-3 px-4">Ticket #</th>
                    <th className="py-3 px-4">Beneficiary</th>
                    <th className="py-3 px-4">Device & Asset</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => setInspectingRequest(req)}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                    >
                      <td className={`py-3.5 px-4 font-mono font-bold text-[#0C2086] dark:text-blue-400 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                        {req.requestNumber}
                      </td>
                      <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {req.targetUserName}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                          {req.targetUserEmail}
                        </div>
                      </td>
                      <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                        <div className="font-medium text-slate-800 dark:text-zinc-200">
                          {req.assetName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                          {req.assetTag}
                        </div>
                      </td>
                      <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                        <div className="font-medium text-slate-800 dark:text-zinc-200">
                          {req.serviceCategory}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                          {req.componentSubtype}
                        </div>
                      </td>
                      <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                        {getUrgencyBadge(req.urgency)}
                      </td>
                      <td className={`py-3.5 px-4 ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                        {getStatusBadge(req.status)}
                      </td>
                      <td className={`py-3.5 px-4 text-slate-500 dark:text-zinc-400 text-[11px] ${isSingleLineMode ? 'whitespace-nowrap' : ''}`}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingRequest(req);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-[#0C2086] dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* ========================================================================= */
            /* GRID VIEW MODE (Matching User Registration Requests Top Accent Elegance)   */
            /* ========================================================================= */
            <div
              className={`grid grid-cols-1 ${
                gridColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
              } gap-4`}
            >
              {filteredRequests.map((req) => (
                <CardSharedComponent
                  key={req.id}
                  hoverable
                  onClick={() => setInspectingRequest(req)}
                  className="p-5 flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-xs"
                >
                  {/* Top Urgency Ambient Gradient Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getUrgencyGradient(req.urgency)}`}
                  />

                  {/* 1. Header: Ticket # & Status Badge */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="font-mono font-bold text-sm text-[#0C2086] dark:text-blue-400">
                      {req.requestNumber}
                    </span>
                    <div>
                      {getStatusBadge(req.status)}
                    </div>
                  </div>

                  {/* 2. Device Title & Asset Tag */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {req.assetName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                      <span className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px]">
                        {req.assetTag}
                      </span>
                      <span>•</span>
                      <span className="truncate">{req.serviceCategory}</span>
                    </div>
                  </div>

                  {/* 3. Beneficiary & Location Metadata Row */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1 text-[11px]">
                        <User className="w-3 h-3 text-slate-400" /> Beneficiary:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                        {req.targetUserName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" /> Facility:
                      </span>
                      <span className="font-medium text-slate-700 dark:text-zinc-300 truncate max-w-[150px]">
                        {req.workLocation}
                      </span>
                    </div>
                  </div>

                  {/* 4. Problem Description Snippet */}
                  <div className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 italic bg-slate-50/50 dark:bg-zinc-900/40 p-2 rounded-lg border border-slate-100 dark:border-zinc-800/60">
                    "{req.descriptionRichText.replace(/[#*`_]/g, '').trim()}"
                  </div>

                  {/* 5. Footer: Timestamp & Inspect Trigger */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
                    <span>
                      {new Date(req.createdAt).toLocaleDateString()} at{' '}
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingRequest(req);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-[#0C2086] dark:hover:text-blue-400 transition-colors font-medium cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </CardSharedComponent>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inspect Request Detail Modal */}
      <DeviceServiceRequestDetailModalController
        isOpen={Boolean(inspectingRequest)}
        request={inspectingRequest}
        isOperatorOrHigher={Boolean(isOperatorOrHigher)}
        isAdminOrDeveloper={Boolean(isAdminOrDeveloper)}
        workLocationOptions={workLocationOptions}
        isUpdatingStatus={updateStatusMutation.isPending}
        isSavingAdminEdit={adminUpdateMutation.isPending}
        onClose={() => setInspectingRequest(null)}
        onUpdateStatus={handleUpdateStatus}
        onAdminUpdate={handleAdminUpdate}
      />

      {/* Submission Confirmation Modal */}
      <ConfirmationModalSharedComponent
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmitRequest}
        title="Confirm Device Service Request"
        subtitle="Review the hardware issue summary before dispatching to IT support."
        description="Once confirmed, an enterprise IT service ticket will be registered and assigned to the hardware service desk."
        variant="primary"
        confirmText="Confirm & Submit"
        cancelText="Back to Edit"
        isLoading={createMutation.isPending}
        maxWidth="lg"
        additionalContent={
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/80 space-y-3 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-zinc-300">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 font-semibold block">
                  Target Requester
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedTargetUser?.fullName || currentUser?.fullName || 'Requester'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 font-semibold block">
                  Device / Hardware
                </span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {assetName || 'Custom Equipment'} ({assetTag || 'CUSTOM-TAG'})
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 font-semibold block">
                  Issue Category
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {serviceCategory}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 font-semibold block">
                  Component / Fault
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {componentSubtype}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 font-semibold block">
                  Urgency Priority
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {urgency}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 font-semibold block">
                  Work Location
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {workLocation || 'Standard Location'}
                </span>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
