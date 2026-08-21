import React, { useState } from 'react';
import { KeyRound, Plus, ShieldCheck, Copy, Check, Trash2 } from 'lucide-react';
import CardSharedComponent from '../../../Shared/Components/CardSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';

interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  scope: string;
  createdDate: string;
  status: 'Active' | 'Revoked';
}

export default function DevApiKeysViewController(): React.JSX.Element {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const [keys, setKeys] = useState<ApiKeyRecord[]>([
    {
      id: 'KEY-001',
      name: 'CI/CD Deployment Service Token',
      keyPrefix: 'sk_live_9042...88a1',
      scope: 'Read / Write Asset Vault',
      createdDate: '2026-08-01',
      status: 'Active',
    },
    {
      id: 'KEY-002',
      name: 'ServiceNow Webhook Integrator',
      keyPrefix: 'sk_live_4102...33b9',
      scope: 'Read Service Desk Tickets',
      createdDate: '2026-08-15',
      status: 'Active',
    },
  ]);

  const handleCopy = (id: string) => {
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = () => {
    const newKey: ApiKeyRecord = {
      id: `KEY-00${keys.length + 1}`,
      name: `Developer Test Token ${keys.length + 1}`,
      keyPrefix: `sk_dev_${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      scope: 'Full Developer Access',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setKeys([newKey, ...keys]);
  };

  const handleRevoke = (id: string) => {
    setKeys(keys.map((k) => (k.id === id ? { ...k, status: 'Revoked' } : k)));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0C2086]/10 text-[#0C2086] dark:bg-indigo-950/60 dark:text-indigo-400 border border-[#0C2086]/20">
              <KeyRound className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-serif-headline">
              API Keys & Webhooks
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Generate and manage API authorization secrets and webhook endpoints.
          </p>
        </div>

        <ButtonSharedComponent
          variant="primary"
          size="sm"
          onClick={handleCreateKey}
          className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
          icon={<Plus className="w-4 h-4 !text-white" />}
        >
          <span className="!text-white font-medium">Generate New API Key</span>
        </ButtonSharedComponent>
      </div>

      {/* API Keys Table */}
      <CardSharedComponent className="p-0 overflow-hidden space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-mono bg-slate-50/50 dark:bg-zinc-900/40">
                <th className="py-2.5 px-3">Token Name</th>
                <th className="py-2.5 px-3">Key Prefix</th>
                <th className="py-2.5 px-3">Permission Scope</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-sans">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {k.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-zinc-300">
                    {k.keyPrefix}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-zinc-400">
                    {k.scope}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 dark:text-zinc-500 text-[11px]">
                    {k.createdDate}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        k.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleCopy(k.id)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      title="Copy Key"
                    >
                      {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-500 inline" /> : <Copy className="w-3.5 h-3.5 inline" />}
                    </button>
                    {k.status === 'Active' && (
                      <button
                        onClick={() => handleRevoke(k.id)}
                        className="text-xs text-rose-500 hover:underline cursor-pointer"
                      >
                        Revoke
                      </button>
                    )}
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
