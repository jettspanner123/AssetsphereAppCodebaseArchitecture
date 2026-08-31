export type LicenseType =
  | 'Enterprise Subscription'
  | 'Named User'
  | 'Floating'
  | 'Per Core'
  | 'Perpetual';

export type ComplianceStatusType =
  | 'Compliant'
  | 'Over Allocated'
  | 'Under Utilized'
  | 'Expiring Soon';

export interface SoftwareLicense {
  id: string;
  softwareName: string;
  publisher: string;
  version?: string;
  category?: string;
  licenseKey: string;
  licenseType: LicenseType | string;
  totalSeats: number;
  allocatedSeats: number;
  costPerSeat: number;
  annualCost?: number;
  currency: string;
  purchaseDate: string;
  expirationDate: string;
  complianceStatus: ComplianceStatusType | string;
  assignedDepartments: string[];
  assignedUsersJson?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendSoftwareLicenseDTO {
  id: string;
  softwareName: string;
  publisher: string;
  version?: string;
  licenseType: string;
  licenseKey: string;
  totalSeats: number;
  assignedSeats: number;
  costPerSeat: number;
  annualCost: number;
  currency?: string;
  purchaseDate?: string;
  expiryDate: string;
  complianceStatus: string;
  assignedUsersJson?: string | null;
  assignedDepartmentsJson?: string | null;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface CreateSoftwareLicenseRequest {
  softwareName: string;
  publisher: string;
  version?: string;
  licenseType: string;
  licenseKey: string;
  totalSeats: number;
  assignedSeats?: number;
  costPerSeat: number;
  annualCost?: number;
  currency?: string;
  purchaseDate?: string;
  expiryDate: string;
  complianceStatus?: string;
  assignedDepartmentsJson?: string;
  assignedUsersJson?: string;
  category?: string;
}

export interface UpdateSoftwareLicenseRequest {
  softwareName?: string;
  publisher?: string;
  version?: string;
  licenseType?: string;
  licenseKey?: string;
  totalSeats?: number;
  assignedSeats?: number;
  costPerSeat?: number;
  annualCost?: number;
  currency?: string;
  purchaseDate?: string;
  expiryDate?: string;
  complianceStatus?: string;
  assignedDepartmentsJson?: string;
  assignedUsersJson?: string;
  category?: string;
}
