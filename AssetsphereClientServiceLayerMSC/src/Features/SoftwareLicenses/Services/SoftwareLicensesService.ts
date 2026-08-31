import ApplicationNetworkAPIConfiguration from '../../../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from '../../../Services/ApplicationLocalStorageService';
import {
  SoftwareLicense,
  BackendSoftwareLicenseDTO,
  CreateSoftwareLicenseRequest,
  UpdateSoftwareLicenseRequest,
} from '../../../Types/SoftwareLicenseType';

export default class SoftwareLicensesService {
  public static current: SoftwareLicensesService = new SoftwareLicensesService();

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

  public mapDtoToLicense(dto: BackendSoftwareLicenseDTO): SoftwareLicense {
    let departments: string[] = [];
    if (dto.assignedDepartmentsJson) {
      try {
        const parsed = JSON.parse(dto.assignedDepartmentsJson);
        if (Array.isArray(parsed)) {
          departments = parsed;
        }
      } catch {
        departments = [dto.assignedDepartmentsJson];
      }
    }

    const formatISODate = (isoStr?: string | null): string => {
      if (!isoStr) return '';
      try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        return d.toISOString().split('T')[0];
      } catch {
        return isoStr;
      }
    };

    return {
      id: dto.id,
      softwareName: dto.softwareName,
      publisher: dto.publisher,
      version: dto.version,
      category: dto.category || 'Productivity',
      licenseKey: dto.licenseKey,
      licenseType: dto.licenseType || 'Enterprise Subscription',
      totalSeats: dto.totalSeats || 0,
      allocatedSeats: dto.assignedSeats || 0,
      costPerSeat: dto.costPerSeat || 0,
      annualCost: dto.annualCost || (dto.costPerSeat * (dto.totalSeats || 0)),
      currency: dto.currency || 'USD',
      purchaseDate: formatISODate(dto.purchaseDate || dto.createdAt),
      expirationDate: formatISODate(dto.expiryDate),
      complianceStatus: dto.complianceStatus || 'Compliant',
      assignedDepartments: departments,
      assignedUsersJson: dto.assignedUsersJson || undefined,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt || undefined,
    };
  }

  public async getAllLicenses(category?: string, complianceStatus?: string, search?: string): Promise<SoftwareLicense[]> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const url = new URL(config.endpoints.softwareLicenses.getAll);

    if (category && category !== 'all') {
      url.searchParams.append('category', category);
    }
    if (complianceStatus && complianceStatus !== 'ALL') {
      url.searchParams.append('complianceStatus', complianceStatus);
    }
    if (search && search.trim()) {
      url.searchParams.append('search', search.trim());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch software licenses (HTTP ${response.status})`);
    }

    const json = await response.json();
    const dtos: BackendSoftwareLicenseDTO[] = json.data || [];
    return dtos.map((d) => this.mapDtoToLicense(d));
  }

  public async getLicenseById(id: string): Promise<SoftwareLicense> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.softwareLicenses.getById(id), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch software license (HTTP ${response.status})`);
    }

    const json = await response.json();
    return this.mapDtoToLicense(json.data);
  }

  public async createLicense(request: CreateSoftwareLicenseRequest): Promise<SoftwareLicense> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.softwareLicenses.create, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create software license: ${errorText || response.statusText}`);
    }

    const json = await response.json();
    return this.mapDtoToLicense(json.data);
  }

  public async updateLicense(id: string, request: UpdateSoftwareLicenseRequest): Promise<SoftwareLicense> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.softwareLicenses.update(id), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update software license: ${errorText || response.statusText}`);
    }

    const json = await response.json();
    return this.mapDtoToLicense(json.data);
  }

  public async deleteLicense(id: string): Promise<boolean> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.softwareLicenses.delete(id), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete software license (HTTP ${response.status})`);
    }

    return true;
  }
}
