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
    // Each matching asset also renders a second, CSS-hidden duplicate card for a
    // different responsive layout - scope to the one actually visible to avoid a
    // strict-mode "resolved to 2 elements" error.
    await page.getByTestId(`asset-card-${assetTag}`).and(page.locator(':visible')).click();
  }

  /** Searches for the asset (narrowing results to its single card) then clicks the
   * card's own "Print Badge" trigger, without opening the full detail modal first. */
  public async openQRBadgeFromCard(page: Page, assetTag: string): Promise<void> {
    await page.getByTestId(CreateAssetCON.SEARCH_INPUT).fill(assetTag);
    await page.getByTestId('asset-card-qr-badge-button').and(page.locator(':visible')).click();
  }
}
