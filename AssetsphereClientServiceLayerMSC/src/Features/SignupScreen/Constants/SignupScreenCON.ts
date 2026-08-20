export default class SignupScreenCON {
  public static readonly FEATURE_NAME: string = 'SignupScreen';
  public static readonly APP_TITLE: string = 'Assetsphere';
  public static readonly APP_SUBTITLE: string = 'Enterprise Asset & Lifecycle Intelligence';
  public static readonly CARD_TITLE: string = 'Create your account';
  public static readonly CARD_DESCRIPTION: string = 'Register your enterprise identity or sign in with single sign-on.';

  // Form Field Labels & Placeholders
  public static readonly FULL_NAME_LABEL: string = 'Full Name';
  public static readonly FULL_NAME_PLACEHOLDER: string = 'Sarah Jenkins';
  public static readonly EMAIL_LABEL: string = 'Work Email Address';
  public static readonly EMAIL_PLACEHOLDER: string = 'name@company.com';
  public static readonly PASSWORD_LABEL: string = 'Password';
  public static readonly PASSWORD_PLACEHOLDER: string = '••••••••••••';
  public static readonly CONFIRM_PASSWORD_LABEL: string = 'Confirm Password';
  public static readonly CONFIRM_PASSWORD_PLACEHOLDER: string = '••••••••••••';
  public static readonly ACCEPT_TERMS_LABEL: string = 'I agree to the Enterprise Security Policy and Terms';

  // Action Buttons
  public static readonly SUBMIT_BUTTON_LABEL: string = 'Create Enterprise Account';
  public static readonly SUBMIT_BUTTON_LOADING: string = 'Registering Account...';
  public static readonly MICROSOFT_SSO_LABEL: string = 'Sign in with Microsoft';
  public static readonly DIVIDER_TEXT: string = 'or register with enterprise email';

  // Bottom Navigation
  public static readonly ALREADY_HAVE_ACCOUNT_TEXT: string = 'Already have an account?';
  public static readonly SIGN_IN_LINK_TEXT: string = 'Sign in';

  // Validation Error Messages
  public static readonly ERROR_FULL_NAME_REQUIRED: string = 'Full name is required.';
  public static readonly ERROR_FULL_NAME_LENGTH: string = 'Full name must be at least 2 characters.';
  public static readonly ERROR_EMAIL_REQUIRED: string = 'Work email address is required.';
  public static readonly ERROR_EMAIL_INVALID: string = 'Please enter a valid work email address.';
  public static readonly ERROR_PASSWORD_REQUIRED: string = 'Password is required.';
  public static readonly ERROR_PASSWORD_LENGTH: string = 'Password must be at least 6 characters.';
  public static readonly ERROR_CONFIRM_PASSWORD_REQUIRED: string = 'Please confirm your password.';
  public static readonly ERROR_PASSWORD_MISMATCH: string = 'Passwords do not match.';
  public static readonly ERROR_TERMS_REQUIRED: string = 'You must accept the enterprise security policy to proceed.';

  // Footnote
  public static readonly SECURITY_BADGE_TEXT: string = '256-Bit SSL Encrypted Enterprise Gateway';
  public static readonly COPYRIGHT_TEXT: string = '© 2026 Assetsphere Inc. All rights reserved.';
}
