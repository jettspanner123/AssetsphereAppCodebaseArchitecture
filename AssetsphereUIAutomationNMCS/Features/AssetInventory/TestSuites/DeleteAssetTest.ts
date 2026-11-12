import { test } from '@playwright/test';
import CreateAssetAssertion from '../Assertion/CreateAssetAssertion';
import DeleteAssetAssertion from '../Assertion/DeleteAssetAssertion';
import DeleteAssetCON from '../Constants/DeleteAssetCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import UILoginUtility from '../../../Utilities/UILoginUtility';
import AssetCleanupUtility from '../Utilities/AssetCleanupUtility';
import AssetFormUtility from '../Utilities/AssetFormUtility';
import AssetDetailNavigationUtility from '../Utilities/AssetDetailNavigationUtility';

test.describe('Delete Asset', () => {
  test.beforeEach(async ({ page }) => {
    await UILoginUtility.current.loginAsAdmin(page);
    await page.goto(ApplicationPageRoutesFactory.DashboardRoutes.AssetInventory);
    await CreateAssetAssertion.current.assertAssetInventoryPageLoaded(page);
  });

  test('deletes an asset via the real delete flow and it disappears from the inventory', async ({ page, request }) => {
    test.setTimeout(BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000);

    const testAsset = await AssetFormUtility.current.createTestAsset(page, 'Playwright Delete Test Device');

    // Cleanup runs regardless of pass/fail. deleteAsset is idempotent (404 = already
    // gone), so this is safe to call even after the UI delete below already succeeded.
    try {
      await AssetDetailNavigationUtility.current.openAssetDetailModal(page, testAsset.assetTag);
      await page.getByTestId(DeleteAssetCON.DETAIL_DELETE_BUTTON).click();
      await DeleteAssetAssertion.current.assertDeleteConfirmationShowsAsset(page, testAsset.assetTag);

      const deleteResponsePromise = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === `/Api/V1/AssetInventory/${testAsset.id}` &&
          response.request().method() === 'DELETE',
        { timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS }
      );
      await page.getByTestId(DeleteAssetCON.DELETE_CONFIRM_BUTTON).click();

      const deleteResponse = await deleteResponsePromise;
      DeleteAssetAssertion.current.assertDeleteResponseSucceeded(deleteResponse);

      await DeleteAssetAssertion.current.assertAssetDeletedToastShown(page);
      await DeleteAssetAssertion.current.assertAssetNoLongerInList(page, testAsset.assetTag);
    } finally {
      await AssetCleanupUtility.current.deleteAsset(request, testAsset.id);
    }
  });
});
