import { test } from '@playwright/test';
import CreateAssetAssertion from '../Assertion/CreateAssetAssertion';
import CreateAssetCON from '../Constants/CreateAssetCON';
import UpdateAssetAssertion from '../Assertion/UpdateAssetAssertion';
import UpdateAssetCON from '../Constants/UpdateAssetCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import UILoginUtility from '../../../Utilities/UILoginUtility';
import AssetCleanupUtility from '../Utilities/AssetCleanupUtility';
import AssetFormUtility from '../Utilities/AssetFormUtility';
import AssetDetailNavigationUtility from '../Utilities/AssetDetailNavigationUtility';

test.describe('Update Asset', () => {
  test.beforeEach(async ({ page }) => {
    await UILoginUtility.current.loginAsAdmin(page);
    await page.goto(ApplicationPageRoutesFactory.DashboardRoutes.AssetInventory);
    await CreateAssetAssertion.current.assertAssetInventoryPageLoaded(page);
  });

  test('edits an existing asset\'s device name and the change persists in the inventory', async ({ page, request }) => {
    test.setTimeout(BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000);

    const testAsset = await AssetFormUtility.current.createTestAsset(page, 'Playwright Update Test Device');

    try {
      await AssetDetailNavigationUtility.current.openAssetDetailModal(page, testAsset.assetTag);
      await UpdateAssetAssertion.current.assertDetailModalShowsAsset(page, testAsset.assetTag);

      await page.getByTestId(UpdateAssetCON.DETAIL_EDIT_BUTTON).click();
      await CreateAssetAssertion.current.assertAddAssetModalOpen(page);

      const updatedDeviceName = `Playwright Updated Device ${Date.now()}`;
      await page.getByTestId(CreateAssetCON.DEVICE_NAME_INPUT).fill(updatedDeviceName);

      const updateResponsePromise = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === `/Api/V1/AssetInventory/${testAsset.id}` &&
          response.request().method() === 'PUT'
      );
      await page.getByTestId(CreateAssetCON.SUBMIT_BUTTON).click();
      await UpdateAssetAssertion.current.assertSubmitInFlight(page);

      const updateResponse = await updateResponsePromise;
      UpdateAssetAssertion.current.assertUpdateResponseSucceeded(updateResponse);

      await UpdateAssetAssertion.current.assertAssetUpdatedToastShown(page);
      await UpdateAssetAssertion.current.assertListShowsUpdatedValue(page, testAsset.assetTag, updatedDeviceName);
    } finally {
      await AssetCleanupUtility.current.deleteAsset(request, testAsset.id);
    }
  });
});
