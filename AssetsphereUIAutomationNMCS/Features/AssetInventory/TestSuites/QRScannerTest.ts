import { test } from '@playwright/test';
import CreateAssetAssertion from '../Assertion/CreateAssetAssertion';
import QRScannerAssertion from '../Assertion/QRScannerAssertion';
import QRScannerCON from '../Constants/QRScannerCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import UILoginUtility from '../../../Utilities/UILoginUtility';
import AssetCleanupUtility from '../Utilities/AssetCleanupUtility';
import AssetFormUtility from '../Utilities/AssetFormUtility';

test.describe('QR Scanner', () => {
  test.beforeEach(async ({ page }) => {
    await UILoginUtility.current.loginAsAdmin(page);
    await page.goto(ApplicationPageRoutesFactory.DashboardRoutes.AssetInventory);
    await CreateAssetAssertion.current.assertAssetInventoryPageLoaded(page);
  });

  test('simulates a barcode scan and confirming the audit opens the same asset that was scanned', async ({
    page,
    request,
  }) => {
    test.setTimeout(BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000);
    // Guarantees the scanner's random pick has at least this one asset to pull from.
    const testAsset = await AssetFormUtility.current.createTestAsset(page, 'Playwright QR Scanner Test Device');

    try {
      await page.getByTestId(QRScannerCON.OPEN_PROFILE_MENU_BUTTON).click();
      await page.getByTestId(QRScannerCON.OPEN_SCANNER_MENU_ITEM).click();

      await page.getByTestId(QRScannerCON.SIMULATE_SCAN_BUTTON).click();
      await QRScannerAssertion.current.assertScanResultShown(page);
      const scannedAssetNumber = await QRScannerAssertion.current.readScannedAssetNumber(page);

      await page.getByTestId(QRScannerCON.CONFIRM_VERIFY_BUTTON).click();
      await QRScannerAssertion.current.assertDetailViewShowsAsset(page, scannedAssetNumber);
    } finally {
      await AssetCleanupUtility.current.deleteAsset(request, testAsset.id);
    }
  });
});
