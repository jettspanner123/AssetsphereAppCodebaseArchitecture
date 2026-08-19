import React, { useState } from 'react';
import { Asset } from '../../types';
import { fetchAssetDiagnostics, AIDiagnosticsResult } from '../../services/aiService';
import MockDataSeederService from '../../services/MockDataSeederService';
import {
  QrCode,
  Sparkles,
  ShieldCheck,
  Cpu,
  DollarSign,
  User,
  Activity,
  Edit,
  GitCommit,
  ArrowRight,
  Warehouse,
  UserCheck,
  FileCheck,
  PackageCheck,
  Mail,
  MapPin,
  Building,
  ShieldAlert,
} from 'lucide-react';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import EmptyStateSharedComponent from '../../Shared/Components/EmptyStateSharedComponent';

export interface AssetDetailModalControllerProps {
  asset: Asset | null;
  onClose: () => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
}

export default function AssetDetailModalController({
  asset,
  onClose,
  onOpenQRBadgeModal,
  onEditAsset,
}: AssetDetailModalControllerProps): React.JSX.Element {
  if (!asset) return <React.Fragment />;

  const [activeTab, setActiveTab] = useState<
    'specs' | 'procurement' | 'warranty' | 'security' | 'timeline' | 'ai_diagnostics'
  >('specs');

  const [aiDiagnostics, setAiDiagnostics] = useState<AIDiagnosticsResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleRunAiDiagnostics = async () => {
    setLoadingAi(true);
    const result = await fetchAssetDiagnostics(asset);
    setAiDiagnostics(result);
    setLoadingAi(false);
  };

  const hasCustodyHistory = asset.chainOfCustody && asset.chainOfCustody.length > 0;
  const hasHardwareSpecs = Boolean(asset.hardwareSpecs?.cpu || asset.hardwareSpecs?.ramGbs || asset.hardwareSpecs?.storageGbs);

  // Look up full employee record from MockDataSeederService
  const employees = MockDataSeederService.current.getEmployees();
  const assignedEmployee = employees.find(
    (e) => e.id === asset.assignedToEmployeeId || e.name === asset.assignedToEmployeeName
  );

  // Construct alternating roadmap milestones starting from Intake -> Provisioning -> Custody Events
  const roadmapEvents = [
    {
      id: 'EVT-INTAKE',
      title: 'Vendor Procurement & Intake',
      timestamp: asset.procurement?.purchaseDate || 'Initial Intake',
      description: `Received from ${asset.procurement?.vendorName || 'Enterprise Vendor'} into HQ Storage. Barcode #${asset.barcodeValue} assigned.`,
      icon: <Warehouse className="w-4 h-4 text-slate-600 dark:text-zinc-300" />,
      signature: 'Inspected by HQ Warehouse QA',
    },
    {
      id: 'EVT-[#0C2086]',
      title: 'IT Staging & Security Baseline',
      timestamp: asset.procurement?.purchaseDate ? `${asset.procurement.purchaseDate}` : 'Provisioned',
      description: `Device provisioned with enterprise security baseline, BitLocker encryption, and CrowdStrike agent.`,
      icon: <PackageCheck className="w-4 h-4 text-slate-600 dark:text-zinc-300" />,
      signature: 'Approved by IT Operations',
    },
    ...(asset.chainOfCustody?.map((record) => ({
      id: record.id,
      title: `${record.fromEntity} → ${record.toEntity}`,
      timestamp: record.timestamp,
      description: record.notes || `Custody transferred to ${record.toEntity}. Approved by ${record.approvedBy || 'Department Lead'}.`,
      icon: <UserCheck className="w-4 h-4" />,
      signature: record.hasDigitalSignature ? `Digital Signature: ${record.employeeSignatureName}` : undefined,
    })) || []),
  ];

  return (
    <ModalSharedComponent
      isOpen={Boolean(asset)}
      onClose={onClose}
      title={`${asset.deviceName} (${asset.assetNumber})`}
      subtitle={`${asset.manufacturer} ${asset.model} • S/N: ${asset.serialNumber}`}
      maxWidth="5xl"
      minHeight="min-h-[540px]"
    >
      <div className="space-y-6">
        {/* Action Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <BadgeSharedComponent
              variant={asset.security?.isCompliant ? 'success' : 'danger'}
              size="md"
              showDot
            >
              {asset.lifecycleStatus}
            </BadgeSharedComponent>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
              Valuation: ${asset.currentValue?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ButtonSharedComponent
              variant="ghost"
              size="sm"
              onClick={() => onOpenQRBadgeModal(asset)}
              icon={<QrCode className="w-3.5 h-3.5" />}
            >
              Print Badge
            </ButtonSharedComponent>
            <ButtonSharedComponent
              variant="outline"
              size="sm"
              onClick={() => onEditAsset(asset)}
              icon={<Edit className="w-3.5 h-3.5" />}
            >
              Edit Specs
            </ButtonSharedComponent>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-200 dark:border-zinc-800">
          {[
            { id: 'specs', label: 'Hardware Specs' },
            { id: 'procurement', label: 'Procurement & Finance' },
            { id: 'warranty', label: 'Warranty & Telemetry' },
            { id: 'security', label: 'Security & Compliance' },
            { id: 'timeline', label: 'Chain of Custody' },
            { id: 'ai_diagnostics', label: 'AI Risk Report' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-zinc-900 text-slate-900 dark:border-white dark:text-white font-semibold'
                  : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'specs' && (
          hasHardwareSpecs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <CardSharedComponent>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 font-serif-headline flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-500" /> Compute & Storage
                </h4>
                <div className="space-y-2 text-slate-600 dark:text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Processor (CPU):</span>
                    <span className="font-mono">{asset.hardwareSpecs?.cpu || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">RAM Memory:</span>
                    <span className="font-mono">{asset.hardwareSpecs?.ramGbs ? `${asset.hardwareSpecs.ramGbs} GB` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Disk Storage:</span>
                    <span className="font-mono">{asset.hardwareSpecs?.storageGbs ? `${asset.hardwareSpecs.storageGbs} GB ${asset.hardwareSpecs.storageType || ''}` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">MAC Address:</span>
                    <span className="font-mono">{asset.hardwareSpecs?.ethernetMac || asset.hardwareSpecs?.wifiMac || 'N/A'}</span>
                  </div>
                </div>
              </CardSharedComponent>

              <CardSharedComponent>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 font-serif-headline flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" /> Allocation & Location
                </h4>
                <div className="space-y-2 text-slate-600 dark:text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Assigned User:</span>
                    <span className="font-medium">{asset.assignedToEmployeeName || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Department:</span>
                    <span>{asset.department || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Primary Office:</span>
                    <span>{asset.currentLocation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Cost Center:</span>
                    <span className="font-mono">{asset.costCenter || 'N/A'}</span>
                  </div>
                </div>
              </CardSharedComponent>
            </div>
          ) : (
            <EmptyStateSharedComponent
              icon={<Cpu className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
              title="Hardware Specifications Pending"
              description="Technical hardware specs such as CPU cores, RAM capacity, and storage types have not been indexed for this device tag."
              actionButton={
                <ButtonSharedComponent variant="outline" size="sm" onClick={() => onEditAsset(asset)}>
                  Populate Specs
                </ButtonSharedComponent>
              }
            />
          )
        )}

        {activeTab === 'procurement' && (
          asset.procurement ? (
            <CardSharedComponent className="space-y-3 text-xs">
              <h4 className="font-semibold text-slate-900 dark:text-white font-serif-headline flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Financial Details
              </h4>
              <div className="grid grid-cols-2 gap-4 text-slate-600 dark:text-zinc-300">
                <div>
                  <span className="text-slate-400 font-medium">Purchase Order:</span>
                  <p className="font-mono font-medium">{asset.procurement?.purchaseOrderNo || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Original Cost:</span>
                  <p className="font-mono font-medium">${asset.procurement?.purchaseCost?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Vendor:</span>
                  <p className="font-medium">{asset.procurement?.vendorName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Purchase Date:</span>
                  <p className="font-mono">{asset.procurement?.purchaseDate || 'N/A'}</p>
                </div>
              </div>
            </CardSharedComponent>
          ) : (
            <EmptyStateSharedComponent
              icon={<DollarSign className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
              title="No Procurement Ledger Data"
              description="Purchase order invoices, vendor contracts, and capitalization ledger records are not linked to this asset."
            />
          )
        )}

        {activeTab === 'warranty' && (
          asset.warranty || asset.health ? (
            <CardSharedComponent className="space-y-3 text-xs">
              <h4 className="font-semibold text-slate-900 dark:text-white font-serif-headline flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" /> Health Telemetry & Warranty
              </h4>
              <div className="grid grid-cols-2 gap-4 text-slate-600 dark:text-zinc-300">
                <div>
                  <span className="text-slate-400 font-medium">Health Score:</span>
                  <p className="font-mono font-bold text-emerald-500 text-sm">{asset.health?.overallScore || 0}%</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Battery Health:</span>
                  <p className="font-mono font-bold">{asset.health?.batteryHealthPct ? `${asset.health.batteryHealthPct}%` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Warranty End:</span>
                  <p className="font-mono">{asset.warranty?.warrantyEnd || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Repair History Count:</span>
                  <p className="font-mono">{asset.health?.repairCount || 0} maintenance events</p>
                </div>
              </div>
            </CardSharedComponent>
          ) : (
            <EmptyStateSharedComponent
              icon={<Activity className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
              title="Telemetry Stream Inactive"
              description="Live hardware health diagnostic streams and vendor AMC warranty contracts are not active for this hardware tag."
            />
          )
        )}

        {activeTab === 'security' && (
          asset.security ? (
            <CardSharedComponent className="space-y-3 text-xs">
              <h4 className="font-semibold text-slate-900 dark:text-white font-serif-headline flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-500" /> Endpoint Security Audit
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Disk Encryption Status</span>
                  <BadgeSharedComponent variant={asset.security?.encryptionStatus === 'Encrypted' ? 'success' : 'danger'} size="sm">
                    {asset.security?.encryptionStatus || 'UNENCRYPTED'}
                  </BadgeSharedComponent>
                </div>
                <div className="flex items-center justify-between">
                  <span>Antivirus Status</span>
                  <BadgeSharedComponent variant={asset.security?.antivirusStatus === 'Active' ? 'success' : 'danger'} size="sm">
                    {asset.security?.antivirusStatus || 'MISSING'}
                  </BadgeSharedComponent>
                </div>
                <div className="flex items-center justify-between">
                  <span>OS Patch Level</span>
                  <span className="font-mono text-slate-500">{asset.security?.patchLevel || 'N/A'}</span>
                </div>
              </div>
            </CardSharedComponent>
          ) : (
            <EmptyStateSharedComponent
              icon={<ShieldCheck className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
              title="Security Audit Handshake Pending"
              description="Endpoint security telemetry, CrowdStrike agent updates, and BitLocker disk encryption reports have not been received."
            />
          )
        )}

        {/* Alternating Center-Line Roadmap Timeline & Authentic Custodian Card */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 text-xs">
            {/* Authentic Current Custodian Card */}
            <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                  {assignedEmployee?.avatarUrl ? (
                    <img
                      src={assignedEmployee.avatarUrl}
                      alt={asset.assignedToEmployeeName || 'Custodian'}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shadow-2xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#0C2086]/10 text-[#0C2086] dark:bg-indigo-950/60 dark:text-indigo-400 border border-[#0C2086]/20 font-bold flex items-center justify-center text-sm font-mono shadow-2xs">
                      {asset.assignedToEmployeeName
                        ? asset.assignedToEmployeeName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                        : 'HQ'}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-serif-headline">
                        {asset.assignedToEmployeeName || 'HQ Inventory Pool'}
                      </h4>
                      {assignedEmployee?.employeeCode && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold">
                          {assignedEmployee.employeeCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {assignedEmployee?.designation || `${asset.department} Department Lead`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20 flex items-center gap-1">
                    <FileCheck className="w-3 h-3" /> VERIFIED CUSTODIAN
                  </span>
                </div>
              </div>

              {/* Custody Ledger Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-semibold">
                    <Building className="w-3 h-3 text-slate-400" /> Department & Unit
                  </span>
                  <p className="font-medium text-slate-800 dark:text-zinc-200">
                    {assignedEmployee?.department || asset.department}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                    {assignedEmployee?.businessUnit || asset.businessUnit} • {assignedEmployee?.costCenter || asset.costCenter}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3 h-3 text-slate-400" /> Verified Location
                  </span>
                  <p className="font-medium text-slate-800 dark:text-zinc-200">
                    {assignedEmployee?.officeLocation || asset.currentLocation}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                    {assignedEmployee?.floor ? `${assignedEmployee.floor} (${assignedEmployee.desk})` : 'Primary Facility'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-semibold">
                    <Mail className="w-3 h-3 text-slate-400" /> Contact & Audit Date
                  </span>
                  <p className="font-medium text-slate-800 dark:text-zinc-200 truncate">
                    {assignedEmployee?.email || 'custody@enterprise.com'}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                    Assigned: {asset.assignedDate || '2023-11-20'} • {asset.lastVerifiedDate ? `Last Audit: ${asset.lastVerifiedDate}` : 'Audit Active'}
                  </p>
                </div>
              </div>
            </div>

            {/* Alternating Center Line Roadmap Container */}
            <div className="relative py-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white font-serif-headline text-xs flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-indigo-500" /> Complete Custody Transfer History
                </h4>
                <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                  {roadmapEvents.length} Lifecycle Milestones
                </span>
              </div>

              {/* Central Spine Line */}
              <div className="absolute left-1/2 top-10 bottom-2 w-0.5 -translate-x-1/2 bg-slate-200 dark:bg-zinc-800" />

              <div className="space-y-8 relative">
                {roadmapEvents.map((event, idx) => {
                  const isLeft = idx % 2 === 0;
                  const isLatest = idx === roadmapEvents.length - 1;

                  return (
                    <div key={event.id} className="relative flex items-center w-full min-h-[90px]">
                      {/* Centered Node Icon on the Spine */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs z-10 ${
                          isLatest
                            ? 'bg-[#0C2086] text-white ring-4 ring-[#0C2086]/20'
                            : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700'
                        }`}
                      >
                        {event.icon}
                      </div>

                      {/* Left Side Container */}
                      <div className="w-1/2 pr-6 sm:pr-8">
                        {isLeft && (
                          <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs space-y-2 text-left transition-all hover:border-slate-300 dark:hover:border-zinc-700">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                                {event.title}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">
                                {event.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                              {event.description}
                            </p>
                            {event.signature && (
                              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <FileCheck className="w-3 h-3 shrink-0" />
                                <span>{event.signature}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Side Container */}
                      <div className="w-1/2 pl-6 sm:pl-8">
                        {!isLeft && (
                          <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-2xs space-y-2 text-left transition-all hover:border-slate-300 dark:hover:border-zinc-700">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                                {event.title}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">
                                {event.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                              {event.description}
                            </p>
                            {event.signature && (
                              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <FileCheck className="w-3 h-3 shrink-0" />
                                <span>{event.signature}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai_diagnostics' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 dark:text-zinc-400">
                Generate an instant AI failure risk assessment using Gemini 3.6 Flash.
              </p>
              <ButtonSharedComponent
                variant="primary"
                size="sm"
                onClick={handleRunAiDiagnostics}
                disabled={loadingAi}
                className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
                icon={<Sparkles className="w-4 h-4 !text-white" />}
              >
                <span className="!text-white font-medium">{loadingAi ? 'Analyzing Hardware...' : 'Run Diagnostics'}</span>
              </ButtonSharedComponent>
            </div>

            {aiDiagnostics ? (
              <CardSharedComponent glow="orange" variant="elevated" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white font-serif-headline text-sm">
                    Failure Risk Assessment:
                  </span>
                  <BadgeSharedComponent
                    variant={
                      aiDiagnostics.failureRiskLevel === 'HIGH' || aiDiagnostics.failureRiskLevel === 'CRITICAL'
                        ? 'danger'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {aiDiagnostics.failureRiskLevel} RISK
                  </BadgeSharedComponent>
                </div>
                <p className="text-slate-700 dark:text-zinc-200">{aiDiagnostics.healthSummary}</p>

                <div>
                  <h5 className="font-semibold text-slate-900 dark:text-white mb-1">Recommended Decision:</h5>
                  <p className="font-mono text-sky-600 dark:text-sky-400">{aiDiagnostics.recommendedAction}</p>
                </div>
              </CardSharedComponent>
            ) : (
              <EmptyStateSharedComponent
                icon={<Sparkles className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
                title="AI Failure Risk Report Uncompiled"
                description="Click 'Run Diagnostics' above to perform automated Gemini 3.6 Flash risk analysis across this device's hardware age, battery health, and telemetry logs."
              />
            )}
          </div>
        )}
      </div>
    </ModalSharedComponent>
  );
}
