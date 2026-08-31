import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import TanstackQueryClientService from '@/src/Services/TanstackQueryClientService';
import { Employee } from '../../../Types/EmployeeType';
import InputSharedComponent from '../../../Shared/Components/InputSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../../Shared/Components/CustomSelectSharedComponent';

export default function DevEditUserViewController(): React.JSX.Element {
  const { data: employees = [], isLoading } = TanstackQueryClientService.current.employees.useEmployeesQuery();

  const employeeSelectOptions: SelectOption[] = employees.map((emp) => ({
    value: emp.id,
    label: `${emp.name} (${emp.employeeCode})`,
    sublabel: `${emp.designation} • ${emp.department}`,
  }));

  const [selectedEmpId, setSelectedEmpId] = useState<string>('');

  useEffect(() => {
    if (employees.length > 0 && !selectedEmpId) {
      setSelectedEmpId(employees[0].id);
    }
  }, [employees, selectedEmpId]);

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId) || employees[0] || null;

  // Editable Form Inputs
  const [name, setName] = useState(selectedEmployee?.name || '');
  const [email, setEmail] = useState(selectedEmployee?.email || '');
  const [phone, setPhone] = useState(selectedEmployee?.phone || '');
  const [designation, setDesignation] = useState(selectedEmployee?.designation || '');
  const [department, setDepartment] = useState(selectedEmployee?.department || 'Engineering');
  const [officeLocation, setOfficeLocation] = useState(selectedEmployee?.officeLocation || 'HQ - San Francisco');
  const [floor, setFloor] = useState(selectedEmployee?.floor || 'Floor 8');
  const [desk, setDesk] = useState(selectedEmployee?.desk || 'Desk 804');

  useEffect(() => {
    if (selectedEmployee) {
      setName(selectedEmployee.name || '');
      setEmail(selectedEmployee.email || '');
      setPhone(selectedEmployee.phone || '');
      setDesignation(selectedEmployee.designation || '');
      setDepartment(selectedEmployee.department || 'Engineering');
      setOfficeLocation(selectedEmployee.officeLocation || 'HQ - San Francisco');
      setFloor(selectedEmployee.floor || 'Floor 8');
      setDesk(selectedEmployee.desk || 'Desk 804');
    }
  }, [selectedEmployee]);

  const handleSelectEmployee = (id: string) => {
    setSelectedEmpId(id);
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      setName(emp.name);
      setEmail(emp.email);
      setPhone(emp.phone);
      setDesignation(emp.designation);
      setDepartment(emp.department);
      setOfficeLocation(emp.officeLocation);
      setFloor(emp.floor);
      setDesk(emp.desk);
    }
  };

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0C2086]/10 text-[#0C2086] dark:bg-indigo-950/60 dark:text-indigo-400 border border-[#0C2086]/20">
              <UserCheck className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif-headline">
              Edit Existing Employee User
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Select an indexed employee record to inspect and modify profile properties.
          </p>
        </div>
      </div>

      {/* Sandbox Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5 font-sans">
          <span className="font-bold">Non-Persisting Developer Sandbox Notice:</span>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
            Edits made in this developer console validate and preview UI changes in sandbox memory. Changes do not save to permanent storage.
          </p>
        </div>
      </div>

      {submitted && (
        <CardSharedComponent glow="green" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>User Profile Modifications Validated for {name} ({selectedEmployee.employeeCode})</span>
            </div>
            <button onClick={() => setSubmitted(false)} className="text-slate-500 hover:text-slate-900 font-mono">
              Dismiss
            </button>
          </div>
        </CardSharedComponent>
      )}

      {/* Employee Selector Dropdown */}
      <CardSharedComponent className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">
          Target Employee Record
        </h3>
        <CustomSelectSharedComponent
          label="Select Employee Profile to Edit"
          value={selectedEmpId}
          onChange={handleSelectEmployee}
          options={employeeSelectOptions}
        />
      </CardSharedComponent>

      {/* Main Employee Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardSharedComponent className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
            Editable Identity & Allocation Specs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputSharedComponent
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputSharedComponent
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputSharedComponent
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputSharedComponent
              label="Designation / Job Title"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <InputSharedComponent
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <InputSharedComponent
              label="Primary Office Facility"
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
            />
            <InputSharedComponent
              label="Floor Level"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
            <InputSharedComponent
              label="Desk / Suite Number"
              value={desk}
              onChange={(e) => setDesk(e.target.value)}
            />
          </div>
        </CardSharedComponent>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <ButtonSharedComponent
            type="submit"
            variant="primary"
            size="sm"
            className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
            icon={<UserCheck className="w-4 h-4 !text-white" />}
          >
            <span className="!text-white font-medium">Update User Profile</span>
          </ButtonSharedComponent>
        </div>
      </form>
    </div>
  );
}
