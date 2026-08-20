export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  general?: string;
}

export interface ForgotPasswordState {
  isSubmitted: boolean;
  emailSentTo: string | null;
}
