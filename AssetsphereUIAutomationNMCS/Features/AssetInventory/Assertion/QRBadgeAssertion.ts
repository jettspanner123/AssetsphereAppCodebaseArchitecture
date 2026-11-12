import { Page, expect } from '@playwright/test';
import QRBadgeCON from '../Constants/QRBadgeCON';

export default class QRBadgeAssertion {
  public static readonly current: QRBadgeAssertion = new QRBadgeAssertion();
  private constructor() {}

  public async assertBadgeShowsAsset(page: Page, assetTag: string, deviceName: string): Promise<void> {
    const badge = page.getByTestId(QRBadgeCON.PRINTABLE_CARD);
    await expect(badge).toBeVisible();
    await expect(badge.getByText(assetTag, { exact: false })).toBeVisible();
    await expect(badge.getByText(deviceName, { exact: false })).toBeVisible();
  }

  public async assertQRCodeRendered(page: Page): Promise<void> {
    await expect(page.getByTestId(QRBadgeCON.PRINTABLE_CARD).locator('svg')).toBeVisible();
  }

  /** Asset Passport is a public page (no login) opened in a new tab - confirms it
   * resolved to the SAME asset that was scanned, by matching its visible tag/name. */
  public async assertPassportPageShowsAsset(page: Page, assetTag: string, deviceName: string): Promise<void> {
    await expect(page.getByText(assetTag, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(deviceName, { exact: false }).first()).toBeVisible();
  }
}
