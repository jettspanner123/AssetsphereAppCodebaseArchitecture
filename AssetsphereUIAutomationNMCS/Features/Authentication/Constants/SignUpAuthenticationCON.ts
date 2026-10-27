export default class SignUpAuthenticationCON {
  // Element Locators (data-testid)
  public static readonly FULLNAME_INPUT: string = 'signup-fullname-input';
  public static readonly EMAIL_INPUT: string = 'signup-email-input';
  public static readonly PASSWORD_INPUT: string = 'signup-password-input';
  public static readonly CONFIRM_PASSWORD_INPUT: string = 'signup-confirm-password-input';
  public static readonly ACCEPT_TERMS_CHECKBOX: string = 'signup-accept-terms-checkbox';
  public static readonly SUBMIT_BUTTON: string = 'signup-submit-button';
  public static readonly GENERAL_ERROR_BANNER: string = 'signup-general-error';
  public static readonly FULLNAME_FIELD_ERROR: string = 'signup-fullname-field-error';
  public static readonly EMAIL_FIELD_ERROR: string = 'signup-email-field-error';
  public static readonly PASSWORD_FIELD_ERROR: string = 'signup-password-field-error';
  public static readonly CONFIRM_PASSWORD_FIELD_ERROR: string = 'signup-confirm-password-field-error';
  public static readonly ACCEPT_TERMS_FIELD_ERROR: string = 'signup-accept-terms-field-error';

  // Shared pending-approval confirmation card (VerificationPendingCardSharedComponent)
  public static readonly PENDING_APPROVAL_CARD: string = 'verification-pending-card';
  public static readonly PENDING_APPROVAL_EMAIL: string = 'verification-pending-email';

  // Backend Endpoint Fragment (for network response matching)
  public static readonly REGISTER_ENDPOINT_FRAGMENT: string = '/Api/V1/Authentication/Register';

  // Expected Text
  public static readonly SUBMIT_BUTTON_LOADING_LABEL: string = 'Registering Account...';
  public static readonly ERROR_FULL_NAME_REQUIRED: string = 'Full name is required.';
  public static readonly ERROR_FULL_NAME_LENGTH: string = 'Full name must be at least 2 characters.';
  public static readonly ERROR_EMAIL_REQUIRED: string = 'Work email address is required.';
  public static readonly ERROR_EMAIL_INVALID: string = 'Please enter a valid work email address.';
  public static readonly ERROR_PASSWORD_REQUIRED: string = 'Password is required.';
  public static readonly ERROR_PASSWORD_LENGTH: string = 'Password must be at least 6 characters.';
  public static readonly ERROR_CONFIRM_PASSWORD_REQUIRED: string = 'Please confirm your password.';
  public static readonly ERROR_PASSWORD_MISMATCH: string = 'Passwords do not match.';
  public static readonly ERROR_TERMS_REQUIRED: string = 'You must accept the enterprise security policy to proceed.';
  public static readonly ERROR_EMAIL_ALREADY_EXISTS: string = 'An account with this email address already exists.';
}
