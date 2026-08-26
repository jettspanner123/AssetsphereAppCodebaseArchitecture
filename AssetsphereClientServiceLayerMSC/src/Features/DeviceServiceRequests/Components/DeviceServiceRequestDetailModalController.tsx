import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../../Shared/Components/BadgeSharedComponent';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';
import {
  DeviceServiceRequestItemType,
  ServiceRequestStatusType,
} from '../../../Types/DeviceServiceRequestType';

export interface DeviceServiceRequestDetailModalControllerProps {
  request: DeviceServiceRequestItemType | null;
  isOpen: boolean;
  isOperatorOrHigher?: boolean;
  isUpdatingStatus?: boolean;
  onClose: () => void;
  onUpdateStatus?: (status: ServiceRequestStatusType, notes?: string) => Promise<void>;
}

export default function DeviceServiceRequestDetailModalController({
  request,
  isOpen,
  isOperatorOrHigher = false,
  isUpdatingStatus = false,
  onClose,
  onUpdateStatus,
}: DeviceServiceRequestDetailModalControllerProps): React.JSX.Element {
  const [technicianNotes, setTechnicianNotes] = useState<string>('');
  const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down');

  const lastRequestRef = React.useRef<DeviceServiceRequestItemType | null>(request);
  if (request) {
    lastRequestRef.current = request;
  }
  const displayRequest = request || lastRequestRef.current;
  const prevIsOpenRef = React.useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setExitDirection('down');
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

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

  const handleDismissButton = () => {
    setExitDirection('up');
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleStatusAction = async (status: ServiceRequestStatusType) => {
    if (!onUpdateStatus) return;
    setExitDirection('up');
    await onUpdateStatus(status, technicianNotes.trim() || undefined);
    setTechnicianNotes('');
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="font-serif-headline font-bold text-slate-900 dark:text-white">
            Ticket #{displayRequest.requestNumber}
          </span>
          {getStatusBadge(displayRequest.status)}
          {getUrgencyBadge(displayRequest.urgency)}
        </div>
      }
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
            <ButtonSharedComponent
              variant="ghost"
              size="sm"
              onClick={handleDismissButton}
              className="text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Dismiss
            </ButtonSharedComponent>
          </div>

          {isOperatorOrHigher && displayRequest.status !== 'RESOLVED' && displayRequest.status !== 'REJECTED' && (
            <div className="flex items-center gap-2">
              <ButtonSharedComponent
                variant="primary"
                size="sm"
                onClick={() => handleStatusAction('RESOLVED')}
                disabled={isUpdatingStatus}
                className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
                icon={<CheckCircle2 className="w-3.5 h-3.5 !text-white" />}
              >
                <span className="!text-white font-medium">Resolve Ticket</span>
              </ButtonSharedComponent>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6 text-xs">
        {/* Section 1: Ticket Overview & Custody (Max 3 Cards per Row on Large Screens) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <User className="w-3.5 h-3.5 text-blue-500" />
            1. Requester & Custody Information
          </h4>

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
          </div>
        </div>

        {/* Section 2: Hardware Specs & Fault Area (15px top margin) */}
        <div className="space-y-3 mt-[15px]">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
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
        <div className="space-y-3 mt-[15px]">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            3. Diagnostic Notes & Problem Description
          </h4>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 font-sans leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-zinc-200">
            {displayRequest.descriptionRichText}
          </div>
        </div>

        {/* Section 4: Resolution & Operator Actions (15px top margin) */}
        <div className="space-y-3 mt-[15px]">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
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
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/30 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                Technician / Operational Notes
              </label>

              <input
                type="text"
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                placeholder="Enter technician diagnostic findings, repair logs, or comments..."
                className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <ButtonSharedComponent
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusAction('IN_REVIEW')}
                  disabled={isUpdatingStatus || displayRequest.status === 'IN_REVIEW'}
                  className="hover:border-blue-300 hover:text-blue-600"
                >
                  Mark In Review
                </ButtonSharedComponent>

                <ButtonSharedComponent
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusAction('IN_PROGRESS')}
                  disabled={isUpdatingStatus || displayRequest.status === 'IN_PROGRESS'}
                  className="hover:border-blue-300 hover:text-[#0C2086]"
                >
                  Mark In Progress
                </ButtonSharedComponent>

                <ButtonSharedComponent
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusAction('RESOLVED')}
                  disabled={isUpdatingStatus || displayRequest.status === 'RESOLVED'}
                  className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
                  icon={<CheckCircle2 className="w-3.5 h-3.5 !text-white" />}
                >
                  <span className="!text-white font-medium">Resolve Ticket</span>
                </ButtonSharedComponent>

                <ButtonSharedComponent
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusAction('REJECTED')}
                  disabled={isUpdatingStatus || displayRequest.status === 'REJECTED'}
                  className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-300"
                >
                  Reject Request
                </ButtonSharedComponent>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalSharedComponent>
  );
}
