import MockDataSeederService from '@/src/Services/MockDataSeederService';
import {
  Asset,
  Employee,
  ServiceTicket,
  VendorProfile,
  PurchaseOrder,
  SoftwareLicense,
  VerificationCampaign,
  SecurityComplianceFramework,
  AIRecommendation,
} from '../types';

export const mockEmployees: Employee[] = MockDataSeederService.current.getEmployees();
export const mockAssets: Asset[] = MockDataSeederService.current.getAssets();
export const mockServiceTickets: ServiceTicket[] = MockDataSeederService.current.getServiceTickets();
export const mockVendors: VendorProfile[] = MockDataSeederService.current.getVendors();
export const mockPurchaseOrders: PurchaseOrder[] = MockDataSeederService.current.getPurchaseOrders();
export const mockSoftwareLicenses: SoftwareLicense[] = MockDataSeederService.current.getSoftwareLicenses();
export const mockVerificationCampaigns: VerificationCampaign[] = MockDataSeederService.current.getVerificationCampaigns();
export const mockComplianceFrameworks: SecurityComplianceFramework[] = MockDataSeederService.current.getComplianceFrameworks();
export const mockAIRecommendations: AIRecommendation[] = MockDataSeederService.current.getAIRecommendations();
