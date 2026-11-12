import { Page, Response } from '@playwright/test';
import CreateAssetAssertion from '../Assertion/CreateAssetAssertion';
import CreateAssetCON from '../Constants/CreateAssetCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import { AssetCreateFormDataType } from '../Models/Types/AssetCreateFormDataType';

export type CreatedTestAsset = {
  id: string;
  assetTag: string;
};

/**
 * Drives the real Add Asset UI flow - shared by every test that needs a disposable
 * test asset as setup (Update/Delete/QR Badge/QR Scanner), not just CreateAssetTest.
 */
export default class AssetFormUtility {
  public static readonly current: AssetFormUtility = new AssetFormUtility();
  private constructor() {}

  public buildUniqueSerialNumber(): string {
    return `PWTEST${Date.now()}`;
  }

  public async openAddAssetModal(page: Page): Promise<void> {
    await page.getByTestId(CreateAssetCON.REGISTER_DEVICE_BUTTON).click();
    await page.getByTestId(CreateAssetCON.CREATE_FROM_SCRATCH_OPTION).click();
    await CreateAssetAssertion.current.assertAddAssetModalOpen(page);
  }

  public async fillAssetForm(page: Page, formData: AssetCreateFormDataType): Promise<void> {
    await page.getByTestId(CreateAssetCON.DEVICE_NAME_INPUT).fill(formData.deviceName);
    await page.getByTestId(CreateAssetCON.SERIAL_NUMBER_INPUT).fill(formData.serialNumber);
  }

  /** Submits the open Add Asset form and returns the real create-asset API response -
   * filtered to POST specifically, since GET (list refetch) shares the same URL prefix. */
  public async submitAssetFormAndCaptureResponse(page: Page): Promise<Response> {
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

  /** Full convenience flow for tests that just need *a* disposable asset to exist as
   * setup, and don't care about re-verifying the create flow itself (already covered
   * by CreateAssetTest). Leaves the Add Asset modal closed and the caller on the
   * Asset Inventory page afterward. */
  public async createTestAsset(page: Page, deviceName: string = 'Playwright Test Device'): Promise<CreatedTestAsset> {
    await this.openAddAssetModal(page);
    await this.fillAssetForm(page, { deviceName, serialNumber: this.buildUniqueSerialNumber() });
    const response = await this.submitAssetFormAndCaptureResponse(page);
    CreateAssetAssertion.current.assertCreateResponseSucceeded(response);
    const payload = await response.json();
    await CreateAssetAssertion.current.assertAssetCreatedToastShown(page);
    return { id: payload.data.id, assetTag: payload.data.assetTag };
  }
}
