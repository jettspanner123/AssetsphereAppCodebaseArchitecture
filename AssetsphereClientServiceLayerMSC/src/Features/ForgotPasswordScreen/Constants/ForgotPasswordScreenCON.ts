export default class ForgotPasswordScreenCON {
  public static readonly FEATURE_NAME: string = 'ForgotPasswordScreen';
  public static readonly APP_TITLE: string = 'Assetsphere';
  public static readonly APP_SUBTITLE: string = 'Enterprise Asset & Lifecycle Intelligence';

  // Card Content
  public static readonly CARD_TITLE: string = 'Reset your password';
  public static readonly CARD_DESCRIPTION: string = 'Enter your enterprise email address and we will send you secure instructions to reset your password.';

  // Form Fields
  public static readonly EMAIL_LABEL: string = 'Work Email Address';
  public static readonly EMAIL_PLACEHOLDER: string = 'name@company.com';

  // Action Buttons
  public static readonly SUBMIT_BUTTON_LABEL: string = 'Send Reset Request';
  public static readonly SUBMIT_BUTTON_LOADING: string = 'Sending Instructions...';
  public static readonly RESEND_BUTTON_LABEL: string = 'Resend Reset Email';
  public static readonly RETURN_TO_LOGIN_LABEL: string = 'Back to Sign in';

  // Success State
  public static readonly SUCCESS_TITLE: string = 'Check your email';
  public static readonly SUCCESS_DESCRIPTION: string = 'We have dispatched password recovery instructions to:';
  public static readonly SUCCESS_FOOTNOTE: string = 'If you do not see the email within a few minutes, please check your spam folder or contact your corporate IT administrator.';

  // Validation Errors
  public static readonly ERROR_EMAIL_REQUIRED: string = 'Work email address is required.';
  public static readonly ERROR_EMAIL_INVALID: string = 'Please enter a valid work email address.';

  // Security Footnote
  public static readonly SECURITY_BADGE_TEXT: string = '256-Bit SSL Encrypted Enterprise Recovery';
  public static readonly COPYRIGHT_TEXT: string = '© 2026 Assetsphere Inc. All rights reserved.';
}
