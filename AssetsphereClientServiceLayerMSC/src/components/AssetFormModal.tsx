import React, { useState } from 'react';
import { Asset, AssetCategory, AssetSubtype, LifecycleStatus } from '../types';
import { X, CheckCircle2, Laptop } from 'lucide-react';

interface AssetFormModalProps {
  initialAsset?: Asset | null;
  onSave: (assetData: Partial<Asset>) => void;
  onClose: () => void;
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  initialAsset,
  onSave,
  onClose,
}) => {
  const [deviceName, setDeviceName] = useState(initialAsset?.deviceName || '');
  const [assetNumber, setAssetNumber] = useState(
    initialAsset?.assetNumber || `AST-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [category, setCategory] = useState<AssetCategory>(initialAsset?.category || 'Computing');
  const [subtype, setSubtype] = useState<AssetSubtype>(initialAsset?.subtype || 'Laptop');
  const [serialNumber, setSerialNumber] = useState(initialAsset?.serialNumber || '');
  const [companyTag, setCompanyTag] = useState(initialAsset?.companyTag || '');
  const [hostname, setHostname] = useState(initialAsset?.hostname || '');
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
      companyTag: companyTag || `TAG-${serialNumber.slice(-4)}`,
      hostname: hostname || `${department.slice(0, 3).toUpperCase()}-${deviceName.replace(/\s+/g, '-').toUpperCase()}`,
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
        supportPhone: '+1 (800) 555-0199',
        slaDetails: 'Next Business Day Onsite Care',
        responseTimeHours: 24,
        escalationContact: 'support@vendor.com',
      },
      security: {
        antivirusStatus: 'Active',
        vpnClientStatus: 'Installed',
        bitlockerEnabled: true,
        encryptionStatus: 'Encrypted',
        patchLevel: 'Compliant',
        securityBaselineScore: 95,
        complianceScore: 100,
        isCompliant: true,
      },
      network: { officeLocation: 'HQ - San Francisco' },
      health: {
        overallScore: 98,
        deviceAgeMonths: 0,
        repairCount: 0,
        warrantyStatus: 'Active',
        downtimeHoursTotal: 0,
        performanceIndex: 100,
        securityCompliancePct: 100,
      },
      currentValue: purchaseCost,
      depreciationMethod: 'Straight Line',
      usefulLifeYears: 4,
      salvageValue: Math.round(purchaseCost * 0.1),
      totalCostOfOwnership: purchaseCost,
      timeline: [
        {
          id: `TL-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          eventType: 'Purchased',
          title: 'Asset Logged into Inventory',
          description: 'Added via AssetSphere Enterprise UI.',
          actorName: 'Alexander Wright',
        },
      ],
      chainOfCustody: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#161618] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-300">
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-[600] text-base text-white">
            <Laptop className="w-5 h-5 text-indigo-400" />
            {initialAsset ? 'Edit Asset Profile' : 'Register New Asset'}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Device / Asset Name *</label>
              <input
                type="text"
                required
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g. MacBook Pro 16 M3 Max"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Asset Tag Number</label>
              <input
                type="text"
                value={assetNumber}
                onChange={(e) => setAssetNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-indigo-400 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
              >
                <option value="Computing">Computing</option>
                <option value="Mobile">Mobile</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Storage">Storage</option>
                <option value="Networking">Networking</option>
                <option value="Security Devices">Security Devices</option>
                <option value="Office Equipment">Office Equipment</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Software Assets">Software Assets</option>
                <option value="Cloud Assets">Cloud Assets</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Serial Number *</label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. C02GX920MD6R"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none placeholder-slate-600"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Manufacturer / Brand</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Apple / Dell / Cisco"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none placeholder-slate-600"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Purchase Cost ($)</label>
              <input
                type="number"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Lifecycle State</label>
              <select
                value={lifecycleStatus}
                onChange={(e) => setLifecycleStatus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
              >
                <option value="Inventory">Inventory Stock</option>
                <option value="In Use">In Use / Assigned</option>
                <option value="Repair">Repair / Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
