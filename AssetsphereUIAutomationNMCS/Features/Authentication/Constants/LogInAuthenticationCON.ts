export default class LogInAuthenticationCON {
  // Element Locators (data-testid)
  public static readonly EMAIL_INPUT: string = 'login-email-input';
  public static readonly PASSWORD_INPUT: string = 'login-password-input';
  public static readonly SUBMIT_BUTTON: string = 'login-submit-button';
  public static readonly GENERAL_ERROR_BANNER: string = 'login-general-error';
  public static readonly EMAIL_FIELD_ERROR: string = 'login-email-field-error';
  public static readonly PASSWORD_FIELD_ERROR: string = 'login-password-field-error';

  // Backend Endpoint Fragment (for network response matching)
  public static readonly LOGIN_ENDPOINT_FRAGMENT: string = '/Api/V1/Authentication/Login';

  // Expected Text
  public static readonly SUBMIT_BUTTON_LABEL: string = 'Sign in with Credentials';
  public static readonly SUBMIT_BUTTON_LOADING_LABEL: string = 'Authenticating...';
  public static readonly INVALID_CREDENTIALS_ERROR: string = 'Invalid email or password combination provided.';
  public static readonly ERROR_EMAIL_REQUIRED: string = 'Email address is required.';
  public static readonly ERROR_EMAIL_INVALID: string = 'Please enter a valid work email address.';
  public static readonly ERROR_PASSWORD_REQUIRED: string = 'Password is required.';
  public static readonly ERROR_PASSWORD_LENGTH: string = 'Password must be at least 6 characters.';

  // Timeouts (ms) - the backend is hosted on Render's free tier and spins down
  // after ~15 minutes idle; the first request after that can take up to ~60s
  // to cold-start. Any assertion waiting on a real backend response uses this
  // budget instead of Playwright's default 5s expect timeout.
  public static readonly COLD_START_TIMEOUT_MS: number = 75_000;
}
