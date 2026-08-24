using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.AssetInventory.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.AssetInventory;

[ApiController]
[Route(ApplicationRouteFactory.AssetInventoryRoutes.ControllerURL)]
[Authorize]
public sealed class AssetInventoryController : ControllerBase
{
    private readonly AssetInventoryService _assetService;

    public AssetInventoryController(AssetInventoryService assetService)
    {
        _assetService = assetService;
    }

    [HttpGet(ApplicationRouteFactory.AssetInventoryRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<AssetResponseDTO>>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] string? location)
    {
        List<AssetResponseDTO> assets = await _assetService.GetAllAssetsAsync(category, status, search, location);
        return Ok(ApiResponseClass<List<AssetResponseDTO>>.Succeeded(assets));
    }

    [HttpGet(ApplicationRouteFactory.AssetInventoryRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<AssetResponseDTO>>> GetById([FromRoute] Guid id)
    {
        AssetResponseDTO asset = await _assetService.GetAssetByIdAsync(id);
        return Ok(ApiResponseClass<AssetResponseDTO>.Succeeded(asset));
    }

    [HttpGet(ApplicationRouteFactory.AssetInventoryRoutes.QrLookup)]
    public async Task<ActionResult<ApiResponseClass<AssetResponseDTO>>> GetByQr([FromRoute] string qrAssetId)
    {
        AssetResponseDTO asset = await _assetService.GetAssetByTagOrQrAsync(qrAssetId);
        return Ok(ApiResponseClass<AssetResponseDTO>.Succeeded(asset));
    }

    [HttpPost(ApplicationRouteFactory.AssetInventoryRoutes.Create)]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<AssetResponseDTO>>> Create([FromBody] AssetCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        AssetResponseDTO asset = await _assetService.CreateAssetAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = asset.Id }, ApiResponseClass<AssetResponseDTO>.Succeeded(asset, "Asset created successfully.", 201));
    }

    [HttpPut(ApplicationRouteFactory.AssetInventoryRoutes.Update)]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<AssetResponseDTO>>> Update([FromRoute] Guid id, [FromBody] AssetUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        AssetResponseDTO asset = await _assetService.UpdateAssetAsync(id, request, username);
        return Ok(ApiResponseClass<AssetResponseDTO>.Succeeded(asset, "Asset updated successfully."));
    }

    [HttpDelete(ApplicationRouteFactory.AssetInventoryRoutes.Delete)]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<bool>>> Delete([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _assetService.DeleteAssetAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Asset deleted successfully."));
    }

    [HttpPatch(ApplicationRouteFactory.AssetInventoryRoutes.UpdateLifecycle)]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<AssetResponseDTO>>> UpdateLifecycle([FromRoute] Guid id, [FromBody] AssetLifecycleUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        AssetResponseDTO asset = await _assetService.UpdateLifecycleStatusAsync(id, request, username);
        return Ok(ApiResponseClass<AssetResponseDTO>.Succeeded(asset, "Asset status updated successfully."));
    }

    [HttpPatch(ApplicationRouteFactory.AssetInventoryRoutes.AssignEmployee)]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<AssetResponseDTO>>> AssignEmployee([FromRoute] Guid id, [FromBody] AssetAssignDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        AssetResponseDTO asset = await _assetService.AssignAssetAsync(id, request, username);
        return Ok(ApiResponseClass<AssetResponseDTO>.Succeeded(asset, "Asset assignment updated successfully."));
    }

    [HttpPost(ApplicationRouteFactory.AssetInventoryRoutes.BulkAction)]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<int>>> BulkAction([FromBody] AssetBulkActionDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        int affected = await _assetService.BulkActionAsync(request, username);
        return Ok(ApiResponseClass<int>.Succeeded(affected, $"Bulk action completed on {affected} assets."));
    }
}
