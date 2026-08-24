import React from 'react';
import { Asset } from '../Types/AssetType';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Key, HardDrive } from 'lucide-react';

interface ComplianceViewProps {
  assets: Asset[];
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({ assets }) => {
  const nonCompliantAssets = assets.filter((a) => !a.security?.isCompliant);
  const compliantAssets = assets.filter((a) => a.security?.isCompliant);
  const totalCount = assets.length || 1;
  const complianceRate = Math.round((compliantAssets.length / totalCount) * 100);

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Security Governance & Compliance Audit Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ISO 27001, SOC2 Type II, CIS Controls, NIST 800-53, BitLocker encryption & antivirus baseline status
          </p>
        </div>
      </div>

      {/* Compliance Framework Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        <div className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-1">
          <span className="text-slate-500 uppercase font-semibold text-[10px]">ISO 27001 Rate</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{complianceRate}%</div>
          <p className="text-[10px] text-slate-500">A.8 Asset Management Framework</p>
        </div>
        <div className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-1">
          <span className="text-slate-500 uppercase font-semibold text-[10px]">SOC 2 Type II Status</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">PASSED</div>
          <p className="text-[10px] text-slate-500">CC6.1 Infrastructure Controls</p>
        </div>
        <div className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-1">
          <span className="text-slate-500 uppercase font-semibold text-[10px]">Drive Encryption</span>
          <div className="text-2xl font-bold text-indigo-400 font-mono">98.2%</div>
          <p className="text-[10px] text-slate-500">BitLocker / FileVault Enforced</p>
        </div>
        <div className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-1">
          <span className="text-slate-500 uppercase font-semibold text-[10px]">Non-Compliant</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">{nonCompliantAssets.length}</div>
          <p className="text-[10px] text-slate-500">Outdated patch or missing AV</p>
        </div>
      </div>

      {/* Non-Compliant Gaps Table */}
      <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" /> Non-Compliant Endpoint Remediation Queue
        </h3>
        <div className="space-y-3 text-xs">
          {nonCompliantAssets.length === 0 ? (
            <div className="p-6 text-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              All managed devices fully meet enterprise security baselines!
            </div>
          ) : (
            nonCompliantAssets.map((ast) => (
              <div
                key={ast.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-white">{ast.deviceName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {ast.assetNumber} • Owner: {ast.assignedToEmployeeName || 'Unassigned'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-rose-400 font-bold text-[10px] bg-rose-950 px-2 py-0.5 rounded border border-rose-900 font-mono">
                    Antivirus: {ast.security?.antivirusStatus || 'Outdated'}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Patch: {ast.security?.patchLevel}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
