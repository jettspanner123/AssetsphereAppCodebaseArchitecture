import React from 'react';
import { PurchaseOrder } from '../../types';
import CardSharedComponent from '../../Shared/Components/CardSharedComponent';
import BadgeSharedComponent from '../../Shared/Components/BadgeSharedComponent';

export interface ProcurementScreenControllerProps {
  orders: PurchaseOrder[];
}

export default function ProcurementScreenController({
  orders,
}: ProcurementScreenControllerProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif-headline">
          Procurement & Purchase Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
          CAPEX approval workflows, vendor invoices, hardware orders, and fulfillment logs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((po) => (
          <CardSharedComponent key={po.id}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-sky-500 font-bold">{po.poNumber}</span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-serif-headline mt-0.5">
                  {po.vendorName}
                </h3>
              </div>
              <BadgeSharedComponent
                variant={
                  po.status === 'PO Issued' || po.status === 'Delivered & QA' ? 'success' : 'warning'
                }
                size="sm"
              >
                {po.status}
              </BadgeSharedComponent>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Total PO Amount:</span>
                <span className="text-slate-900 dark:text-white font-bold">${po.totalCost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Date:</span>
                <span className="text-slate-700 dark:text-zinc-300">{po.requestDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Requested By:</span>
                <span className="text-slate-700 dark:text-zinc-300">{po.requestorName}</span>
              </div>
            </div>
          </CardSharedComponent>
        ))}
      </div>
    </div>
  );
}
