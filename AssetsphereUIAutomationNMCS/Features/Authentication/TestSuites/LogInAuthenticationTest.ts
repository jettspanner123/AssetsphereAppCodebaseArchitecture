import { test } from '@playwright/test';
import LogInAuthenticationAssertion from '../Assertion/LogInAuthenticationAssertion';
import LogInAuthenticationCON from '../Constants/LogInAuthenticationCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import { LoginCredentialsType } from '../Models/Types/LoginCredentialsType';

const ADMIN_EMAIL = process.env.ASSETSPHERE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ASSETSPHERE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error(
    'ASSETSPHERE_ADMIN_EMAIL / ASSETSPHERE_ADMIN_PASSWORD are not set. Copy .env.example to .env and fill them in.'
  );
}

async function fillLoginForm(page: import('@playwright/test').Page, credentials: LoginCredentialsType): Promise<void> {
  await page.getByTestId(LogInAuthenticationCON.EMAIL_INPUT).fill(credentials.email);
  await page.getByTestId(LogInAuthenticationCON.PASSWORD_INPUT).fill(credentials.password);
}

test.describe('Login Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ApplicationPageRoutesFactory.AuthenticationRoutes.Login);
    await LogInAuthenticationAssertion.current.assertLoginPageLoaded(page);
  });

  test('signs in successfully with valid admin credentials (tolerates a cold-started backend)', async ({ page }) => {
    test.setTimeout(LogInAuthenticationCON.COLD_START_TIMEOUT_MS + 15_000);

    await fillLoginForm(page, { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

    const [loginResponse] = await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes(LogInAuthenticationCON.LOGIN_ENDPOINT_FRAGMENT),
        { timeout: LogInAuthenticationCON.COLD_START_TIMEOUT_MS }
      ),
      page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click(),
    ]);

    await LogInAuthenticationAssertion.current.assertSubmitInFlight(page);
    LogInAuthenticationAssertion.current.assertLoginResponseSucceeded(loginResponse);
    await LogInAuthenticationAssertion.current.assertLoginSucceeded(page);
  });

  test('rejects an incorrect password with the generic invalid-credentials error', async ({ page }) => {
    test.setTimeout(LogInAuthenticationCON.COLD_START_TIMEOUT_MS + 15_000);

    await fillLoginForm(page, { email: ADMIN_EMAIL, password: 'DefinitelyWrongPassword123!' });
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await LogInAuthenticationAssertion.current.assertInvalidCredentialsErrorShown(page);
    await LogInAuthenticationAssertion.current.assertStillOnLoginPage(page);
  });

  test('rejects a non-existent email with the same generic invalid-credentials error', async ({ page }) => {
    test.setTimeout(LogInAuthenticationCON.COLD_START_TIMEOUT_MS + 15_000);

    await fillLoginForm(page, { email: 'definitely-not-a-real-user@assetsphere.internal', password: 'SomePassword123!' });
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await LogInAuthenticationAssertion.current.assertInvalidCredentialsErrorShown(page);
    await LogInAuthenticationAssertion.current.assertStillOnLoginPage(page);
  });

  test('blocks submission with an empty email (client-side validation, no network call)', async ({ page }) => {
    await fillLoginForm(page, { email: '', password: 'SomePassword123!' });
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await LogInAuthenticationAssertion.current.assertEmailValidationError(page, LogInAuthenticationCON.ERROR_EMAIL_REQUIRED);
    await LogInAuthenticationAssertion.current.assertStillOnLoginPage(page);
  });

  test('blocks submission with a malformed email (client-side validation, no network call)', async ({ page }) => {
    await fillLoginForm(page, { email: 'not-an-email', password: 'SomePassword123!' });
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await LogInAuthenticationAssertion.current.assertEmailValidationError(page, LogInAuthenticationCON.ERROR_EMAIL_INVALID);
    await LogInAuthenticationAssertion.current.assertStillOnLoginPage(page);
  });

  test('blocks submission with an empty password (client-side validation, no network call)', async ({ page }) => {
    await fillLoginForm(page, { email: ADMIN_EMAIL, password: '' });
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await LogInAuthenticationAssertion.current.assertPasswordValidationError(page, LogInAuthenticationCON.ERROR_PASSWORD_REQUIRED);
    await LogInAuthenticationAssertion.current.assertStillOnLoginPage(page);
  });

  test('blocks submission with a too-short password (client-side validation, no network call)', async ({ page }) => {
    await fillLoginForm(page, { email: ADMIN_EMAIL, password: 'abc' });
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await LogInAuthenticationAssertion.current.assertPasswordValidationError(page, LogInAuthenticationCON.ERROR_PASSWORD_LENGTH);
    await LogInAuthenticationAssertion.current.assertStillOnLoginPage(page);
  });

  test('blocks submission when both email and password are empty', async ({ page }) => {
    await fillLoginForm(page, { email: '', password: '' });
    await page.getByTestId(LogInAuthenticationCON.SUBMIT_BUTTON).click();

    await LogInAuthenticationAssertion.current.assertEmailValidationError(page, LogInAuthenticationCON.ERROR_EMAIL_REQUIRED);
    await LogInAuthenticationAssertion.current.assertPasswordValidationError(page, LogInAuthenticationCON.ERROR_PASSWORD_REQUIRED);
    await LogInAuthenticationAssertion.current.assertStillOnLoginPage(page);
  });
});
