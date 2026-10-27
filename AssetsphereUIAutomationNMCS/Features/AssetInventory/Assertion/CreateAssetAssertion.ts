import { Page, Response, expect } from '@playwright/test';
import CreateAssetCON from '../Constants/CreateAssetCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';

export default class CreateAssetAssertion {
  public static readonly current: CreateAssetAssertion = new CreateAssetAssertion();
  private constructor() {}

  public async assertAssetInventoryPageLoaded(page: Page): Promise<void> {
    await expect(page).toHaveURL(new RegExp(`${ApplicationPageRoutesFactory.DashboardRoutes.AssetInventory}$`));
    await expect(page.getByTestId(CreateAssetCON.REGISTER_DEVICE_BUTTON)).toBeVisible();
  }

  public async assertAddAssetModalOpen(page: Page): Promise<void> {
    await expect(page.getByTestId(CreateAssetCON.DEVICE_NAME_INPUT)).toBeVisible();
    await expect(page.getByTestId(CreateAssetCON.SERIAL_NUMBER_INPUT)).toBeVisible();
  }

  /** Fast check: the submit button reacts immediately, regardless of backend speed. */
  public async assertSubmitInFlight(page: Page): Promise<void> {
    await expect(page.getByTestId(CreateAssetCON.SUBMIT_BUTTON)).toContainText(
      CreateAssetCON.SUBMIT_BUTTON_LOADING_LABEL
    );
  }

  /** Ground-truth check on the actual create-asset API response. Caller must capture the
   * Response via page.waitForResponse() started before the triggering click. */
  public assertCreateResponseSucceeded(response: Response): void {
    expect(response.ok()).toBe(true);
  }

  /** Slow check: allows the full cold-start budget, since the backend may still be
   * waking up even after the create response itself has already landed. */
  public async assertAssetCreatedToastShown(page: Page): Promise<void> {
    await expect(page.getByText(CreateAssetCON.SUCCESS_TOAST_TITLE)).toBeVisible({
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
  }

  /** The create-asset cache patch is instant on success (no page reload needed). Filters
   * via the search box (filters the full in-memory list) rather than scanning raw page
   * text, since the underlying table may paginate/sort the new row off the visible page. */
  public async assertAssetAppearsInList(page: Page, serialNumber: string): Promise<void> {
    await page.getByTestId(CreateAssetCON.SEARCH_INPUT).fill(serialNumber);
    await expect(page.getByText(serialNumber, { exact: false }).first()).toBeVisible({
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
  }

  public assertValidAssetTag(assetTag: string): void {
    expect(assetTag).toMatch(CreateAssetCON.ASSET_TAG_PATTERN);
  }
}
