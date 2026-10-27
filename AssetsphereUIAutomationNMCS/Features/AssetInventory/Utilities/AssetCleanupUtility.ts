import { APIRequestContext } from '@playwright/test';
import AdminAPIClientUtility from '../../../Utilities/AdminAPIClientUtility';
import BackendAPIRoutesFactory from '../../../Factories/BackendAPIRoutesFactory';

/**
 * Deletes a test-created asset via a direct backend API call - used to clean up after
 * a test so it doesn't sit forever in the real production asset inventory.
 */
export default class AssetCleanupUtility {
  public static readonly current: AssetCleanupUtility = new AssetCleanupUtility();
  private constructor() {}

  public async deleteAsset(request: APIRequestContext, assetId: string): Promise<void> {
    const adminToken = await AdminAPIClientUtility.current.getAdminToken(request);

    const response = await request.delete(BackendAPIRoutesFactory.AssetInventoryEndpoints.DeleteAsset(assetId), {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to clean up test asset ${assetId}: HTTP ${response.status()}: ${await response.text()}`
      );
    }
  }
}
