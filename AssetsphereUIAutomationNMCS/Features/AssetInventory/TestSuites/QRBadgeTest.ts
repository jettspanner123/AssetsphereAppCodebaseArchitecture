import { test } from '@playwright/test';
import CreateAssetAssertion from '../Assertion/CreateAssetAssertion';
import QRBadgeAssertion from '../Assertion/QRBadgeAssertion';
import QRBadgeCON from '../Constants/QRBadgeCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import UILoginUtility from '../../../Utilities/UILoginUtility';
import AssetCleanupUtility from '../Utilities/AssetCleanupUtility';
import AssetFormUtility from '../Utilities/AssetFormUtility';
import AssetDetailNavigationUtility from '../Utilities/AssetDetailNavigationUtility';

test.describe('QR Badge', () => {
  test.beforeEach(async ({ page }) => {
    await UILoginUtility.current.loginAsAdmin(page);
    await page.goto(ApplicationPageRoutesFactory.DashboardRoutes.AssetInventory);
    await CreateAssetAssertion.current.assertAssetInventoryPageLoaded(page);
  });

  test('generates a QR badge for an asset and its "Open Passport" link resolves to the same asset', async ({
    page,
    request,
  }) => {
    test.setTimeout(BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000);
    const testAsset = await AssetFormUtility.current.createTestAsset(page, 'Playwright QR Badge Test Device');

    try {
      await AssetDetailNavigationUtility.current.openQRBadgeFromCard(page, testAsset.assetTag);
      await QRBadgeAssertion.current.assertBadgeShowsAsset(
        page,
        testAsset.assetTag,
        'Playwright QR Badge Test Device'
      );
      await QRBadgeAssertion.current.assertQRCodeRendered(page);

      const popupPromise = page.waitForEvent('popup');
      await page.getByTestId(QRBadgeCON.OPEN_PASSPORT_BUTTON).click();
      const passportPage = await popupPromise;
      await passportPage.waitForLoadState();
      await QRBadgeAssertion.current.assertPassportPageShowsAsset(
        passportPage,
        testAsset.assetTag,
        'Playwright QR Badge Test Device'
      );
      await passportPage.close();

      await page.getByTestId(QRBadgeCON.CLOSE_BUTTON).click();
    } finally {
      await AssetCleanupUtility.current.deleteAsset(request, testAsset.id);
    }
  });
});
