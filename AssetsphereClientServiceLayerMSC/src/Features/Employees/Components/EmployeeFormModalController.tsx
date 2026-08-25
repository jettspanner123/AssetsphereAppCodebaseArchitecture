import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Briefcase, MapPin, Plus } from 'lucide-react';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../../Shared/Components/CustomSelectSharedComponent';
import { Employee } from '../../../Types/EmployeeType';
import EmployeesCON from '../Constants/EmployeesCON';
import TanstackQueryClientService from '../../../Services/TanstackQueryClientService';
import CreateDesignationModalController from './CreateDesignationModalController';

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

export default function EmployeeFormModalController({
  isOpen,
  initialEmployee,
  isLoading = false,
  onSave,
  onClose,
}: EmployeeFormModalControllerProps): React.JSX.Element {
  // Live Work Locations & Designations from ConfigurationConstants
  const { data: workLocations = ['Pune, Maharastra'] } =
    TanstackQueryClientService.current.configuration.useWorkLocationsQuery();

  const { data: designationsMap = {
    Engineering: ['Software Engineer'],
    'Product Design': ['Product Designer'],
    Operations: ['Operations Manager'],
  } } = TanstackQueryClientService.current.configuration.useDesignationsQuery();

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
    initialEmployee?.designation || (designationsMap['Engineering']?.[0] || 'Software Engineer')
  );
  const [location, setLocation] = useState(
    initialEmployee?.officeLocation || (workLocations.length > 0 ? workLocations[0] : 'Pune, Maharastra')
  );
  const [employmentType, setEmploymentType] = useState<string>(
    initialEmployee?.employmentType || 'Full-time'
  );
  const [contactPhone, setContactPhone] = useState(initialEmployee?.phone || '');
  const [managerName, setManagerName] = useState(initialEmployee?.managerName || '');
  const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down');
  const [isCreateDesignationOpen, setIsCreateDesignationOpen] = useState(false);

  const lastEmployeeRef = useRef<Employee | null>(initialEmployee || null);
  if (initialEmployee) {
    lastEmployeeRef.current = initialEmployee;
  }
  const displayEmployee = initialEmployee || lastEmployeeRef.current;
  const prevIsOpenRef = useRef(isOpen);

  // Filter available designations specifically for the currently selected department
  const currentDepartmentDesignations = designationsMap[department] || [];
  const designationOptions: SelectOption[] = currentDepartmentDesignations.map((des) => ({
    value: des,
    label: des,
  }));

  useEffect(() => {
    if (isOpen) {
      if (!prevIsOpenRef.current) {
        setExitDirection('down');
      }
      if (displayEmployee) {
        const empDept = displayEmployee.department || 'Engineering';
        const empDesignations = designationsMap[empDept] || [];
        setFullName(displayEmployee.name || '');
        setEmail(displayEmployee.email || '');
        setEmployeeCode(displayEmployee.employeeCode || '');
        setDepartment(empDept);
        setDesignation(displayEmployee.designation || (empDesignations.length > 0 ? empDesignations[0] : ''));
        setLocation(displayEmployee.officeLocation || (workLocations.length > 0 ? workLocations[0] : 'Pune, Maharastra'));
        setEmploymentType(displayEmployee.employmentType || 'Full-time');
        setContactPhone(displayEmployee.phone || '');
        setManagerName(displayEmployee.managerName || '');
      } else {
        const defaultDept = 'Engineering';
        const defaultDesignations = designationsMap[defaultDept] || [];
        setFullName('');
        setEmail('');
        setEmployeeCode(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
        setDepartment(defaultDept);
        setDesignation(defaultDesignations.length > 0 ? defaultDesignations[0] : '');
        setLocation(workLocations.length > 0 ? workLocations[0] : 'Pune, Maharastra');
        setEmploymentType('Full-time');
        setContactPhone('');
        setManagerName('');
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, displayEmployee, workLocations, designationsMap]);

  const handleDepartmentChange = (newDept: string) => {
    setDepartment(newDept);
    const available = designationsMap[newDept] || [];
    if (!available.includes(designation)) {
      setDesignation(available.length > 0 ? available[0] : '');
    }
  };

  const handleDesignationCreated = (createdDept: string, createdDesignation: string) => {
    setDepartment(createdDept);
    setDesignation(createdDesignation);
  };

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

    const departmentIndex = EmployeesCON.DEPARTMENT_INDEX_MAP[department] ?? 0;

    onSave({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      employeeId: employeeCode.trim(),
      department: departmentIndex,
      designation: designation.trim() || (currentDepartmentDesignations.length > 0 ? currentDepartmentDesignations[0] : 'General Staff'),
      location: location || (workLocations.length > 0 ? workLocations[0] : 'Pune, Maharastra'),
      status: 'Active',
      managerName: managerName.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
    });
  };

  return (
    <>
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
                    onChange={handleDepartmentChange}
                    options={DEPARTMENT_OPTIONS}
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Designation / Role Title <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelectSharedComponent
                    value={designation}
                    onChange={setDesignation}
                    options={designationOptions}
                    placeholder={
                      designationOptions.length === 0
                        ? 'No roles yet — click below to add'
                        : 'Select designation...'
                    }
                    searchable={true}
                    searchPlaceholder="Search designations..."
                    size="sm"
                    footerAction={{
                      label: '+ Create New Department / Designation',
                      icon: <Plus className="w-3.5 h-3.5" />,
                      onClick: () => {
                        setIsCreateDesignationOpen(true);
                      },
                    }}
                  />
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
                    searchable={true}
                    searchPlaceholder="Search work locations..."
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Reporting Manager Name
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. David Ross (CTO)"
                    className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800 mt-6">
            <ButtonSharedComponent
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </ButtonSharedComponent>
            <ButtonSharedComponent
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
            >
              {initialEmployee ? 'Save Profile Changes' : 'Provision Employee'}
            </ButtonSharedComponent>
          </div>
        </form>
      </ModalSharedComponent>

      {/* Nested Create Designation Modal layered on top without dismissing employee form */}
      <CreateDesignationModalController
        isOpen={isCreateDesignationOpen}
        initialDepartment={department}
        onClose={() => setIsCreateDesignationOpen(false)}
        onCreated={handleDesignationCreated}
      />
    </>
  );
}
