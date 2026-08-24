export interface VerificationCampaign {
  id: string;
  title: string;
  targetDepartment: string;
  startDate: string;
  endDate: string;
  totalTargetAssets: number;
  verifiedAssetsCount: number;
  flaggedDiscrepancies: number;
  status: 'Draft' | 'Active' | 'Completed' | 'Archived';
  description: string;
}
