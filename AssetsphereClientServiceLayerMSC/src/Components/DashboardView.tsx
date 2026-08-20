import React from 'react';
import {
  Asset,
  ServiceTicket,
  AIRecommendation,
  VerificationCampaign,
} from '../types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  DollarSign,
  Box,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardViewProps {
  assets: Asset[];
  tickets: ServiceTicket[];
  recommendations: AIRecommendation[];
  campaign: VerificationCampaign;
  onSelectAsset: (asset: Asset) => void;
  onOpenAIAssistant: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assets,
  tickets,
  recommendations,
  campaign,
  onSelectAsset,
  onOpenAIAssistant,
  onNavigateTab,
}) => {
  // Metric Calculations
  const totalAssets = assets.length;
  const totalValuation = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalPurchaseCost = assets.reduce((sum, a) => sum + (a.procurement?.purchaseCost || 0), 0);
  const totalDepreciation = totalPurchaseCost - totalValuation;
  const activeTicketsCount = tickets.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length;
  const nonCompliantCount = assets.filter((a) => !a.security?.isCompliant).length;
  const avgHealthScore = Math.round(
    assets.reduce((sum, a) => sum + (a.health?.overallScore || 0), 0) / (assets.length || 1)
  );

  // Category Distribution Chart Data
  const categoryMap: Record<string, number> = {};
  assets.forEach((a) => {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Department Valuation Data
  const deptMap: Record<string, number> = {};
  assets.forEach((a) => {
    const dept = a.department || 'Unassigned';
    deptMap[dept] = (deptMap[dept] || 0) + a.currentValue;
  });
  const deptChartData = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#a855f7'];

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Executive Command Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time global IT asset portfolio visibility, valuation & security compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Optimization Plan
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Managed Assets</p>
          <h3 className="text-2xl font-bold text-white font-mono">{totalAssets}</h3>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Traceability
          </div>
        </div>

        {/* Total Book Value */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Asset Value</p>
          <h3 className="text-2xl font-bold text-white font-mono">
            ${(totalValuation / 1000000).toFixed(2)}M
          </h3>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <span>Depr: ${(totalDepreciation / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Average Health Score */}
        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-5">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">AI Health Score</p>
          <h3 className="text-2xl font-bold text-white font-mono">{avgHealthScore}/100</h3>
          <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${avgHealthScore}%` }}></div>
          </div>
        </div>

        {/* Compliance Risk */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Compliance Warnings</p>
          <h3 className="text-2xl font-bold text-white font-mono">{nonCompliantCount}</h3>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-amber-500 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{nonCompliantCount > 0 ? `${nonCompliantCount} non-compliant` : 'Fully Compliant'}</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Donut */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Portfolio Category Distribution</h3>
            <span className="text-[10px] text-slate-500 font-mono">Count</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#161618', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800 text-xs">
            {categoryChartData.map((c, idx) => (
              <div key={c.name} className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{c.name}:</span>
                <span className="font-mono font-bold text-white ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Valuation Bar Chart */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 flex flex-col lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Department Valuation ($ Book Value)</h3>
            <button onClick={() => onNavigateTab('analytics')} className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium">
              View Financials <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Valuation']}
                  contentStyle={{ backgroundColor: '#161618', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Highest concentration of capital assets resides in Engineering and Executive Management.
          </p>
        </div>
      </div>

      {/* Second Row: AI Recommendations & Audit Campaign */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights Card */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">AI Assistant Insights</h4>
            </div>
            <button onClick={onOpenAIAssistant} className="text-xs text-indigo-400 hover:underline">
              Ask Assistant
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${rec.impact === 'High' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    {rec.title}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 font-bold">
                    {rec.estimatedCostOrSaving}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed italic mt-1">"{rec.explanation}"</p>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenAIAssistant}
            className="w-full py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 text-xs font-semibold rounded border border-indigo-600/30 transition-all"
          >
            Run optimization plan
          </button>
        </div>

        {/* Verification Campaign Progress & Asset Register Preview */}
        <div className="bg-[#161618] border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Asset Custody & Verification Audit</h3>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-900">
                {campaign.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{campaign.title}</p>

            {/* Campaign Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>
                  {campaign.verifiedAssetsCount} / {campaign.totalTargetAssets} Verified
                </span>
                <span className="font-bold text-indigo-400">
                  {Math.round((campaign.verifiedAssetsCount / campaign.totalTargetAssets) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${(campaign.verifiedAssetsCount / campaign.totalTargetAssets) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Critical Assets Preview */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Priority Managed Assets</h4>
            <div className="space-y-2">
              {assets.slice(0, 3).map((ast) => (
                <div
                  key={ast.id}
                  onClick={() => onSelectAsset(ast)}
                  className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center font-bold text-indigo-400 font-mono text-[10px]">
                      {ast.assetNumber.slice(-4)}
                    </div>
                    <div>
                      <div className="font-medium text-white">{ast.deviceName}</div>
                      <div className="text-[10px] text-slate-500">
                        {ast.assignedToEmployeeName || 'Unassigned'} • {ast.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">${ast.currentValue.toLocaleString()}</span>
                    <div className="text-[10px] text-emerald-400 font-bold">Health: {ast.health?.overallScore}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
