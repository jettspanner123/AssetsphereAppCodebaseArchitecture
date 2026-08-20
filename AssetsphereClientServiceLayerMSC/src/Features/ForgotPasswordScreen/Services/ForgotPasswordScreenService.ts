import { ForgotPasswordFormData, ForgotPasswordFormErrors, ForgotPasswordState } from '../Models/ForgotPasswordScreenModel';
import ForgotPasswordScreenCON from '../Constants/ForgotPasswordScreenCON';

export default class ForgotPasswordScreenService {
  public static current: ForgotPasswordScreenService = new ForgotPasswordScreenService();

  public validate(formData: ForgotPasswordFormData): ForgotPasswordFormErrors {
    const errors: ForgotPasswordFormErrors = {};

    if (!formData.email.trim()) {
      errors.email = ForgotPasswordScreenCON.ERROR_EMAIL_REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = ForgotPasswordScreenCON.ERROR_EMAIL_INVALID;
    }

    return errors;
  }

  public async sendResetEmail(formData: ForgotPasswordFormData): Promise<ForgotPasswordState> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      isSubmitted: true,
      emailSentTo: formData.email.trim(),
    };
  }
}
