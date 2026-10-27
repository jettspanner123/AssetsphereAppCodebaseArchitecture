import { APIRequestContext } from '@playwright/test';
import AdminAPIClientUtility from '../../../Utilities/AdminAPIClientUtility';
import BackendAPIRoutesFactory from '../../../Factories/BackendAPIRoutesFactory';

/**
 * Rejects a pending user registration via a direct backend API call - used to clean up
 * after a test-created signup so it doesn't sit forever in the real admin's approval queue.
 */
export default class PendingUserCleanupUtility {
  public static readonly current: PendingUserCleanupUtility = new PendingUserCleanupUtility();
  private constructor() {}

  public async rejectPendingUser(request: APIRequestContext, pendingUserId: string): Promise<void> {
    const adminToken = await AdminAPIClientUtility.current.getAdminToken(request);

    const response = await request.post(BackendAPIRoutesFactory.AuthenticationEndpoints.RejectUser(pendingUserId), {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to clean up test pending user ${pendingUserId}: HTTP ${response.status()}: ${await response.text()}`
      );
    }
  }
}
