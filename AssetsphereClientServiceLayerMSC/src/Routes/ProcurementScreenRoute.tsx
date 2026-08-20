import React from 'react';
import ProcurementScreenController from '../Features/Procurement/ProcurementScreenController';
import { PurchaseOrder } from '../types';

export interface ProcurementScreenRouteProps {
  orders: PurchaseOrder[];
}

export default function ProcurementScreenRoute({
  orders,
}: ProcurementScreenRouteProps): React.JSX.Element {
  return <ProcurementScreenController orders={orders} />;
}
