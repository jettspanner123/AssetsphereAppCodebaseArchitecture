import { Page, Response, expect } from '@playwright/test';
import LogInAuthenticationCON from '../Constants/LogInAuthenticationCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';

export default class LogInAuthenticationAssertion {
  public static readonly current: LogInAuthenticationAssertion = new LogInAuthenticationAssertion();
  private constructor() {}

  public async assertLoginPageLoaded(page: Page): Promise<void> {
    await expect(page).toHaveURL(new RegExp(`${ApplicationPageRoutesFactory.AuthenticationRoutes.Login}$`));
    await expect(page.getByTestId(LogInAuthenticationCON.EMAIL_INPUT)).toBeVisible();
    await expect(page.getByTestId(LogInAuthenticationCON.PASSWORD_INPUT)).toBeVisible();
  }

  /** Fast check: the submit button reacts immediately, regardless of backend speed. */
  public async assertSubmitInFlight(page: Page): Promise<void> {
    await expect(page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON)).toContainText(
      LogInAuthenticationCON.SUBMIT_BUTTON_LOADING_LABEL
    );
  }

  /** Ground-truth check on the actual login API response. Caller must capture the
   * Response via page.waitForResponse() started before the triggering click. */
  public assertLoginResponseSucceeded(response: Response): void {
    expect(response.status()).toBe(200);
  }

  /** Slow check: allows the full cold-start budget, since the backend may still be
   * waking up even after the login API response itself has already landed. */
  public async assertLoginSucceeded(page: Page): Promise<void> {
    await expect(page).toHaveURL(
      new RegExp(`${ApplicationPageRoutesFactory.DashboardRoutes.Overview}$`),
      { timeout: LogInAuthenticationCON.COLD_START_TIMEOUT_MS }
    );
  }

  public async assertInvalidCredentialsErrorShown(page: Page): Promise<void> {
    await expect(page.getByTestId(LogInAuthenticationCON.GENERAL_ERROR_BANNER)).toContainText(
      LogInAuthenticationCON.INVALID_CREDENTIALS_ERROR,
      { timeout: LogInAuthenticationCON.COLD_START_TIMEOUT_MS }
    );
  }

  public async assertEmailValidationError(page: Page, expectedMessage: string): Promise<void> {
    await expect(page.getByTestId(LogInAuthenticationCON.EMAIL_FIELD_ERROR)).toContainText(expectedMessage);
  }

  public async assertPasswordValidationError(page: Page, expectedMessage: string): Promise<void> {
    await expect(page.getByTestId(LogInAuthenticationCON.PASSWORD_FIELD_ERROR)).toContainText(expectedMessage);
  }

  /** Client-side validation never calls the backend - no navigation should occur. */
  public async assertStillOnLoginPage(page: Page): Promise<void> {
    await expect(page).toHaveURL(new RegExp(`${ApplicationPageRoutesFactory.AuthenticationRoutes.Login}$`));
  }
}
