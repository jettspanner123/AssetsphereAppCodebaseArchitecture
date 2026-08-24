import ApplicationNetworkAPIConfiguration from '../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from './ApplicationLocalStorageService';

export interface ConfigurationConstantDTO {
  id: string;
  configurationKey: string;
  configurationValue: string;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export default class ConfigurationConstantService {
  public static current: ConfigurationConstantService = new ConfigurationConstantService();

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

  public async getAllConstants(): Promise<ConfigurationConstantDTO[]> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.configurationConstant.getAll, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch configuration constants (HTTP ${response.status})`);
    }

    const json = await response.json();
    return json.data || [];
  }

  public async getConstantByKey(key: string): Promise<ConfigurationConstantDTO> {
    const config = ApplicationNetworkAPIConfiguration.current.getConfiguration();
    const response = await fetch(config.endpoints.configurationConstant.getByKey(key), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch configuration constant '${key}' (HTTP ${response.status})`);
    }

    const json = await response.json();
    return json.data;
  }

  public async getWorkLocations(): Promise<string[]> {
    try {
      const dto = await this.getConstantByKey('WORK_LOCATIONS');
      if (dto && dto.configurationValue) {
        const parsed = JSON.parse(dto.configurationValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback if parsing fails or offline
    }
    return ['Pune, Maharastra'];
  }
}
