import React, { useState } from 'react';
import { Asset, TimelineEvent, ChainOfCustodyRecord } from '../Types/AssetType';
import { fetchAssetDiagnostics, AIDiagnosticsResult } from '../Services/aiService';
import {
  X,
  QrCode,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  HardDrive,
  DollarSign,
  Calendar,
  Wrench,
  CheckCircle2,
  Clock,
  User,
  FileText,
  Building,
  Key,
  Laptop,
  Activity,
  AlertTriangle,
  RefreshCw,
  Printer,
  Edit,
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onOpenTicket: (asset: Asset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onOpenQRBadgeModal,
  onEditAsset,
  onOpenTicket,
}) => {
  const [activeTab, setActiveTab] = useState<
    'specs' | 'procurement' | 'warranty' | 'security' | 'software' | 'timeline' | 'ai_diagnostics'
  >('specs');

  const [aiDiagnostics, setAiDiagnostics] = useState<AIDiagnosticsResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleRunAiDiagnostics = async () => {
    setLoadingAi(true);
    const result = await fetchAssetDiagnostics(asset);
    setAiDiagnostics(result);
    setLoadingAi(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-end p-0 md:p-4">
      <div className="bg-[#161618] border-l md:border border-slate-800 w-full max-w-4xl h-full md:h-[92vh] md:rounded-2xl shadow-2xl flex flex-col text-slate-300 overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-900">
                  {asset.assetNumber}
                </span>
                <span className="text-xs text-slate-500 font-mono">Serial: {asset.serialNumber}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{asset.deviceName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {asset.manufacturer} {asset.model} • {asset.category} ({asset.subtype})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenQRBadgeModal(asset)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4 text-indigo-400" /> Print Tag
            </button>
            <button
              onClick={() => onEditAsset(asset)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-4 h-4 text-indigo-400" /> Edit
            </button>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900/50 px-5 border-b border-slate-800 text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'specs', label: 'Hardware Specs' },
            { id: 'procurement', label: 'Procurement & Financials' },
            { id: 'warranty', label: 'Warranty & AMC' },
            { id: 'security', label: 'Security & Compliance' },
            { id: 'software', label: 'Installed Software' },
            { id: 'timeline', label: 'Timeline & Custody' },
            { id: 'ai_diagnostics', label: 'AI Health Diagnostics', isAi: true },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? tab.isAi
                    ? 'text-indigo-400 border-indigo-500 font-semibold'
                    : 'text-white border-indigo-500 font-semibold'
                  : 'text-slate-500 hover:text-slate-300 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-[#161618] text-xs">
          {/* TAB 1: Hardware Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" /> Compute & Memory
                  </h3>
                  <div className="space-y-1.5 text-slate-300 font-mono text-xs pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Processor:</span>
                      <span className="text-slate-200">{asset.hardwareSpecs?.cpu || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RAM:</span>
                      <span className="text-slate-200">{asset.hardwareSpecs?.ramGbs ? `${asset.hardwareSpecs.ramGbs} GB` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Storage:</span>
                      <span className="text-slate-200">
                        {asset.hardwareSpecs?.storageGbs ? `${asset.hardwareSpecs.storageGbs} GB ${asset.hardwareSpecs.storageType}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GPU:</span>
                      <span className="text-slate-200">{asset.hardwareSpecs?.gpu || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Network & MAC Addresses
                  </h3>
                  <div className="space-y-1.5 text-slate-300 font-mono text-xs pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ethernet MAC:</span>
                      <span className="text-slate-200">{asset.hardwareSpecs?.ethernetMac || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Wi-Fi MAC:</span>
                      <span className="text-slate-200">{asset.hardwareSpecs?.wifiMac || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">IP Address:</span>
                      <span className="text-slate-200">{asset.network?.ipAddress || 'Dynamic DHCP'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">VLAN / Location:</span>
                      <span className="text-slate-200">{asset.network?.vlan || asset.currentLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Battery & Health Stats */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-semibold text-white text-sm">Battery & Health Diagnostics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px]">Battery Health</span>
                    <div className="text-base font-bold text-emerald-400 mt-1">
                      {asset.hardwareSpecs?.batteryHealthPct ? `${asset.hardwareSpecs.batteryHealthPct}%` : 'N/A'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px]">Battery Cycles</span>
                    <div className="text-base font-bold text-slate-200 mt-1">
                      {asset.hardwareSpecs?.batteryCycleCount || '0'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px]">SMART Status</span>
                    <div className="text-base font-bold text-indigo-400 mt-1">
                      {asset.health?.smartStatus || 'GOOD'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px]">Repair Tickets</span>
                    <div className="text-base font-bold text-amber-400 mt-1">
                      {asset.health?.repairCount || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Procurement & Financials */}
          {activeTab === 'procurement' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Purchase Information
                  </h3>
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Purchase Cost:</span>
                      <span className="text-white font-bold">${asset.procurement?.purchaseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Purchase Order:</span>
                      <span className="text-indigo-400">{asset.procurement?.purchaseOrderNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vendor:</span>
                      <span className="text-slate-300">{asset.procurement?.vendorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cost Center:</span>
                      <span className="text-slate-300">{asset.costCenter}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" /> Depreciation Schedule
                  </h3>
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Book Value:</span>
                      <span className="text-emerald-400 font-bold">${asset.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Depreciation Model:</span>
                      <span className="text-slate-300">{asset.depreciationMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Useful Life:</span>
                      <span className="text-slate-300">{asset.usefulLifeYears} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Salvage Value:</span>
                      <span className="text-slate-300">${asset.salvageValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Warranty */}
          {activeTab === 'warranty' && (
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3 font-mono">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Vendor Support & AMC SLA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-slate-500">Vendor Contact:</span>
                  <div className="text-slate-200 font-bold">{asset.warranty?.vendorContactName}</div>
                </div>
                <div>
                  <span className="text-slate-500">Support Hotline:</span>
                  <div className="text-indigo-400 font-bold">{asset.warranty?.supportPhone}</div>
                </div>
                <div>
                  <span className="text-slate-500">Warranty Expiration:</span>
                  <div className="text-slate-200 font-bold">{asset.warranty?.warrantyEnd}</div>
                </div>
                <div>
                  <span className="text-slate-500">SLA Response Target:</span>
                  <div className="text-emerald-400 font-bold">{asset.warranty?.responseTimeHours} Hours</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security & Compliance */}
          {activeTab === 'security' && (
            <div className="space-y-4 font-mono">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Endpoint Compliance Matrix
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500">Antivirus:</span>
                    <span className="text-emerald-400 font-bold">{asset.security?.antivirusStatus}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500">Encryption:</span>
                    <span className="text-emerald-400 font-bold">{asset.security?.encryptionStatus}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500">Patch Level:</span>
                    <span className="text-indigo-400 font-bold">{asset.security?.patchLevel}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500">Baseline Score:</span>
                    <span className="text-white font-bold">{asset.security?.securityBaselineScore}/100</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Installed Software */}
          {activeTab === 'software' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-sm">Installed Software Inventory</h3>
              <div className="space-y-2">
                {asset.installedSoftware?.map((sw, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="font-bold text-white">{sw.name}</div>
                      <div className="text-slate-500">Publisher: {sw.publisher}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-indigo-400 font-bold">v{sw.version}</span>
                      <div className="text-emerald-400 text-[10px]">{sw.complianceState}</div>
                    </div>
                  </div>
                )) || <div className="text-slate-500">No software assets mapped to this device.</div>}
              </div>
            </div>
          )}

          {/* TAB 6: Timeline & Custody */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white text-sm">Chain of Custody History</h3>
              <div className="relative border-l-2 border-slate-800 ml-3 space-y-4 pl-4">
                {asset.timeline?.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                    <div className="font-semibold text-white">{evt.title}</div>
                    <div className="text-xs text-slate-500 font-mono">{evt.timestamp} • {evt.actorName}</div>
                    <p className="text-slate-400 mt-1">{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AI Health Diagnostics */}
          {activeTab === 'ai_diagnostics' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Gemini AI Diagnostics
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Automated health risk forecast, battery lifecycle calculation & replacement suggestions
                  </p>
                </div>
                <button
                  onClick={handleRunAiDiagnostics}
                  disabled={loadingAi}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loadingAi ? 'Analyzing...' : 'Run Diagnostic Check'}
                </button>
              </div>

              {aiDiagnostics && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Failure Risk Level:</span>
                    <span className="px-2.5 py-0.5 rounded font-bold text-amber-400 bg-amber-950 border border-amber-900">
                      {aiDiagnostics.failureRiskLevel}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold">Diagnostic Summary:</span>
                    <p className="text-slate-300 mt-1 font-sans text-xs leading-relaxed">{aiDiagnostics.healthSummary}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold">Recommended Decision:</span>
                    <div className="p-3 bg-slate-950 border border-indigo-500/30 rounded text-indigo-400 font-semibold mt-1">
                      {aiDiagnostics.recommendedAction}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
