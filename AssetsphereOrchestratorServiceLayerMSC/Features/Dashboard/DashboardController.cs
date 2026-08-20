using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Dashboard.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Dashboard;

[ApiController]
[Route(ApplicationRouteFactory.DashboardRoutes.ControllerURL)]
[Authorize]
public sealed class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet(ApplicationRouteFactory.DashboardRoutes.Summary)]
    public async Task<ActionResult<ApiResponseClass<DashboardSummaryDTO>>> GetSummary()
    {
        DashboardSummaryDTO summary = await _dashboardService.GetSummaryAsync();
        return Ok(ApiResponseClass<DashboardSummaryDTO>.Succeeded(summary));
    }

    [HttpGet(ApplicationRouteFactory.DashboardRoutes.Analytics)]
    public async Task<ActionResult<ApiResponseClass<DashboardAnalyticsDTO>>> GetAnalytics()
    {
        DashboardAnalyticsDTO analytics = await _dashboardService.GetAnalyticsAsync();
        return Ok(ApiResponseClass<DashboardAnalyticsDTO>.Succeeded(analytics));
    }
}
