using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.VerificationCampaign.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.VerificationCampaign;

[ApiController]
[Route(ApplicationRouteFactory.VerificationCampaignRoutes.ControllerURL)]
[Authorize]
public sealed class VerificationCampaignController : ControllerBase
{
    private readonly VerificationCampaignService _campaignService;

    public VerificationCampaignController(VerificationCampaignService campaignService)
    {
        _campaignService = campaignService;
    }

    [HttpGet(ApplicationRouteFactory.VerificationCampaignRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<VerificationCampaignResponseDTO>>>> GetAll()
    {
        List<VerificationCampaignResponseDTO> list = await _campaignService.GetAllCampaignsAsync();
        return Ok(ApiResponseClass<List<VerificationCampaignResponseDTO>>.Succeeded(list));
    }

    [HttpGet(ApplicationRouteFactory.VerificationCampaignRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<VerificationCampaignResponseDTO>>> GetById([FromRoute] Guid id)
    {
        VerificationCampaignResponseDTO c = await _campaignService.GetCampaignByIdAsync(id);
        return Ok(ApiResponseClass<VerificationCampaignResponseDTO>.Succeeded(c));
    }

    [HttpPost(ApplicationRouteFactory.VerificationCampaignRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<VerificationCampaignResponseDTO>>> Create([FromBody] VerificationCampaignCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        VerificationCampaignResponseDTO c = await _campaignService.CreateCampaignAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = c.Id }, ApiResponseClass<VerificationCampaignResponseDTO>.Succeeded(c, "Verification campaign initialized.", 201));
    }

    [HttpPost(ApplicationRouteFactory.VerificationCampaignRoutes.VerifyScan)]
    public async Task<ActionResult<ApiResponseClass<VerificationScanResultDTO>>> VerifyScan([FromRoute] Guid id, [FromBody] VerifyScanDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        VerificationScanResultDTO result = await _campaignService.VerifyScanAsync(id, request, username);
        return Ok(ApiResponseClass<VerificationScanResultDTO>.Succeeded(result, result.Message));
    }
}
