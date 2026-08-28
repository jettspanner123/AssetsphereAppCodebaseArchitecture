import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationCException extends HttpException {
  public readonly validationErrors: string[];

  public constructor(messageOrErrors: string | string[]) {
    if (Array.isArray(messageOrErrors)) {
      super(
        {
          message: messageOrErrors.length > 0 ? messageOrErrors[0] : 'Validation failed.',
          errors: messageOrErrors,
        },
        HttpStatus.BAD_REQUEST
      );
      this.validationErrors = messageOrErrors;
    } else {
      super(
        {
          message: messageOrErrors,
          errors: [messageOrErrors],
        },
        HttpStatus.BAD_REQUEST
      );
      this.validationErrors = [messageOrErrors];
    }
  }
}

export default ValidationCException;
