using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Features.Notifications.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Notifications;

[ApiController]
[Route("Api/V1/Notifications")]
public sealed class NotificationsController : ControllerBase
{
    private readonly INotificationsService _notificationsService;

    public NotificationsController(INotificationsService notificationsService)
    {
        _notificationsService = notificationsService;
    }

    [HttpGet("")]
    public async Task<ActionResult<ApiResponseClass<List<NotificationResponseDTO>>>> GetNotifications(
        [FromQuery] string? userId,
        [FromQuery] string? role)
    {
        string? currentUserId = userId ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        string? currentUserRole = role ?? User.FindFirstValue(ClaimTypes.Role);

        List<NotificationResponseDTO> notifications = await _notificationsService.GetNotificationsAsync(currentUserId, currentUserRole);
        return Ok(ApiResponseClass<List<NotificationResponseDTO>>.Succeeded(notifications));
    }

    [HttpPost("MarkAsRead/{id:guid}")]
    public async Task<ActionResult<ApiResponseClass<NotificationResponseDTO>>> MarkAsRead(
        [FromRoute] Guid id,
        [FromQuery] string? userId)
    {
        string? currentUserId = userId ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return BadRequest(ApiResponseClass<NotificationResponseDTO>.Failed("User identifier is required to mark notification as read.", null, 400));
        }

        NotificationResponseDTO? result = await _notificationsService.MarkAsReadAsync(id, currentUserId);
        if (result == null)
        {
            return NotFound(ApiResponseClass<NotificationResponseDTO>.Failed($"Notification with ID '{id}' was not found.", null, 404));
        }

        return Ok(ApiResponseClass<NotificationResponseDTO>.Succeeded(result, "Notification marked as read."));
    }

    [HttpPost("MarkAllAsRead")]
    public async Task<ActionResult<ApiResponseClass<int>>> MarkAllAsRead(
        [FromQuery] string? userId,
        [FromQuery] string? role)
    {
        string? currentUserId = userId ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        string? currentUserRole = role ?? User.FindFirstValue(ClaimTypes.Role);

        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return BadRequest(ApiResponseClass<int>.Failed("User identifier is required to mark all notifications as read.", null, 400));
        }

        int count = await _notificationsService.MarkAllAsReadAsync(currentUserId, currentUserRole);
        return Ok(ApiResponseClass<int>.Succeeded(count, $"{count} notifications marked as read."));
    }

    [HttpPost("")]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<NotificationResponseDTO>>> CreateNotification([FromBody] CreateNotificationDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Heading) || string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest(ApiResponseClass<NotificationResponseDTO>.Failed("Heading and Description are required.", null, 400));
        }

        string creator = User.FindFirstValue(ClaimTypes.Name) ?? "operator";
        NotificationResponseDTO result = await _notificationsService.CreateNotificationAsync(request, creator);

        return Ok(ApiResponseClass<NotificationResponseDTO>.Succeeded(result, "Notification created successfully."));
    }
}
