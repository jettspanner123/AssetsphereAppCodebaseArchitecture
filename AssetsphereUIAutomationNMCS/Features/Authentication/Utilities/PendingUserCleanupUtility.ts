import { APIRequestContext } from '@playwright/test';
import AdminApiClientUtility from '../../../Utilities/AdminApiClientUtility';
import BackendApiRoutesFactory from '../../../Factories/BackendApiRoutesFactory';

/**
 * Rejects a pending user registration via a direct backend API call - used to clean up
 * after a test-created signup so it doesn't sit forever in the real admin's approval queue.
 */
export default class PendingUserCleanupUtility {
  public static readonly current: PendingUserCleanupUtility = new PendingUserCleanupUtility();
  private constructor() {}

  public async rejectPendingUser(request: APIRequestContext, pendingUserId: string): Promise<void> {
    const adminToken = await AdminApiClientUtility.current.getAdminToken(request);

    const response = await request.post(BackendApiRoutesFactory.AuthenticationEndpoints.RejectUser(pendingUserId), {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to clean up test pending user ${pendingUserId}: HTTP ${response.status()}: ${await response.text()}`
      );
    }
  }
}
