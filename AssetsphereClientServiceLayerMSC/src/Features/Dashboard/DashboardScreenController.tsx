import React from 'react';
import {
  Asset,
  ServiceTicket,
  AIRecommendation,
  VerificationCampaign,
} from '../../types';
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
} from 'recharts';
import {
  DollarSign,
  Box,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';
import DashboardCON from './Constants/DashboardCON';

export interface DashboardScreenControllerProps {
  assets: Asset[];
  tickets: ServiceTicket[];
  recommendations: AIRecommendation[];
  campaign: VerificationCampaign;
  onSelectAsset: (asset: Asset) => void;
  onOpenAIAssistant: () => void;
  onNavigateTab: (tab: any) => void;
}

export default function DashboardScreenController({
  assets,
  tickets,
  recommendations,
  campaign,
  onSelectAsset,
  onOpenAIAssistant,
  onNavigateTab,
}: DashboardScreenControllerProps): React.JSX.Element {
  // Metrics
  const totalAssets = assets.length;
  const totalValuation = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalPurchaseCost = assets.reduce(
    (sum, a) => sum + (a.procurement?.purchaseCost || 0),
    0
  );
  const totalDepreciation = totalPurchaseCost - totalValuation;
  const activeTicketsCount = tickets.filter(
    (t) => t.status !== 'Closed' && t.status !== 'Resolved'
  ).length;
  const nonCompliantCount = assets.filter((a) => !a.security?.isCompliant).length;
  const avgHealthScore = Math.round(
    assets.reduce((sum, a) => sum + (a.health?.overallScore || 0), 0) /
      (assets.length || 1)
  );

  // Category chart data
  const categoryMap: Record<string, number> = {};
  assets.forEach((a) => {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Department Valuation Data
  const deptMap: Record<string, number> = {};
  assets.forEach((a) => {
    const dept = a.department || 'Unassigned';
    deptMap[dept] = (deptMap[dept] || 0) + a.currentValue;
  });
  const deptChartData = Object.entries(deptMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            {DashboardCON.TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {DashboardCON.SUBTITLE}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ButtonSharedComponent
            variant="primary"
            size="md"
            onClick={onOpenAIAssistant}
            icon={<Sparkles className="w-4 h-4 text-amber-400" />}
          >
            AI Copilot Insights
          </ButtonSharedComponent>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <CardSharedComponent glow="blue" hoverable onClick={() => onNavigateTab('assets')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Total Asset Count</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalAssets}</span>
            <BadgeSharedComponent variant="success" size="sm">
              Operational
            </BadgeSharedComponent>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
            Across {Object.keys(categoryMap).length} equipment categories
          </p>
        </CardSharedComponent>

        {/* Metric 2 */}
        <CardSharedComponent glow="green" hoverable onClick={() => onNavigateTab('analytics')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Portfolio Net Valuation</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              ${totalValuation.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-mono">
              <TrendingDown className="w-3 h-3 text-amber-500" />
              -${Math.round(totalDepreciation / 1000)}k dep.
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
            Original Cost: ${totalPurchaseCost.toLocaleString()}
          </p>
        </CardSharedComponent>

        {/* Metric 3 */}
        <CardSharedComponent glow="red" hoverable onClick={() => onNavigateTab('compliance')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Security Compliance</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {Math.round(((totalAssets - nonCompliantCount) / (totalAssets || 1)) * 100)}%
            </span>
            {nonCompliantCount > 0 ? (
              <BadgeSharedComponent variant="danger" size="sm" showDot>
                {nonCompliantCount} Non-Compliant
              </BadgeSharedComponent>
            ) : (
              <BadgeSharedComponent variant="success" size="sm">
                100% Compliant
              </BadgeSharedComponent>
            )}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
            BitLocker & EDR agent compliance status
          </p>
        </CardSharedComponent>

        {/* Metric 4 */}
        <CardSharedComponent glow="orange" hoverable onClick={() => onNavigateTab('servicedesk')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Service Desk Queue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{activeTicketsCount}</span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
              Avg Health: {avgHealthScore}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
            Open maintenance & hardware repair tickets
          </p>
        </CardSharedComponent>
      </div>

      {/* AI Recommendation Banner */}
      {recommendations.length > 0 && (
        <CardSharedComponent glow="orange" variant="elevated">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                    AI Predictive Asset Insights
                  </h3>
                  <BadgeSharedComponent variant="warning" size="sm">
                    {recommendations[0].impact} Impact
                  </BadgeSharedComponent>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1">
                  {recommendations[0].title} — {recommendations[0].estimatedCostOrSaving}
                </p>
              </div>
            </div>
            <ButtonSharedComponent
              variant="outline"
              size="sm"
              onClick={onOpenAIAssistant}
            >
              Analyze with Copilot
            </ButtonSharedComponent>
          </div>
        </CardSharedComponent>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <CardSharedComponent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                Category Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Hardware & virtual assets breakdown
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DashboardCON.CHART_COLORS[index % DashboardCON.CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderColor: 'var(--color-hairline-strong)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--color-ink)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardSharedComponent>

        {/* Department Valuation Bar Chart */}
        <CardSharedComponent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
                Departmental Valuation ($)
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Asset capital distribution by department
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderColor: 'var(--color-hairline-strong)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--color-ink)',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Valuation']}
                />
                <Bar dataKey="value" fill="#3b9eff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardSharedComponent>
      </div>

      {/* Critical Failure Risk Devices Table */}
      <CardSharedComponent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline">
              Assets Requiring Physical Verification or Maintenance
            </h3>
          </div>
          <ButtonSharedComponent
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab('assets')}
            icon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            View Full Inventory
          </ButtonSharedComponent>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-mono">
                <th className="py-2.5 px-3">Asset Tag</th>
                <th className="py-2.5 px-3">Device Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Health Score</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {assets.slice(0, 5).map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-zinc-100">
                    {asset.assetNumber}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                    {asset.deviceName}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-zinc-400">
                    {asset.category}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span
                      className={`font-semibold ${
                        (asset.health?.overallScore || 0) < 70
                          ? 'text-rose-500'
                          : (asset.health?.overallScore || 0) < 85
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {asset.health?.overallScore || 0}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <BadgeSharedComponent
                      variant={
                        asset.lifecycleStatus === 'In Use' || asset.lifecycleStatus === 'Assigned'
                          ? 'success'
                          : asset.lifecycleStatus === 'Repair' || asset.lifecycleStatus === 'Maintenance'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {asset.lifecycleStatus}
                    </BadgeSharedComponent>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectAsset(asset)}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardSharedComponent>
    </div>
  );
}
