import React, { useState } from 'react';
import { UserPlus, Sparkles, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import InputSharedComponent from '../../../Shared/Components/InputSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../../Shared/Components/CustomSelectSharedComponent';

const EMPLOYMENT_TYPES: SelectOption[] = [
  { value: 'Full-time', label: 'Full-time', sublabel: 'Standard FTE Employee' },
  { value: 'Contractor', label: 'Contractor', sublabel: 'External Staff Augmentation' },
  { value: 'Vendor', label: 'Vendor', sublabel: 'Third-party Service Partner' },
  { value: 'Intern', label: 'Intern', sublabel: 'Trainee or Academic Intern' },
];

const DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: 'Engineering', label: 'Engineering', sublabel: 'Software & Infrastructure' },
  { value: 'Executive Leadership', label: 'Executive Leadership', sublabel: 'C-Suite & Operations' },
  { value: 'Product & Design', label: 'Product & Design', sublabel: 'UX & Product Strategy' },
  { value: 'Finance & Accounting', label: 'Finance & Accounting', sublabel: 'Corporate Financials' },
  { value: 'Human Resources', label: 'Human Resources', sublabel: 'Talent & Culture' },
  { value: 'Sales & Marketing', label: 'Sales & Marketing', sublabel: 'Go-to-Market Teams' },
];

export default function DevCreateUserViewController(): React.JSX.Element {
  // Auto-generated fields
  const [autoEmpId] = useState(() => `EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [autoEmpCode] = useState(() => `E-${Math.floor(1000 + Math.random() * 9000)}`);

  // Editable Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [businessUnit, setBusinessUnit] = useState('Cloud Platform & Infrastructure');
  const [costCenter, setCostCenter] = useState('CC-200-ENG');
  const [managerName, setManagerName] = useState('Alexander Wright');
  const [officeLocation, setOfficeLocation] = useState('HQ - San Francisco');
  const [floor, setFloor] = useState('Floor 8');
  const [desk, setDesk] = useState('Desk 804');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contractor' | 'Vendor' | 'Intern'>('Full-time');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Toast / Form Feedback state
  const [submittedUser, setSubmittedUser] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill out Name and Email address.');
      return;
    }

    const newUserPayload = {
      id: autoEmpId,
      employeeCode: autoEmpCode,
      name,
      email,
      phone,
      designation,
      department,
      businessUnit,
      costCenter,
      managerName,
      officeLocation,
      floor,
      desk,
      employmentType,
      joiningDate,
      assignedAssetCount: 0,
    };

    setSubmittedUser(newUserPayload);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDesignation('');
    setSubmittedUser(null);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0C2086]/10 text-[#0C2086] dark:bg-indigo-950/60 dark:text-indigo-400 border border-[#0C2086]/20">
              <UserPlus className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif-headline">
              Create New Employee User
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Developer sandbox tool to construct and validate employee identity specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold border border-slate-200 dark:border-zinc-700">
            AUTO-GENERATOR ACTIVE
          </span>
        </div>
      </div>

      {/* Sandbox Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-sans">
          <span className="font-bold">Non-Persisting Developer Sandbox Notice:</span>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
            Form entries validate and render rich profile specs in mock sandbox state. Per requirements, new user profiles created here will not save permanently to the database.
          </p>
        </div>
      </div>

      {/* Submitted User Success Feedback Card */}
      {submittedUser && (
        <CardSharedComponent glow="green" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>User Profile Constructed Successfully (Mock Payload)</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-mono cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset Form
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-slate-200/80 dark:border-zinc-800">
            <div>
              <span className="text-slate-400 block text-[10px]">ID / CODE</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedUser.id} ({submittedUser.employeeCode})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">NAME</span>
              <span className="font-bold text-slate-900 dark:text-white truncate block">{submittedUser.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DEPARTMENT</span>
              <span className="text-slate-700 dark:text-zinc-300 truncate block">{submittedUser.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">OFFICE</span>
              <span className="text-slate-700 dark:text-zinc-300 truncate block">{submittedUser.officeLocation}</span>
            </div>
          </div>
        </CardSharedComponent>
      )}

      {/* Main Employee Specifications Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Identity & Auto-generated Codes */}
        <CardSharedComponent className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
            1. Identity & System Identifiers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 block">
                Employee System ID (Auto-Generated)
              </label>
              <input
                type="text"
                value={autoEmpId}
                readOnly
                className="w-full h-9 px-3 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 block">
                Employee Tag Code (Auto-Generated)
              </label>
              <input
                type="text"
                value={autoEmpCode}
                readOnly
                className="w-full h-9 px-3 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 cursor-not-allowed"
              />
            </div>
            <InputSharedComponent
              label="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sophia Vance"
              required
            />
            <InputSharedComponent
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. s.vance@enterprise.com"
              required
            />
            <InputSharedComponent
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 019-2831"
            />
            <InputSharedComponent
              label="Designation / Job Title"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Systems Architect"
            />
          </div>
        </CardSharedComponent>

        {/* Section 2: Departmental & Location Allocation */}
        <CardSharedComponent className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
            2. Departmental & Location Allocation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelectSharedComponent
              label="Department Allocation"
              value={department}
              onChange={setDepartment}
              options={DEPARTMENT_OPTIONS}
            />
            <InputSharedComponent
              label="Business Unit"
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              placeholder="e.g. Cloud Platform & Infrastructure"
            />
            <InputSharedComponent
              label="Cost Center Code"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              placeholder="e.g. CC-200-ENG"
            />
            <InputSharedComponent
              label="Manager Full Name"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="e.g. Alexander Wright"
            />
            <InputSharedComponent
              label="Primary Office Location"
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              placeholder="e.g. HQ - San Francisco"
            />
            <div className="grid grid-cols-2 gap-3">
              <InputSharedComponent
                label="Floor Level"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="Floor 8"
              />
              <InputSharedComponent
                label="Desk / Suite"
                value={desk}
                onChange={(e) => setDesk(e.target.value)}
                placeholder="Desk 804"
              />
            </div>
          </div>
        </CardSharedComponent>

        {/* Section 3: Employment Terms */}
        <CardSharedComponent className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
            3. Employment Terms & Onboarding
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelectSharedComponent
              label="Employment Type"
              value={employmentType}
              onChange={(val) => setEmploymentType(val as any)}
              options={EMPLOYMENT_TYPES}
            />
            <InputSharedComponent
              label="Joining / Effective Date"
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>
        </CardSharedComponent>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <ButtonSharedComponent type="button" variant="outline" size="sm" onClick={handleReset}>
            Clear Form
          </ButtonSharedComponent>
          <ButtonSharedComponent
            type="submit"
            variant="primary"
            size="sm"
            className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
            icon={<UserPlus className="w-4 h-4 !text-white" />}
          >
            <span className="!text-white font-medium">Create User Profile</span>
          </ButtonSharedComponent>
        </div>
      </form>
    </div>
  );
}
