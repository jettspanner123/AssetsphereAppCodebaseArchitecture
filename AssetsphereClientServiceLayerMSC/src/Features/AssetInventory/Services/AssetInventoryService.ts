import ApplicationNetworkAPIConfiguration from '../../../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from '../../../Services/ApplicationLocalStorageService';
import { Asset } from '../../../Types/AssetType';

export interface BackendAssetDTO {
  id: string;
  assetTag: string;
  serialNumber: string;
  category: string;
  subtype: string;
  modelName: string;
  manufacturer: string;
  status: string;
  assignedEmployeeId?: string | null;
  assignedEmployeeName?: string | null;
  assignedDepartment?: string | null;
  location: string;
  purchasePrice: number;
  currentBookValue: number;
  depreciationMethod: string;
  usefulLifeMonths: number;
  salvageValue: number;
  specs?: {
    processor?: string;
    ramGbs?: number;
    ram?: string;
    storage?: string;
    storageDrives?: Array<{ capacity: string; type: string }>;
    screenSize?: string;
    resolution?: string;
    graphics?: string;
  } | null;
  currency?: string;
  hardwareSpecsJson?: string | null;
  procurementInfoJson?: string | null;
  warrantyInfoJson?: string | null;
  securityAndComplianceJson?: string | null;
  networkConfigJson?: string | null;
  healthMetricJson?: string | null;
  timelineEventsJson?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateAssetRequest {
  assetTag?: string;
  serialNumber: string;
  category: string;
  subtype?: string;
  modelName: string;
  manufacturer: string;
  status?: string;
  purchasePrice: number;
  currency?: string;
  location?: string;
  notes?: string;
  specs?: {
    processor?: string;
    ramGbs?: number;
    ram?: string;
    storage?: string;
    storageDrives?: Array<{ capacity: string; type: string }>;
    screenSize?: string;
    resolution?: string;
    graphics?: string;
  };
}

export default class AssetInventoryService {
  public static current: AssetInventoryService = new AssetInventoryService();

  private getAuthHeaders(): HeadersInit {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const token = ApplicationLocalStorageService.current.getAccessToken();
    const headers: Record<string, string> = {
      ...config.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  public async getAllAssets(): Promise<Asset[]> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.assetInventory.getAll, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch assets (HTTP ${response.status})`);
    }

    const json = await response.json();
    const dtos: BackendAssetDTO[] = json.data || [];
    return dtos.map(this.mapDtoToAsset);
  }

  public async getAssetById(id: string): Promise<Asset> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.assetInventory.getById(id), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset with ID ${id} (HTTP ${response.status})`);
    }

    const json = await response.json();
    const dto: BackendAssetDTO = json.data;
    return this.mapDtoToAsset(dto);
  }

  public async createAsset(request: CreateAssetRequest): Promise<Asset> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.assetInventory.create, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    const json = await response.json();
    if (!response.ok) {
      const errorMsg = json.message || json.title || `Asset creation failed with HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    const createdDto: BackendAssetDTO = json.data;
    return this.mapDtoToAsset(createdDto);
  }

  public async deleteAsset(id: string): Promise<boolean> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.assetInventory.delete(id), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      const errorMsg = json.message || `Asset deletion failed with HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    return true;
  }

  private mapDtoToAsset(dto: BackendAssetDTO): Asset {
    return {
      id: dto.id,
      assetNumber: dto.assetTag,
      barcodeValue: dto.serialNumber.replace(/[^0-9]/g, '') || '904100990011',
      serialNumber: dto.serialNumber,
      companyTag: dto.assetTag,
      hostname: `${(dto.assignedDepartment || 'CORP').slice(0, 3).toUpperCase()}-${dto.modelName.replace(/\s+/g, '-').toUpperCase()}`,
      deviceName: dto.modelName,
      category: (dto.category || 'Computing') as any,
      subtype: (dto.subtype || 'Laptop') as any,
      manufacturer: dto.manufacturer,
      brand: dto.manufacturer,
      model: dto.modelName,
      productFamily: dto.category,
      sku: `SKU-${dto.serialNumber.slice(0, 6)}`,
      releaseYear: 2024,
      lifecycleStatus: (dto.status || 'Inventory') as any,
      currentLocation: dto.location || 'HQ Warehouse',
      department: dto.assignedDepartment || 'Unassigned',
      businessUnit: 'Corporate Operations',
      costCenter: 'CC-100-GEN',
      assignedToEmployeeId: dto.assignedEmployeeId || undefined,
      assignedToEmployeeName: dto.assignedEmployeeName || undefined,
      currentValue: dto.currentBookValue || dto.purchasePrice,
      depreciationMethod: (dto.depreciationMethod as any) || 'Straight Line',
      usefulLifeYears: Math.round(dto.usefulLifeMonths / 12) || 3,
      salvageValue: dto.salvageValue,
      totalCostOfOwnership: dto.purchasePrice,
      aiNotes: dto.notes || undefined,
      hardwareSpecs: {
        cpu: dto.specs?.processor,
        ramGbs: dto.specs?.ramGbs || (dto.specs?.ram ? parseInt(dto.specs.ram) || undefined : undefined),
        ram: dto.specs?.ram || (dto.specs?.ramGbs ? `${dto.specs.ramGbs} GB` : undefined),
        storage: dto.specs?.storage,
        storageDrives: dto.specs?.storageDrives as any,
        screenSize: dto.specs?.screenSize,
        gpu: dto.specs?.graphics,
        resolution: dto.specs?.resolution,
      },
      procurement: {
        purchaseDate: dto.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        purchaseOrderNo: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        vendorName: dto.manufacturer || 'Direct Purchase',
        invoiceNo: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        invoiceDate: dto.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        purchaseCost: dto.purchasePrice,
        gstPct: 8.5,
        currency: dto.currency || 'USD',
        budgetCode: 'CAPEX-2026',
        costCenter: 'CC-100-GEN',
        isCapitalized: true,
        procurementMethod: 'Direct Purchase',
      },
      warranty: {
        warrantyStart: dto.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        warrantyEnd: new Date(Date.now() + 365 * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hasExtendedWarranty: false,
        vendorContactName: 'Enterprise Support',
        supportPhone: '+1-800-ASSETSPHERE',
        slaDetails: 'Next Business Day Onsite Support',
        responseTimeHours: 4,
        escalationContact: 'support@assetsphere.internal',
      },
      security: {
        antivirusStatus: 'Active',
        vpnClientStatus: 'Installed',
        bitlockerEnabled: true,
        encryptionStatus: 'Encrypted',
        patchLevel: 'Current (KB-2026-08)',
        securityBaselineScore: 95,
        complianceScore: 98,
        isCompliant: true,
      },
      network: {
        officeLocation: dto.location || 'HQ Warehouse',
      },
      health: {
        overallScore: 96,
        deviceAgeMonths: 0,
        batteryHealthPct: 100,
        repairCount: 0,
        warrantyStatus: 'Active',
        downtimeHoursTotal: 0,
        performanceIndex: 98,
        smartStatus: 'GOOD',
        securityCompliancePct: 98,
      },
      timeline: [
        {
          id: `EVT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          eventType: 'Purchased',
          title: 'Device Registered',
          description: `Asset tag ${dto.assetTag} registered into system inventory.`,
          actorName: 'Asset Inventory Engine',
        },
      ],
      chainOfCustody: [],
    };
  }
}
