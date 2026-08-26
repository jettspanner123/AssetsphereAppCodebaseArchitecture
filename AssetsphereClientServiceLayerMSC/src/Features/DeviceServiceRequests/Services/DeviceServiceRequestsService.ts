import ApplicationNetworkAPIConfiguration from '../../../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from '../../../Services/ApplicationLocalStorageService';
import {
  DeviceServiceRequestItemType,
  CreateDeviceServiceRequestInput,
  UpdateDeviceServiceRequestStatusInput,
} from '../../../Types/DeviceServiceRequestType';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: string[] | null;
  statusCode: number;
}

export default class DeviceServiceRequestsService {
  public static current: DeviceServiceRequestsService = new DeviceServiceRequestsService();

  private getAuthHeaders(): HeadersInit {
    const token = ApplicationLocalStorageService.current.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Fetch all service requests (scoped to role/user on backend)
   */
  public async getAllRequests(status?: string, userId?: string): Promise<DeviceServiceRequestItemType[]> {
    const user = ApplicationLocalStorageService.current.getAuthSession()?.user;
    const effectiveUserId = userId || user?.id || '';

    const queryParams = new URLSearchParams();
    if (status && status !== 'ALL') queryParams.append('status', status);
    if (effectiveUserId) queryParams.append('userId', effectiveUserId);

    const qs = queryParams.toString();
    const endpoint = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.deviceServiceRequests.getAll;
    const url = `${endpoint}${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch device service requests: ${res.statusText}`);
    }

    const json: ApiResponse<DeviceServiceRequestItemType[]> = await res.json();
    return json.data || [];
  }

  /**
   * Fetch service requests specifically raised by or for the current user
   */
  public async getMyRequests(userId?: string): Promise<DeviceServiceRequestItemType[]> {
    const user = ApplicationLocalStorageService.current.getAuthSession()?.user;
    const effectiveUserId = userId || user?.id || '';

    const queryParams = new URLSearchParams();
    if (effectiveUserId) queryParams.append('userId', effectiveUserId);

    const qs = queryParams.toString();
    const endpoint = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.deviceServiceRequests.getMyRequests;
    const url = `${endpoint}${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch personal service requests: ${res.statusText}`);
    }

    const json: ApiResponse<DeviceServiceRequestItemType[]> = await res.json();
    return json.data || [];
  }

  /**
   * Create a new device service request
   */
  public async createRequest(input: CreateDeviceServiceRequestInput): Promise<DeviceServiceRequestItemType> {
    const endpoint = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.deviceServiceRequests.create;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.message || `Failed to submit service request: ${res.statusText}`);
    }

    const json: ApiResponse<DeviceServiceRequestItemType> = await res.json();
    return json.data;
  }

  /**
   * Update request status (Operator/Admin only)
   */
  public async updateRequestStatus(
    id: string,
    input: UpdateDeviceServiceRequestStatusInput
  ): Promise<DeviceServiceRequestItemType> {
    const endpoint = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.deviceServiceRequests.updateStatus(id);

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      throw new Error(errorJson?.message || `Failed to update service request status: ${res.statusText}`);
    }

    const json: ApiResponse<DeviceServiceRequestItemType> = await res.json();
    return json.data;
  }
}
