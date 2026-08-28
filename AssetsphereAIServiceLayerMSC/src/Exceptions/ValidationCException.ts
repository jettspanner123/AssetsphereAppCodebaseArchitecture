import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationCException extends HttpException {
  public readonly ValidationErrors: string[];

  public constructor(messageOrErrors: string | string[]) {
    if (Array.isArray(messageOrErrors)) {
      super(
        {
          Message: messageOrErrors.length > 0 ? messageOrErrors[0] : 'Validation failed.',
          Errors: messageOrErrors,
        },
        HttpStatus.BAD_REQUEST
      );
      this.ValidationErrors = messageOrErrors;
    } else {
      super(
        {
          Message: messageOrErrors,
          Errors: [messageOrErrors],
        },
        HttpStatus.BAD_REQUEST
      );
      this.ValidationErrors = [messageOrErrors];
    }
  }
}

export default ValidationCException;
