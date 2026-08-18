import React, { useState } from 'react';
import { Asset } from '../../types';
import { fetchAssetDiagnostics, AIDiagnosticsResult } from '../../services/aiService';
import {
  QrCode,
  Sparkles,
  ShieldCheck,
  Cpu,
  DollarSign,
  User,
  Activity,
  Edit,
} from 'lucide-react';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';

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

  return (
    <ModalSharedComponent
      isOpen={Boolean(asset)}
      onClose={onClose}
      title={`${asset.deviceName} (${asset.assetNumber})`}
      subtitle={`${asset.manufacturer} ${asset.model} • S/N: ${asset.serialNumber}`}
      maxWidth="4xl"
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
        )}

        {activeTab === 'procurement' && (
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
        )}

        {activeTab === 'warranty' && (
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
        )}

        {activeTab === 'security' && (
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
                icon={<Sparkles className="w-4 h-4 text-amber-400" />}
              >
                {loadingAi ? 'Analyzing Hardware...' : 'Run Diagnostics'}
              </ButtonSharedComponent>
            </div>

            {aiDiagnostics && (
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
            )}
          </div>
        )}
      </div>
    </ModalSharedComponent>
  );
}
