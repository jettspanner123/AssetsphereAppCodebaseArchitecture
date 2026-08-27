using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.HealthCheck.Services;

public interface IHealthCheckService
{
    Task<HealthCheckResponseDTO> CheckHealthAsync(CancellationToken cancellationToken = default);
}
