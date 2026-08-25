import { PendingUserType, UserProfileType } from '@/src/Types';
import ApplicationLocalStorageService from '@/src/Services/ApplicationLocalStorageService';
import ApplicationNetworkAPIConfiguration from '@/src/Configurations/ApplicationNetworkAPIConfiguration';
import { toast } from 'sonner';

export default class UserRequestsService {
  public static current: UserRequestsService = new UserRequestsService();

  private constructor() {}

  private getBaseUrl(): string {
    return ApplicationNetworkAPIConfiguration.current.getConfiguration().baseUrl;
  }

  public async getPendingUsers(status: string = 'pending'): Promise<PendingUserType[]> {
    const baseUrl = this.getBaseUrl();
    const token = ApplicationLocalStorageService.current.getAccessToken();
    const query = status ? `?status=${encodeURIComponent(status)}` : '';

    const response = await fetch(`${baseUrl}/Api/V1/Authentication/PendingUsers${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to fetch user registration requests.');
    }

    const payload = await response.json();
    return (payload?.data || []) as PendingUserType[];
  }

  public async approveUser(id: string): Promise<UserProfileType> {
    const baseUrl = this.getBaseUrl();
    const token = ApplicationLocalStorageService.current.getAccessToken();

    const response = await fetch(`${baseUrl}/Api/V1/Authentication/ApproveUser/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'Failed to approve user registration.';
      toast.error('Approval Failed', { description: errorMessage });
      throw new Error(errorMessage);
    }

    const payload = await response.json();
    toast.success('User Approved', {
      description: payload?.message || 'The user account has been activated and verified.',
    });
    return payload?.data as UserProfileType;
  }

  public async rejectUser(id: string): Promise<boolean> {
    const baseUrl = this.getBaseUrl();
    const token = ApplicationLocalStorageService.current.getAccessToken();

    const response = await fetch(`${baseUrl}/Api/V1/Authentication/RejectUser/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || 'Failed to reject user request.';
      toast.error('Rejection Failed', { description: errorMessage });
      throw new Error(errorMessage);
    }

    const payload = await response.json();
    toast.success('Request Rejected', {
      description: payload?.message || 'The registration request has been removed.',
    });
    return true;
  }
}
