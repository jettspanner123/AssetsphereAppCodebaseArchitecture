using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.ServiceDesk.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.ServiceDesk;

[ApiController]
[Route(ApplicationRouteFactory.ServiceDeskRoutes.ControllerURL)]
[Authorize]
public sealed class ServiceDeskController : ControllerBase
{
    private readonly ServiceDeskService _serviceDeskService;

    public ServiceDeskController(ServiceDeskService serviceDeskService)
    {
        _serviceDeskService = serviceDeskService;
    }

    [HttpGet(ApplicationRouteFactory.ServiceDeskRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<ServiceTicketResponseDTO>>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] string? search)
    {
        List<ServiceTicketResponseDTO> list = await _serviceDeskService.GetAllTicketsAsync(status, priority, search);
        return Ok(ApiResponseClass<List<ServiceTicketResponseDTO>>.Succeeded(list));
    }

    [HttpGet(ApplicationRouteFactory.ServiceDeskRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<ServiceTicketResponseDTO>>> GetById([FromRoute] Guid id)
    {
        ServiceTicketResponseDTO ticket = await _serviceDeskService.GetTicketByIdAsync(id);
        return Ok(ApiResponseClass<ServiceTicketResponseDTO>.Succeeded(ticket));
    }

    [HttpPost(ApplicationRouteFactory.ServiceDeskRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<ServiceTicketResponseDTO>>> Create([FromBody] ServiceTicketCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        ServiceTicketResponseDTO ticket = await _serviceDeskService.CreateTicketAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, ApiResponseClass<ServiceTicketResponseDTO>.Succeeded(ticket, "Ticket opened successfully.", 201));
    }

    [HttpPut(ApplicationRouteFactory.ServiceDeskRoutes.Update)]
    public async Task<ActionResult<ApiResponseClass<ServiceTicketResponseDTO>>> Update([FromRoute] Guid id, [FromBody] ServiceTicketUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        ServiceTicketResponseDTO ticket = await _serviceDeskService.UpdateTicketAsync(id, request, username);
        return Ok(ApiResponseClass<ServiceTicketResponseDTO>.Succeeded(ticket, "Ticket updated successfully."));
    }

    [HttpPatch(ApplicationRouteFactory.ServiceDeskRoutes.Resolve)]
    public async Task<ActionResult<ApiResponseClass<ServiceTicketResponseDTO>>> Resolve([FromRoute] Guid id, [FromBody] ServiceTicketResolveDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        ServiceTicketResponseDTO ticket = await _serviceDeskService.ResolveTicketAsync(id, request, username);
        return Ok(ApiResponseClass<ServiceTicketResponseDTO>.Succeeded(ticket, "Ticket marked as resolved."));
    }

    [HttpDelete(ApplicationRouteFactory.ServiceDeskRoutes.Delete)]
    public async Task<ActionResult<ApiResponseClass<bool>>> Delete([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _serviceDeskService.DeleteTicketAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Ticket deleted successfully."));
    }
}
