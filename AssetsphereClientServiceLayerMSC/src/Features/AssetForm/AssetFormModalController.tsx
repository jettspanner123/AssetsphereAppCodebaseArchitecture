import React, { useState } from 'react';
import { Asset, AssetCategory, AssetSubtype, LifecycleStatus } from '../../types';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import InputSharedComponent from '../../Shared/Components/InputSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import { Plus } from 'lucide-react';
import CustomSelectSharedComponent, { SelectOption } from '../../Shared/Components/CustomSelectSharedComponent';

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'Computing', label: 'Computing', sublabel: 'Laptops, Desktops & Workstations' },
  { value: 'Mobile', label: 'Mobile', sublabel: 'Smartphones & Tablets' },
  { value: 'Peripherals', label: 'Peripherals', sublabel: 'Monitors, Docks & Keyboards' },
  { value: 'Storage', label: 'Storage', sublabel: 'SAN, NAS & Disk Arrays' },
  { value: 'Networking', label: 'Networking', sublabel: 'Switches, Routers & Firewalls' },
  { value: 'Security Devices', label: 'Security Devices', sublabel: 'Hardware Security Keys & HSMs' },
  { value: 'Infrastructure', label: 'Infrastructure', sublabel: 'UPS, Racks & Power Distribution' },
];

const DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: 'Engineering', label: 'Engineering', sublabel: 'Software & Infrastructure Development' },
  { value: 'Design', label: 'Design', sublabel: 'UX Research & Product Design' },
  { value: 'Product', label: 'Product', sublabel: 'Product Management & Growth' },
  { value: 'Finance', label: 'Finance', sublabel: 'Global Financial Planning & Treasury' },
  { value: 'Human Resources', label: 'Human Resources', sublabel: 'People Operations & Talent' },
  { value: 'IT Operations', label: 'IT Operations', sublabel: 'Enterprise Infrastructure & Support' },
];

export interface AssetFormModalControllerProps {
  isOpen: boolean;
  initialAsset?: Asset | null;
  onSave: (assetData: Partial<Asset>) => void;
  onClose: () => void;
}

export default function AssetFormModalController({
  isOpen,
  initialAsset,
  onSave,
  onClose,
}: AssetFormModalControllerProps): React.JSX.Element {
  const [deviceName, setDeviceName] = useState(initialAsset?.deviceName || '');
  const [assetNumber] = useState(
    initialAsset?.assetNumber || `AST-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [category, setCategory] = useState<AssetCategory>(initialAsset?.category || 'Computing');
  const [subtype, setSubtype] = useState<AssetSubtype>(initialAsset?.subtype || 'Laptop');
  const [serialNumber, setSerialNumber] = useState(initialAsset?.serialNumber || '');
  const [manufacturer, setManufacturer] = useState(initialAsset?.manufacturer || '');
  const [model, setModel] = useState(initialAsset?.model || '');
  const [purchaseCost, setPurchaseCost] = useState(initialAsset?.procurement?.purchaseCost || 1200);
  const [vendorName, setVendorName] = useState(initialAsset?.procurement?.vendorName || 'Insight Direct');
  const [department, setDepartment] = useState(initialAsset?.department || 'Engineering');
  const [lifecycleStatus, setLifecycleStatus] = useState<LifecycleStatus>(
    initialAsset?.lifecycleStatus || 'Inventory'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName || !serialNumber) {
      alert('Device Name and Serial Number are required.');
      return;
    }

    onSave({
      id: initialAsset?.id || `AST-${Date.now()}`,
      deviceName,
      assetNumber,
      category,
      subtype,
      serialNumber,
      companyTag: `TAG-${serialNumber.slice(-4)}`,
      hostname: `${department.slice(0, 3).toUpperCase()}-${deviceName.replace(/\s+/g, '-').toUpperCase()}`,
      manufacturer: manufacturer || 'Enterprise Vendor',
      model: model || deviceName,
      brand: manufacturer || 'Enterprise',
      productFamily: category,
      sku: `SKU-${serialNumber.slice(0, 6)}`,
      releaseYear: 2024,
      lifecycleStatus,
      currentLocation: 'HQ Warehouse',
      department,
      businessUnit: 'Corporate Operations',
      costCenter: 'CC-100-GEN',
      barcodeValue: serialNumber.replace(/[^0-9]/g, '') || '904100990011',
      procurement: {
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseOrderNo: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        vendorName,
        invoiceNo: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        purchaseCost,
        gstPct: 8.5,
        currency: 'USD',
        budgetCode: 'CAPEX-2026',
        costCenter: 'CC-100-GEN',
        isCapitalized: true,
        procurementMethod: 'Direct Purchase',
      },
      warranty: {
        warrantyStart: new Date().toISOString().split('T')[0],
        warrantyEnd: new Date(Date.now() + 3 * 365 * 86400000).toISOString().split('T')[0],
        hasExtendedWarranty: true,
        vendorContactName: vendorName,
        supportPhone: '+1-800-555-0199',
        slaDetails: '24x7 4hr Response',
        responseTimeHours: 4,
        escalationContact: 'support@vendor.com',
      },
      security: {
        antivirusStatus: 'Active',
        vpnClientStatus: 'Installed',
        bitlockerEnabled: true,
        encryptionStatus: 'Encrypted',
        patchLevel: 'Windows 11 23H2 (Build 22631)',
        securityBaselineScore: 95,
        complianceScore: 98,
        isCompliant: true,
      },
      network: {
        officeLocation: 'HQ Office',
      },
      health: {
        overallScore: 95,
        batteryHealthPct: 100,
        deviceAgeMonths: 1,
        repairCount: 0,
        warrantyStatus: 'Active',
        downtimeHoursTotal: 0,
        performanceIndex: 98,
        securityCompliancePct: 100,
      },
      currentValue: purchaseCost,
      depreciationMethod: 'Straight Line',
      usefulLifeYears: 4,
      salvageValue: 100,
      totalCostOfOwnership: purchaseCost + 200,
      timeline: [],
      chainOfCustody: [],
    });
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={onClose}
      title={initialAsset ? 'Edit IT Asset Specification' : 'Register New Enterprise IT Asset'}
      subtitle={`Asset Tag Assigned: ${assetNumber}`}
      maxWidth="3xl"
      minHeight="min-h-[460px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full min-h-[420px] text-xs">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomSelectSharedComponent
              label="Equipment Category"
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={(val) => setCategory(val as AssetCategory)}
            />

            <CustomSelectSharedComponent
              label="Department Allocation"
              value={department}
              options={DEPARTMENT_OPTIONS}
              onChange={(val) => setDepartment(val)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputSharedComponent
              label="Manufacturer Brand"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="e.g. Apple / Dell / Cisco"
            />
            <InputSharedComponent
              label="Original Purchase Cost ($)"
              type="number"
              value={purchaseCost}
              onChange={(e) => setPurchaseCost(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 mt-8 border-t border-slate-200 dark:border-zinc-800 shrink-0">
          <ButtonSharedComponent variant="outline" size="sm" onClick={onClose}>
            Cancel
          </ButtonSharedComponent>
          <ButtonSharedComponent
            type="submit"
            variant="primary"
            size="sm"
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
