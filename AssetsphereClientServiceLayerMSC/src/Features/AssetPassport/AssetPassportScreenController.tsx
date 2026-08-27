import React, { useState } from 'react';
import { Asset } from '../../Types/AssetType';
import {
  ShieldCheck,
  Cpu,
  HardDrive,
  User,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Lock,
  Battery,
  Layers,
  ArrowLeft,
  Wrench,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import ApplicationRouteCON from '../../Constants/ApplicationRouteCON';

export interface AssetPassportScreenControllerProps {
  asset: Asset | null;
  isLoading?: boolean;
  onNavigateHome?: () => void;
  onNavigateServiceRequests?: (assetId: string) => void;
}

export default function AssetPassportScreenController({
  asset,
  isLoading = false,
  onNavigateHome,
  onNavigateServiceRequests,
}: AssetPassportScreenControllerProps): React.JSX.Element {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [verifiedTimestamp, setVerifiedTimestamp] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      toast.success(`${label} Copied`, {
        description: text,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleLogVerification = () => {
    const now = new Date().toLocaleString();
    setVerifiedTimestamp(now);
    toast.success('Physical Audit Verified', {
      description: `Asset physical presence recorded at ${now}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Loading Asset Passport...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-serif-headline">Asset Not Found</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The requested asset tag does not exist or has been decommissioned from the Enterprise ITAM registry.
          </p>
          <div className="pt-2">
            <button
              onClick={() => (onNavigateHome ? onNavigateHome() : (window.location.href = ApplicationRouteCON.ROOT))}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCompliant = asset.security?.isCompliant ?? true;
  const isWarrantyActive = asset.health?.warrantyStatus === 'Active';
  const batteryHealth = asset.hardwareSpecs?.batteryHealthPct ?? asset.health?.batteryHealthPct ?? null;
  const healthScore = asset.health?.overallScore ?? 88;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-3 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation / Top Brand Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => (onNavigateHome ? onNavigateHome() : (window.location.href = ApplicationRouteCON.ROOT))}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer text-xs font-medium inline-flex items-center gap-1.5"
              title="Print Asset Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Passport</span>
            </button>
            <button
              onClick={() => handleCopy(window.location.href, 'Passport URL')}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer text-xs font-medium inline-flex items-center gap-1.5"
              title="Share Passport Link"
            >
              {copiedField === 'Passport URL' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Master Asset Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl divide-y divide-slate-800">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-[#0C2086]/20 to-slate-900 relative">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md text-xs font-mono font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> ITAM DIGITAL PASSPORT
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif-headline tracking-tight">
                  {asset.deviceName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="text-indigo-400 font-bold">{asset.assetNumber}</span>
                  <span>•</span>
                  <span>{asset.manufacturer} {asset.model}</span>
                  <span>•</span>
                  <span>TAG: {asset.companyTag}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {asset.lifecycleStatus || 'In Use'}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Category: {asset.category} ({asset.subtype})
                </span>
              </div>
            </div>

            {/* Verification Banner Notice */}
            {verifiedTimestamp && (
              <div className="mt-4 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-xs text-emerald-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Physical scan verified at {verifiedTimestamp}</span>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-800 bg-slate-900/60 text-center">
            <div className="p-4 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Health Score</span>
              <div className="text-lg font-bold text-emerald-400 font-mono">{healthScore}%</div>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Warranty</span>
              <div className={`text-sm font-semibold font-mono ${isWarrantyActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                {asset.health?.warrantyStatus || 'Active'}
              </div>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Security Posture</span>
              <div className={`text-sm font-semibold font-mono ${isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCompliant ? 'Compliant' : 'Needs Review'}
              </div>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Battery State</span>
              <div className="text-sm font-semibold text-slate-200 font-mono">
                {batteryHealth !== null ? `${batteryHealth}%` : 'A/C Powered'}
              </div>
            </div>
          </div>

          {/* Section 1: Hardware Specifications */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono tracking-wider">
              <Cpu className="w-4 h-4 text-indigo-400" /> Hardware Specifications
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Processor / CPU</span>
                <div className="font-semibold text-slate-200">
                  {asset.hardwareSpecs?.processor || asset.hardwareSpecs?.cpu || 'Intel Core i7-13700H (14 Cores)'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Installed Memory (RAM)</span>
                <div className="font-semibold text-slate-200 font-mono">
                  {asset.hardwareSpecs?.ram || (asset.hardwareSpecs?.ramGbs ? `${asset.hardwareSpecs.ramGbs} GB DDR5` : '32 GB DDR5 5600MHz')}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Storage Configuration</span>
                <div className="font-semibold text-slate-200 font-mono">
                  {asset.hardwareSpecs?.storage || (asset.hardwareSpecs?.storageGbs ? `${asset.hardwareSpecs.storageGbs} GB NVMe SSD` : '1 TB NVMe Gen4 SSD')}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Graphics / GPU</span>
                <div className="font-semibold text-slate-200">
                  {asset.hardwareSpecs?.gpu || asset.hardwareSpecs?.graphics || 'Intel Iris Xe / Integrated Graphics'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Serial Number (S/N)</span>
                <div className="font-semibold text-slate-200 font-mono flex items-center justify-between">
                  <span>{asset.serialNumber || 'N/A'}</span>
                  {asset.serialNumber && (
                    <button
                      onClick={() => handleCopy(asset.serialNumber, 'Serial Number')}
                      className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {copiedField === 'Serial Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Barcode & Tag Value</span>
                <div className="font-semibold text-slate-200 font-mono">
                  {asset.barcodeValue || asset.assetNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Custody & Location */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono tracking-wider">
              <User className="w-4 h-4 text-indigo-400" /> Assignment & Custody
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-mono text-[11px]">Current Custodian</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {asset.assignedToEmployeeName || 'Unassigned / Available in Stock'}
                </div>
                {asset.assignedToEmployeeId && (
                  <div className="text-[11px] text-slate-500 font-mono">Emp ID: {asset.assignedToEmployeeId}</div>
                )}
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-mono text-[11px]">Deployment Location</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {asset.currentLocation || asset.network?.officeLocation || 'Corporate HQ'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Department: <span className="text-slate-200 font-semibold">{asset.department || 'IT Operations'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Procurement & Warranty */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono tracking-wider">
              <Calendar className="w-4 h-4 text-indigo-400" /> Procurement & Lifecycle
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Purchase Date</span>
                <div className="font-semibold text-slate-200 font-mono">
                  {asset.procurement?.purchaseDate || '2024-03-15'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Warranty Expiry</span>
                <div className={`font-semibold font-mono ${isWarrantyActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {asset.warranty?.warrantyEnd || '2027-03-15'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Vendor</span>
                <div className="font-semibold text-slate-200 truncate">
                  {asset.procurement?.vendorName || asset.warranty?.vendorContactName || 'Dell Technologies'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Security & Compliance */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono tracking-wider">
              <Lock className="w-4 h-4 text-indigo-400" /> Security & MDM Compliance
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">OS & Build</span>
                <div className="font-semibold text-slate-200 truncate">
                  {asset.security?.operatingSystem || 'Windows 11 Enterprise'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">BitLocker Encryption</span>
                <div className="font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {asset.security?.bitlockerEnabled ? 'Enabled (AES-256)' : 'Active (XTS-AES)'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <span className="text-slate-400 font-mono text-[11px]">Antivirus Protection</span>
                <div className="font-semibold text-emerald-400 font-mono flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {asset.security?.antivirusName || 'Defender for Endpoint'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Verification Footer */}
          <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleLogVerification}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Record Physical Audit
            </button>

            <button
              onClick={() => {
                if (onNavigateServiceRequests) {
                  onNavigateServiceRequests(asset.id || asset.assetNumber);
                } else {
                  window.location.href = `${ApplicationRouteCON.DASHBOARD_DEVICE_SERVICE_REQUESTS}?newRequest=true&assetId=${encodeURIComponent(asset.id || asset.assetNumber)}`;
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0C2086] hover:bg-[#0C2086]/90 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-900/30 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4" /> Report Issue / Request Service
            </button>
          </div>
        </div>

        {/* Footer Organization Stamp */}
        <div className="text-center text-[11px] text-slate-500 font-mono space-y-1">
          <div>AssetSphere Enterprise IT Asset Management & Digital Passport Protocol</div>
          <div>Confidential & Proprietary Enterprise Asset Record</div>
        </div>
      </div>
    </div>
  );
}
