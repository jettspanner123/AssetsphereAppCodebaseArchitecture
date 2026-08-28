import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  User,
  MapPin,
  Laptop,
  AlertCircle,
  FileText,
  ShieldCheck,
  RefreshCw,
  Send,
  Calendar,
  Cpu,
  Layers,
  Edit3,
  History,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
} from 'lucide-react';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../../Shared/Components/BadgeSharedComponent';
import CreatableCustomSelectSharedComponent, {
  CreatableSelectOption,
} from '../../../Shared/Components/CreatableCustomSelectSharedComponent';
import RichTextEditorSharedComponent from '../../../Shared/Components/RichTextEditorSharedComponent';
import {
  DeviceServiceRequestItemType,
  ServiceRequestStatusType,
  AdminUpdateDeviceServiceRequestInput,
  DeviceServiceRequestAuditItemType,
} from '../../../Types/DeviceServiceRequestType';

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
  { value: 'Display Panel / Screen', label: 'Display Panel / Screen' },
  { value: 'Internal Battery Unit', label: 'Internal Battery Unit' },
  { value: 'Keyboard & Trackpad Module', label: 'Keyboard & Trackpad Module' },
  { value: 'Motherboard & Logic Board', label: 'Motherboard & Logic Board' },
  { value: 'Cooling Fans & Thermal Heat Pipe', label: 'Cooling Fans & Thermal Heat Pipe' },
  { value: 'Storage Drive (NVMe SSD / SATA)', label: 'Storage Drive (NVMe SSD / SATA)' },
  { value: 'Power Adapter / MagSafe / USB-C Cable', label: 'Power Adapter / MagSafe / USB-C Cable' },
  { value: 'Thunderbolt / HDMI Ports', label: 'Thunderbolt / HDMI Ports' },
  { value: 'Audio DAC & Internal Speakers', label: 'Audio DAC & Internal Speakers' },
  { value: 'Integrated Camera & Microphone', label: 'Integrated Camera & Microphone' },
];

const PRESET_USABILITY_STATES: CreatableSelectOption[] = [
  { value: 'Intermittently Usable / Crashes', label: 'Intermittently Usable / Crashes' },
  { value: 'Fully Functional / Minor Defect', label: 'Fully Functional / Minor Defect' },
  { value: 'Completely Inoperable / Dead', label: 'Completely Inoperable / Dead' },
  { value: 'Cosmetic Imperfection Only', label: 'Cosmetic Imperfection Only' },
];

const PRESET_SERVICE_CHANNELS: CreatableSelectOption[] = [
  { value: 'On-Site IT Service Desk Drop-Off', label: 'On-Site IT Service Desk Drop-Off' },
  { value: 'Desk-Side Technician Dispatch', label: 'Desk-Side Technician Dispatch' },
  { value: 'Courier Pre-Paid Shipping Box', label: 'Courier Pre-Paid Shipping Box' },
  { value: 'Remote Diagnostics & Assistance', label: 'Remote Diagnostics & Assistance' },
];

const PRESET_URGENCY_LEVELS: CreatableSelectOption[] = [
  { value: 'LOW', label: 'LOW - Routine Maintenance / Non-Urgent' },
  { value: 'MEDIUM', label: 'MEDIUM - Daily workflow degraded' },
  { value: 'HIGH', label: 'HIGH - Work blocked, urgent resolution' },
  { value: 'CRITICAL', label: 'CRITICAL - Executive / Production emergency' },
];

const RICH_OPERATOR_STATUS_OPTIONS: CreatableSelectOption[] = [
  {
    value: 'PENDING',
    label: 'Pending Triage',
    sublabel: 'Awaiting initial operator review & priority assignment',
    icon: <Clock className="w-4 h-4 text-amber-500 shrink-0" />,
  },
  {
    value: 'IN_REVIEW',
    label: 'In Review',
    sublabel: 'Under active diagnostic investigation by IT service desk',
    icon: <Search className="w-4 h-4 text-blue-500 shrink-0" />,
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress / Repair',
    sublabel: 'Hardware bench servicing, parts replacement, or OS recovery',
    icon: <RefreshCw className="w-4 h-4 text-indigo-500 shrink-0" />,
  },
  {
    value: 'RESOLVED',
    label: 'Resolved & Operational',
    sublabel: 'All repairs completed, QA passed, and device returned',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  },
  {
    value: 'REJECTED',
    label: 'Rejected / Denied',
    sublabel: 'Request declined (out-of-warranty, unauthorized, duplicate)',
    icon: <XCircle className="w-4 h-4 text-rose-500 shrink-0" />,
  },
];

const PRESET_STATUS_OPTIONS: CreatableSelectOption[] = [
  { value: 'PENDING', label: 'PENDING - Awaiting Operator Review' },
  { value: 'IN_REVIEW', label: 'IN_REVIEW - Under Initial Triage' },
  { value: 'IN_PROGRESS', label: 'IN_PROGRESS - Hardware Repair in Progress' },
  { value: 'RESOLVED', label: 'RESOLVED - Diagnostics & Repair Complete' },
  { value: 'REJECTED', label: 'REJECTED - Request Denied' },
];

export interface DeviceServiceRequestDetailModalControllerProps {
  request: DeviceServiceRequestItemType | null;
  isOpen: boolean;
  isOperatorOrHigher?: boolean;
  isAdminOrDeveloper?: boolean;
  workLocationOptions?: CreatableSelectOption[];
  isUpdatingStatus?: boolean;
  isSavingAdminEdit?: boolean;
  onClose: () => void;
  onUpdateStatus?: (status: ServiceRequestStatusType, notes?: string) => Promise<void>;
  onAdminUpdate?: (input: AdminUpdateDeviceServiceRequestInput) => Promise<void>;
}

export default function DeviceServiceRequestDetailModalController({
  request,
  isOpen,
  isOperatorOrHigher = false,
  isAdminOrDeveloper = false,
  workLocationOptions,
  isUpdatingStatus = false,
  isSavingAdminEdit = false,
  onClose,
  onUpdateStatus,
  onAdminUpdate,
}: DeviceServiceRequestDetailModalControllerProps): React.JSX.Element {
  const [technicianNotes, setTechnicianNotes] = useState<string>('');
  const [selectedNewStatus, setSelectedNewStatus] = useState<ServiceRequestStatusType>(
    (request?.status as ServiceRequestStatusType) || 'PENDING'
  );
  const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showOriginalData, setShowOriginalData] = useState<boolean>(false);

  // Edit Form Fields
  const [editTargetUserName, setEditTargetUserName] = useState<string>('');
  const [editTargetUserEmail, setEditTargetUserEmail] = useState<string>('');
  const [editAssetTag, setEditAssetTag] = useState<string>('');
  const [editAssetName, setEditAssetName] = useState<string>('');
  const [editServiceCategory, setEditServiceCategory] = useState<string>('');
  const [editComponentSubtype, setEditComponentSubtype] = useState<string>('');
  const [editUsabilityState, setEditUsabilityState] = useState<string>('');
  const [editServiceChannel, setEditServiceChannel] = useState<string>('');
  const [editUrgency, setEditUrgency] = useState<string>('MEDIUM');
  const [editWorkLocation, setEditWorkLocation] = useState<string>('');
  const [editDescriptionRichText, setEditDescriptionRichText] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('PENDING');
  const [editResolutionNotes, setEditResolutionNotes] = useState<string>('');

  const lastRequestRef = React.useRef<DeviceServiceRequestItemType | null>(request);
  if (request) {
    lastRequestRef.current = request;
  }
  const displayRequest = request || lastRequestRef.current;
  const prevIsOpenRef = React.useRef(isOpen);

  // Initialize edit fields from displayRequest
  const syncEditFields = (req: DeviceServiceRequestItemType) => {
    if (req.status) {
      setSelectedNewStatus((req.status.toUpperCase() as ServiceRequestStatusType) || 'PENDING');
    }
    setEditTargetUserName(req.targetUserName || '');
    setEditTargetUserEmail(req.targetUserEmail || '');
    setEditAssetTag(req.assetTag || '');
    setEditAssetName(req.assetName || '');
    setEditServiceCategory(req.serviceCategory || 'Hardware Malfunction');
    setEditComponentSubtype(req.componentSubtype || 'Display Panel / Screen');
    setEditUsabilityState(req.usabilityState || 'Intermittently Usable / Crashes');
    setEditServiceChannel(req.serviceChannel || 'On-Site IT Service Desk Drop-Off');
    setEditUrgency(req.urgency ? req.urgency.toUpperCase() : 'MEDIUM');
    setEditWorkLocation(req.workLocation || 'Austin Silicon Labs - TX');
    setEditDescriptionRichText(req.descriptionRichText || '');
    setEditStatus(req.status ? req.status.toUpperCase() : 'PENDING');
    setEditResolutionNotes(req.resolutionNotes || '');
  };

  useEffect(() => {
    if (isOpen) {
      if (displayRequest) {
        syncEditFields(displayRequest);
        if (displayRequest.status) {
          setSelectedNewStatus((displayRequest.status.toUpperCase() as ServiceRequestStatusType) || 'PENDING');
        }
      }
    }
    if (isOpen && !prevIsOpenRef.current) {
      setExitDirection('down');
      setIsEditMode(false);
      setShowOriginalData(false);
      setTechnicianNotes('');
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, displayRequest?.id, displayRequest?.status]);

  // Parse edit history and original data if available
  const parsedAuditHistory: DeviceServiceRequestAuditItemType[] = useMemo(() => {
    if (!displayRequest?.editHistory) return [];
    try {
      return JSON.parse(displayRequest.editHistory) as DeviceServiceRequestAuditItemType[];
    } catch {
      return [];
    }
  }, [displayRequest?.editHistory]);

  const parsedOriginalData: any = useMemo(() => {
    if (!displayRequest?.originalData) return null;
    try {
      return JSON.parse(displayRequest.originalData);
    } catch {
      return null;
    }
  }, [displayRequest?.originalData]);

  if (!displayRequest) return <React.Fragment />;

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return (
          <BadgeSharedComponent variant="warning" size="sm">
            Pending Review
          </BadgeSharedComponent>
        );
      case 'IN_REVIEW':
        return (
          <BadgeSharedComponent variant="info" size="sm">
            In Review
          </BadgeSharedComponent>
        );
      case 'IN_PROGRESS':
        return (
          <BadgeSharedComponent variant="info" size="sm">
            In Progress
          </BadgeSharedComponent>
        );
      case 'RESOLVED':
        return (
          <BadgeSharedComponent variant="success" size="sm">
            Resolved
          </BadgeSharedComponent>
        );
      case 'REJECTED':
        return (
          <BadgeSharedComponent variant="danger" size="sm">
            Rejected
          </BadgeSharedComponent>
        );
      default:
        return (
          <BadgeSharedComponent variant="neutral" size="sm">
            {status}
          </BadgeSharedComponent>
        );
    }
  };

  const getUrgencyBadge = (urgencyVal: string) => {
    switch (urgencyVal.toUpperCase()) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            HIGH
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700">
            LOW
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            MEDIUM
          </span>
        );
    }
  };

  const handleCloseButton = () => {
    setExitDirection('up');
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleStatusAction = async (status: ServiceRequestStatusType) => {
    if (!onUpdateStatus) return;
    setExitDirection('up');
    try {
      await onUpdateStatus(status, technicianNotes.trim() || undefined);
      setTechnicianNotes('');
      setTimeout(() => {
        onClose();
      }, 0);
    } catch {
      // Keep modal open if update fails
    }
  };

  const handleStartEdit = () => {
    syncEditFields(displayRequest);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    syncEditFields(displayRequest);
    setIsEditMode(false);
  };

  const handleSaveAdminEdit = async () => {
    if (!onAdminUpdate) return;
    await onAdminUpdate({
      targetUserName: editTargetUserName.trim() || displayRequest.targetUserName,
      targetUserEmail: editTargetUserEmail.trim() || displayRequest.targetUserEmail,
      assetTag: editAssetTag.trim() || displayRequest.assetTag,
      assetName: editAssetName.trim() || displayRequest.assetName,
      serviceCategory: editServiceCategory,
      componentSubtype: editComponentSubtype,
      usabilityState: editUsabilityState,
      serviceChannel: editServiceChannel,
      urgency: editUrgency,
      workLocation: editWorkLocation,
      descriptionRichText: editDescriptionRichText,
      status: editStatus,
      resolutionNotes: editResolutionNotes.trim() || undefined,
    });
    setIsEditMode(false);
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket #${displayRequest.requestNumber}`}
      subtitle={`Submitted on ${new Date(displayRequest.createdAt).toLocaleDateString()} at ${new Date(
        displayRequest.createdAt
      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Requester: ${displayRequest.requesterName}`}
      maxWidth="3xl"
      scrollMode="backdrop"
      animationType="slide-up"
      exitDirection={exitDirection}
      headerCloseDirection="down"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ButtonSharedComponent
              variant="outline"
              size="sm"
              onClick={handleCloseButton}
            >
              Close
            </ButtonSharedComponent>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Mode Save / Cancel Controls */}
            {isEditMode ? (
              <>
                <ButtonSharedComponent
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSavingAdminEdit}
                >
                  Cancel Editing
                </ButtonSharedComponent>
                <ButtonSharedComponent
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAdminEdit}
                  disabled={isSavingAdminEdit}
                  className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
                  icon={<CheckCircle2 className="w-3.5 h-3.5 !text-white" />}
                >
                  <span className="!text-white font-medium">
                    {isSavingAdminEdit ? 'Saving Changes...' : 'Save Changes'}
                  </span>
                </ButtonSharedComponent>
              </>
            ) : (
              <>
                {/* Admin / Developer Edit Trigger */}
                {isAdminOrDeveloper && (
                  <ButtonSharedComponent
                    variant="outline"
                    size="sm"
                    onClick={handleStartEdit}
                    className="hover:border-blue-300 hover:text-[#0C2086] dark:hover:text-blue-400 font-medium"
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Edit Details
                  </ButtonSharedComponent>
                )}

                {/* Operator Ticket Update Action */}
                {isOperatorOrHigher && (
                  <ButtonSharedComponent
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusAction(selectedNewStatus)}
                    disabled={isUpdatingStatus || (selectedNewStatus === displayRequest.status && !technicianNotes.trim())}
                    className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold cursor-pointer"
                    icon={
                      isUpdatingStatus ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 !text-white" />
                      )
                    }
                  >
                    <span className="!text-white font-medium">
                      {isUpdatingStatus ? 'Updating Ticket...' : 'Update Ticket'}
                    </span>
                  </ButtonSharedComponent>
                )}
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-xs">
        {/* Top Status & Urgency Metadata Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/80">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-zinc-400">
              Status & Priority:
            </span>
            {getStatusBadge(displayRequest.status)}
            {getUrgencyBadge(displayRequest.urgency)}
            {isEditMode && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono">
                Admin Edit Mode Active
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            Ticket ID: <span className="font-semibold text-slate-700 dark:text-zinc-300">#{displayRequest.requestNumber}</span>
          </div>
        </div>
        {/* ========================================================================= */}
        {/* READ ONLY INSPECTION VIEW                                                 */}
        {/* ========================================================================= */}
        {!isEditMode ? (
          <>
            {/* Section 1: Ticket Overview & Custody (Max 3 Cards per Row on Large Screens) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  1. Requester & Custody Information
                </h4>
                {parsedOriginalData && (
                  <button
                    type="button"
                    onClick={() => setShowOriginalData(!showOriginalData)}
                    className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {showOriginalData ? 'Hide Original Baseline' : 'View Original Baseline'}
                  </button>
                )}
              </div>

              {/* Original Snapshot Collapsible Banner */}
              {showOriginalData && parsedOriginalData && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Original User Submission Snapshot:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-[10px]">
                    <div>Beneficiary: <span className="font-semibold text-slate-900 dark:text-white">{parsedOriginalData.targetUserName}</span></div>
                    <div>Asset: <span className="font-semibold text-slate-900 dark:text-white">{parsedOriginalData.assetTag} ({parsedOriginalData.assetName})</span></div>
                    <div>Category: <span className="font-semibold text-slate-900 dark:text-white">{parsedOriginalData.serviceCategory}</span></div>
                    <div>Urgency: <span className="font-semibold text-slate-900 dark:text-white">{parsedOriginalData.urgency}</span></div>
                    <div>Location: <span className="font-semibold text-slate-900 dark:text-white">{parsedOriginalData.workLocation}</span></div>
                    <div>Channel: <span className="font-semibold text-slate-900 dark:text-white">{parsedOriginalData.serviceChannel}</span></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] text-slate-400 font-mono block">Beneficiary / User</span>
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">
                    {displayRequest.targetUserName}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
                    {displayRequest.targetUserEmail}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] text-slate-400 font-mono block">Logged Requester</span>
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">
                    {displayRequest.requesterName}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
                    {displayRequest.requesterEmail}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] text-slate-400 font-mono block">Work Location</span>
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">
                    {displayRequest.workLocation}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">
                    Primary Facility
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] text-slate-400 font-mono block">Service Channel</span>
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">
                    {displayRequest.serviceChannel}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">
                    Preferred Channel
                  </span>
                </div>

                {displayRequest.updatedBy && (
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40">
                    <span className="text-[10px] text-blue-500 font-mono block">Last Modified By</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-300 block truncate">
                      {displayRequest.updatedBy}
                    </span>
                    <span className="text-[10px] text-blue-400 dark:text-blue-400 block truncate">
                      {displayRequest.updatedAt ? new Date(displayRequest.updatedAt).toLocaleString() : 'Recently'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Hardware Specs & Fault Area (15px top margin) */}
            <div className="space-y-3 mt-[15px]">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[35px]">
                <Laptop className="w-3.5 h-3.5 text-blue-500" />
                2. Hardware Details & Fault Classification
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] text-slate-400 font-mono block">Device / Asset Tag</span>
                  <span className="font-semibold font-mono text-[#0C2086] dark:text-blue-400 block truncate">
                    {displayRequest.assetTag}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate mt-0.5">
                    {displayRequest.assetName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] text-slate-400 font-mono block">Service Category</span>
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">
                    {displayRequest.serviceCategory}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate mt-0.5">
                    Subtype: {displayRequest.componentSubtype}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] text-slate-400 font-mono block">Device Usability State</span>
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">
                    {displayRequest.usabilityState}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block mt-0.5">
                    Operational Impact
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Diagnostic Problem Notes (15px top margin) */}
            <div className="space-y-3 mt-[35px]">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[35px]">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                3. Diagnostic Notes & Problem Description
              </h4>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 font-sans leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-zinc-200">
                {displayRequest.descriptionRichText}
              </div>
            </div>

            {/* Section 4: Resolution & Operator Actions (15px top margin) */}
            <div className="space-y-3 mt-[15px]">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[35px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                4. Resolution & Operator Workflow
              </h4>

              {/* Existing Resolution Notes */}
              {displayRequest.resolutionNotes && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300">
                  <span className="text-[10px] font-bold uppercase font-mono block text-emerald-700 dark:text-emerald-400 mb-1">
                    Technician Resolution Log:
                  </span>
                  <p className="font-sans leading-relaxed">{displayRequest.resolutionNotes}</p>
                </div>
              )}

              {/* Operator Action Controls */}
              {isOperatorOrHigher && (
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/30 border border-slate-200/80 dark:border-zinc-800 space-y-4">
                  {/* Line 1: Status Selection Dropdown (Full Width) */}
                  <div>
                    <CreatableCustomSelectSharedComponent
                      label="Update Ticket Lifecycle Status"
                      required
                      value={selectedNewStatus}
                      options={RICH_OPERATOR_STATUS_OPTIONS}
                      onChange={(val) => setSelectedNewStatus(val as ServiceRequestStatusType)}
                      enableCustomCreation={false}
                      enableSearch={false}
                      helperText="Select a lifecycle state to transition the hardware ticket workflow."
                    />
                  </div>

                  {/* Line 2: Technician Notes Textarea (Full Width, Expanded Height) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block">
                      Technician / Operational Notes
                    </label>
                    <textarea
                      rows={4}
                      value={technicianNotes}
                      onChange={(e) => setTechnicianNotes(e.target.value)}
                      placeholder="Enter diagnostic findings, bench repair logs, parts replaced, or resolution summary..."
                      className="w-full p-3 text-xs bg-white dark:bg-zinc-900/80 border border-slate-300 dark:border-zinc-700/80 rounded-xl text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1.5 focus:ring-[#0C2086]/50 focus:border-[#0C2086] transition-all font-sans leading-relaxed resize-y min-h-[95px]"
                    />
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                      Notes will be logged into the permanent revision audit trail and shown upon ticket inspection.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Admin & Developer Audit History Log (15px top margin) */}
            {parsedAuditHistory.length > 0 && (
              <div className="space-y-3 mt-[15px]">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
                  <History className="w-3.5 h-3.5 text-blue-500" />
                  5. Modification & Revision Audit Trail ({parsedAuditHistory.length} Revisions)
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {parsedAuditHistory.map((audit, idx) => (
                    <div
                      key={audit.editId || idx}
                      className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-700/60 text-[11px] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{audit.editorName}</span>
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-sm bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {audit.editorRole}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(audit.editedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-zinc-300 font-mono text-[10px] leading-tight">
                        {audit.changesSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* ========================================================================= */
          /* ADMIN & DEVELOPER EDIT MODE FORM                                         */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Edit Section 1: Beneficiary & Work Logistics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
                <User className="w-3.5 h-3.5 text-blue-500" />
                1. Edit Requester & Logistics Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Beneficiary Full Name
                  </label>
                  <input
                    type="text"
                    value={editTargetUserName}
                    onChange={(e) => setEditTargetUserName(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0C2086]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Beneficiary Email
                  </label>
                  <input
                    type="email"
                    value={editTargetUserEmail}
                    onChange={(e) => setEditTargetUserEmail(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0C2086]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Work Location
                  </label>
                  <CreatableCustomSelectSharedComponent
                    value={editWorkLocation}
                    options={
                      workLocationOptions && workLocationOptions.length > 0
                        ? workLocationOptions
                        : [
                            { value: 'Austin Silicon Labs - TX', label: 'Austin Silicon Labs - TX', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
                            { value: 'San Jose Technology Park - CA', label: 'San Jose Technology Park - CA', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
                            { value: 'London High Street Office - UK', label: 'London High Street Office - UK', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
                            { value: 'Remote / Work From Home', label: 'Remote / Work From Home', icon: <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> },
                          ]
                    }
                    onChange={setEditWorkLocation}
                    enableSearch={false}
                    enableCustomCreation={false}
                    size="sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Preferred Service Channel
                  </label>
                  <CreatableCustomSelectSharedComponent
                    value={editServiceChannel}
                    options={PRESET_SERVICE_CHANNELS}
                    onChange={setEditServiceChannel}
                    size="sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Urgency Priority Level
                  </label>
                  <CreatableCustomSelectSharedComponent
                    value={editUrgency}
                    options={PRESET_URGENCY_LEVELS}
                    onChange={setEditUrgency}
                    size="sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Ticket Lifecycle Status
                  </label>
                  <CreatableCustomSelectSharedComponent
                    value={editStatus}
                    options={PRESET_STATUS_OPTIONS}
                    onChange={setEditStatus}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Edit Section 2: Hardware & Classification */}
            <div className="space-y-3 mt-[15px]">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
                <Laptop className="w-3.5 h-3.5 text-blue-500" />
                2. Edit Hardware & Component Diagnostics
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Asset Identifier / Tag
                  </label>
                  <input
                    type="text"
                    value={editAssetTag}
                    onChange={(e) => setEditAssetTag(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-[#0C2086]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Device Model Title
                  </label>
                  <input
                    type="text"
                    value={editAssetName}
                    onChange={(e) => setEditAssetName(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0C2086]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Service Category
                  </label>
                  <CreatableCustomSelectSharedComponent
                    value={editServiceCategory}
                    options={PRESET_SERVICE_CATEGORIES}
                    onChange={setEditServiceCategory}
                    size="sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Fault Component Subtype
                  </label>
                  <CreatableCustomSelectSharedComponent
                    value={editComponentSubtype}
                    options={PRESET_COMPONENT_SUBTYPES}
                    onChange={setEditComponentSubtype}
                    size="sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    Device Usability State
                  </label>
                  <CreatableCustomSelectSharedComponent
                    value={editUsabilityState}
                    options={PRESET_USABILITY_STATES}
                    onChange={setEditUsabilityState}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Edit Section 3: Rich Problem Description */}
            <div className="space-y-3 mt-[15px]">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                3. Edit Diagnostic Notes & Problem Description
              </h4>

              <RichTextEditorSharedComponent
                value={editDescriptionRichText}
                onChange={setEditDescriptionRichText}
                placeholder="Enter complete Markdown technical diagnosis..."
                minHeight="140px"
              />
            </div>

            {/* Edit Section 4: Resolution Notes */}
            <div className="space-y-3 mt-[15px]">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                4. Edit Resolution Notes
              </h4>

              <input
                type="text"
                value={editResolutionNotes}
                onChange={(e) => setEditResolutionNotes(e.target.value)}
                placeholder="Enter technical resolution logs or admin override notes..."
                className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-[#0C2086]"
              />
            </div>
          </div>
        )}
      </div>
    </ModalSharedComponent>
  );
}
