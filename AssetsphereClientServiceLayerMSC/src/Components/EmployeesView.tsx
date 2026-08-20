import React, { useState } from 'react';
import { Employee, Asset } from '../types';
import {
  Users,
  Search,
  Laptop,
  Smartphone,
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  Plus,
  Mail,
  Phone,
  MapPin,
  FileCheck,
} from 'lucide-react';

interface EmployeesViewProps {
  employees: Employee[];
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  assets,
  onSelectAsset,
}) => {
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(employees[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmployeeAssets = selectedEmp
    ? assets.filter((a) => a.assignedToEmployeeId === selectedEmp.id)
    : [];

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Employee Directory & Asset Allocations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Multi-asset ownership tracking, onboarding & offboarding custody handshakes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Employee List */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredEmployees.map((emp) => {
              const isSelected = selectedEmp?.id === emp.id;
              const empAssetCount = assets.filter((a) => a.assignedToEmployeeId === emp.id).length;
              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={emp.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-medium text-xs text-white">{emp.name}</div>
                      <div className="text-[10px] text-slate-500">{emp.designation}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                      {empAssetCount} Assets
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Employee Profile & Assigned Assets */}
        <div className="lg:col-span-2 bg-[#161618] border border-slate-800 rounded-xl p-6 space-y-6">
          {selectedEmp ? (
            <>
              {/* Profile Card Header */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedEmp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={selectedEmp.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{selectedEmp.name}</h3>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {selectedEmp.employeeCode}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-400 font-medium mt-0.5">{selectedEmp.designation}</div>
                    <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" /> {selectedEmp.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> {selectedEmp.officeLocation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Assets Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-semibold text-white">
                    Assigned Hardware & Tokens ({selectedEmployeeAssets.length})
                  </h4>
                </div>

                {selectedEmployeeAssets.length === 0 ? (
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                    No active assets currently allocated to this employee.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedEmployeeAssets.map((ast) => (
                      <div
                        key={ast.id}
                        onClick={() => onSelectAsset(ast)}
                        className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0">
                            <Laptop className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{ast.deviceName}</div>
                            <div className="font-mono text-[10px] text-slate-500">
                              {ast.assetNumber} • S/N: {ast.serialNumber}
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <div className="font-bold text-white">${ast.currentValue.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500">Assigned: {ast.assignedDate || 'Recent'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Select an employee from the directory.</div>
          )}
        </div>
      </div>
    </div>
  );
};
