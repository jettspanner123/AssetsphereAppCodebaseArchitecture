using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Compliance.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Compliance;

[ApiController]
[Route(ApplicationRouteFactory.ComplianceRoutes.ControllerURL)]
[Authorize]
public sealed class ComplianceController : ControllerBase
{
    private readonly ComplianceService _complianceService;

    public ComplianceController(ComplianceService complianceService)
    {
        _complianceService = complianceService;
    }

    [HttpGet(ApplicationRouteFactory.ComplianceRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<ComplianceResponseDTO>>>> GetAll()
    {
        List<ComplianceResponseDTO> list = await _complianceService.GetAllFrameworksAsync();
        return Ok(ApiResponseClass<List<ComplianceResponseDTO>>.Succeeded(list));
    }

    [HttpGet(ApplicationRouteFactory.ComplianceRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<ComplianceResponseDTO>>> GetById([FromRoute] Guid id)
    {
        ComplianceResponseDTO f = await _complianceService.GetFrameworkByIdAsync(id);
        return Ok(ApiResponseClass<ComplianceResponseDTO>.Succeeded(f));
    }

    [HttpGet(ApplicationRouteFactory.ComplianceRoutes.BaselineScore)]
    public async Task<ActionResult<ApiResponseClass<BaselineScoreResponseDTO>>> GetBaselineScore()
    {
        BaselineScoreResponseDTO baseline = await _complianceService.GetBaselineScoreSummaryAsync();
        return Ok(ApiResponseClass<BaselineScoreResponseDTO>.Succeeded(baseline));
    }

    [HttpPost(ApplicationRouteFactory.ComplianceRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<ComplianceResponseDTO>>> Create([FromBody] ComplianceCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        ComplianceResponseDTO created = await _complianceService.CreateFrameworkAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ApiResponseClass<ComplianceResponseDTO>.Succeeded(created, "Framework created.", 201));
    }

    [HttpPut(ApplicationRouteFactory.ComplianceRoutes.Update)]
    public async Task<ActionResult<ApiResponseClass<ComplianceResponseDTO>>> Update([FromRoute] Guid id, [FromBody] ComplianceCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        ComplianceResponseDTO updated = await _complianceService.UpdateFrameworkAsync(id, request, username);
        return Ok(ApiResponseClass<ComplianceResponseDTO>.Succeeded(updated, "Framework updated."));
    }
}
