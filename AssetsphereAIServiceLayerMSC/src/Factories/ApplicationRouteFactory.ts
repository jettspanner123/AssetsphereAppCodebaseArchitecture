export class ApplicationRouteFactory {
  public static readonly HealthCheckRoutes = {
    ControllerURL: 'Api/V1/HealthCheck',
    Status: '',
    Diagnostics: 'Diagnostics',
    Ping: 'Ping',
  } as const;

  public static readonly AiDiagnosticsRoutes = {
    ControllerURL: 'Api/V1/AiDiagnostics',
    Analyze: 'Analyze',
    PredictiveHealth: 'PredictiveHealth',
    TcoForecast: 'TcoForecast',
  } as const;
}

export default ApplicationRouteFactory;
