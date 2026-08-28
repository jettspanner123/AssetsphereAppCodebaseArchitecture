import { ValidationCException } from '../../../Exceptions/ValidationCException';
import { HealthCheckResponseDTO, HealthStatusType } from '../Models/HealthCheckDTOs';

export class HealthCheckAssertion {
  private static readonly _current: HealthCheckAssertion = new HealthCheckAssertion();
  public static get Current(): HealthCheckAssertion {
    return HealthCheckAssertion._current;
  }
  public static get current(): HealthCheckAssertion {
    return HealthCheckAssertion._current;
  }

  private constructor() {}

  public CheckForNullRequest<T>(
    request: T | null | undefined,
    errorMessage: string = 'Request body cannot be empty.'
  ): void {
    if (request === null || request === undefined) {
      throw new ValidationCException(errorMessage);
    }
  }

  public checkForNullRequest<T>(
    request: T | null | undefined,
    errorMessage: string = 'Request body cannot be empty.'
  ): void {
    this.CheckForNullRequest(request, errorMessage);
  }

  public AssertHealthReport(report: HealthCheckResponseDTO | null | undefined): void {
    if (!report) {
      throw new ValidationCException('Diagnostic health check report generation yielded null.');
    }

    if (!report.Subsystems || report.Subsystems.length === 0) {
      throw new ValidationCException('Diagnostic report did not contain any subsystem telemetry records.');
    }
  }

  public assertHealthReport(report: HealthCheckResponseDTO | null | undefined): void {
    this.AssertHealthReport(report);
  }
}

export default HealthCheckAssertion;
