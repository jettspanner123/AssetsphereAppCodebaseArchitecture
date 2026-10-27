import { Page } from '@playwright/test';
import LogInAuthenticationCON from '../Features/Authentication/Constants/LogInAuthenticationCON';
import ApplicationPageRoutesFactory from '../Factories/ApplicationPageRoutesFactory';
import BackendBehaviorCON from '../Constants/BackendBehaviorCON';

/**
 * Logs in as the seeded admin account through the real login form, as a precondition
 * for any test (in any feature) whose flow starts on an authenticated dashboard page.
 * Not an assertion - just gets the browser into a logged-in state.
 */
export default class UILoginUtility {
  public static readonly current: UILoginUtility = new UILoginUtility();
  private constructor() {}

  public async loginAsAdmin(page: Page): Promise<void> {
    const adminEmail = process.env.ASSETSPHERE_ADMIN_EMAIL;
    const adminPassword = process.env.ASSETSPHERE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        'ASSETSPHERE_ADMIN_EMAIL / ASSETSPHERE_ADMIN_PASSWORD are not set. Copy .env.example to .env and fill them in.'
      );
    }

    await page.goto(ApplicationPageRoutesFactory.AuthenticationRoutes.Login);
    await page.getByTestId(LogInAuthenticationCON.EMAIL_INPUT).fill(adminEmail);
    await page.getByTestId(LogInAuthenticationCON.PASSWORD_INPUT).fill(adminPassword);
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await page.waitForURL(new RegExp(`${ApplicationPageRoutesFactory.DashboardRoutes.Overview}$`), {
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
  }
}
