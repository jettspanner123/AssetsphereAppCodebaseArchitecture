import { Page, expect } from '@playwright/test';
import QRBadgeCON from '../Constants/QRBadgeCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';

export default class QRBadgeAssertion {
  public static readonly current: QRBadgeAssertion = new QRBadgeAssertion();
  private constructor() {}

  public async assertBadgeShowsAsset(page: Page, assetTag: string, deviceName: string): Promise<void> {
    const badge = page.getByTestId(QRBadgeCON.PRINTABLE_CARD);
    await expect(badge).toBeVisible();
    // Exact match: the badge also shows a separate "TAG: <assetTag>" line (companyTag,
    // which mirrors the asset tag) that would otherwise also match a substring search.
    await expect(badge.getByText(assetTag, { exact: true })).toBeVisible();
    await expect(badge.getByText(deviceName, { exact: false })).toBeVisible();
  }

  public async assertQRCodeRendered(page: Page): Promise<void> {
    // The badge card also contains an unrelated "Verified Tag" icon svg - the QR code
    // itself is the only svg rendered with role="img" (from the QRCodeSVG library).
    await expect(page.getByTestId(QRBadgeCON.PRINTABLE_CARD).getByRole('img')).toBeVisible();
  }

  /** Asset Passport is a public page (no login) opened in a new tab - confirms it
   * resolved to the SAME asset that was created moments earlier, by matching its visible
   * tag/name. This tab does its own one-shot fetch of the full asset list on mount (no
   * built-in retry), so a brand-new asset can briefly show "Asset Not Found" if that
   * fetch lands in the same backend read-after-write window documented on the create
   * mutation - reload once and retry rather than treating that as a hard failure. */
  public async assertPassportPageShowsAsset(page: Page, assetTag: string, deviceName: string): Promise<void> {
    const deadline = Date.now() + BackendBehaviorCON.COLD_START_TIMEOUT_MS;
    for (;;) {
      const notFound = await page.getByText('Asset Not Found').isVisible().catch(() => false);
      if (!notFound) break;
      if (Date.now() >= deadline) break;
      await page.waitForTimeout(2000);
      await page.reload();
    }

    await expect(page.getByText(assetTag, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(deviceName, { exact: false }).first()).toBeVisible();
  }
}
