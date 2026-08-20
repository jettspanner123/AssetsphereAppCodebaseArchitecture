import React from 'react';
import { Asset } from '../types';
import { BarChart3, Download, DollarSign, TrendingDown } from 'lucide-react';

interface AnalyticsViewProps {
  assets: Asset[];
  onExportCSV: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ assets, onExportCSV }) => {
  const totalPurchaseCost = assets.reduce((sum, a) => sum + (a.procurement?.purchaseCost || 0), 0);
  const totalCurrentValue = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalDepreciation = totalPurchaseCost - totalCurrentValue;

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Financial Analytics & Depreciation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            CAPEX/OPEX reports, straight-line & written-down value depreciation, CSV exports
          </p>
        </div>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Initial Capital</span>
          <div className="text-2xl font-bold text-white mt-1">${totalPurchaseCost.toLocaleString()}</div>
        </div>
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Book Value</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">${totalCurrentValue.toLocaleString()}</div>
        </div>
        <div className="bg-[#161618] border border-slate-800 p-5 rounded-xl">
          <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Accumulated Depreciation</span>
          <div className="text-2xl font-bold text-amber-500 mt-1">${totalDepreciation.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Asset Valuation Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Asset</th>
                <th className="p-3">Category</th>
                <th className="p-3">Purchase Cost</th>
                <th className="p-3">Book Value</th>
                <th className="p-3">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {assets.map((ast) => (
                <tr key={ast.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-medium text-white font-sans">{ast.deviceName}</td>
                  <td className="p-3 text-slate-500">{ast.category}</td>
                  <td className="p-3 text-slate-300">${ast.procurement?.purchaseCost.toLocaleString()}</td>
                  <td className="p-3 text-emerald-400 font-bold">${ast.currentValue.toLocaleString()}</td>
                  <td className="p-3 text-slate-500">{ast.depreciationMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
