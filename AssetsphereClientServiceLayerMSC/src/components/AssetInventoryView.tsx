import React, { useState } from 'react';
import { Asset, AssetCategory, LifecycleStatus } from '../types';
import {
  Search,
  Plus,
  Filter,
  Download,
  QrCode,
  Grid,
  List,
  Columns,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  User,
  Box,
  HardDrive,
  Laptop,
  Smartphone,
  Server,
  Wifi,
  Key,
  Cloud,
  FileText,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface AssetInventoryViewProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onOpenAddModal: () => void;
  onOpenQRBadgeModal: (asset: Asset) => void;
  onExportCSV: () => void;
}

export const AssetInventoryView: React.FC<AssetInventoryViewProps> = ({
  assets,
  onSelectAsset,
  onOpenAddModal,
  onOpenQRBadgeModal,
  onExportCSV,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLifecycle, setSelectedLifecycle] = useState<string>('ALL');
  const [complianceFilter, setComplianceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'kanban'>('table');

  const categoriesList: (AssetCategory | 'ALL')[] = [
    'ALL',
    'Computing',
    'Mobile',
    'Peripherals',
    'Storage',
    'Networking',
    'Security Devices',
    'Office Equipment',
    'Infrastructure',
    'Software Assets',
    'Cloud Assets',
  ];

  const filteredAssets = assets.filter((ast) => {
    if (selectedCategory !== 'ALL' && ast.category !== selectedCategory) return false;
    if (selectedLifecycle !== 'ALL' && ast.lifecycleStatus !== selectedLifecycle) return false;
    if (complianceFilter === 'COMPLIANT' && !ast.security?.isCompliant) return false;
    if (complianceFilter === 'NON_COMPLIANT' && ast.security?.isCompliant) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ast.deviceName.toLowerCase().includes(q);
      const matchNumber = ast.assetNumber.toLowerCase().includes(q);
      const matchSerial = ast.serialNumber.toLowerCase().includes(q);
      const matchHost = ast.hostname?.toLowerCase().includes(q);
      const matchOwner = ast.assignedToEmployeeName?.toLowerCase().includes(q);
      const matchCompanyTag = ast.companyTag?.toLowerCase().includes(q);
      return matchName || matchNumber || matchSerial || matchHost || matchOwner || matchCompanyTag;
    }

    return true;
  });

  const getStatusBadge = (status: LifecycleStatus) => {
    switch (status) {
      case 'In Use':
      case 'Assigned':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-900';
      case 'Inventory':
      case 'Received':
        return 'bg-slate-800 text-slate-400 border border-slate-700';
      case 'Repair':
      case 'Maintenance':
        return 'bg-amber-950 text-amber-500 border border-amber-900';
      case 'Retired':
      case 'Disposed':
        return 'bg-rose-950 text-rose-400 border border-rose-900';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case 'Computing':
        return Laptop;
      case 'Mobile':
        return Smartphone;
      case 'Peripherals':
        return HardDrive;
      case 'Networking':
        return Wifi;
      case 'Security Devices':
        return Key;
      case 'Cloud Assets':
        return Cloud;
      case 'Infrastructure':
        return Server;
      default:
        return Box;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Enterprise Asset Register
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Physical, virtual & cloud asset inventory with complete 150+ attribute traceability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" /> Export CSV
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded text-xs font-medium shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#161618] border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Search & Layout Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Assets, Serial #, or Employees..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Grid Card View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded ${viewMode === 'kanban' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                title="Kanban Board View"
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all text-xs ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Additional Filters: Lifecycle & Compliance */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Lifecycle:</span>
            <select
              value={selectedLifecycle}
              onChange={(e) => setSelectedLifecycle(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All States</option>
              <option value="In Use">In Use / Assigned</option>
              <option value="Inventory">Inventory Stock</option>
              <option value="Repair">Under Repair / Maintenance</option>
              <option value="Retired">Retired / Disposed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Compliance:</span>
            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Devices</option>
              <option value="COMPLIANT">ISO/SOC2 Compliant</option>
              <option value="NON_COMPLIANT">Non-Compliant / At Risk</option>
            </select>
          </div>

          <div className="ml-auto text-slate-500 font-mono text-[11px]">
            Showing <span className="text-white font-bold">{filteredAssets.length}</span> of {assets.length} assets
          </div>
        </div>
      </div>

      {/* VIEW 1: Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#161618] border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] text-slate-500 uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-4 col-span-2">Asset / Model</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Value</th>
                  <th className="p-4 text-right">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No matching assets found for selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((ast) => {
                    const CatIcon = getCategoryIcon(ast.category);
                    return (
                      <tr
                        key={ast.id}
                        className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                        onClick={() => onSelectAsset(ast)}
                      >
                        {/* ID & Device */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center border border-slate-800 shrink-0">
                              <CatIcon className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-sm text-white font-medium">{ast.deviceName}</p>
                              <p className="text-[10px] font-mono text-slate-500">
                                ID: {ast.assetNumber} | SN: {ast.serialNumber}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 text-slate-400">
                          {ast.category}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(ast.lifecycleStatus)}`}>
                            {ast.lifecycleStatus.toUpperCase()}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="p-4 text-slate-300">
                          {ast.assignedToEmployeeName ? (
                            ast.assignedToEmployeeName
                          ) : (
                            <span className="text-slate-500">— Unassigned</span>
                          )}
                        </td>

                        {/* Value */}
                        <td className="p-4 font-mono font-bold text-white">
                          ${ast.currentValue.toLocaleString()}
                        </td>

                        {/* Health */}
                        <td className="p-4 text-right font-bold text-emerald-500">
                          {ast.health?.overallScore || 85}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Grid Card View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((ast) => {
            const CatIcon = getCategoryIcon(ast.category);
            return (
              <div
                key={ast.id}
                onClick={() => onSelectAsset(ast)}
                className="bg-[#161618] border border-slate-800 rounded-xl p-5 hover:border-slate-700 cursor-pointer transition-colors space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 rounded flex items-center justify-center border border-slate-800 text-slate-400">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-indigo-400 font-bold">{ast.assetNumber}</span>
                      <h3 className="font-medium text-sm text-white">
                        {ast.deviceName}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQRBadgeModal(ast);
                    }}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-400"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-3 border-t border-slate-800 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Serial:</span>
                    <span className="text-slate-300">{ast.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned To:</span>
                    <span className="text-slate-300 font-sans">{ast.assignedToEmployeeName || 'Unassigned Stock'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Book Value:</span>
                    <span className="text-white font-bold">${ast.currentValue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Condition</span>
                    <span className="font-bold text-emerald-400">{ast.health?.overallScore}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${ast.health?.overallScore}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto">
          {['Inventory', 'Assigned', 'Repair', 'Retired'].map((stage) => {
            const stageAssets = filteredAssets.filter((a) =>
              stage === 'Assigned' ? a.lifecycleStatus === 'In Use' || a.lifecycleStatus === 'Assigned' : a.lifecycleStatus === stage
            );
            return (
              <div key={stage} className="bg-[#161618] border border-slate-800 rounded-xl p-4 space-y-4 min-h-[500px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-semibold text-xs text-white uppercase tracking-wider">{stage}</h3>
                  <span className="bg-slate-900 text-slate-400 font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-slate-800">
                    {stageAssets.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {stageAssets.map((ast) => (
                    <div
                      key={ast.id}
                      onClick={() => onSelectAsset(ast)}
                      className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 cursor-pointer space-y-2 text-xs"
                    >
                      <div className="font-medium text-white">{ast.deviceName}</div>
                      <div className="font-mono text-[10px] text-indigo-400">{ast.assetNumber}</div>
                      <div className="text-[11px] text-slate-500">{ast.assignedToEmployeeName || 'Warehouse Storage'}</div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-[10px] text-slate-400">
                        <span>${ast.currentValue}</span>
                        <span className="text-emerald-400 font-bold">{ast.health?.overallScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
