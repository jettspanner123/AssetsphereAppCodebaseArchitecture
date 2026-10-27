import { test, Page } from '@playwright/test';
import SignUpAuthenticationAssertion from '../Assertion/SignUpAuthenticationAssertion';
import SignUpAuthenticationCON from '../Constants/SignUpAuthenticationCON';
import BackendBehaviorCON from '../../../Constants/BackendBehaviorCON';
import ApplicationPageRoutesFactory from '../../../Factories/ApplicationPageRoutesFactory';
import PerformanceMetricsUtility from '../../../Utilities/PerformanceMetricsUtility';
import PendingUserCleanupUtility from '../Utilities/PendingUserCleanupUtility';
import { SignUpFormDataType } from '../Models/Types/SignUpFormDataType';

const COLD_START_THRESHOLD_MS = 10_000;

const ADMIN_EMAIL = process.env.ASSETSPHERE_ADMIN_EMAIL;

if (!ADMIN_EMAIL) {
  throw new Error('ASSETSPHERE_ADMIN_EMAIL is not set. Copy .env.example to .env and fill it in.');
}

function buildUniqueTestEmail(): string {
  return `playwright-test-${Date.now()}@assetsphere.internal`;
}

async function fillSignUpForm(page: Page, formData: Partial<SignUpFormDataType>): Promise<void> {
  if (formData.fullName !== undefined) {
    await page.getByTestId(SignUpAuthenticationCON.FULLNAME_INPUT).fill(formData.fullName);
  }
  if (formData.email !== undefined) {
    await page.getByTestId(SignUpAuthenticationCON.EMAIL_INPUT).fill(formData.email);
  }
  if (formData.password !== undefined) {
    await page.getByTestId(SignUpAuthenticationCON.PASSWORD_INPUT).fill(formData.password);
  }
  if (formData.confirmPassword !== undefined) {
    await page.getByTestId(SignUpAuthenticationCON.CONFIRM_PASSWORD_INPUT).fill(formData.confirmPassword);
  }
  if (formData.acceptTerms === false) {
    await page.getByTestId(SignUpAuthenticationCON.ACCEPT_TERMS_CHECKBOX).uncheck();
  }
}

test.describe('Sign Up Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ApplicationPageRoutesFactory.AuthenticationRoutes.SignUp);
    await SignUpAuthenticationAssertion.current.assertSignUpPageLoaded(page);
  });

  test('registers successfully with valid details and lands in pending-approval (tolerates a cold-started backend)', async ({
    page,
    request,
  }, testInfo) => {
    test.setTimeout(BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000);

    const testEmail = buildUniqueTestEmail();
    await fillSignUpForm(page, {
      fullName: 'Playwright Test User',
      email: testEmail,
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });

    const submitClickedAt = Date.now();
    const registerResponsePromise = page.waitForResponse(
      (response) => response.url().includes(SignUpAuthenticationCON.REGISTER_ENDPOINT_FRAGMENT),
      { timeout: BackendBehaviorCON.COLD_START_TIMEOUT_MS }
    );
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    // Check the in-flight loading state before awaiting the response - see LogIn suite
    // for why this ordering matters once the backend is warm.
    await SignUpAuthenticationAssertion.current.assertSubmitInFlight(page);

    const registerResponse = await registerResponsePromise;
    const registerRequestDurationMs = Date.now() - submitClickedAt;
    SignUpAuthenticationAssertion.current.assertRegisterResponseSucceeded(registerResponse);

    const registerPayload = await registerResponse.json();
    const pendingUserId: string = registerPayload.data.user.id;

    // Once the account exists in production, cleanup MUST run even if an assertion
    // below throws - otherwise a failed test would leave the pending user behind.
    try {
      await SignUpAuthenticationAssertion.current.assertPendingApprovalShown(page, testEmail);
      const timeToPendingApprovalMs = Date.now() - submitClickedAt;

      PerformanceMetricsUtility.current.record(
        testInfo.title,
        {
          registerRequestDurationMs,
          timeToPendingApprovalMs,
          coldStart: registerRequestDurationMs > COLD_START_THRESHOLD_MS,
        },
        testInfo
      );
    } finally {
      await PendingUserCleanupUtility.current.rejectPendingUser(request, pendingUserId);
    }
  });

  test('rejects registration with an email that already has an account', async ({ page }) => {
    test.setTimeout(BackendBehaviorCON.COLD_START_TIMEOUT_MS + 15_000);

    await fillSignUpForm(page, {
      fullName: 'Duplicate Email Tester',
      email: ADMIN_EMAIL,
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertDuplicateEmailErrorShown(page);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission with an empty full name (client-side validation, no network call)', async ({ page }) => {
    await fillSignUpForm(page, {
      fullName: '',
      email: buildUniqueTestEmail(),
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertFullNameValidationError(page, SignUpAuthenticationCON.ERROR_FULL_NAME_REQUIRED);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission with a too-short full name (client-side validation, no network call)', async ({ page }) => {
    await fillSignUpForm(page, {
      fullName: 'A',
      email: buildUniqueTestEmail(),
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertFullNameValidationError(page, SignUpAuthenticationCON.ERROR_FULL_NAME_LENGTH);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission with an empty email (client-side validation, no network call)', async ({ page }) => {
    await fillSignUpForm(page, {
      fullName: 'Valid Tester',
      email: '',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertEmailValidationError(page, SignUpAuthenticationCON.ERROR_EMAIL_REQUIRED);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission with a malformed email (client-side validation, no network call)', async ({ page }) => {
    // Note: see LogIn suite for why "test@localhost" (no dot) is used instead of
    // "not-an-email" - the latter is intercepted by native type="email" constraint
    // validation before React's onSubmit (and its custom validator) ever runs.
    await fillSignUpForm(page, {
      fullName: 'Valid Tester',
      email: 'test@localhost',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertEmailValidationError(page, SignUpAuthenticationCON.ERROR_EMAIL_INVALID);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission with an empty password (client-side validation, no network call)', async ({ page }) => {
    await fillSignUpForm(page, {
      fullName: 'Valid Tester',
      email: buildUniqueTestEmail(),
      password: '',
      confirmPassword: 'ValidPassword123!',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertPasswordValidationError(page, SignUpAuthenticationCON.ERROR_PASSWORD_REQUIRED);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission with a too-short password (client-side validation, no network call)', async ({ page }) => {
    await fillSignUpForm(page, {
      fullName: 'Valid Tester',
      email: buildUniqueTestEmail(),
      password: 'abc',
      confirmPassword: 'abc',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertPasswordValidationError(page, SignUpAuthenticationCON.ERROR_PASSWORD_LENGTH);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission with an empty confirm-password (client-side validation, no network call)', async ({ page }) => {
    await fillSignUpForm(page, {
      fullName: 'Valid Tester',
      email: buildUniqueTestEmail(),
      password: 'ValidPassword123!',
      confirmPassword: '',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertConfirmPasswordValidationError(
      page,
      SignUpAuthenticationCON.ERROR_CONFIRM_PASSWORD_REQUIRED
    );
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission when password and confirm-password do not match (client-side validation, no network call)', async ({
    page,
  }) => {
    await fillSignUpForm(page, {
      fullName: 'Valid Tester',
      email: buildUniqueTestEmail(),
      password: 'ValidPassword123!',
      confirmPassword: 'ADifferentPassword456!',
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertConfirmPasswordValidationError(
      page,
      SignUpAuthenticationCON.ERROR_PASSWORD_MISMATCH
    );
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });

  test('blocks submission when the enterprise security policy is not accepted (client-side validation, no network call)', async ({
    page,
  }) => {
    await fillSignUpForm(page, {
      fullName: 'Valid Tester',
      email: buildUniqueTestEmail(),
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
      acceptTerms: false,
    });
    await page.getByTestId(SignUpAuthenticationCON.SUBMIT_BUTTON).click();

    await SignUpAuthenticationAssertion.current.assertTermsValidationError(page, SignUpAuthenticationCON.ERROR_TERMS_REQUIRED);
    await SignUpAuthenticationAssertion.current.assertStillOnSignUpPage(page);
  });
});
