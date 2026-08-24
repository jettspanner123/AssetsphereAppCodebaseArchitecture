import { AssetCategory } from './AssetType';

export interface VendorProfile {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  ratingScore: number;
  slaTargetHours: number;
  activeContractsCount: number;
  amcAssetsCount: number;
  performanceScore: number;
  address: string;
  categoriesSupplied: AssetCategory[];
}

export type Vendor = VendorProfile;
