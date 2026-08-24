import React, { useState } from 'react';
import { Employee } from '../../Types/EmployeeType';
import { Asset } from '../../Types/AssetType';
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
  Plus,
  Users,
  MapPin,
  Phone,
  Briefcase,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import EmptyStateSharedComponent from '../../Shared/Components/EmptyStateSharedComponent';
import PermissionGuardSharedComponent from '../../Shared/Components/PermissionGuardSharedComponent';
import CustomSelectSharedComponent from '../../Shared/Components/CustomSelectSharedComponent';
import PrimaryActionButtonSharedComponent from '../../Shared/Components/PrimaryActionButtonSharedComponent';
import ApplicationPermissionCON from '../../Constants/ApplicationPermissionCON';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';
import TanstackQueryClientService from '../../Services/TanstackQueryClientService';

export interface EmployeesScreenControllerProps {
  employees: Employee[];
  assets: Asset[];
  isLoading?: boolean;
  onOpenAddModal?: () => void;
}

export default function EmployeesScreenController({
  employees,
  assets,
  isLoading = false,
  onOpenAddModal,
}: EmployeesScreenControllerProps): React.JSX.Element {
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getEmployeesViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getEmployeesGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getEmployeesSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  // Fetch registered work locations from backend configuration
  const { data: workLocations = ['Pune, Maharastra'] } =
    TanstackQueryClientService.current.configuration.useWorkLocationsQuery();

  // Combine backend work locations with any existing employee office locations
  const locationOptions = React.useMemo(() => {
    const locSet = new Set<string>(workLocations.length > 0 ? workLocations : ['Pune, Maharastra']);
    employees.forEach((e) => {
      if (e.officeLocation) locSet.add(e.officeLocation);
    });
    return [
      { value: 'ALL', label: 'All Locations' },
      ...Array.from(locSet).sort().map((loc) => ({ value: loc, label: loc })),
    ];
  }, [workLocations, employees]);

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
    (e) => {
      // Location filter
      if (locationFilter !== 'ALL' && e.officeLocation !== locationFilter) return false;
      // Search filter
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (e.name || '').toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q) ||
        (e.department || '').toLowerCase().includes(q) ||
        (e.designation || '').toLowerCase().includes(q) ||
        (e.employeeCode || '').toLowerCase().includes(q)
      );
    }
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

        {/* Action Controls & Counters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Executive Typographic Metric Counters */}
          <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {isLoading ? '...' : filteredEmployees.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Personnel
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {isLoading ? '...' : totalAssignedAssets}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Allocated Devices
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar Card */}
      <CardSharedComponent className="p-3 space-y-3">
        {/* Row 1: Search + Add Employee */}
        <div className="flex items-center justify-between gap-3">
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

          <PermissionGuardSharedComponent
            permission={ApplicationPermissionCON.CAN_WRITE_ORGANIZATION}
          >
            <PrimaryActionButtonSharedComponent
              label="Add Employee"
              onClick={onOpenAddModal}
            />
          </PermissionGuardSharedComponent>
        </div>

        {/* Row 2: Location Filter + View Options (with divider) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs">
          {/* Left: Location Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-zinc-400 font-medium">Location:</span>
            <CustomSelectSharedComponent
              value={locationFilter}
              options={locationOptions}
              onChange={(val) => setLocationFilter(val)}
              size="sm"
              className="w-40 sm:w-48"
            />
          </div>

          {/* Right: View Switchers */}
          <div className="flex flex-wrap items-center justify-end gap-3">
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

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CardSharedComponent key={i} className="p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-zinc-800 rounded" />
            </CardSharedComponent>
          ))}
        </div>
      )}

      {/* Fallback Empty State */}
      {!isLoading && filteredEmployees.length === 0 && (
        <EmptyStateSharedComponent
          icon={<Users className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
          title={searchQuery ? 'No Employees Matched' : 'No Employees in Directory'}
          description={
            searchQuery
              ? `No personnel profiles matched "${searchQuery}". Try clearing search filters.`
              : 'Your organization directory currently has no employee records. Add your first team member.'
          }
        />
      )}

      {/* Grid View Mode */}
      {!isLoading && viewMode === 'grid' && filteredEmployees.length > 0 && (
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
                  <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Email
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-100 truncate max-w-[200px]">
                      {emp.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Location
                    </span>
                    <span className="text-slate-900 dark:text-zinc-100 font-medium">
                      {emp.officeLocation || 'HQ Bangalore'}
                    </span>
                  </div>
                </div>

                {/* Allocated Hardware Devices */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      Allocated Assets
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {empAssets.length} Devices
                    </span>
                  </div>

                  {empAssets.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {empAssets.map((ast) => (
                        <span
                          key={ast.id}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-mono text-[11px] border border-slate-200/60 dark:border-zinc-700/60"
                        >
                          {ast.deviceName} ({ast.assetNumber})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
                      No active hardware assets assigned
                    </p>
                  )}
                </div>
              </CardSharedComponent>
            );
          })}
        </div>
      )}

      {/* List / Table View Mode */}
      {!isLoading && viewMode === 'list' && filteredEmployees.length > 0 && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table
              className={`w-full text-left text-xs ${
                isSingleLineMode ? 'min-w-[1000px] whitespace-nowrap' : ''
              }`}
            >
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Name & Title</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Allocated Devices</th>
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
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-zinc-100">
                        {emp.employeeCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                          {emp.designation}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-zinc-300">
                        {emp.department}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-zinc-400">
                        {emp.email}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300">
                        {emp.officeLocation}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                          {empAssets.length} Assets
                        </span>
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
