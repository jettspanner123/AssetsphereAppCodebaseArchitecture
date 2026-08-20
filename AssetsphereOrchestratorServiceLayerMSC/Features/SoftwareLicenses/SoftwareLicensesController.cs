using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.SoftwareLicenses.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.SoftwareLicenses;

[ApiController]
[Route(ApplicationRouteFactory.SoftwareLicenseRoutes.ControllerURL)]
[Authorize]
public sealed class SoftwareLicensesController : ControllerBase
{
    private readonly SoftwareLicensesService _licenseService;

    public SoftwareLicensesController(SoftwareLicensesService licenseService)
    {
        _licenseService = licenseService;
    }

    [HttpGet(ApplicationRouteFactory.SoftwareLicenseRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<SoftwareLicenseResponseDTO>>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? complianceStatus,
        [FromQuery] string? search)
    {
        List<SoftwareLicenseResponseDTO> list = await _licenseService.GetAllLicensesAsync(category, complianceStatus, search);
        return Ok(ApiResponseClass<List<SoftwareLicenseResponseDTO>>.Succeeded(list));
    }

    [HttpGet(ApplicationRouteFactory.SoftwareLicenseRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<SoftwareLicenseResponseDTO>>> GetById([FromRoute] Guid id)
    {
        SoftwareLicenseResponseDTO lic = await _licenseService.GetLicenseByIdAsync(id);
        return Ok(ApiResponseClass<SoftwareLicenseResponseDTO>.Succeeded(lic));
    }

    [HttpPost(ApplicationRouteFactory.SoftwareLicenseRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<SoftwareLicenseResponseDTO>>> Create([FromBody] SoftwareLicenseCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        SoftwareLicenseResponseDTO lic = await _licenseService.CreateLicenseAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = lic.Id }, ApiResponseClass<SoftwareLicenseResponseDTO>.Succeeded(lic, "Software license registered.", 201));
    }

    [HttpPut(ApplicationRouteFactory.SoftwareLicenseRoutes.Update)]
    public async Task<ActionResult<ApiResponseClass<SoftwareLicenseResponseDTO>>> Update([FromRoute] Guid id, [FromBody] SoftwareLicenseUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        SoftwareLicenseResponseDTO lic = await _licenseService.UpdateLicenseAsync(id, request, username);
        return Ok(ApiResponseClass<SoftwareLicenseResponseDTO>.Succeeded(lic, "Software license updated successfully."));
    }

    [HttpDelete(ApplicationRouteFactory.SoftwareLicenseRoutes.Delete)]
    public async Task<ActionResult<ApiResponseClass<bool>>> Delete([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _licenseService.DeleteLicenseAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Software license deleted successfully."));
    }
}
