import React, { useState } from 'react';
import { Terminal, Search, Filter, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';
  module: 'AUTH' | 'ASSET_VAULT' | 'SECURITY' | 'API_GATEWAY' | 'SEEDED_DATA';
  message: string;
  details?: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'LOG-9041',
    timestamp: '2026-08-21 10:35:12.419',
    level: 'AUDIT',
    module: 'AUTH',
    message: 'User authentication session initialized. User: a.vance@assetsphere.io',
    details: 'JWT token validated with SHA-256 algorithm signature.',
  },
  {
    id: 'LOG-9042',
    timestamp: '2026-08-21 10:34:55.102',
    level: 'INFO',
    module: 'SEEDED_DATA',
    message: 'MockDataSeederService loaded 10 assets, 4 employees, and 4 software licenses.',
    details: 'State initialized from localStorage preferences key: assetsphere_show_mock_data.',
  },
  {
    id: 'LOG-9043',
    timestamp: '2026-08-21 10:32:04.882',
    level: 'INFO',
    module: 'ASSET_VAULT',
    message: 'Chain of custody roadmap rendered with alternating center-line timeline layout.',
  },
  {
    id: 'LOG-9044',
    timestamp: '2026-08-21 10:28:11.340',
    level: 'WARN',
    module: 'SECURITY',
    message: 'BitLocker key physical verification alert flagged for MacBook Pro M3 (AST-2026-9042).',
    details: 'Non-compliance reason: BitLocker recovery key verification pending.',
  },
  {
    id: 'LOG-9045',
    timestamp: '2026-08-21 10:20:44.015',
    level: 'INFO',
    module: 'API_GATEWAY',
    message: 'Gemini 3.6 Flash AI diagnostics endpoint handshake successful (latency: 142ms).',
  },
];

export default function DevSystemLogsViewController(): React.JSX.Element {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleRefreshLogs = () => {
    setLogs(INITIAL_LOGS);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0C2086]/10 text-[#0C2086] dark:bg-indigo-950/60 dark:text-indigo-400 border border-[#0C2086]/20">
              <Terminal className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif-headline">
              System Logs & Event Audits
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time execution log console, audit trails, and diagnostic trace streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ButtonSharedComponent variant="outline" size="sm" onClick={handleRefreshLogs} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </ButtonSharedComponent>
          <ButtonSharedComponent variant="outline" size="sm" onClick={handleClearLogs} icon={<Trash2 className="w-3.5 h-3.5" />}>
            Clear Logs
          </ButtonSharedComponent>
        </div>
      </div>

      {/* Control Toolbar */}
      <CardSharedComponent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs by ID, message, or module..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 font-sans">Level:</span>
            {['ALL', 'INFO', 'WARN', 'ERROR', 'AUDIT'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </CardSharedComponent>

      {/* Logs Table Console */}
      <CardSharedComponent className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 bg-slate-50/50 dark:bg-zinc-900/40">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Message & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-sans">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 dark:text-zinc-400 text-[11px]">
                      {log.id}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 dark:text-zinc-500 text-[10px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          log.level === 'ERROR'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : log.level === 'WARN'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : log.level === 'AUDIT'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-zinc-300 font-semibold text-[11px]">
                      {log.module}
                    </td>
                    <td className="py-3 px-3 space-y-0.5">
                      <p className="text-slate-900 dark:text-zinc-100 font-medium text-xs">
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
                          ↳ {log.details}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-zinc-500 font-sans">
                    No log events match the specified query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardSharedComponent>
    </div>
  );
}
