import { Page, Response, expect } from '@playwright/test';
import SignUpAuthenticationCON from '../Constants/SignUpAuthenticationCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';

export default class SignUpAuthenticationAssertion {
  public static readonly current: SignUpAuthenticationAssertion = new SignUpAuthenticationAssertion();
  private constructor() {}

  public async assertSignUpPageLoaded(page: Page): Promise<void> {
    await expect(page).toHaveURL(new RegExp(`${ApplicationPageRoutesFactory.AuthenticationRoutes.SignUp}$`));
    await expect(page.getByTestId(SignUpAuthenticationCON.EMAIL_INPUT)).toBeVisible();
    await expect(page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON)).toBeVisible();
  }

  /** Fast check: the submit button reacts immediately, regardless of backend speed. */
  public async assertSubmitInFlight(page: Page): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON)).toContainText(
      SignUpAuthenticationCON.SUBMIT_BUTTON_LOADING_LABEL
    );
  }

  /** Ground-truth check on the actual registration API response. Caller must capture the
   * Response via page.waitForResponse() started before the triggering click. */
  public assertRegisterResponseSucceeded(response: Response): void {
    expect(response.ok()).toBe(true);
  }

  /** Slow check: a successful registration swaps the form for the shared pending-approval
   * confirmation card - no dashboard navigation occurs (new accounts require admin approval). */
  public async assertPendingApprovalShown(page: Page, expectedEmail: string): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.PENDING_APPROVAL_CARD)).toBeVisible({
      timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS,
    });
    await expect(page.getByTestId(SignUpAuthenticationCON.PENDING_APPROVAL_EMAIL)).toContainText(expectedEmail);
  }

  public async assertDuplicateEmailErrorShown(page: Page): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.GENERAL_ERROR_BANNER)).toContainText(
      SignUpAuthenticationCON.ERROR_EMAIL_ALREADY_EXISTS,
      { timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS }
    );
  }

  public async assertFullNameValidationError(page: Page, expectedMessage: string): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.FULLNAME_FIELD_ERROR)).toContainText(expectedMessage);
  }

  public async assertEmailValidationError(page: Page, expectedMessage: string): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.EMAIL_FIELD_ERROR)).toContainText(expectedMessage);
  }

  public async assertPasswordValidationError(page: Page, expectedMessage: string): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.PASSWORD_FIELD_ERROR)).toContainText(expectedMessage);
  }

  public async assertConfirmPasswordValidationError(page: Page, expectedMessage: string): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.CONFIRM_PASSWORD_FIELD_ERROR)).toContainText(expectedMessage);
  }

  public async assertTermsValidationError(page: Page, expectedMessage: string): Promise<void> {
    await expect(page.getByTestId(SignUpAuthenticationCON.ACCEPT_TERMS_FIELD_ERROR)).toContainText(expectedMessage);
  }

  /** Client-side validation never calls the backend - no state change should occur. */
  public async assertStillOnSignUpPage(page: Page): Promise<void> {
    await expect(page).toHaveURL(new RegExp(`${ApplicationPageRoutesFactory.AuthenticationRoutes.SignUp}$`));
  }
}
