using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Vendors.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Vendors;

[ApiController]
[Route(ApplicationRouteFactory.VendorRoutes.ControllerURL)]
[Authorize]
public sealed class VendorsController : ControllerBase
{
    private readonly VendorsService _vendorsService;

    public VendorsController(VendorsService vendorsService)
    {
        _vendorsService = vendorsService;
    }

    [HttpGet(ApplicationRouteFactory.VendorRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<VendorResponseDTO>>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? search)
    {
        List<VendorResponseDTO> list = await _vendorsService.GetAllVendorsAsync(category, search);
        return Ok(ApiResponseClass<List<VendorResponseDTO>>.Succeeded(list));
    }

    [HttpGet(ApplicationRouteFactory.VendorRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<VendorResponseDTO>>> GetById([FromRoute] Guid id)
    {
        VendorResponseDTO vendor = await _vendorsService.GetVendorByIdAsync(id);
        return Ok(ApiResponseClass<VendorResponseDTO>.Succeeded(vendor));
    }

    [HttpPost(ApplicationRouteFactory.VendorRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<VendorResponseDTO>>> Create([FromBody] VendorCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        VendorResponseDTO vendor = await _vendorsService.CreateVendorAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = vendor.Id }, ApiResponseClass<VendorResponseDTO>.Succeeded(vendor, "Vendor profile added.", 201));
    }

    [HttpPut(ApplicationRouteFactory.VendorRoutes.Update)]
    public async Task<ActionResult<ApiResponseClass<VendorResponseDTO>>> Update([FromRoute] Guid id, [FromBody] VendorUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        VendorResponseDTO vendor = await _vendorsService.UpdateVendorAsync(id, request, username);
        return Ok(ApiResponseClass<VendorResponseDTO>.Succeeded(vendor, "Vendor profile updated successfully."));
    }

    [HttpDelete(ApplicationRouteFactory.VendorRoutes.Delete)]
    public async Task<ActionResult<ApiResponseClass<bool>>> Delete([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _vendorsService.DeleteVendorAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Vendor profile deleted successfully."));
    }
}
