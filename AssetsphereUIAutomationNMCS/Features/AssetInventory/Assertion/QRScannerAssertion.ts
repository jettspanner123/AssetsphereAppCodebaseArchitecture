import { Page, expect } from '@playwright/test';
import QRScannerCON from '../Constants/QRScannerCON';

export default class QRScannerAssertion {
  public static readonly current: QRScannerAssertion = new QRScannerAssertion();
  private constructor() {}

  public async assertScanResultShown(page: Page): Promise<void> {
    await expect(page.getByTestId(QRScannerCON.SCAN_RESULT)).toBeVisible();
  }

  /** The scanner picks a RANDOM asset from the inventory - this reads back whichever
   * asset it actually picked so the test can correlate it with what happens next,
   * rather than trying to control or predict the randomness. */
  public async readScannedAssetNumber(page: Page): Promise<string> {
    const text = await page.getByTestId(QRScannerCON.SCAN_RESULT_ASSET_NUMBER).innerText();
    const assetNumber = text.split('—')[0].trim();
    expect(assetNumber.length).toBeGreaterThan(0);
    return assetNumber;
  }

  public async assertDetailViewShowsAsset(page: Page, assetNumber: string): Promise<void> {
    // The scanned asset also has a CSS-hidden duplicate card elsewhere on the page (a
    // second responsive layout) - scope to a visible match so this doesn't resolve to
    // that hidden instance instead of the opened detail modal.
    await expect(
      page.getByText(assetNumber, { exact: false }).and(page.locator(':visible')).first()
    ).toBeVisible();
  }
}
