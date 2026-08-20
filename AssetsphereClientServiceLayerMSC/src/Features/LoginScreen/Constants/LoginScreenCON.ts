export default class LoginScreenCON {
  public static readonly FEATURE_NAME: string = 'LoginScreen';
  public static readonly APP_TITLE: string = 'Assetsphere';
  public static readonly APP_SUBTITLE: string = 'Enterprise Asset & Lifecycle Intelligence';
  public static readonly CARD_TITLE: string = 'Sign in to your account';
  public static readonly CARD_DESCRIPTION: string = 'Enter your corporate credentials or use single sign-on.';

  // Form Field Labels
  public static readonly EMAIL_LABEL: string = 'Work Email Address';
  public static readonly EMAIL_PLACEHOLDER: string = 'name@company.com';
  public static readonly PASSWORD_LABEL: string = 'Password';
  public static readonly PASSWORD_PLACEHOLDER: string = '••••••••••••';
  public static readonly REMEMBER_ME_LABEL: string = 'Remember this device for 30 days';
  public static readonly FORGOT_PASSWORD_LABEL: string = 'Forgot password?';

  // Action Buttons
  public static readonly SUBMIT_BUTTON_LABEL: string = 'Sign in with Credentials';
  public static readonly SUBMIT_BUTTON_LOADING: string = 'Authenticating...';
  public static readonly MICROSOFT_SSO_LABEL: string = 'Sign in with Microsoft';
  public static readonly DIVIDER_TEXT: string = 'or continue with enterprise sso';

  // Bottom Navigation
  public static readonly DONT_HAVE_ACCOUNT_TEXT: string = "Don't have an account?";
  public static readonly SIGN_UP_LINK_TEXT: string = 'Create an account';

  // Validation Error Messages
  public static readonly ERROR_EMAIL_REQUIRED: string = 'Email address is required.';
  public static readonly ERROR_EMAIL_INVALID: string = 'Please enter a valid work email address.';
  public static readonly ERROR_PASSWORD_REQUIRED: string = 'Password is required.';
  public static readonly ERROR_PASSWORD_LENGTH: string = 'Password must be at least 6 characters.';

  // Footnote
  public static readonly SECURITY_BADGE_TEXT: string = '256-Bit SSL Encrypted Enterprise Gateway';
  public static readonly COPYRIGHT_TEXT: string = '© 2026 Assetsphere Inc. All rights reserved.';
}
