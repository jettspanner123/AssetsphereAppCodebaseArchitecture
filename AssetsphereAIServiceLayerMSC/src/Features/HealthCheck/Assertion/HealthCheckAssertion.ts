import { ValidationCException } from '../../../Exceptions/ValidationCException';
import { HealthCheckResponseDTO, HealthStatusType } from '../Models/HealthCheckDTOs';

export class HealthCheckAssertion {
  private static readonly _current: HealthCheckAssertion = new HealthCheckAssertion();
  public static get current(): HealthCheckAssertion {
    return HealthCheckAssertion._current;
  }

  private constructor() {}

  public checkForNullRequest<T>(
    request: T | null | undefined,
    errorMessage: string = 'Request body cannot be empty.'
  ): void {
    if (request === null || request === undefined) {
      throw new ValidationCException(errorMessage);
    }
  }

  public assertHealthReport(report: HealthCheckResponseDTO | null | undefined): void {
    if (!report) {
      throw new ValidationCException('Diagnostic health check report generation yielded null.');
    }

    if (!report.subsystems || report.subsystems.length === 0) {
      throw new ValidationCException('Diagnostic report did not contain any subsystem telemetry records.');
    }
  }
}

export default HealthCheckAssertion;
