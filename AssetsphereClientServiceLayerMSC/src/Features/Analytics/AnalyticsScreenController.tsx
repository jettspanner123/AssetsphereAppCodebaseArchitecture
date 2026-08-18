import React from 'react';
import { Asset } from '../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';

export interface AnalyticsScreenControllerProps {
  assets: Asset[];
}

export default function AnalyticsScreenController({
  assets,
}: AnalyticsScreenControllerProps): React.JSX.Element {
  const depreciationTrend = [
    { year: '2023 Q1', valuation: 480000, cost: 520000 },
    { year: '2023 Q3', valuation: 430000, cost: 520000 },
    { year: '2024 Q1', valuation: 390000, cost: 540000 },
    { year: '2024 Q3', valuation: 340000, cost: 580000 },
    { year: '2025 Q1', valuation: 290000, cost: 610000 },
    { year: '2025 Q3', valuation: 260000, cost: 650000 },
    { year: '2026 Q1', valuation: 220000, cost: 680000 },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          Analytics & Failure Risk Models
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Depreciation curves, hardware degradation analytics, and lifecycle planning
        </p>
      </div>

      <CardSharedComponent>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline mb-4">
          5-Year Asset Depreciation & Portfolio Valuation ($)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={depreciationTrend}>
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
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
              />
              <Area type="monotone" dataKey="cost" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
              <Area type="monotone" dataKey="valuation" stroke="#3b9eff" fill="#3b9eff" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardSharedComponent>
    </div>
  );
}
