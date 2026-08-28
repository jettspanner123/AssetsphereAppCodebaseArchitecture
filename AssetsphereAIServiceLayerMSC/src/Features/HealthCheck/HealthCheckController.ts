import { Controller, Get, Res, HttpStatus, Logger, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ApplicationRouteFactory } from '../../Factories/ApplicationRouteFactory';
import { HealthCheckService } from './Services/HealthCheckService';
import { HealthCheckAssertion } from './Assertion/HealthCheckAssertion';
import { ApiResponseClass } from '../../Models/Classes/ApiResponseClass';
import { HealthCheckResponseDTO, HealthStatusType } from './Models/HealthCheckDTOs';
import { ValidationCException } from '../../Exceptions/ValidationCException';

@ApiTags('HealthCheck')
@Controller(ApplicationRouteFactory.HealthCheckRoutes.ControllerURL)
export class HealthCheckController {
  private readonly _logger: Logger = new Logger(HealthCheckController.name);

  public constructor(
    @Inject(HealthCheckService) private readonly _healthCheckService: HealthCheckService
  ) {}

  @Get(ApplicationRouteFactory.HealthCheckRoutes.Status)
  @ApiOperation({ summary: 'Execute full system and AI readiness diagnostics' })
  @ApiResponse({ status: 200, description: 'Diagnostic report retrieved successfully', type: HealthCheckResponseDTO })
  @ApiResponse({ status: 503, description: 'One or more critical subsystems are unhealthy' })
  public async getStatus(@Res() res: Response): Promise<void> {
    try {
      const report: HealthCheckResponseDTO = await this._healthCheckService.CheckHealthAsync();

      HealthCheckAssertion.Current.AssertHealthReport(report);

      const statusCode: number =
        report.OverallStatus === HealthStatusType.Healthy
          ? HttpStatus.OK
          : report.OverallStatus === HealthStatusType.Degraded
            ? HttpStatus.OK
            : HttpStatus.SERVICE_UNAVAILABLE;

      const message: string =
        report.OverallStatus === HealthStatusType.Healthy
          ? 'All AI microservice systems are operational and healthy.'
          : report.OverallStatus === HealthStatusType.Degraded
            ? 'AI microservice operational with degraded performance.'
            : 'One or more critical AI subsystems are unhealthy.';

      const payload = ApiResponseClass.Succeeded<HealthCheckResponseDTO>(report, message, statusCode);
      res.status(statusCode).json(payload);
    } catch (valEx) {
      if (valEx instanceof ValidationCException) {
        this._logger.warn(`Health check validation warning: ${valEx.message}`);
        res.status(HttpStatus.BAD_REQUEST).json(
          ApiResponseClass.Failed<HealthCheckResponseDTO>(valEx.message, valEx.ValidationErrors, HttpStatus.BAD_REQUEST)
        );
      } else {
        const error = valEx as Error;
        this._logger.error(`Unexpected health check diagnostic failure: ${error.message}`, error.stack);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
          ApiResponseClass.Failed<HealthCheckResponseDTO>(
            'An unexpected error occurred during health check diagnosis.',
            [error.message],
            HttpStatus.INTERNAL_SERVER_ERROR
          )
        );
      }
    }
  }

  @Get(ApplicationRouteFactory.HealthCheckRoutes.Ping)
  @ApiOperation({ summary: 'Fast lightweight liveness ping' })
  @ApiResponse({ status: 200, description: 'Service is responding to network traffic' })
  public async ping(@Res() res: Response): Promise<void> {
    const payload = ApiResponseClass.Succeeded<{ Status: string; Timestamp: string }>(
      { Status: 'PONG', Timestamp: new Date().toISOString() },
      'Liveness probe succeeded.',
      HttpStatus.OK
    );
    res.status(HttpStatus.OK).json(payload);
  }
}

export default HealthCheckController;
