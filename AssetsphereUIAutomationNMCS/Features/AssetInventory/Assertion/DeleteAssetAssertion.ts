import { Page, Response, expect } from '@playwright/test';
import DeleteAssetCON from '../Constants/DeleteAssetCON';
import CreateAssetCON from '../Constants/CreateAssetCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';

export default class DeleteAssetAssertion {
  public static readonly current: DeleteAssetAssertion = new DeleteAssetAssertion();
  private constructor() {}

  public async assertDeleteConfirmationShowsAsset(page: Page, assetTag: string): Promise<void> {
    await expect(page.getByText(DeleteAssetCON.CONFIRMATION_TITLE)).toBeVisible();
    await expect(page.getByText(assetTag, { exact: false }).first()).toBeVisible();
  }

  public assertDeleteResponseSucceeded(response: Response): void {
    expect(response.ok()).toBe(true);
  }

  public async assertAssetDeletedToastShown(page: Page): Promise<void> {
    await expect(page.getByText(DeleteAssetCON.SUCCESS_TOAST_TITLE)).toBeVisible({
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
  }

  /** Confirms the asset is genuinely gone from the inventory - searching by its own
   * assetTag should now find nothing, not even the deleted row. */
  public async assertAssetNoLongerInList(page: Page, assetTag: string): Promise<void> {
    await page.getByTestId(CreateAssetCON.SEARCH_INPUT).fill(assetTag);
    await expect(page.getByTestId(`asset-card-${assetTag}`)).toHaveCount(0, {
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
  }
}
