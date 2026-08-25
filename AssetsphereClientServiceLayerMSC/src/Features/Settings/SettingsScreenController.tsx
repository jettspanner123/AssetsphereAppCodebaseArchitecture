import React, { useState, useRef } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Building2,
  AlertTriangle,
  Users,
  Laptop,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import ConfirmationModalSharedComponent from '../../Shared/Components/ConfirmationModalSharedComponent';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import TanstackQueryClientService from '../../Services/TanstackQueryClientService';

export interface SettingsScreenControllerProps {
  deploymentMode?: 'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync';
  onToggleDeploymentMode?: () => void;
  currentTheme?: string;
  onToggleTheme?: () => void;
}

export default function SettingsScreenController({}: SettingsScreenControllerProps): React.JSX.Element {
  // Live Work Locations from ConfigurationConstants
  const { data: workLocations = ['Pune, Maharastra'], isLoading: isLocationsLoading } =
    TanstackQueryClientService.current.configuration.useWorkLocationsQuery();

  // Active Employees & Assets for dependency tracking
  const { data: employees = [] } =
    TanstackQueryClientService.current.employees.useEmployeesQuery();
  const { data: assets = [] } =
    TanstackQueryClientService.current.assets.useAssetsQuery();

  // Mutations
  const addWorkLocationMutation =
    TanstackQueryClientService.current.configuration.useAddWorkLocationMutation();
  const deleteWorkLocationMutation =
    TanstackQueryClientService.current.configuration.useDeleteWorkLocationMutation();

  // Local Form State
  const [newLocation, setNewLocation] = useState('');

  // In-button error shake state
  const [buttonErrorText, setButtonErrorText] = useState<string | null>(null);
  const [isButtonShaking, setIsButtonShaking] = useState<boolean>(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Deletion Modal State (retaining mounted instance for fluid AnimatePresence exit animations)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedLocationToDelete, setSelectedLocationToDelete] = useState<string>('');

  // Dependency Warning Modal State
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [warningLocationData, setWarningLocationData] = useState<{
    location: string;
    employeeCount: number;
    assetCount: number;
  }>({ location: '', employeeCount: 0, assetCount: 0 });

  // Helper to trigger in-button error with horizontal shake
  const triggerButtonError = (errorText: string) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    setButtonErrorText(errorText);
    setIsButtonShaking(true);

    setTimeout(() => {
      setIsButtonShaking(false);
    }, 500);

    errorTimeoutRef.current = setTimeout(() => {
      setButtonErrorText(null);
    }, 2800);
  };

  // Helper to compute dependency counts for a given location
  const getDependenciesForLocation = (loc: string) => {
    const locLower = loc.trim().toLowerCase();
    const employeeCount = employees.filter(
      (e) => (e.officeLocation || '').trim().toLowerCase() === locLower
    ).length;
    const assetCount = assets.filter(
      (a) => (a.currentLocation || '').trim().toLowerCase() === locLower
    ).length;

    return { employeeCount, assetCount };
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLocation.trim();
    if (!trimmed) {
      triggerButtonError('Location Name Required');
      return;
    }

    const alreadyExists = workLocations.some(
      (loc) => loc.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      triggerButtonError(`${trimmed} Already Exists`);
      return;
    }

    try {
      await addWorkLocationMutation.mutateAsync({ location: trimmed });
      setNewLocation('');
      setButtonErrorText(null);
      toast.success(`'${trimmed}' has been added to work locations.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to Add Location';
      triggerButtonError(msg.length > 32 ? 'Failed to Add Location' : msg);
    }
  };

  const initiateDeleteLocation = (loc: string) => {
    const { employeeCount, assetCount } = getDependenciesForLocation(loc);

    if (employeeCount > 0 || assetCount > 0) {
      setWarningLocationData({
        location: loc,
        employeeCount,
        assetCount,
      });
      setIsWarningModalOpen(true);
    } else {
      setSelectedLocationToDelete(loc);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedLocationToDelete) return;
    const locToDelete = selectedLocationToDelete;
    try {
      await deleteWorkLocationMutation.mutateAsync({ location: locToDelete });
      setIsDeleteModalOpen(false);
      toast.success(`'${locToDelete}' was removed from work locations.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete work location.';
      triggerButtonError(msg);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          Enterprise Work Locations & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Manage corporate physical facilities, regional operational sites, and asset deployment locations
        </p>
      </div>

      {/* Single Unified Card with Middle Divider */}
      <CardSharedComponent className="p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-zinc-800">
          {/* Left Section (5 cols): Register Work Location Form */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800/60">
                <div className="p-2.5 rounded-lg bg-[#0C2086]/10 dark:bg-blue-500/10 text-[#0C2086] dark:text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                    Register Work Location
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Add a new campus, facility, or regional hub
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddLocation} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Location Name / City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => {
                        setNewLocation(e.target.value);
                        if (buttonErrorText) setButtonErrorText(null);
                      }}
                      placeholder="e.g. Frankfurt, Germany or Bangalore HQ"
                      className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    This location will instantly become available across all employee profiles and asset deployment forms.
                  </p>
                </div>

                <div className="pt-2">
                  <ButtonSharedComponent
                    type="submit"
                    variant={buttonErrorText ? 'danger' : 'primary'}
                    size="sm"
                    isLoading={addWorkLocationMutation.isPending}
                    className={`w-full flex items-center justify-center gap-1.5 transition-all duration-300 font-semibold ${
                      buttonErrorText
                        ? `!bg-rose-600 hover:!bg-rose-700 !text-white border-none shadow-sm ${
                            isButtonShaking ? 'animate-shake' : ''
                          }`
                        : '!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm'
                    }`}
                    icon={
                      buttonErrorText ? (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-white" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 shrink-0 text-white" />
                      )
                    }
                  >
                    <span className="text-xs truncate">
                      {buttonErrorText ? buttonErrorText : 'Add Work Location'}
                    </span>
                  </ButtonSharedComponent>
                </div>
              </form>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed">
                Work locations are synchronized in real-time. Deletion is automatically guarded if active employees or assets are currently assigned.
              </p>
            </div>
          </div>

          {/* Right Section (7 cols): Active Work Locations Directory */}
          <div className="lg:col-span-7 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                    Active Work Locations Directory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Currently registered enterprise sites
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                {workLocations.length} {workLocations.length === 1 ? 'Location' : 'Locations'}
              </span>
            </div>

            {isLocationsLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500">
                Loading work locations...
              </div>
            ) : workLocations.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500">
                No work locations found. Use the form on the left to add one.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {workLocations.map((loc) => {
                  const { employeeCount, assetCount } = getDependenciesForLocation(loc);
                  const hasDependencies = employeeCount > 0 || assetCount > 0;

                  return (
                    <div
                      key={loc}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 flex items-center justify-center shrink-0 text-slate-600 dark:text-zinc-300">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {loc}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-slate-400" />
                              {employeeCount} {employeeCount === 1 ? 'Employee' : 'Employees'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Laptop className="w-3 h-3 text-slate-400" />
                              {assetCount} {assetCount === 1 ? 'Asset' : 'Assets'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => initiateDeleteLocation(loc)}
                        title={
                          hasDependencies
                            ? `Cannot delete: in use by ${employeeCount} employees and ${assetCount} assets`
                            : `Delete ${loc}`
                        }
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardSharedComponent>

      {/* Confirmation Modal for deletion when 0 dependencies (stays mounted for AnimatePresence exit animation) */}
      <ConfirmationModalSharedComponent
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Work Location"
        subtitle="Permanent Directory Removal"
        description={
          <span>
            Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{selectedLocationToDelete}</strong>? This action will permanently remove this location from all enterprise dropdowns.
          </span>
        }
        confirmText="Delete Location"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteWorkLocationMutation.isPending}
      />

      {/* Dependency Warning Modal when location is still in use (stays mounted for AnimatePresence exit animation) */}
      <ModalSharedComponent
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Work Location Is In Use</span>
          </div>
        }
        subtitle="Active dependencies prevent immediate deletion"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-700 dark:text-zinc-300 leading-relaxed">
            Cannot delete <strong className="text-slate-900 dark:text-white font-semibold">{warningLocationData.location}</strong> because it is currently assigned to:
          </p>

          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-1.5 text-amber-800 dark:text-amber-200 font-medium">
            {warningLocationData.employeeCount > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {warningLocationData.employeeCount} active {warningLocationData.employeeCount === 1 ? 'employee' : 'employees'}
                </span>
              </div>
            )}
            {warningLocationData.assetCount > 0 && (
              <div className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5" />
                <span>
                  {warningLocationData.assetCount} registered {warningLocationData.assetCount === 1 ? 'asset' : 'assets'}
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            To delete this work location, please first reassign or edit the employees and assets assigned to this location.
          </p>

          <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-zinc-800">
            <ButtonSharedComponent
              variant="primary"
              size="sm"
              onClick={() => setIsWarningModalOpen(false)}
              className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none"
            >
              Understood
            </ButtonSharedComponent>
          </div>
        </div>
      </ModalSharedComponent>
    </div>
  );
}
