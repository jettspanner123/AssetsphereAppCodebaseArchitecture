using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Procurement.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Procurement;

[ApiController]
[Route(ApplicationRouteFactory.ProcurementRoutes.ControllerURL)]
[Authorize]
public sealed class ProcurementController : ControllerBase
{
    private readonly ProcurementService _procurementService;

    public ProcurementController(ProcurementService procurementService)
    {
        _procurementService = procurementService;
    }

    [HttpGet(ApplicationRouteFactory.ProcurementRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<PurchaseOrderResponseDTO>>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        List<PurchaseOrderResponseDTO> list = await _procurementService.GetAllPurchaseOrdersAsync(status, search);
        return Ok(ApiResponseClass<List<PurchaseOrderResponseDTO>>.Succeeded(list));
    }

    [HttpGet(ApplicationRouteFactory.ProcurementRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<PurchaseOrderResponseDTO>>> GetById([FromRoute] Guid id)
    {
        PurchaseOrderResponseDTO po = await _procurementService.GetPurchaseOrderByIdAsync(id);
        return Ok(ApiResponseClass<PurchaseOrderResponseDTO>.Succeeded(po));
    }

    [HttpPost(ApplicationRouteFactory.ProcurementRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<PurchaseOrderResponseDTO>>> Create([FromBody] PurchaseOrderCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        PurchaseOrderResponseDTO po = await _procurementService.CreatePurchaseOrderAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = po.Id }, ApiResponseClass<PurchaseOrderResponseDTO>.Succeeded(po, "Purchase order generated.", 201));
    }

    [HttpPut(ApplicationRouteFactory.ProcurementRoutes.Update)]
    public async Task<ActionResult<ApiResponseClass<PurchaseOrderResponseDTO>>> Update([FromRoute] Guid id, [FromBody] PurchaseOrderUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        PurchaseOrderResponseDTO po = await _procurementService.UpdatePurchaseOrderAsync(id, request, username);
        return Ok(ApiResponseClass<PurchaseOrderResponseDTO>.Succeeded(po, "Purchase order updated successfully."));
    }

    [HttpPatch(ApplicationRouteFactory.ProcurementRoutes.Approve)]
    public async Task<ActionResult<ApiResponseClass<PurchaseOrderResponseDTO>>> Approve([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        PurchaseOrderResponseDTO po = await _procurementService.ApprovePurchaseOrderAsync(id, username);
        return Ok(ApiResponseClass<PurchaseOrderResponseDTO>.Succeeded(po, "Purchase order approved successfully."));
    }

    [HttpDelete(ApplicationRouteFactory.ProcurementRoutes.Delete)]
    public async Task<ActionResult<ApiResponseClass<bool>>> Delete([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _procurementService.DeletePurchaseOrderAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Purchase order deleted successfully."));
    }
}
