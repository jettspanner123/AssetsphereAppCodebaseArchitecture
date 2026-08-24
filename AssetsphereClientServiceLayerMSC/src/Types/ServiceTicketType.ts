export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  assetId: string;
  assetName: string;
  assetNumber: string;
  reportedBy: string;
  reportedDate: string;
  problemDescription: string;
  rootCause?: string;
  resolution?: string;
  assignedEngineer: string;
  repairVendor: string;
  partsReplaced?: string[];
  repairCost: number;
  downtimeHours: number;
  status: 'Open' | 'In Progress' | 'Awaiting Parts' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}
