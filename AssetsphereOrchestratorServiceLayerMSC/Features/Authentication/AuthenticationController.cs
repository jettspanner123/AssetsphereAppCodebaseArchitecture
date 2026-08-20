using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Authentication;

[ApiController]
[Route(ApplicationRouteFactory.AuthenticationRoutes.ControllerURL)]
public sealed class AuthenticationController : ControllerBase
{
    private readonly AuthenticationService _authenticationService;

    public AuthenticationController(AuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    [HttpPost(ApplicationRouteFactory.AuthenticationRoutes.Login)]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseClass<AuthResponseDTO>>> Login([FromBody] LoginRequestDTO request)
    {
        AuthResponseDTO response = await _authenticationService.LoginAsync(request);
        return Ok(ApiResponseClass<AuthResponseDTO>.Succeeded(response, "Login successful."));
    }

    [HttpPost(ApplicationRouteFactory.AuthenticationRoutes.Register)]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseClass<AuthResponseDTO>>> Register([FromBody] RegisterRequestDTO request)
    {
        AuthResponseDTO response = await _authenticationService.RegisterAsync(request);
        return Ok(ApiResponseClass<AuthResponseDTO>.Succeeded(response, "User registered successfully.", 201));
    }

    [HttpPost(ApplicationRouteFactory.AuthenticationRoutes.RefreshToken)]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseClass<AuthResponseDTO>>> RefreshToken([FromBody] RefreshTokenRequestDTO request)
    {
        AuthResponseDTO response = await _authenticationService.RefreshTokenAsync(request);
        return Ok(ApiResponseClass<AuthResponseDTO>.Succeeded(response, "Token refreshed successfully."));
    }

    [HttpGet(ApplicationRouteFactory.AuthenticationRoutes.Me)]
    [Authorize]
    public async Task<ActionResult<ApiResponseClass<UserProfileDTO>>> GetCurrentUser()
    {
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized(ApiResponseClass<UserProfileDTO>.Failed("Invalid user identity in token.", null, 401));
        }

        UserProfileDTO profile = await _authenticationService.GetCurrentUserAsync(userId);
        return Ok(ApiResponseClass<UserProfileDTO>.Succeeded(profile));
    }
}
