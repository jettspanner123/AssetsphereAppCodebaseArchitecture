import React, { useState } from 'react';
import { VerificationCampaign, Asset } from '../types';
import { QrCode, CheckCircle2, AlertCircle, Clock, Search, RefreshCw } from 'lucide-react';

interface VerificationCampaignViewProps {
  campaign: VerificationCampaign;
  assets: Asset[];
  onVerifyAsset: (assetId: string) => void;
}

export const VerificationCampaignView: React.FC<VerificationCampaignViewProps> = ({
  campaign,
  assets,
  onVerifyAsset,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const targetAssets = assets.filter((a) =>
    a.deviceName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    a.assetNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
    a.assignedToEmployeeName?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const verifiedPct = Math.round((campaign.verifiedAssetsCount / campaign.totalTargetAssets) * 100);

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Quarterly Asset Verification Audit Campaign
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Self-verification mobile web push notifications & QR physical audit scan tracking
          </p>
        </div>
      </div>

      {/* Progress Box */}
      <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <div>
            <h3 className="text-base font-semibold text-white font-sans">{campaign.title}</h3>
            <span className="text-slate-500 text-xs">Deadline: {campaign.deadlineDate}</span>
          </div>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-bold font-mono text-[10px]">
            {campaign.status}
          </span>
        </div>

        <div className="space-y-1.5 font-mono">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Audit Verification Progress</span>
            <span className="font-bold text-indigo-400">
              {campaign.verifiedAssetsCount} / {campaign.totalTargetAssets} ({verifiedPct}%)
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${verifiedPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Asset Verification List */}
      <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="font-semibold text-white text-sm">Target Managed Assets Queue</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search target assets..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {targetAssets.map((ast) => (
            <div
              key={ast.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-white">{ast.deviceName}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {ast.assetNumber} • Owner: {ast.assignedToEmployeeName || 'Unassigned'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 font-mono">
                  VERIFIED
                </span>
                <button
                  onClick={() => onVerifyAsset(ast.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" /> Re-Verify Tag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
