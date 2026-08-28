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

export interface StorageDrive {
  id: string;
  capacity: string;
  type: 'NVMe SSD' | 'SATA SSD' | 'HDD' | 'eMMC' | 'External SSD' | 'Other';
}

export interface HardwareSpecs {
  cpu?: string;
  processor?: string;
  generation?: string;
  ramGbs?: number;
  ram?: string;
  storageGbs?: number;
  storageType?: 'SSD' | 'HDD' | 'NVMe' | 'SAN/NAS';
  storage?: string;
  storageDrives?: StorageDrive[];
  gpu?: string;
  graphics?: string;
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
  securityBaselineScore: number;
  complianceScore: number;
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
  overallScore: number;
  deviceAgeMonths: number;
  batteryHealthPct?: number;
  repairCount: number;
  warrantyStatus: 'Active' | 'Expiring Soon' | 'Expired';
  downtimeHoursTotal: number;
  performanceIndex: number;
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
  assetNumber: string;
  qrCodeUrl?: string;
  barcodeValue: string;
  rfidTag?: string;
  serialNumber: string;
  companyTag: string;
  hostname: string;
  deviceName: string;
  category: AssetCategory;
  subtype: AssetSubtype;
  
  manufacturer: string;
  brand: string;
  model: string;
  productFamily: string;
  sku: string;
  color?: string;
  generation?: string;
  releaseYear: number;
  countryOfOrigin?: string;

  lifecycleStatus: LifecycleStatus;
  currentLocation: string;
  department: string;
  businessUnit: string;
  costCenter: string;

  assignedToEmployeeId?: string;
  assignedToEmployeeName?: string;
  assignedDate?: string;

  hardwareSpecs?: HardwareSpecs;
  procurement: ProcurementInfo;
  currency?: string;
  warranty: WarrantyInfo;
  security: SecurityAndCompliance;
  network: NetworkConfig;
  installedSoftware?: SoftwareInventoryItem[];
  health: AssetHealthMetric;

  currentValue: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears: number;
  salvageValue: number;
  totalCostOfOwnership: number;

  timeline: TimelineEvent[];
  chainOfCustody: ChainOfCustodyRecord[];
  lastVerifiedDate?: string;
  lastVerifiedBy?: string;
  isVerificationPending?: boolean;
  aiNotes?: string;
}
