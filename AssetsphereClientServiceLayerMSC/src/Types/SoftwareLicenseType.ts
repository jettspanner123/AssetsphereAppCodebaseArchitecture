export interface SoftwareLicense {
  id: string;
  softwareName: string;
  publisher: string;
  licenseKey: string;
  licenseType: 'Named User' | 'Per Core' | 'Floating' | 'Enterprise Subscription';
  totalSeats: number;
  allocatedSeats: number;
  costPerSeat: number;
  currency: string;
  purchaseDate: string;
  expirationDate: string;
  complianceStatus: 'Compliant' | 'Over Allocated' | 'Under Utilized' | 'Expiring Soon';
  assignedDepartments: string[];
}
