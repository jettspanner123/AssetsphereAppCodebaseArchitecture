import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Briefcase, MapPin, Phone, UserCheck, Plus, Sparkles } from 'lucide-react';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../../Shared/Components/CustomSelectSharedComponent';
import { Employee } from '../../../Types/EmployeeType';
import { DEPARTMENT_INDEX_MAP } from '../Services/EmployeesDirectoryService';

export interface EmployeeFormModalControllerProps {
  isOpen: boolean;
  initialEmployee?: Employee | null;
  isLoading?: boolean;
  onSave: (employeeData: {
    fullName: string;
    email: string;
    employeeId: string;
    department: number;
    designation: string;
    location: string;
    status?: string;
    managerName?: string;
    contactPhone?: string;
  }) => void;
  onClose: () => void;
}

import TanstackQueryClientService from '../../../Services/TanstackQueryClientService';

const DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Security Operations', label: 'Security Operations' },
  { value: 'Finance & Procurement', label: 'Finance & Procurement' },
  { value: 'Product Design', label: 'Product Design' },
  { value: 'IT & Infrastructure', label: 'IT & Infrastructure' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Legal & Compliance', label: 'Legal & Compliance' },
  { value: 'Operations', label: 'Operations' },
];

const EMPLOYMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Contractor', label: 'Contractor' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Intern', label: 'Intern' },
];

const DESIGNATION_PRESETS = [
  'Software Engineer',
  'Senior Backend Engineer',
  'Frontend Specialist',
  'DevOps Architect',
  'Product Designer',
  'Security Analyst',
  'HR Operations Lead',
  'Finance Analyst',
];

export default function EmployeeFormModalController({
  isOpen,
  initialEmployee,
  isLoading = false,
  onSave,
  onClose,
}: EmployeeFormModalControllerProps): React.JSX.Element {
  const { data: workLocations = ['Pune, Maharastra'] } =
    TanstackQueryClientService.current.configuration.useWorkLocationsQuery();

  const locationOptions: SelectOption[] = (workLocations.length > 0 ? workLocations : ['Pune, Maharastra']).map((loc) => ({
    value: loc,
    label: loc,
  }));

  const [fullName, setFullName] = useState(initialEmployee?.name || '');
  const [email, setEmail] = useState(initialEmployee?.email || '');
  const [employeeCode, setEmployeeCode] = useState(
    initialEmployee?.employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [department, setDepartment] = useState<string>(
    initialEmployee?.department || 'Engineering'
  );
  const [designation, setDesignation] = useState(
    initialEmployee?.designation || 'Software Engineer'
  );
  const [location, setLocation] = useState(
    initialEmployee?.officeLocation || workLocations[0] || 'Pune, Maharastra'
  );
  const [employmentType, setEmploymentType] = useState<string>(
    initialEmployee?.employmentType || 'Full-time'
  );
  const [contactPhone, setContactPhone] = useState(initialEmployee?.phone || '');
  const [managerName, setManagerName] = useState(initialEmployee?.managerName || '');

  const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down');

  useEffect(() => {
    if (isOpen) {
      setExitDirection('down');
      if (!initialEmployee) {
        setEmployeeCode(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
        if (workLocations.length > 0 && !location) {
          setLocation(workLocations[0]);
        }
      }
    }
  }, [isOpen, initialEmployee, workLocations]);

  useEffect(() => {
    if (!initialEmployee && (!location || location === 'HQ Bangalore') && workLocations.length > 0) {
      setLocation(workLocations[0]);
    }
  }, [workLocations, initialEmployee]);

  const handleCancel = () => {
    setExitDirection('up');
    setTimeout(() => {
      onClose();
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      alert('Full Name and Email Address are required.');
      return;
    }

    setExitDirection('up');

    const departmentIndex = DEPARTMENT_INDEX_MAP[department] ?? 0;

    onSave({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      employeeId: employeeCode.trim(),
      department: departmentIndex,
      designation: designation.trim() || 'Software Engineer',
      location: location || 'HQ Bangalore',
      status: 'Active',
      managerName: managerName.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
    });
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={onClose}
      title={initialEmployee ? 'Edit Employee Profile' : 'Add Employee to Directory'}
      subtitle={
        initialEmployee
          ? `Modify directory credentials for ${initialEmployee.name}`
          : 'Provision a new team member into the enterprise ITAM organization directory'
      }
      maxWidth="2xl"
      scrollMode="backdrop"
      animationType="slide-up"
      exitDirection={exitDirection}
    >
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full text-xs">
        <div>
          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <User className="w-3.5 h-3.5 text-blue-500" />
              1. Employee Identity & Credentials
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Corporate Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@enterprise.com"
                    className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Employee ID / Code
                </label>
                <input
                  type="text"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  placeholder="EMP-1001"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Employment Type
                </label>
                <CustomSelectSharedComponent
                  value={employmentType}
                  onChange={setEmploymentType}
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Department & Designation */}
          <div className="space-y-4 pt-8">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              2. Organization & Job Role
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Assigned Department <span className="text-rose-500">*</span>
                </label>
                <CustomSelectSharedComponent
                  value={department}
                  onChange={setDepartment}
                  options={DEPARTMENT_OPTIONS}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Designation / Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] transition-all"
                />
              </div>
            </div>

            {/* Quick Designation Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Quick Role Suggestions:</span>
              <div className="flex items-center gap-2 overflow-x-auto custom-horizontal-scrollbar pb-1.5 pt-0.5">
                {DESIGNATION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDesignation(preset)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      designation === preset
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Location & Management */}
          <div className="space-y-4 pt-8">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              3. Work Location & Reporting Contact
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Primary Work Location
                </label>
                <CustomSelectSharedComponent
                  value={location}
                  onChange={setLocation}
                  options={locationOptions}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Reporting Manager Name (Optional)
                </label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="e.g. David Vance (VP Engineering)"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Contact Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-200 dark:border-zinc-800 shrink-0">
          <ButtonSharedComponent variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </ButtonSharedComponent>
          <ButtonSharedComponent
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            loadingText={initialEmployee ? 'Saving Changes...' : 'Adding Employee...'}
            className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
            icon={<Plus className="w-3.5 h-3.5 !text-white" />}
          >
            <span className="!text-white font-medium">
              {initialEmployee ? 'Save Profile' : 'Add Employee'}
            </span>
          </ButtonSharedComponent>
        </div>
      </form>
    </ModalSharedComponent>
  );
}
