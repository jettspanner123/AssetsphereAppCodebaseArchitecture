using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.HealthCheck.Assertion;
using AssetsphereOrchestratorServiceLayerMSC.Features.HealthCheck.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.HealthCheck;

[ApiController]
[Route(ApplicationRouteFactory.HealthCheckRoutes.ControllerURL)]
[AllowAnonymous]
public sealed class HealthCheckController : ControllerBase
{
    private readonly IHealthCheckService _healthCheckService;
    private readonly ILogger<HealthCheckController> _logger;

    public HealthCheckController(
        IHealthCheckService healthCheckService,
        ILogger<HealthCheckController> logger)
    {
        _healthCheckService = healthCheckService;
        _logger = logger;
    }

    [HttpGet(ApplicationRouteFactory.HealthCheckRoutes.Status)]
    public async Task<ActionResult<ApiResponseClass<HealthCheckResponseDTO>>> GetStatus(CancellationToken cancellationToken)
    {
        try
        {
            HealthCheckResponseDTO report = await _healthCheckService.CheckHealthAsync(cancellationToken);

            int statusCode = report.OverallStatus == HealthStatusType.Healthy
                ? 200
                : (report.OverallStatus == HealthStatusType.Degraded ? 200 : 503);

            string message = report.OverallStatus == HealthStatusType.Healthy
                ? "All systems operational and healthy."
                : (report.OverallStatus == HealthStatusType.Degraded
                    ? "Systems operational with degraded performance."
                    : "One or more critical subsystems are unhealthy.");

            return StatusCode(statusCode, ApiResponseClass<HealthCheckResponseDTO>.Succeeded(
                report,
                message,
                statusCode
            ));
        }
        catch (ValidationCException valEx)
        {
            _logger.LogWarning("Health check validation warning: {Message}", valEx.Message);
            return BadRequest(ApiResponseClass<HealthCheckResponseDTO>.Failed(valEx.Message, valEx.ValidationErrors, 400));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error executing health check diagnostics.");
            return StatusCode(500, ApiResponseClass<HealthCheckResponseDTO>.Failed(
                "An unexpected error occurred during health check diagnosis.",
                new List<string> { ex.Message },
                500
            ));
        }
    }

    [HttpGet(ApplicationRouteFactory.HealthCheckRoutes.Ping)]
    public ActionResult<ApiResponseClass<object>> Ping()
    {
        return Ok(ApiResponseClass<object>.Succeeded(
            new { Status = "PONG", Timestamp = DateTime.UtcNow },
            "Liveness probe succeeded.",
            200
        ));
    }
}
