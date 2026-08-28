import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseClass<T> {
  @ApiProperty({ description: 'Indicates if the operation succeeded', example: true })
  public success: boolean;

  @ApiProperty({ description: 'Human-readable status or informational message', example: 'Operation completed successfully.' })
  public message: string;

  @ApiProperty({ description: 'Payload returned by the endpoint', required: false })
  public data?: T;

  @ApiProperty({ description: 'List of validation or system errors if failed', required: false, type: [String] })
  public errors?: string[];

  @ApiProperty({ description: 'HTTP status code', example: 200 })
  public statusCode: number;

  @ApiProperty({ description: 'Server timestamp of response generation', example: '2026-08-28T12:00:00.000Z' })
  public timestamp: string;

  public constructor(
    success: boolean,
    message: string,
    data?: T,
    errors?: string[],
    statusCode: number = 200
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  public static Succeeded<T>(
    data?: T,
    message: string = 'Operation completed successfully.',
    statusCode: number = 200
  ): ApiResponseClass<T> {
    return new ApiResponseClass<T>(true, message, data, undefined, statusCode);
  }

  public static Failed<T>(
    message: string = 'Operation failed.',
    errors?: string[],
    statusCode: number = 400
  ): ApiResponseClass<T> {
    return new ApiResponseClass<T>(false, message, undefined, errors, statusCode);
  }
}

export default ApiResponseClass;
