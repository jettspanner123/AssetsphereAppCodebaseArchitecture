import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  Mail,
  Calendar,
  Check,
  X,
  Grid,
  List,
  Maximize2,
  WrapText,
} from 'lucide-react';
import { PendingUserType } from '@/src/Types';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../Shared/Components/CustomSelectSharedComponent';
import ConfirmationModalSharedComponent from '../../Shared/Components/ConfirmationModalSharedComponent';
import EmptyStateSharedComponent from '../../Shared/Components/EmptyStateSharedComponent';
import PermissionGuardSharedComponent from '../../Shared/Components/PermissionGuardSharedComponent';
import ApplicationPermissionCON from '../../Constants/ApplicationPermissionCON';
import TanstackQueryClientService from '../../Services/TanstackQueryClientService';

import ApproveUserSetupModalController from './Components/ApproveUserSetupModalController';

const statusOptions: SelectOption[] = [
  { value: 'pending', label: 'Pending Requests', sublabel: 'Awaiting operator review' },
  { value: 'approved', label: 'Approved Users', sublabel: 'Verified active accounts' },
  { value: 'rejected', label: 'Rejected Requests', sublabel: 'Declined registrations' },
  { value: 'all', label: 'All Requests', sublabel: 'Complete history' },
];

export default function UserRequestsScreenController(): React.JSX.Element {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridColumns, setGridColumns] = useState<2 | 3>(2);
  const [isSingleLineMode, setIsSingleLineMode] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Setup / Approval Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [userToApprove, setUserToApprove] = useState<PendingUserType | null>(null);

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [userToReject, setUserToReject] = useState<PendingUserType | null>(null);

  // Fetch live user requests from backend with status filter
  const {
    data: pendingUsers = [],
    isLoading,
    isRefetching,
  } = TanstackQueryClientService.current.authentication.usePendingUsersQuery(statusFilter);

  // Reject Mutation
  const rejectMutation = TanstackQueryClientService.current.authentication.useRejectUserMutation();

  const handleOpenApproveModal = (user: PendingUserType) => {
    setUserToApprove(user);
    setIsApproveModalOpen(true);
  };

  const handleOpenRejectModal = (user: PendingUserType) => {
    setUserToReject(user);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!userToReject) return;
    await rejectMutation.mutateAsync(userToReject.id);
    setIsRejectModalOpen(false);
    setUserToReject(null);
  };

  // Filter requests by search query
  const filteredUsers = pendingUsers.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner */}
      <div
        data-header-summary="true"
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            User Registration Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Operator Access Approval & Directory Verification
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {isLoading ? '...' : filteredUsers.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {statusFilter === 'pending'
                ? 'Pending Review'
                : statusFilter === 'approved'
                ? 'Approved Users'
                : statusFilter === 'rejected'
                ? 'Rejected Requests'
                : 'Filtered Total'}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {isLoading ? '...' : pendingUsers.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Active Queue
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar Card */}
      <CardSharedComponent className="p-3 space-y-3">
        {/* Row 1: Search Bar (No Primary Action Button as requested) */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, department..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            {isRefetching && <span className="animate-spin text-slate-400">↻</span>}
            <span className="font-mono text-[11px]">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'applicant' : 'applicants'}
            </span>
          </div>
        </div>

        {/* Row 2: Status Dropdown Filter + View Switchers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs">
          {/* Left: Status Dropdown Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Status:</span>
              <CustomSelectSharedComponent
                value={statusFilter}
                options={statusOptions}
                onChange={(val) => setStatusFilter(val)}
                size="sm"
                className="w-44 sm:w-52"
              />
            </div>
          </div>

          {/* Right: View Switchers */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Grid Column Density Switcher (2 Col vs 3 Col) */}
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

            {/* List Single-Line Segmented Control */}
            {viewMode === 'list' && (
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
                  <span className="hidden sm:inline">Single-Line</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSingleLineMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    !isSingleLineMode
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Wrap-Text Table Mode"
                >
                  <WrapText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Wrap-Text</span>
                </button>
              </div>
            )}

            {/* Grid vs Table View Switcher with Text Labels */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid Card View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List Table View"
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Requests Status Color Legend Indicator */}
        <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 shadow-xs" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Pending Operator Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-xs" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Approved & Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 rounded-full bg-gradient-to-r from-rose-500 via-red-400 to-rose-500 shadow-xs" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Rejected Request</span>
          </div>
        </div>
      </CardSharedComponent>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#0C2086] border-t-transparent animate-spin" />
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Loading user registration requests...
          </span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyStateSharedComponent
          title={
            statusFilter === 'pending'
              ? 'No Pending Registration Requests'
              : statusFilter === 'approved'
              ? 'No Approved Users Found'
              : statusFilter === 'rejected'
              ? 'No Rejected Requests Found'
              : 'No User Requests Found'
          }
          description={
            searchQuery
              ? `No user requests match "${searchQuery}". Try clearing your search query.`
              : statusFilter === 'pending'
              ? 'All user registration requests have been reviewed and verified by an Operator.'
              : 'No user requests match the selected status filter.'
          }
          icon={<UserCheck className="w-6 h-6" />}
        />
      ) : viewMode === 'grid' ? (
        /* Grid Card View */
        <div
          className={`grid gap-4 ${
            gridColumns === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {filteredUsers.map((user) => {
            return (
              <CardSharedComponent
                key={user.id}
                hoverable
                className="p-4 flex flex-col justify-between gap-4 border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-xs relative overflow-hidden"
              >
                {/* Top Status Ambient Gradient Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    user.isDeleted
                      ? 'from-rose-500 via-red-400 to-rose-500'
                      : user.isVerified
                      ? 'from-emerald-500 via-teal-400 to-emerald-500'
                      : 'from-amber-500 via-orange-400 to-amber-500'
                  }`}
                />

                <div className="space-y-3">
                  {/* Card Header: Avatar & Name */}
                  <div className="flex items-start justify-between gap-3 pt-0.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0C2086] to-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                        {user.lastName ? user.lastName[0].toUpperCase() : ''}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                          {user.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="font-mono">{user.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Block */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-zinc-800/60">
                    <div>
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase font-mono">
                        Department
                      </span>
                      <span className="font-medium text-slate-700 dark:text-zinc-300 truncate block">
                        {user.department || 'Not Assigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase font-mono">
                        Requested Role
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-zinc-300 block">
                        {user.role || 'USER'}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-zinc-800 flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400">
                      <Calendar className="w-3 h-3" />
                      <span>Requested on {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80 min-h-[36px]">
                  {!user.isDeleted && !user.isVerified ? (
                    <PermissionGuardSharedComponent
                      permission={ApplicationPermissionCON.CAN_WRITE_ORGANIZATION}
                    >
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <ButtonSharedComponent
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRejectModal(user)}
                          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
                          icon={<X className="w-3.5 h-3.5" />}
                        >
                          Reject
                        </ButtonSharedComponent>
                        <ButtonSharedComponent
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenApproveModal(user)}
                          className="!bg-emerald-600 hover:!bg-emerald-700 !text-white border-none shadow-xs font-semibold"
                          icon={<Check className="w-3.5 h-3.5 !text-white" />}
                        >
                          <span className="!text-white font-medium">Approve</span>
                        </ButtonSharedComponent>
                      </div>
                    </PermissionGuardSharedComponent>
                  ) : user.isVerified ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified & Active
                    </span>
                  ) : (
                    <span className="text-xs text-rose-500 dark:text-rose-400 font-medium inline-flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Request Rejected
                    </span>
                  )}
                </div>
              </CardSharedComponent>
            );
          })}
        </div>
      ) : (
        /* List Table View */
        <CardSharedComponent className="overflow-hidden border border-slate-200/80 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 font-semibold border-b border-slate-200 dark:border-zinc-800 uppercase text-[10px] font-mono tracking-wider">
                <tr>
                  <th className="px-4 py-3">Applicant Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Requested At</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      <td className={`px-4 py-3 font-semibold text-slate-900 dark:text-zinc-100 ${
                        isSingleLineMode ? 'whitespace-nowrap truncate max-w-[200px]' : 'whitespace-normal'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0C2086] to-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                          </div>
                          <span>{user.fullName}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-mono text-slate-600 dark:text-zinc-300 ${
                        isSingleLineMode ? 'whitespace-nowrap truncate max-w-[220px]' : 'whitespace-normal break-all'
                      }`}>
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-zinc-300 whitespace-nowrap">
                        {user.department || 'Not Assigned'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.isDeleted ? (
                          <BadgeSharedComponent variant="danger" size="sm">
                            Rejected
                          </BadgeSharedComponent>
                        ) : user.isVerified ? (
                          <BadgeSharedComponent variant="success" size="sm">
                            Approved
                          </BadgeSharedComponent>
                        ) : (
                          <BadgeSharedComponent variant="warning" size="sm" showDot>
                            Pending Review
                          </BadgeSharedComponent>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {!user.isDeleted && !user.isVerified ? (
                          <PermissionGuardSharedComponent
                            permission={ApplicationPermissionCON.CAN_WRITE_ORGANIZATION}
                          >
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <ButtonSharedComponent
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenRejectModal(user)}
                                className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 py-1 px-2 text-xs"
                                icon={<X className="w-3.5 h-3.5" />}
                              >
                                Reject
                              </ButtonSharedComponent>
                              <ButtonSharedComponent
                                variant="primary"
                                size="sm"
                                onClick={() => handleOpenApproveModal(user)}
                                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white border-none shadow-xs font-semibold py-1 px-2.5 text-xs"
                                icon={<Check className="w-3.5 h-3.5 !text-white" />}
                              >
                                <span className="!text-white font-medium">Approve</span>
                              </ButtonSharedComponent>
                            </div>
                          </PermissionGuardSharedComponent>
                        ) : user.isVerified ? (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-xs text-rose-500 dark:text-rose-400 font-medium inline-flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardSharedComponent>
      )}

      {/* Setup & Approval Result Modal */}
      <ApproveUserSetupModalController
        isOpen={isApproveModalOpen}
        user={userToApprove}
        onClose={() => {
          setIsApproveModalOpen(false);
          setUserToApprove(null);
        }}
        onSuccess={() => {
          setIsApproveModalOpen(false);
          setUserToApprove(null);
        }}
      />

      {/* Confirmation Modal for Reject Request */}
      <ConfirmationModalSharedComponent
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setUserToReject(null);
        }}
        onConfirm={handleConfirmReject}
        title="Reject Registration Request"
        subtitle={
          userToReject
            ? `Applicant: ${userToReject.fullName} (${userToReject.email})`
            : undefined
        }
        description={
          userToReject
            ? `Are you sure you want to reject the registration request for "${userToReject.fullName}"? The applicant will not be granted access to the platform.`
            : ''
        }
        confirmText="Reject Request"
        variant="danger"
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
