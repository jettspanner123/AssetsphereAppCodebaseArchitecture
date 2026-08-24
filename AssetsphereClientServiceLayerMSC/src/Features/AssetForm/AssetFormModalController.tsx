import React, { useState } from 'react';
import { Asset, AssetCategory, AssetSubtype, LifecycleStatus, StorageDrive } from '../../Types/AssetType';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import InputSharedComponent from '../../Shared/Components/InputSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import { Plus, Cpu, HardDrive, MemoryStick, Monitor, Sparkles, Trash2, FileText, UserCheck, MapPin, Building } from 'lucide-react';
import CustomSelectSharedComponent, { SelectOption } from '../../Shared/Components/CustomSelectSharedComponent';
import TanstackQueryClientService from '../../Services/TanstackQueryClientService';

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'Computing', label: 'Computing', sublabel: 'Laptops, Desktops & Workstations' },
  { value: 'Mobile', label: 'Mobile', sublabel: 'Smartphones & Tablets' },
  { value: 'Peripherals', label: 'Peripherals', sublabel: 'Monitors, Docks & Keyboards' },
  { value: 'Storage', label: 'Storage', sublabel: 'SAN, NAS & Disk Arrays' },
  { value: 'Networking', label: 'Networking', sublabel: 'Switches, Routers & Firewalls' },
  { value: 'Security Devices', label: 'Security Devices', sublabel: 'Hardware Security Keys & HSMs' },
  { value: 'Infrastructure', label: 'Infrastructure', sublabel: 'UPS, Racks & Power Distribution' },
];

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'USD', label: 'USD - United States Dollar ($)' },
  { value: 'INR', label: 'INR - Indian Rupee (₹)' },
];

const STORAGE_UNIT_OPTIONS: SelectOption[] = [
  { value: 'GB', label: 'GB' },
  { value: 'TB', label: 'TB' },
];

const DRIVE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'NVMe SSD', label: 'NVMe M.2 SSD (High Speed)' },
  { value: 'SATA SSD', label: 'SATA 2.5" SSD' },
  { value: 'HDD', label: 'Mechanical Hard Drive (HDD)' },
  { value: 'eMMC', label: 'eMMC Flash Storage' },
  { value: 'External SSD', label: 'External / Removable SSD' },
  { value: 'Other', label: 'Other Storage Array' },
];

const DEPARTMENT_SELECT_OPTIONS: SelectOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product & Design', label: 'Product & Design' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Finance & Accounts', label: 'Finance & Accounts' },
  { value: 'Sales & Marketing', label: 'Sales & Marketing' },
  { value: 'Legal & Compliance', label: 'Legal & Compliance' },
  { value: 'Operations', label: 'Operations' },
];

const PROCESSOR_PRESETS = [
  'Apple M3 Max',
  'Apple M3 Pro',
  'Apple M2',
  'Intel Core i7 14th Gen',
  'Intel Core i9-14900HX',
  'AMD Ryzen 9 7950X',
  'Intel Xeon Gold',
];

const RAM_NUMERIC_PRESETS = [8, 16, 32, 64, 128, 256];

const DRIVE_PRESET_ITEMS = [
  { sizeNumber: 256, unit: 'GB' as const, label: '256 GB' },
  { sizeNumber: 512, unit: 'GB' as const, label: '512 GB' },
  { sizeNumber: 1, unit: 'TB' as const, label: '1 TB' },
  { sizeNumber: 2, unit: 'TB' as const, label: '2 TB' },
  { sizeNumber: 4, unit: 'TB' as const, label: '4 TB' },
  { sizeNumber: 16, unit: 'TB' as const, label: '16 TB' },
];

const SCREEN_SIZE_PRESETS = [
  'None / Server',
  '13.3"',
  '14.0"',
  '15.6"',
  '16.0"',
  '24.0"',
  '27.0" 4K',
  '32.0" 4K',
];

interface DriveFormItem {
  id: string;
  sizeNumber: number;
  unit: 'GB' | 'TB';
  type: string;
}

export interface AssetFormModalControllerProps {
  isOpen: boolean;
  initialAsset?: Asset | null;
  isLoading?: boolean;
  onSave: (assetData: Partial<Asset>) => void;
  onClose: () => void;
}

export default function AssetFormModalController({
  isOpen,
  initialAsset,
  isLoading = false,
  onSave,
  onClose,
}: AssetFormModalControllerProps): React.JSX.Element {
  // Query active employees and registered work locations
  const { data: employees = [] } =
    TanstackQueryClientService.current.employees.useEmployeesQuery();
  const { data: workLocations = ['Pune, Maharastra'] } =
    TanstackQueryClientService.current.configuration.useWorkLocationsQuery();

  const [deviceName, setDeviceName] = useState(initialAsset?.deviceName || '');
  const [assetNumber] = useState(
    initialAsset?.assetNumber || `AST-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [category, setCategory] = useState<AssetCategory>(initialAsset?.category || 'Computing');
  const [serialNumber, setSerialNumber] = useState(initialAsset?.serialNumber || '');
  const [manufacturer, setManufacturer] = useState(initialAsset?.manufacturer || '');
  const [purchaseCost, setPurchaseCost] = useState(initialAsset?.procurement?.purchaseCost || 1499);
  const [currency, setCurrency] = useState<'USD' | 'INR'>(
    (initialAsset?.procurement?.currency as 'USD' | 'INR') || 'USD'
  );

  // Hardware Specs State
  const [processor, setProcessor] = useState(initialAsset?.hardwareSpecs?.cpu || 'Apple M3 Pro');
  const [ramGbs, setRamGbs] = useState<number>(
    initialAsset?.hardwareSpecs?.ramGbs || 32
  );

  // Multi-Storage Drives State with Numeric Size & GB/TB Unit Dropdown
  const [storageDrives, setStorageDrives] = useState<DriveFormItem[]>(() => {
    if (initialAsset?.hardwareSpecs?.storageDrives && initialAsset.hardwareSpecs.storageDrives.length > 0) {
      return initialAsset.hardwareSpecs.storageDrives.map((d, index) => {
        const isTb = d.capacity.toUpperCase().includes('TB');
        const num = parseFloat(d.capacity.replace(/[^0-9.]/g, '')) || (isTb ? 1 : 512);
        return {
          id: d.id || `drive-${index + 1}`,
          sizeNumber: num,
          unit: isTb ? 'TB' : 'GB',
          type: d.type || 'NVMe SSD',
        };
      });
    }
    return [{ id: 'drive-1', sizeNumber: 512, unit: 'GB', type: 'NVMe SSD' }];
  });

  const [screenSize, setScreenSize] = useState(initialAsset?.hardwareSpecs?.screenSize || '16.0"');

  // Custody & Assignment State
  const [assignedEmployeeId, setAssignedEmployeeId] = useState<string>(
    initialAsset?.assignedToEmployeeId || 'UNASSIGNED'
  );
  const [assignedDepartment, setAssignedDepartment] = useState<string>(
    initialAsset?.department || 'Engineering'
  );
  const [assignedLocation, setAssignedLocation] = useState<string>(
    initialAsset?.currentLocation || workLocations[0] || 'Pune, Maharastra'
  );

  const [notes, setNotes] = useState(initialAsset?.aiNotes || '');
  const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down');

  React.useEffect(() => {
    if (isOpen) {
      setExitDirection('down');
      if (!initialAsset && workLocations.length > 0 && !assignedLocation) {
        setAssignedLocation(workLocations[0]);
      }
    }
  }, [isOpen, initialAsset, workLocations]);

  // Employee Select Options for Searchable Dropdown
  const employeeSelectOptions: SelectOption[] = React.useMemo(() => {
    return [
      {
        value: 'UNASSIGNED',
        label: 'Unassigned (In Inventory / Stock)',
        sublabel: 'Device remains unallocated in central IT asset pool',
      },
      ...employees.map((emp) => ({
        value: emp.id,
        label: `${emp.name} (${emp.employeeCode})`,
        sublabel: `${emp.department} • ${emp.officeLocation || 'Pune, Maharastra'}`,
      })),
    ];
  }, [employees]);

  // Location Select Options
  const locationSelectOptions: SelectOption[] = React.useMemo(() => {
    const locSet = new Set<string>(workLocations.length > 0 ? workLocations : ['Pune, Maharastra']);
    employees.forEach((e) => {
      if (e.officeLocation) locSet.add(e.officeLocation);
    });
    return Array.from(locSet).map((loc) => ({ value: loc, label: loc }));
  }, [workLocations, employees]);

  // Handle Employee Change & Auto-Sync Location/Department
  const handleEmployeeChange = (empId: string) => {
    setAssignedEmployeeId(empId);
    if (empId !== 'UNASSIGNED') {
      const matched = employees.find((e) => e.id === empId || e.employeeCode === empId);
      if (matched) {
        if (matched.department) setAssignedDepartment(matched.department);
        if (matched.officeLocation) setAssignedLocation(matched.officeLocation);
      }
    }
  };

  const handleCancel = () => {
    setExitDirection('up');
    setTimeout(() => {
      onClose();
    }, 0);
  };

  // Multi-Storage Helpers
  const handleAddStorageDrive = () => {
    const newDriveId = `drive-${Date.now()}`;
    setStorageDrives((prev) => [
      ...prev,
      { id: newDriveId, sizeNumber: 1, unit: 'TB', type: 'SATA SSD' },
    ]);
  };

  const handleRemoveStorageDrive = (idToRemove: string) => {
    setStorageDrives((prev) => prev.filter((d) => d.id !== idToRemove));
  };

  const handleUpdateDriveNumber = (id: string, sizeNumber: number) => {
    setStorageDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, sizeNumber } : d))
    );
  };

  const handleUpdateDriveUnit = (id: string, unit: 'GB' | 'TB') => {
    setStorageDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, unit } : d))
    );
  };

  const handleUpdateDriveType = (id: string, type: string) => {
    setStorageDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, type } : d))
    );
  };

  const handleApplyDrivePreset = (id: string, sizeNumber: number, unit: 'GB' | 'TB') => {
    setStorageDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, sizeNumber, unit } : d))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim() || !serialNumber.trim()) {
      alert('Device Name and Serial Number are required.');
      return;
    }

    setExitDirection('up');

    const formattedDrives: StorageDrive[] = storageDrives.map((d) => ({
      id: d.id,
      capacity: `${d.sizeNumber} ${d.unit}`,
      type: d.type as StorageDrive['type'],
    }));

    const primaryDrive = formattedDrives[0];
    const totalStorageGbs = storageDrives.reduce((acc, curr) => {
      const inGbs = curr.unit === 'TB' ? curr.sizeNumber * 1024 : curr.sizeNumber;
      return acc + inGbs;
    }, 0);

    const isAssigned = assignedEmployeeId !== 'UNASSIGNED';
    const assignedEmp = isAssigned
      ? employees.find((e) => e.id === assignedEmployeeId || e.employeeCode === assignedEmployeeId)
      : null;

    onSave({
      deviceName: deviceName.trim(),
      serialNumber: serialNumber.trim().toUpperCase(),
      category,
      manufacturer: manufacturer.trim() || 'Enterprise Hardware',
      brand: manufacturer.trim() || 'Generic Enterprise',
      model: deviceName.trim(),
      productFamily: category,
      sku: `${category.toUpperCase().slice(0, 3)}-${serialNumber.trim().toUpperCase().slice(0, 4)}`,
      releaseYear: 2026,
      lifecycleStatus: isAssigned ? 'Assigned' : 'Inventory',
      currentLocation: assignedLocation || 'Pune, Maharastra',
      department: assignedDepartment || 'Engineering',
      assignedToEmployeeId: isAssigned ? (assignedEmp?.id || assignedEmployeeId) : undefined,
      assignedToEmployeeName: isAssigned ? (assignedEmp?.name || undefined) : undefined,
      assignedDate: isAssigned ? new Date().toISOString().split('T')[0] : undefined,
      hardwareSpecs: {
        cpu: processor,
        processor: processor,
        ramGbs: ramGbs,
        ram: `${ramGbs} GB`,
        storageGbs: totalStorageGbs,
        storageType: primaryDrive?.type?.includes('NVMe') ? 'NVMe' : 'SSD',
        storage: formattedDrives.map((d) => d.capacity).join(' + '),
        storageDrives: formattedDrives,
        screenSize: screenSize,
      },
      procurement: {
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseOrderNo: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        vendorName: manufacturer || 'Direct Enterprise Vendor',
        invoiceNo: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        purchaseCost: Number(purchaseCost) || 0,
        gstPct: 8.5,
        currency: currency,
        budgetCode: 'CAPEX-2026',
        costCenter: 'CC-100-GEN',
        isCapitalized: true,
        procurementMethod: 'Direct Purchase',
      },
      warranty: {
        warrantyStart: new Date().toISOString().split('T')[0],
        warrantyEnd: new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0],
        hasExtendedWarranty: true,
        vendorContactName: manufacturer || 'Enterprise Support',
        supportPhone: '+1-800-555-0199',
        slaDetails: '24x7 4hr Response Time',
        responseTimeHours: 4,
        escalationContact: 'support@assetsphere.internal',
      },
      security: {
        antivirusStatus: 'Active',
        vpnClientStatus: 'Installed',
        bitlockerEnabled: true,
        encryptionStatus: 'Encrypted',
        patchLevel: 'Current (KB-2026-08)',
        securityBaselineScore: 98,
        complianceScore: 99,
        isCompliant: true,
      },
      network: {
        officeLocation: assignedLocation || 'Pune, Maharastra',
      },
      health: {
        overallScore: 98,
        batteryHealthPct: 100,
        deviceAgeMonths: 0,
        repairCount: 0,
        warrantyStatus: 'Active',
        downtimeHoursTotal: 0,
        performanceIndex: 99,
        smartStatus: 'GOOD',
        securityCompliancePct: 99,
      },
      currentValue: Number(purchaseCost) || 0,
      depreciationMethod: 'Straight Line',
      usefulLifeYears: 3,
      salvageValue: Math.round((Number(purchaseCost) || 0) * 0.1),
      totalCostOfOwnership: Number(purchaseCost) || 0,
      aiNotes: notes.trim() || undefined,
      timeline: [],
      chainOfCustody: [],
    });
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={onClose}
      title={initialAsset ? 'Edit Enterprise IT Asset' : 'Register New Enterprise IT Asset'}
      subtitle={`Auto-Generated Asset Identifier: ${assetNumber}`}
      maxWidth="3xl"
      scrollMode="backdrop"
      animationType="slide-up"
      exitDirection={exitDirection}
    >
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full text-xs">
        <div>
          {/* Section 1: General Equipment Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              1. General Equipment Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputSharedComponent
                label="Device Name / Model Title *"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g. MacBook Pro 16 M3 Max"
                required
              />
              <InputSharedComponent
                label="Serial Number (S/N) *"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. C02G4109MD6N"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelectSharedComponent
                label="Equipment Category *"
                value={category}
                options={CATEGORY_OPTIONS}
                onChange={(val) => setCategory(val as AssetCategory)}
              />

              <InputSharedComponent
                label="Manufacturer Brand"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Apple / Dell / Cisco"
              />
            </div>

            {/* Financial Cost & Currency Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputSharedComponent
                label={`Original Purchase Cost (${currency === 'INR' ? '₹' : '$'})`}
                type="number"
                min="0"
                step="any"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(Number(e.target.value))}
              />

              <CustomSelectSharedComponent
                label="Purchase Currency"
                value={currency}
                options={CURRENCY_OPTIONS}
                onChange={(val) => setCurrency(val as 'USD' | 'INR')}
              />
            </div>
          </div>

          {/* Section 2: Hardware Specifications & Performance Details */}
          <div className="space-y-4 pt-8">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              2. Hardware Specifications & Performance Details
            </h4>

            {/* Processor (CPU) */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                Processor (CPU) Architecture
              </label>
              <InputSharedComponent
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                placeholder="e.g. Apple M3 Max / Intel Core i9-14900HX"
              />
              <div className="flex items-center gap-2 overflow-x-auto custom-horizontal-scrollbar pb-1.5 pt-0.5">
                {PROCESSOR_PRESETS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setProcessor(item)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-all ${
                      processor === item
                        ? 'bg-[#0C2086] text-white border-[#0C2086] shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/60 hover:bg-slate-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* System Memory (RAM) - Strict GB Only */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                System Memory (RAM in Gigabytes)
              </label>
              
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="1"
                  max="4096"
                  value={ramGbs || ''}
                  onChange={(e) => setRamGbs(Math.max(1, Number(e.target.value)))}
                  placeholder="e.g. 32"
                  className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 pr-12 text-xs font-mono text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
                <div className="absolute right-2.5 px-2 py-0.5 bg-slate-200 dark:bg-zinc-700 rounded text-[10px] font-semibold text-slate-700 dark:text-zinc-300 pointer-events-none select-none">
                  GB
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto custom-horizontal-scrollbar pb-1.5 pt-0.5">
                {RAM_NUMERIC_PRESETS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRamGbs(val)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-all ${
                      ramGbs === val
                        ? 'bg-[#0C2086] text-white border-[#0C2086] shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/60 hover:bg-slate-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {val} GB
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Multi-Storage Drives Configuration (Number + GB/TB Select) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  Storage Drive Configuration (Dual / Multi-Drive Support)
                </label>
                <button
                  type="button"
                  onClick={handleAddStorageDrive}
                  className="text-[11px] font-semibold text-[#0C2086] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add Secondary Drive
                </button>
              </div>

              <div className="space-y-3">
                {storageDrives.map((drive, idx) => (
                  <div
                    key={drive.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">
                        {idx === 0 ? 'Primary Drive' : `Secondary Drive #${idx + 1}`}
                      </span>
                      {storageDrives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStorageDrive(drive.id)}
                          className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 text-[10px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove Drive
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Storage Capacity with Number Input + GB/TB Unit Dropdown */}
                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                          Storage Capacity
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={drive.sizeNumber || ''}
                            onChange={(e) => handleUpdateDriveNumber(drive.id, Math.max(1, Number(e.target.value)))}
                            placeholder="e.g. 512"
                            className="w-full h-10 text-sm px-3 py-2 rounded-md bg-white dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 hairline-border-strong focus:outline-hidden focus:border-zinc-900 dark:focus:border-white font-mono transition-colors duration-200"
                          />
                          <CustomSelectSharedComponent
                            value={drive.unit}
                            options={STORAGE_UNIT_OPTIONS}
                            onChange={(val) => handleUpdateDriveUnit(drive.id, val as 'GB' | 'TB')}
                            className="w-24 shrink-0"
                            dropdownClassName="!min-w-[90px]"
                          />
                        </div>
                      </div>

                      <CustomSelectSharedComponent
                        label="Drive Type"
                        value={drive.type}
                        options={DRIVE_TYPE_OPTIONS}
                        onChange={(val) => handleUpdateDriveType(drive.id, val)}
                      />
                    </div>

                    {/* Quick Capacity Preset Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto custom-horizontal-scrollbar pb-1.5 pt-0.5">
                      {DRIVE_PRESET_ITEMS.map((preset) => {
                        const isSelected = drive.sizeNumber === preset.sizeNumber && drive.unit === preset.unit;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleApplyDrivePreset(drive.id, preset.sizeNumber, preset.unit)}
                            className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-all ${
                              isSelected
                                ? 'bg-[#0C2086] text-white border-[#0C2086] shadow-xs'
                                : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/60 hover:bg-slate-100 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Display / Screen Size */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                Display / Screen Size
              </label>
              <InputSharedComponent
                value={screenSize}
                onChange={(e) => setScreenSize(e.target.value)}
                placeholder="e.g. 16.0-inch Liquid Retina XDR"
              />
              <div className="flex items-center gap-2 overflow-x-auto custom-horizontal-scrollbar pb-1.5 pt-0.5">
                {SCREEN_SIZE_PRESETS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setScreenSize(item)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-all ${
                      screenSize === item
                        ? 'bg-[#0C2086] text-white border-[#0C2086] shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/60 hover:bg-slate-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Custody, Assignment & Deployment */}
          <div className="space-y-4 pt-8">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              3. Custody, Assignment & Deployment
            </h4>

            {/* Searchable Assign to Employee Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Assign to Team Member / Custodian
              </label>
              <CustomSelectSharedComponent
                value={assignedEmployeeId}
                options={employeeSelectOptions}
                onChange={handleEmployeeChange}
                searchable={true}
                searchPlaceholder="Search employee by name, ID, or department..."
                size="md"
                placeholder="Select an employee or leave unassigned..."
              />
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                Assigning an employee will automatically update the device lifecycle status to <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">Assigned</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                  Primary Deployment Location
                </label>
                <CustomSelectSharedComponent
                  value={assignedLocation}
                  options={locationSelectOptions}
                  onChange={setAssignedLocation}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                  Allocated Department
                </label>
                <CustomSelectSharedComponent
                  value={assignedDepartment}
                  options={DEPARTMENT_SELECT_OPTIONS}
                  onChange={setAssignedDepartment}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Administrative & Provisioning Notes */}
          <div className="space-y-4 pt-8">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              4. Administrative & Provisioning Notes
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Special Instructions, Tagging & Exceptions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add special provisioning instructions, warranty exceptions, vendor RMA references, or custom configuration tags..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg p-3 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all resize-y"
              />
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
            loadingText={initialAsset ? 'Saving Specs...' : 'Registering Device...'}
            className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
            icon={<Plus className="w-3.5 h-3.5 !text-white" />}
          >
            <span className="!text-white font-medium">{initialAsset ? 'Save Asset Specs' : 'Register Device'}</span>
          </ButtonSharedComponent>
        </div>
      </form>
    </ModalSharedComponent>
  );
}
