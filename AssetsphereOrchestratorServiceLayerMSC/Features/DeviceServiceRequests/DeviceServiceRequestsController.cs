using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.DeviceServiceRequests.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.DeviceServiceRequests;

[ApiController]
[Route("Api/V1/DeviceServiceRequests")]
[Authorize]
public sealed class DeviceServiceRequestsController : ControllerBase
{
    private readonly IDeviceServiceRequestsService _serviceRequestsService;

    public DeviceServiceRequestsController(IDeviceServiceRequestsService serviceRequestsService)
    {
        _serviceRequestsService = serviceRequestsService;
    }

    [HttpGet("")]
    public async Task<ActionResult<ApiResponseClass<List<DeviceServiceRequestResponseDTO>>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? userId)
    {
        string currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? userId ?? string.Empty;
        string currentUserRole = User.FindFirstValue(ClaimTypes.Role) ?? "USER";

        List<DeviceServiceRequestResponseDTO> results = await _serviceRequestsService.GetAllRequestsAsync(
            currentUserId,
            currentUserRole,
            status
        );

        return Ok(ApiResponseClass<List<DeviceServiceRequestResponseDTO>>.Succeeded(results));
    }

    [HttpGet("MyRequests")]
    public async Task<ActionResult<ApiResponseClass<List<DeviceServiceRequestResponseDTO>>>> GetMyRequests([FromQuery] string? userId)
    {
        string currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? userId ?? string.Empty;

        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return BadRequest(ApiResponseClass<List<DeviceServiceRequestResponseDTO>>.Failed("User ID is required.", null, 400));
        }

        List<DeviceServiceRequestResponseDTO> results = await _serviceRequestsService.GetMyRequestsAsync(currentUserId);
        return Ok(ApiResponseClass<List<DeviceServiceRequestResponseDTO>>.Succeeded(results));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponseClass<DeviceServiceRequestResponseDTO>>> GetById([FromRoute] Guid id)
    {
        DeviceServiceRequestResponseDTO? result = await _serviceRequestsService.GetRequestByIdAsync(id);
        if (result == null)
        {
            return NotFound(ApiResponseClass<DeviceServiceRequestResponseDTO>.Failed($"Device service request '{id}' not found.", null, 404));
        }

        return Ok(ApiResponseClass<DeviceServiceRequestResponseDTO>.Succeeded(result));
    }

    [HttpPost("")]
    public async Task<ActionResult<ApiResponseClass<DeviceServiceRequestResponseDTO>>> Create([FromBody] CreateDeviceServiceRequestDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.ServiceCategory) ||
            string.IsNullOrWhiteSpace(request.ComponentSubtype) ||
            string.IsNullOrWhiteSpace(request.DescriptionRichText))
        {
            return BadRequest(ApiResponseClass<DeviceServiceRequestResponseDTO>.Failed(
                "Service Category, Component Subtype, and Problem Description are required.",
                null,
                400
            ));
        }

        string requesterUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anonymous_user";
        string requesterName = User.FindFirstValue(ClaimTypes.Name) ?? "Enterprise User";
        string requesterEmail = User.FindFirstValue(ClaimTypes.Email) ?? "user@assetsphere.internal";
        string requesterRole = User.FindFirstValue(ClaimTypes.Role) ?? "USER";

        DeviceServiceRequestResponseDTO result = await _serviceRequestsService.CreateRequestAsync(
            request,
            requesterUserId,
            requesterName,
            requesterEmail,
            requesterRole
        );

        return Ok(ApiResponseClass<DeviceServiceRequestResponseDTO>.Succeeded(
            result,
            $"Device service request {result.RequestNumber} submitted successfully."
        ));
    }

    [HttpPatch("{id:guid}/Status")]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<DeviceServiceRequestResponseDTO>>> UpdateStatus(
        [FromRoute] Guid id,
        [FromBody] UpdateDeviceServiceRequestStatusDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(ApiResponseClass<DeviceServiceRequestResponseDTO>.Failed("Status is required.", null, 400));
        }

        string updatedBy = User.FindFirstValue(ClaimTypes.Name) ?? "operator";
        DeviceServiceRequestResponseDTO? result = await _serviceRequestsService.UpdateRequestStatusAsync(
            id,
            request,
            updatedBy
        );

        if (result == null)
        {
            return NotFound(ApiResponseClass<DeviceServiceRequestResponseDTO>.Failed($"Device service request '{id}' not found.", null, 404));
        }

        return Ok(ApiResponseClass<DeviceServiceRequestResponseDTO>.Succeeded(
            result,
            $"Request {result.RequestNumber} status updated to {result.Status}."
        ));
    }
}
