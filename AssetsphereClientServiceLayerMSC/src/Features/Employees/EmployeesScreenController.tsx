import React, { useState } from 'react';
import { Employee, Asset } from '../../types';
import { Search, Laptop, Mail, Building } from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import InputSharedComponent from '../../Shared/Components/InputSharedComponent';

export interface EmployeesScreenControllerProps {
  employees: Employee[];
  assets: Asset[];
}

export default function EmployeesScreenController({
  employees,
  assets,
}: EmployeesScreenControllerProps): React.JSX.Element {
  const [search, setSearch] = useState('');

  const filtered = employees.filter(
    (e) =>
      (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Employees & People Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Personnel profiles, hardware allocations, and department seat usage
          </p>
        </div>
        <div className="w-full sm:w-72">
          <InputSharedComponent
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp) => {
          const empAssets = assets.filter(
            (a) => a.assignedToEmployeeId === emp.id || a.assignedToEmployeeName === emp.name
          );

          return (
            <CardSharedComponent key={emp.id} hoverable>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                  {(emp.name || 'EM').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline truncate">
                    {emp.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{emp.designation}</p>
                </div>
                <BadgeSharedComponent variant="info" size="sm">
                  {emp.department}
                </BadgeSharedComponent>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.officeLocation}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-sky-500" /> Assigned Devices ({empAssets.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {empAssets.length > 0 ? (
                    empAssets.map((ast) => (
                      <div
                        key={ast.id}
                        className="px-2.5 py-1.5 rounded bg-slate-100 dark:bg-zinc-800/60 flex items-center justify-between text-[11px] font-mono"
                      >
                        <span className="text-slate-900 dark:text-zinc-200 truncate">{ast.deviceName}</span>
                        <span className="text-slate-400 shrink-0">{ast.assetNumber}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No hardware currently allocated</span>
                  )}
                </div>
              </div>
            </CardSharedComponent>
          );
        })}
      </div>
    </div>
  );
}
