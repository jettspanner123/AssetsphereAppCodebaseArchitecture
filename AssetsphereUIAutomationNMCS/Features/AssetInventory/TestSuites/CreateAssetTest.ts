import { test, expect, Page, Response } from '@playwright/test';
import CreateAssetAssertion from '../Assertion/CreateAssetAssertion';
import CreateAssetCON from '../Constants/CreateAssetCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import PerformanceMetricsUtility from '../../../Utilities/PerformanceMetricsUtility';
import UILoginUtility from '../../../Utilities/UILoginUtility';
import AssetCleanupUtility from '../Utilities/AssetCleanupUtility';
import { AssetCreateFormDataType } from '../Models/Types/AssetCreateFormDataType';

const COLD_START_THRESHOLD_MS = 10_000;

function buildUniqueSerialNumber(): string {
  return `PWTEST${Date.now()}`;
}

async function openAddAssetModal(page: Page): Promise<void> {
  await page.getByTestId(CreateAssetCON.REGISTER_DEVICE_BUTTON).click();
  await page.getByTestId(CreateAssetCON.CREATE_FROM_SCRATCH_OPTION).click();
  await CreateAssetAssertion.current.assertAddAssetModalOpen(page);
}

async function fillAssetForm(page: Page, formData: AssetCreateFormDataType): Promise<void> {
  await page.getByTestId(CreateAssetCON.DEVICE_NAME_INPUT).fill(formData.deviceName);
  await page.getByTestId(CreateAssetCON.SERIAL_NUMBER_INPUT).fill(formData.serialNumber);
}

/** Submits the open Add Asset form and returns the real create-asset API response -
 * filtered to POST specifically, since GET (list refetch) shares the same URL prefix. */
async function submitAssetFormAndCaptureResponse(page: Page): Promise<Response> {
  const createResponsePromise = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === CreateAssetCON.CREATE_ASSET_ENDPOINT_PATH &&
      response.request().method() === 'POST',
    { timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS }
  );
  await page.getByTestId(CreateAssetCON.SUBMIT_BUTTON).click();

  // Check the in-flight loading state before awaiting the response - see Authentication
  // suites for why this ordering matters once the backend is warm.
  await CreateAssetAssertion.current.assertSubmitInFlight(page);

  return createResponsePromise;
}

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

    const serialNumber = buildUniqueSerialNumber();
    await openAddAssetModal(page);
    await fillAssetForm(page, { deviceName: 'Playwright Test Device', serialNumber });

    const submitClickedAt = Date.now();
    const createResponse = await submitAssetFormAndCaptureResponse(page);
    const createRequestDurationMs = Date.now() - submitClickedAt;
    CreateAssetAssertion.current.assertCreateResponseSucceeded(createResponse);

    const createPayload = await createResponse.json();
    const createdAssetId: string = createPayload.data.id;

    // Once the asset exists in production, cleanup MUST run even if an assertion
    // below throws - otherwise a failed test would leave it behind permanently.
    try {
      await CreateAssetAssertion.current.assertAssetCreatedToastShown(page);
      await CreateAssetAssertion.current.assertAssetAppearsInList(page, serialNumber);
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
      // First asset
      await openAddAssetModal(page);
      await fillAssetForm(page, { deviceName: 'Playwright Tag Test Device A', serialNumber: buildUniqueSerialNumber() });
      const firstResponse = await submitAssetFormAndCaptureResponse(page);
      CreateAssetAssertion.current.assertCreateResponseSucceeded(firstResponse);
      const firstPayload = await firstResponse.json();
      createdAssetIds.push(firstPayload.data.id);
      const firstAssetTag: string = firstPayload.data.assetTag;
      CreateAssetAssertion.current.assertValidAssetTag(firstAssetTag);

      // Second asset, created immediately after with no manual tag either
      await openAddAssetModal(page);
      await fillAssetForm(page, { deviceName: 'Playwright Tag Test Device B', serialNumber: buildUniqueSerialNumber() });
      const secondResponse = await submitAssetFormAndCaptureResponse(page);
      CreateAssetAssertion.current.assertCreateResponseSucceeded(secondResponse);
      const secondPayload = await secondResponse.json();
      createdAssetIds.push(secondPayload.data.id);
      const secondAssetTag: string = secondPayload.data.assetTag;
      CreateAssetAssertion.current.assertValidAssetTag(secondAssetTag);

      expect(secondAssetTag).not.toBe(firstAssetTag);
    } finally {
      for (const assetId of createdAssetIds) {
        await AssetCleanupUtility.current.deleteAsset(request, assetId);
      }
    }
  });
});
