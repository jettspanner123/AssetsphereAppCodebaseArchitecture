import ApplicationNetworkAPIConfiguration from '../../../Configurations/ApplicationNetworkAPIConfiguration';
import ApplicationLocalStorageService from '../../../Services/ApplicationLocalStorageService';
import { NotificationItemType, CreateNotificationRequest } from '../../../Types/NotificationType';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: string[] | null;
  statusCode: number;
}

export default class NotificationsService {
  public static current: NotificationsService = new NotificationsService();

  private getAuthHeaders(): HeadersInit {
    const token = ApplicationLocalStorageService.current.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Fetch live notification feed for the current user
   */
  public async getNotifications(userId?: string, role?: string): Promise<NotificationItemType[]> {
    const user = ApplicationLocalStorageService.current.getAuthSession()?.user;
    const effectiveUserId = userId || user?.id || '';
    const effectiveRole = role || user?.role || '';

    const queryParams = new URLSearchParams();
    if (effectiveUserId) queryParams.append('userId', effectiveUserId);
    if (effectiveRole) queryParams.append('role', effectiveRole);

    const qs = queryParams.toString();
    const endpoint = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.notifications.getAll;
    const url = `${endpoint}${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch notifications: ${res.statusText}`);
    }

    const json: ApiResponse<NotificationItemType[]> = await res.json();
    return json.data || [];
  }

  /**
   * Mark a single notification as read
   */
  public async markAsRead(id: string, userId?: string): Promise<NotificationItemType> {
    const user = ApplicationLocalStorageService.current.getAuthSession()?.user;
    const effectiveUserId = userId || user?.id || '';

    const queryParams = new URLSearchParams();
    if (effectiveUserId) queryParams.append('userId', effectiveUserId);

    const qs = queryParams.toString();
    const endpoint = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.notifications.markAsRead(id);
    const url = `${endpoint}${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to mark notification as read: ${res.statusText}`);
    }

    const json: ApiResponse<NotificationItemType> = await res.json();
    return json.data;
  }

  /**
   * Mark all notifications as read for the current user
   */
  public async markAllAsRead(userId?: string, role?: string): Promise<number> {
    const user = ApplicationLocalStorageService.current.getAuthSession()?.user;
    const effectiveUserId = userId || user?.id || '';
    const effectiveRole = role || user?.role || '';

    const queryParams = new URLSearchParams();
    if (effectiveUserId) queryParams.append('userId', effectiveUserId);
    if (effectiveRole) queryParams.append('role', effectiveRole);

    const qs = queryParams.toString();
    const endpoint = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.notifications.markAllAsRead;
    const url = `${endpoint}${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to mark all notifications as read: ${res.statusText}`);
    }

    const json: ApiResponse<number> = await res.json();
    return json.data;
  }

  /**
   * Create a new notification (Operator/Admin)
   */
  public async createNotification(request: CreateNotificationRequest): Promise<NotificationItemType> {
    const url = ApplicationNetworkAPIConfiguration.current.getConfiguration().endpoints.notifications.create;

    const res = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error(`Failed to create notification: ${res.statusText}`);
    }

    const json: ApiResponse<NotificationItemType> = await res.json();
    return json.data;
  }
}
