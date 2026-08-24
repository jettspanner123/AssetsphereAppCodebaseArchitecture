import React, { useState } from 'react';
import { PurchaseOrder } from '../../Types/ProcurementType';
import {
  Search,
  DollarSign,
  ShoppingCart,
  Grid,
  List,
  Maximize2,
  WrapText,
  FileText,
  Calendar,
  User,
} from 'lucide-react';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import UserPreferencesUtility from '../../Utilities/UserPreferencesUtility';

export interface ProcurementScreenControllerProps {
  orders: PurchaseOrder[];
}

export default function ProcurementScreenController({
  orders,
}: ProcurementScreenControllerProps): React.JSX.Element {
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() =>
    UserPreferencesUtility.current.getProcurementViewMode('grid')
  );
  const [gridColumns, setGridColumnsState] = useState<2 | 3>(() =>
    UserPreferencesUtility.current.getProcurementGridColumns(2)
  );
  const [isSingleLineMode, setIsSingleLineModeState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getProcurementSingleLine(true)
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    UserPreferencesUtility.current.setProcurementViewMode(mode);
  };

  const setGridColumns = (cols: 2 | 3) => {
    setGridColumnsState(cols);
    UserPreferencesUtility.current.setProcurementGridColumns(cols);
  };

  const setIsSingleLineMode = (val: boolean) => {
    setIsSingleLineModeState(val);
    UserPreferencesUtility.current.setProcurementSingleLine(val);
  };

  const filteredOrders = orders.filter(
    (po) =>
      (po.poNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.requestorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProcurementSpend = filteredOrders.reduce(
    (sum, po) => sum + (po.totalCost || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Hero Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
            Procurement & Purchase Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            CAPEX approval workflows, vendor invoices, hardware orders, and fulfillment logs
          </p>
        </div>

        {/* Executive Typographic Metric Counters */}
        <div className="flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-zinc-900/60 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              ${totalProcurementSpend.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Total Orders Value
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {filteredOrders.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Active Orders
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar Card */}
      <CardSharedComponent className="p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PO number, vendor, requestor..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
          </div>

          {/* Uniform Height Control Switchers */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            {/* Grid Column Density Switcher (2 Col vs 3 Col) */}
            {viewMode === 'grid' && (
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
                <button
                  onClick={() => setGridColumns(2)}
                  className={`px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    gridColumns === 2
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Show 2 Items Per Row"
                >
                  2 Per Row
                </button>
                <button
                  onClick={() => setGridColumns(3)}
                  className={`px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    gridColumns === 3
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Show 3 Items Per Row"
                >
                  3 Per Row
                </button>
              </div>
            )}

            {/* List Single-Line Segmented Control */}
            {viewMode === 'list' && (
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
                <button
                  onClick={() => setIsSingleLineMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isSingleLineMode
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Single-Line Table Mode"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Single-Line</span>
                </button>
                <button
                  onClick={() => setIsSingleLineMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    !isSingleLineMode
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Wrap Text Table Mode"
                >
                  <WrapText className="w-3.5 h-3.5" />
                  <span>Wrap Text</span>
                </button>
              </div>
            )}

            {/* View Mode Segmented Control (Grid vs List) */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 h-9">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-7 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </CardSharedComponent>

      {/* Fallback Empty State */}
      {filteredOrders.length === 0 && (
        <CardSharedComponent className="p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white font-serif-headline">
            No Purchase Orders Found
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            No orders matched your search query "{searchQuery}".
          </p>
        </CardSharedComponent>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && filteredOrders.length > 0 && (
        <div
          className={`grid grid-cols-1 ${
            gridColumns === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}
        >
          {filteredOrders.map((po) => (
            <CardSharedComponent key={po.id} hoverable className="p-6 flex flex-col justify-between space-y-5">
              {/* Header */}
              <div>
                <span className="text-xs font-mono text-sky-500 font-bold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> {po.poNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif-headline truncate mt-0.5">
                  {po.vendorName}
                </h3>
              </div>

              {/* Middle Section: Details & Valuation */}
              <div className="py-3 border-y border-slate-100 dark:border-zinc-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-zinc-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" /> Order Date:
                  </span>
                  <span className="font-mono">{po.requestDate}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-zinc-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3.5 h-3.5" /> Requestor:
                  </span>
                  <span className="font-medium">{po.requestorName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-zinc-300">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{po.status}</span>
                </div>

                {/* PO Cost at the very last with a top divider */}
                <div className="flex justify-between items-baseline pt-2.5 border-t border-slate-100 dark:border-zinc-800/80">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">PO Cost:</span>
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                    ${po.totalCost?.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardSharedComponent>
          ))}
        </div>
      )}

      {/* List / Table View Mode */}
      {viewMode === 'list' && filteredOrders.length > 0 && (
        <CardSharedComponent className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className={`w-full text-left text-xs ${isSingleLineMode ? 'min-w-[900px] whitespace-nowrap' : ''}`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/40 text-slate-400 dark:text-zinc-500 font-mono">
                  <th className="py-3.5 px-5">PO Number</th>
                  <th className="py-3.5 px-5">Vendor Name</th>
                  <th className="py-3.5 px-5">Request Date</th>
                  <th className="py-3.5 px-5">Requested By</th>
                  <th className="py-3.5 px-5">Fulfillment Status</th>
                  <th className="py-3.5 px-5 text-right">PO Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {filteredOrders.map((po) => (
                  <tr
                    key={po.id}
                    className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-4 px-5 font-mono font-bold text-sky-500">
                      {po.poNumber}
                    </td>
                    <td className="py-4 px-5 font-serif-headline font-bold text-slate-900 dark:text-white text-sm">
                      {po.vendorName}
                    </td>
                    <td className="py-4 px-5 font-mono text-slate-500 dark:text-zinc-400">
                      {po.requestDate}
                    </td>
                    <td className="py-4 px-5 text-slate-700 dark:text-zinc-300">
                      {po.requestorName}
                    </td>
                    <td className="py-4 px-5 font-mono font-medium text-slate-600 dark:text-zinc-300">
                      {po.status}
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ${po.totalCost?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardSharedComponent>
      )}
    </div>
  );
}
