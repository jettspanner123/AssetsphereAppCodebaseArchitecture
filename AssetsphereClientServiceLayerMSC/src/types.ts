export type AssetCategory =
  | 'Computing'
  | 'Mobile'
  | 'Peripherals'
  | 'Storage'
  | 'Networking'
  | 'Security Devices'
  | 'Office Equipment'
  | 'Infrastructure'
  | 'Software Assets'
  | 'Cloud Assets';

export type ComputingSubtype =
  | 'Laptop'
  | 'Desktop'
  | 'Workstation'
  | 'Mini PC'
  | 'Thin Client'
  | 'Server'
  | 'GPU Server'
  | 'MacBook'
  | 'Chromebook';

export type MobileSubtype =
  | 'Android Phone'
  | 'iPhone'
  | 'Tablet'
  | 'iPad'
  | 'Rugged Device';

export type PeripheralsSubtype =
  | 'Monitor'
  | 'Curved Monitor'
  | 'Keyboard'
  | 'Mouse'
  | 'Webcam'
  | 'Docking Station'
  | 'Headset'
  | 'Headphones'
  | 'Speakers'
  | 'Microphone'
  | 'Camera';

export type StorageSubtype =
  | 'External HDD'
  | 'SSD'
  | 'NAS'
  | 'SAN'
  | 'USB Drive'
  | 'SD Card';

export type NetworkingSubtype =
  | 'Router'
  | 'Switch'
  | 'Firewall'
  | 'WiFi Access Point'
  | 'Load Balancer'
  | 'VPN Appliance'
  | 'SFP Modules'
  | 'Network Cables';

export type SecuritySubtype =
  | 'Smart Card'
  | 'Access Card'
  | 'YubiKey'
  | 'RSA Token'
  | 'Biometric Device'
  | 'Fingerprint Scanner';

export type OfficeSubtype =
  | 'Printer'
  | 'Scanner'
  | 'TV'
  | 'Smart TV'
  | 'Projector'
  | 'Conference Phone'
  | 'Video Conference Unit';

export type InfrastructureSubtype =
  | 'UPS'
  | 'Rack'
  | 'PDU'
  | 'Cooling Unit'
  | 'Generator';

export type SoftwareSubtype =
  | 'Windows License'
  | 'Office License'
  | 'Adobe'
  | 'AutoCAD'
  | 'Visual Studio'
  | 'Oracle'
  | 'SQL Server'
  | 'VMware'
  | 'Antivirus'
  | 'SaaS Subscriptions';

export type CloudSubtype =
  | 'Azure VM'
  | 'AWS EC2'
  | 'GCP VM'
  | 'Kubernetes Cluster'
  | 'Containers'
  | 'Storage Accounts'
  | 'Databases';

export type AssetSubtype =
  | ComputingSubtype
  | MobileSubtype
  | PeripheralsSubtype
  | StorageSubtype
  | NetworkingSubtype
  | SecuritySubtype
  | OfficeSubtype
  | InfrastructureSubtype
  | SoftwareSubtype
  | CloudSubtype;

export type LifecycleStatus =
  | 'Ordered'
  | 'Received'
  | 'QA Checked'
  | 'Inventory'
  | 'Assigned'
  | 'In Use'
  | 'Repair'
  | 'Maintenance'
  | 'Refurbished'
  | 'Returned'
  | 'Retired'
  | 'Recycled'
  | 'Disposed';

export type DepreciationMethod = 'Straight Line' | 'Written Down Value' | 'Custom Formula';

export interface HardwareSpecs {
  cpu?: string;
  generation?: string;
  ramGbs?: number;
  storageGbs?: number;
  storageType?: 'SSD' | 'HDD' | 'NVMe' | 'SAN/NAS';
  gpu?: string;
  screenSize?: string;
  resolution?: string;
  touchSupport?: boolean;
  tpmVersion?: string;
  biosVersion?: string;
  batteryHealthPct?: number;
  batteryCycleCount?: number;
  keyboardLayout?: string;
  fingerprintReader?: boolean;
  cameraResolution?: string;
  wifiStandard?: string;
  bluetoothVersion?: string;
  nfcSupported?: boolean;
  ethernetMac?: string;
  wifiMac?: string;
  bluetoothMac?: string;
}

export interface ProcurementInfo {
  purchaseDate: string;
  purchaseOrderNo: string;
  vendorName: string;
  invoiceNo: string;
  invoiceDate: string;
  purchaseCost: number;
  gstPct: number;
  currency: string;
  budgetCode: string;
  costCenter: string;
  isCapitalized: boolean;
  procurementMethod: 'Direct Purchase' | 'Lease' | 'Tender' | 'Cloud Subscription';
  tenderReference?: string;
}

export interface WarrantyInfo {
  warrantyStart: string;
  warrantyEnd: string;
  hasExtendedWarranty: boolean;
  amcStart?: string;
  amcEnd?: string;
  vendorContactName: string;
  supportPhone: string;
  slaDetails: string;
  responseTimeHours: number;
  escalationContact: string;
}

export interface SoftwareInventoryItem {
  name: string;
  version: string;
  installDate: string;
  licenseKey?: string;
  publisher: string;
  complianceState: 'Compliant' | 'Unlicensed' | 'Update Needed';
}

export interface SecurityAndCompliance {
  operatingSystem?: string;
  osBuild?: string;
  antivirusName?: string;
  antivirusStatus: 'Active' | 'Outdated' | 'Missing';
  vpnClientStatus: 'Installed' | 'Missing';
  bitlockerEnabled: boolean;
  encryptionStatus: 'Encrypted' | 'Unencrypted' | 'Partial';
  patchLevel: string;
  securityBaselineScore: number; // 0-100
  complianceScore: number; // 0-100
  isCompliant: boolean;
  nonComplianceReasons?: string[];
}

export interface NetworkConfig {
  ipAddress?: string;
  ipv6Address?: string;
  hostname?: string;
  dnsDomain?: string;
  vlan?: string;
  switchPort?: string;
  officeLocation: string;
  floorDesk?: string;
  rackPosition?: string;
}

export interface AssetHealthMetric {
  overallScore: number; // 0 - 100
  deviceAgeMonths: number;
  batteryHealthPct?: number; // 0 - 100
  repairCount: number;
  warrantyStatus: 'Active' | 'Expiring Soon' | 'Expired';
  downtimeHoursTotal: number;
  performanceIndex: number; // 0 - 100
  smartStatus?: 'GOOD' | 'WARNING' | 'CRITICAL';
  securityCompliancePct: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'Purchased'
    | 'Received'
    | 'QA Approved'
    | 'Tagged'
    | 'Assigned'
    | 'Relocated'
    | 'Repair Ticket Opened'
    | 'Repair Completed'
    | 'Battery Changed'
    | 'Returned'
    | 'Verification Completed'
    | 'Disposed';
  title: string;
  description: string;
  actorName: string;
  location?: string;
  courierTracking?: string;
  digitalSignatureUrl?: string;
}

export interface ChainOfCustodyRecord {
  id: string;
  timestamp: string;
  fromEntity: string;
  toEntity: string;
  courierName?: string;
  trackingNumber?: string;
  approvedBy: string;
  employeeSignatureName?: string;
  hasDigitalSignature: boolean;
  geoLocation?: string;
  notes?: string;
}

export interface Asset {
  id: string;
  assetNumber: string; // e.g. AST-2026-9042
  qrCodeUrl?: string;
  barcodeValue: string;
  rfidTag?: string;
  serialNumber: string;
  companyTag: string;
  hostname: string;
  deviceName: string;
  category: AssetCategory;
  subtype: AssetSubtype;
  
  // Product Information
  manufacturer: string;
  brand: string;
  model: string;
  productFamily: string;
  sku: string;
  color?: string;
  generation?: string;
  releaseYear: number;
  countryOfOrigin?: string;

  // Status & Location
  lifecycleStatus: LifecycleStatus;
  currentLocation: string;
  department: string;
  businessUnit: string;
  costCenter: string;

  // Assigned Employee
  assignedToEmployeeId?: string;
  assignedToEmployeeName?: string;
  assignedDate?: string;

  // Specifications, Financials, Warranty, Security
  hardwareSpecs?: HardwareSpecs;
  procurement: ProcurementInfo;
  warranty: WarrantyInfo;
  security: SecurityAndCompliance;
  network: NetworkConfig;
  installedSoftware?: SoftwareInventoryItem[];
  health: AssetHealthMetric;

  // Financials
  currentValue: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears: number;
  salvageValue: number;
  totalCostOfOwnership: number;

  // History & Audit
  timeline: TimelineEvent[];
  chainOfCustody: ChainOfCustodyRecord[];
  lastVerifiedDate?: string;
  lastVerifiedBy?: string;
  isVerificationPending?: boolean;
  aiNotes?: string;
}

export interface Employee {
  id: string;
  employeeCode: string; // e.g. EMP-1042
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

export interface ServiceTicket {
  id: string;
  ticketNumber: string; // e.g. TCK-8812
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

export type Vendor = VendorProfile;

export interface VendorProfile {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  ratingScore: number; // 1-5
  slaTargetHours: number;
  activeContractsCount: number;
  amcAssetsCount: number;
  performanceScore: number; // 0-100
  address: string;
  categoriesSupplied: AssetCategory[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. PO-2026-0041
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

export interface SecurityComplianceFramework {
  frameworkName: 'ISO 27001' | 'SOC2' | 'NIST' | 'CIS' | 'GDPR';
  overallScorePct: number;
  compliantDeviceCount: number;
  nonCompliantDeviceCount: number;
  criticalGaps: string[];
}

export interface AIRecommendation {
  id: string;
  assetId?: string;
  assetName?: string;
  category: 'Replacement' | 'Warranty Extension' | 'Hardware Upgrade' | 'Reallocation' | 'Cost Saving' | 'Security Risk';
  title: string;
  explanation: string;
  impact: 'High' | 'Medium' | 'Low';
  estimatedCostOrSaving: string;
  actionableStep: string;
}

export interface CloudResource {
  id: string;
  provider: string;
  name: string;
  type: string;
  region: string;
  cost: number;
  status: string;
}

export type TabType =
  | 'dashboard'
  | 'inventory'
  | 'employees'
  | 'licenses'
  | 'cloud'
  | 'procurement'
  | 'servicedesk'
  | 'vendors'
  | 'compliance'
  | 'verification'
  | 'ai_assistant'
  | 'analytics'
  | 'settings';


