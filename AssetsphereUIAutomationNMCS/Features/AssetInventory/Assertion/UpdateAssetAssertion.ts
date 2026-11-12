import { Page, Response, expect } from '@playwright/test';
import UpdateAssetCON from '../Constants/UpdateAssetCON';
import CreateAssetCON from '../Constants/CreateAssetCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';

export default class UpdateAssetAssertion {
  public static readonly current: UpdateAssetAssertion = new UpdateAssetAssertion();
  private constructor() {}

  public async assertDetailModalShowsAsset(page: Page, assetTag: string): Promise<void> {
    await expect(page.getByText(assetTag, { exact: false }).first()).toBeVisible();
  }

  /** Fast check: the submit button reacts immediately, regardless of backend speed. */
  public async assertSubmitInFlight(page: Page): Promise<void> {
    await expect(page.getByTestId(CreateAssetCON.SUBMIT_BUTTON)).toContainText(
      UpdateAssetCON.SUBMIT_BUTTON_LOADING_LABEL
    );
  }

  public assertUpdateResponseSucceeded(response: Response): void {
    expect(response.ok()).toBe(true);
  }

  public async assertAssetUpdatedToastShown(page: Page): Promise<void> {
    await expect(page.getByText(UpdateAssetCON.SUCCESS_TOAST_TITLE)).toBeVisible({
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
  }

  /** Confirms the new value actually persisted and is reflected in the inventory list -
   * searches by assetTag (stable) then checks the updated field's new value is shown. */
  public async assertListShowsUpdatedValue(page: Page, assetTag: string, updatedValue: string): Promise<void> {
    await page.getByTestId(CreateAssetCON.SEARCH_INPUT).fill(assetTag);
    await expect(page.getByText(updatedValue, { exact: false }).first()).toBeVisible({
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
  }
}
