using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.CloudInfrastructure.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.CloudInfrastructure;

[ApiController]
[Route(ApplicationRouteFactory.CloudInfrastructureRoutes.ControllerURL)]
[Authorize]
public sealed class CloudInfrastructureController : ControllerBase
{
    private readonly CloudInfrastructureService _cloudService;

    public CloudInfrastructureController(CloudInfrastructureService cloudService)
    {
        _cloudService = cloudService;
    }

    [HttpGet(ApplicationRouteFactory.CloudInfrastructureRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<CloudResourceResponseDTO>>>> GetAll(
        [FromQuery] string? provider,
        [FromQuery] string? environment,
        [FromQuery] string? search)
    {
        List<CloudResourceResponseDTO> list = await _cloudService.GetAllResourcesAsync(provider, environment, search);
        return Ok(ApiResponseClass<List<CloudResourceResponseDTO>>.Succeeded(list));
    }

    [HttpGet(ApplicationRouteFactory.CloudInfrastructureRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<CloudResourceResponseDTO>>> GetById([FromRoute] Guid id)
    {
        CloudResourceResponseDTO res = await _cloudService.GetResourceByIdAsync(id);
        return Ok(ApiResponseClass<CloudResourceResponseDTO>.Succeeded(res));
    }

    [HttpGet(ApplicationRouteFactory.CloudInfrastructureRoutes.CostRollup)]
    public async Task<ActionResult<ApiResponseClass<decimal>>> GetCostRollup()
    {
        decimal totalSpend = await _cloudService.GetTotalMonthlySpendAsync();
        return Ok(ApiResponseClass<decimal>.Succeeded(totalSpend));
    }

    [HttpPost(ApplicationRouteFactory.CloudInfrastructureRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<CloudResourceResponseDTO>>> Create([FromBody] CloudResourceCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        CloudResourceResponseDTO res = await _cloudService.CreateResourceAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = res.Id }, ApiResponseClass<CloudResourceResponseDTO>.Succeeded(res, "Cloud resource registered.", 201));
    }

    [HttpPut(ApplicationRouteFactory.CloudInfrastructureRoutes.Update)]
    public async Task<ActionResult<ApiResponseClass<CloudResourceResponseDTO>>> Update([FromRoute] Guid id, [FromBody] CloudResourceUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        CloudResourceResponseDTO res = await _cloudService.UpdateResourceAsync(id, request, username);
        return Ok(ApiResponseClass<CloudResourceResponseDTO>.Succeeded(res, "Cloud resource updated successfully."));
    }

    [HttpDelete(ApplicationRouteFactory.CloudInfrastructureRoutes.Delete)]
    public async Task<ActionResult<ApiResponseClass<bool>>> Delete([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _cloudService.DeleteResourceAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Cloud resource deleted successfully."));
    }
}
