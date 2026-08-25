import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  UserCheck,
  Building2,
  Briefcase,
  MapPin,
  Mail,
  User,
  Phone,
  Hash,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { PendingUserType } from '@/src/Types';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../../Shared/Components/CustomSelectSharedComponent';
import TanstackQueryClientService from '../../../Services/TanstackQueryClientService';
import CreateDepartmentModalController from '../../Employees/Components/CreateDepartmentModalController';
import CreateDesignationModalController from '../../Employees/Components/CreateDesignationModalController';

export interface ApproveUserSetupModalControllerProps {
  isOpen: boolean;
  user: PendingUserType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'Active', label: 'Active', sublabel: 'Full operational enterprise status' },
  { value: 'Probation', label: 'Probation', sublabel: 'Initial onboarding review period' },
  { value: 'Contractor', label: 'Contractor', sublabel: 'External contract professional' },
  { value: 'On Leave', label: 'On Leave', sublabel: 'Temporary absence' },
];

export default function ApproveUserSetupModalController({
  isOpen,
  user,
  onClose,
  onSuccess,
}: ApproveUserSetupModalControllerProps): React.JSX.Element {
  // Live dynamic configuration data
  const { data: designationsMap = {
    Engineering: ['Software Engineer', 'Senior Architect'],
    'Product Design': ['Product Designer', 'Design Lead'],
    Operations: ['Operations Manager', 'Facilities Specialist'],
  } } = TanstackQueryClientService.current.configuration.useDesignationsQuery();

  const { data: workLocations = ['Pune, Maharastra'] } =
    TanstackQueryClientService.current.configuration.useWorkLocationsQuery();

  // Mutations
  const approveMutation = TanstackQueryClientService.current.authentication.useApproveUserMutation();
  const createEmployeeMutation = TanstackQueryClientService.current.employees.useCreateEmployeeMutation();

  // Form State
  const [employeeId, setEmployeeId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [department, setDepartment] = useState<string>('Engineering');
  const [designation, setDesignation] = useState<string>('Software Engineer');
  const [location, setLocation] = useState<string>('Pune, Maharastra');
  const [status, setStatus] = useState<string>('Active');
  const [managerName, setManagerName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Nested Creation Modals
  const [isCreateDeptModalOpen, setIsCreateDeptModalOpen] = useState<boolean>(false);
  const [isCreateDesigModalOpen, setIsCreateDesigModalOpen] = useState<boolean>(false);

  // Memoized dropdown options
  const departmentKeys = useMemo(() => Object.keys(designationsMap), [designationsMap]);
  const departmentOptions: SelectOption[] = useMemo(() => {
    const keys = departmentKeys.length > 0 ? departmentKeys : ['Engineering', 'Product Design', 'Operations'];
    return keys.map((dept) => ({
      value: dept,
      label: dept,
    }));
  }, [departmentKeys]);

  const designationOptions: SelectOption[] = useMemo(() => {
    const currentList = designationsMap[department] || designationsMap['Engineering'] || ['Software Engineer'];
    return currentList.map((desig) => ({
      value: desig,
      label: desig,
    }));
  }, [designationsMap, department]);

  const locationOptions: SelectOption[] = useMemo(() => {
    return workLocations.map((loc) => ({
      value: loc,
      label: loc,
    }));
  }, [workLocations]);

  // Generate random Employee ID once upon opening
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current && user) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setEmployeeId(`EMP-${randomNum}`);
      setFullName(user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'New Employee');

      // Department matching
      const userDept = user.department?.trim();
      const matchedDept = userDept && departmentKeys.includes(userDept)
        ? userDept
        : (departmentKeys[0] || 'Engineering');
      setDepartment(matchedDept);

      // Designation matching
      const defaultDesigs = designationsMap[matchedDept] || ['Software Engineer'];
      setDesignation(defaultDesigs[0] || 'Software Engineer');

      // Location matching
      setLocation(workLocations[0] || 'Pune, Maharastra');
      setStatus('Active');
      setManagerName('');
      setContactPhone('');
      setErrorMessage(null);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, user, departmentKeys, designationsMap, workLocations]);

  // Update designation default when department changes manually
  const handleDepartmentChange = (newDept: string) => {
    setDepartment(newDept);
    const available = designationsMap[newDept] || [];
    if (available.length > 0) {
      setDesignation(available[0]);
    }
  };

  const isSubmitting = approveMutation.isPending || createEmployeeMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedEmpId = employeeId.trim();
    const trimmedFullName = fullName.trim();
    const trimmedDept = department.trim();
    const trimmedDesig = designation.trim();
    const trimmedLoc = location.trim();

    if (!trimmedEmpId) {
      setErrorMessage('Employee ID is required.');
      return;
    }
    if (!trimmedFullName) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!trimmedDept) {
      setErrorMessage('Please select a department.');
      return;
    }
    if (!trimmedDesig) {
      setErrorMessage('Please select a designation.');
      return;
    }
    if (!trimmedLoc) {
      setErrorMessage('Please select a work location.');
      return;
    }

    try {
      setErrorMessage(null);

      // Step 1: Approve User Account
      await approveMutation.mutateAsync(user.id);

      // Step 2: Register Employee in Employee Directory
      await createEmployeeMutation.mutateAsync({
        employeeId: trimmedEmpId.toUpperCase(),
        fullName: trimmedFullName,
        email: user.email.trim().toLowerCase(),
        department: trimmedDept,
        designation: trimmedDesig,
        location: trimmedLoc,
        status: status.trim(),
        managerName: managerName.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        avatarUrl: user.avatarUrl || undefined,
      });

      toast.success(`${trimmedFullName} approved and registered in Employee Directory.`);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve and setup employee record.';
      setErrorMessage(msg);
    }
  };

  if (!user) return <React.Fragment />;

  return (
    <>
      <ModalSharedComponent
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">
                Approve User & Setup Employee Directory Record
              </span>
            </div>
          </div>
        }
        subtitle="Transfer the verified user into the enterprise employee directory with configured credentials and assignment"
        maxWidth="2xl"
        scrollMode="body"
        animationType="slide-up"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* User Profile Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#0C2086]/10 dark:bg-blue-500/10 text-[#0C2086] dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  {(user.fullName || user.email || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'New User'}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user.role || 'STANDARD_USER'}
              </span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-1042"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <CustomSelectSharedComponent
                options={departmentOptions}
                value={department}
                onChange={handleDepartmentChange}
                placeholder="Select Department"
                searchable={true}
                footerAction={{
                  label: '+ Create New Department',
                  onClick: () => setIsCreateDeptModalOpen(true),
                }}
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Designation / Job Title <span className="text-rose-500">*</span>
              </label>
              <CustomSelectSharedComponent
                options={designationOptions}
                value={designation}
                onChange={setDesignation}
                placeholder="Select Designation"
                searchable={true}
                footerAction={{
                  label: '+ Create New Designation',
                  onClick: () => setIsCreateDesigModalOpen(true),
                }}
              />
            </div>

            {/* Work Location */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Work Location <span className="text-rose-500">*</span>
              </label>
              <CustomSelectSharedComponent
                options={locationOptions}
                value={location}
                onChange={setLocation}
                placeholder="Select Work Location"
                searchable={true}
              />
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Employment Status <span className="text-rose-500">*</span>
              </label>
              <CustomSelectSharedComponent
                options={STATUS_OPTIONS}
                value={status}
                onChange={setStatus}
                placeholder="Select Status"
              />
            </div>

            {/* Reporting Manager */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Reporting Manager <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="e.g. David Marcus"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Contact Phone <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-zinc-800 mt-6">
            <ButtonSharedComponent
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </ButtonSharedComponent>
            <ButtonSharedComponent
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              icon={<Sparkles className="w-3.5 h-3.5" />}
              className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm"
            >
              Approve & Register Employee
            </ButtonSharedComponent>
          </div>
        </form>
      </ModalSharedComponent>

      {/* Nested Create Department Modal (zIndex=60) */}
      <CreateDepartmentModalController
        isOpen={isCreateDeptModalOpen}
        onClose={() => setIsCreateDeptModalOpen(false)}
        onCreated={(newDept) => {
          handleDepartmentChange(newDept);
        }}
      />

      {/* Nested Create Designation Modal (zIndex=60) */}
      <CreateDesignationModalController
        isOpen={isCreateDesigModalOpen}
        initialDepartment={department}
        onClose={() => setIsCreateDesigModalOpen(false)}
        onCreated={(targetDept, newDesig) => {
          setDepartment(targetDept);
          setDesignation(newDesig);
        }}
      />
    </>
  );
}
