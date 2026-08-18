import React, { useState } from 'react';
import { Employee, Asset } from '../../types';
import {
  Search,
  Laptop,
  Mail,
  Building,
  UserCheck,
  Cpu,
  Grid,
  List,
  Maximize2,
  WrapText,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';

export interface EmployeesScreenControllerProps {
  employees: Employee[];
  assets: Asset[];
}

export default function EmployeesScreenController({
  employees,
  assets,
}: EmployeesScreenControllerProps): React.JSX.Element {
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getEmployeesViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getEmployeesGridColumns(3)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getEmployeesSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setEmployeesViewMode(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setEmployeesGridColumns(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setEmployeesSingleLine(val);
  };

  const filteredEmployees = employees.filter(
    (e) =>
      (e.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.employeeCode || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAssignedAssets = assets.filter(
    (a) => a.assignedToEmployeeId || a.assignedToEmployeeName
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Employees & People Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Personnel profiles, hardware allocations, and department seat usage
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {filteredEmployees.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Personnel
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {totalAssignedAssets}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Allocated Devices
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar Card */}
      <CardSharedComponent className="p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, department, code..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
          </div>

          {/* Uniform Height Control Switchers */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            {/* Grid Column Density Switcher (2 Col vs 3 Col) */}
            {viewMode === 'grid' && (
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
                <button
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
                  onClick={() => setIsSingleLineMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isSingleLineMode
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Single-Line Table Mode"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Single-Line</span>
                </button>
                <button
                  onClick={() => setIsSingleLineMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    !isSingleLineMode
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Wrap Text Table Mode"
                >
                  <WrapText className="w-3.5 h-3.5" />
                  <span>Wrap Text</span>
                </button>
              </div>
            )}

            {/* View Mode Segmented Control (Grid vs List) */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </CardSharedComponent>

      {/* Fallback Empty State */}
      {filteredEmployees.length === 0 && (
        <CardSharedComponent className="p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white font-serif-headline">
            No Employees Found
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            No personnel matched your search query "{searchQuery}".
          </p>
        </CardSharedComponent>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && filteredEmployees.length > 0 && (
        <div
          className={`grid grid-cols-1 ${
            gridColumns === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {filteredEmployees.map((emp) => {
            const empAssets = assets.filter(
              (a) => a.assignedToEmployeeId === emp.id || a.assignedToEmployeeName === emp.name
            );

            return (
              <CardSharedComponent key={emp.id} hoverable className="p-6 flex flex-col justify-between space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      {(emp.name || 'EM').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline truncate leading-tight">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono mt-0.5 truncate">
                        {emp.designation} • <span className="text-slate-500 dark:text-zinc-400 font-sans">{emp.department}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 shrink-0">
                    {emp.employeeCode || 'EMP'}
                  </span>
                </div>

                {/* Email & Location */}
                <div className="py-3 border-y border-slate-100 dark:border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.officeLocation}</span>
                  </div>
                </div>

                {/* Allocated Hardware Badges */}
                <div>
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
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/60 flex items-center justify-between text-[11px] font-mono"
                        >
                          <span className="text-slate-900 dark:text-zinc-200 truncate">{ast.deviceName}</span>
                          <span className="text-slate-400 shrink-0 ml-2">{ast.assetNumber}</span>
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
      )}

      {/* List / Table View Mode */}
      {viewMode === 'list' && filteredEmployees.length > 0 && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className={`w-full text-left text-xs ${isSingleLineMode ? 'min-w-[900px] whitespace-nowrap' : ''}`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-5">Code</th>
                  <th className="py-3.5 px-5">Employee Name</th>
                  <th className="py-3.5 px-5">Designation & Dept</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-5">Office Location</th>
                  <th className="py-3.5 px-5 text-right">Allocated Devices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredEmployees.map((emp) => {
                  const empAssets = assets.filter(
                    (a) => a.assignedToEmployeeId === emp.id || a.assignedToEmployeeName === emp.name
                  );

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-mono text-slate-500 dark:text-zinc-400">
                        {emp.employeeCode || 'EMP'}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                            {(emp.name || 'EM').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white font-serif-headline text-sm">
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-zinc-300">
                        {emp.designation} • <span className="text-slate-400 font-mono">{emp.department}</span>
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-500 dark:text-zinc-400">
                        {emp.email}
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-zinc-300">
                        {emp.officeLocation}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {empAssets.length} devices
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardSharedComponent>
      )}
    </div>
  );
}
