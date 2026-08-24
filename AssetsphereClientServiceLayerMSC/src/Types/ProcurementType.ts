export interface PurchaseOrder {
  id: string;
  poNumber: string;
  requestorName: string;
  department: string;
  vendorName: string;
  requestDate: string;
  expectedDeliveryDate: string;
  totalCost: number;
  currency: string;
  status: 'Draft' | 'Pending IT Approval' | 'Pending Finance' | 'PO Issued' | 'Delivered & QA' | 'Cancelled';
  itemCount: number;
  description: string;
}
