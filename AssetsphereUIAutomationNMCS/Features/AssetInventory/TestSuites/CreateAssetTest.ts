import { test, expect } from '@playwright/test';
import CreateAssetAssertion from '../Assertion/CreateAssetAssertion';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import PerformanceMetricsUtility from '../../../Utilities/PerformanceMetricsUtility';
import UILoginUtility from '../../../Utilities/UILoginUtility';
import AssetCleanupUtility from '../Utilities/AssetCleanupUtility';
import AssetFormUtility from '../Utilities/AssetFormUtility';

const COLD_START_THRESHOLD_MS = 10_000;

test.describe('Create Asset', () => {
  test.beforeEach(async ({ page }) => {
    await UILoginUtility.current.loginAsAdmin(page);
    await page.goto(ApplicationPageRoutesFactory.DashboardRoutes.AssetInventory);
    await CreateAssetAssertion.current.assertAssetInventoryPageLoaded(page);
  });

  test('registers a new asset successfully and it instantly appears in the inventory (tolerates a cold-started backend)', async ({
    page,
    request,
  }, testInfo) => {
    test.setTimeout(BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000);

    const serialNumber = AssetFormUtility.current.buildUniqueSerialNumber();
    await AssetFormUtility.current.openAddAssetModal(page);
    await AssetFormUtility.current.fillAssetForm(page, { deviceName: 'Playwright Test Device', serialNumber });

    const submitClickedAt = Date.now();
    const createResponse = await AssetFormUtility.current.submitAssetFormAndCaptureResponse(page);
    const createRequestDurationMs = Date.now() - submitClickedAt;
    CreateAssetAssertion.current.assertCreateResponseSucceeded(createResponse);

    const createPayload = await createResponse.json();
    const createdAssetId: string = createPayload.data.id;
    const createdAssetTag: string = createPayload.data.assetTag;

    // Once the asset exists in production, cleanup MUST run even if an assertion
    // below throws - otherwise a failed test would leave it behind permanently.
    try {
      await CreateAssetAssertion.current.assertAssetCreatedToastShown(page);
      await CreateAssetAssertion.current.assertAssetAppearsInList(page, createdAssetTag);
      const timeToVisibleInListMs = Date.now() - submitClickedAt;

      PerformanceMetricsUtility.current.record(
        testInfo.title,
        {
          createRequestDurationMs,
          timeToVisibleInListMs,
          coldStart: createRequestDurationMs > COLD_START_THRESHOLD_MS,
        },
        testInfo
      );
    } finally {
      await AssetCleanupUtility.current.deleteAsset(request, createdAssetId);
    }
  });

  test('auto-generates a unique asset tag for every asset, even created back-to-back (regression: the tag-collision bug fixed earlier)', async ({
    page,
    request,
  }) => {
    test.setTimeout(2 * (BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000));

    const createdAssetIds: string[] = [];

    try {
      const firstAsset = await AssetFormUtility.current.createTestAsset(page, 'Playwright Tag Test Device A');
      createdAssetIds.push(firstAsset.id);
      CreateAssetAssertion.current.assertValidAssetTag(firstAsset.assetTag);

      const secondAsset = await AssetFormUtility.current.createTestAsset(page, 'Playwright Tag Test Device B');
      createdAssetIds.push(secondAsset.id);
      CreateAssetAssertion.current.assertValidAssetTag(secondAsset.assetTag);

      expect(secondAsset.assetTag).not.toBe(firstAsset.assetTag);
    } finally {
      for (const assetId of createdAssetIds) {
        await AssetCleanupUtility.current.deleteAsset(request, assetId);
      }
    }
  });
});
