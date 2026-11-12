import { Page } from '@playwright/test';
import CreateAssetCON from '../Constants/CreateAssetCON';

/**
 * Finds an asset by its tag via the inventory search box and opens its detail modal -
 * shared navigation reused by Update/Delete/QR Badge/QR Scanner tests, since they all
 * start from "locate a specific asset's card and click into it".
 */
export default class AssetDetailNavigationUtility {
  public static readonly current: AssetDetailNavigationUtility = new AssetDetailNavigationUtility();
  private constructor() {}

  public async openAssetDetailModal(page: Page, assetTag: string): Promise<void> {
    await page.getByTestId(CreateAssetCON.SEARCH_INPUT).fill(assetTag);
    await page.getByTestId(`asset-card-${assetTag}`).click();
  }

  /** Searches for the asset (narrowing results to its single card) then clicks the
   * card's own "Print Badge" trigger, without opening the full detail modal first. */
  public async openQRBadgeFromCard(page: Page, assetTag: string): Promise<void> {
    await page.getByTestId(CreateAssetCON.SEARCH_INPUT).fill(assetTag);
    await page.getByTestId('asset-card-qr-badge-button').click();
  }
}
