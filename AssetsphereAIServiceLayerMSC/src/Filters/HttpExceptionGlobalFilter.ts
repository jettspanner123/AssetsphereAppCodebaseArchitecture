import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseClass } from '../Models/Classes/ApiResponseClass';
import { ValidationCException } from '../Exceptions/ValidationCException';

@Catch()
export class HttpExceptionGlobalFilter implements ExceptionFilter {
  private readonly _logger: Logger = new Logger(HttpExceptionGlobalFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'An unexpected internal server error occurred.';
    let errors: string[] | undefined = undefined;

    if (exception instanceof ValidationCException) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errors = exception.ValidationErrors;
      this._logger.warn(`Validation failure: ${message}`);
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as Record<string, any>;
        message = resObj.Message || resObj.message || exception.message;
        if (Array.isArray(resObj.message)) {
          errors = resObj.message;
          message = 'Request validation failed.';
        } else if (resObj.Errors && Array.isArray(resObj.Errors)) {
          errors = resObj.Errors;
        } else if (resObj.errors && Array.isArray(resObj.errors)) {
          errors = resObj.errors;
        }
      } else {
        message = exceptionResponse as string;
      }
      this._logger.warn(`HTTP exception [${statusCode}]: ${message}`);
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = [exception.message];
      this._logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    } else {
      this._logger.error('Unhandled unknown exception occurred.');
    }

    const payload = ApiResponseClass.Failed<null>(message, errors, statusCode);
    response.status(statusCode).json(payload);
  }
}

export default HttpExceptionGlobalFilter;
