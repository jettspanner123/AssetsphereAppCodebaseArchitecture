export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  businessUnit: string;
  costCenter: string;
  managerName: string;
  designation: string;
  officeLocation: string;
  floor: string;
  desk: string;
  employmentType: 'Full-time' | 'Contractor' | 'Vendor' | 'Intern';
  joiningDate: string;
  exitDate?: string;
  avatarUrl?: string;
  assignedAssetCount: number;
  isOnboardingPending?: boolean;
  isOffboardingActive?: boolean;
}

export interface AssetAllocation {
  id: string;
  assetId: string;
  employeeId: string;
  assignedDate: string;
  assignedBy: string;
  approvedBy: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  returnCondition?: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Requires Maintenance';
  employeeSignature?: string;
  managerApprovalStatus: 'Approved' | 'Pending' | 'Rejected';
}
