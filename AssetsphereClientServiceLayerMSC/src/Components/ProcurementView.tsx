import React from 'react';
import { PurchaseOrder } from '../types';
import { ShoppingCart, CheckCircle2, Clock, DollarSign, FileText } from 'lucide-react';

interface ProcurementViewProps {
  orders: PurchaseOrder[];
}

export const ProcurementView: React.FC<ProcurementViewProps> = ({ orders }) => {
  return (
    <div className="p-8 space-y-8 bg-[#0a0a0b] text-slate-300 min-h-screen">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            Procurement & Purchase Order Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            PO requests, IT approvals, vendor invoicing, delivery inspection & asset automated ingestion
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {orders.map((po) => (
          <div key={po.id} className="p-5 bg-[#161618] border border-slate-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{po.poNumber}</span>
                    <span className="text-[10px] text-slate-500">Vendor: {po.vendorName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Requested by: {po.requesterName} • Dept: {po.department}</div>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-bold font-mono text-[10px] self-start sm:self-auto">
                {po.status}
              </span>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Line Items</div>
              {po.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-300">
                  <span>{item.quantity}x {item.description}</span>
                  <span className="font-bold text-white font-mono">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between font-medium text-slate-400">
              <span>Total PO Value:</span>
              <span className="text-white font-bold font-mono text-sm">${po.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
