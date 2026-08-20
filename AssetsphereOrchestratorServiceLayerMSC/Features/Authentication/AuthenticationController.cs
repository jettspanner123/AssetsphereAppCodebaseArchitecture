using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Assertion;
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
    private readonly ILogger<AuthenticationController> _logger;

    public AuthenticationController(
        AuthenticationService authenticationService,
        ILogger<AuthenticationController> logger)
    {
        _authenticationService = authenticationService;
        _logger = logger;
    }

    [HttpPost(ApplicationRouteFactory.AuthenticationRoutes.Login)]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseClass<AuthResponseDTO>>> Login([FromBody] LoginRequestDTO? request)
    {
        try
        {
            AuthenticationAssertion.Current.CheckForNullRequest(request);
            AuthenticationAssertion.Current.AssertLoginRequest(request);

            AuthResponseDTO response = await _authenticationService.LoginAsync(request);
            return Ok(ApiResponseClass<AuthResponseDTO>.Succeeded(response, "Login successful.", 200));
        }
        catch (ValidationCException valEx)
        {
            _logger.LogWarning("Login validation failed: {Message}", valEx.Message);
            return BadRequest(ApiResponseClass<AuthResponseDTO>.Failed(valEx.Message, valEx.ValidationErrors, 400));
        }
        catch (UnauthorizedAccessException authEx)
        {
            _logger.LogWarning("Unauthorized login attempt: {Message}", authEx.Message);
            return Unauthorized(ApiResponseClass<AuthResponseDTO>.Failed(authEx.Message, null, 401));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred during login for email: {Email}", request?.Email);
            return StatusCode(500, ApiResponseClass<AuthResponseDTO>.Failed(
                "An unexpected error occurred while processing the login request.",
                new List<string> { ex.Message },
                500
            ));
        }
    }

    [HttpPost(ApplicationRouteFactory.AuthenticationRoutes.Register)]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseClass<AuthResponseDTO>>> Register([FromBody] RegisterRequestDTO? request)
    {
        try
        {
            AuthenticationAssertion.Current.CheckForNullRequest(request);
            AuthenticationAssertion.Current.AssertRegisterRequest(request);

            AuthResponseDTO response = await _authenticationService.RegisterAsync(request);
            return Created(
                $"{ApplicationRouteFactory.AuthenticationRoutes.ControllerURL}/{ApplicationRouteFactory.AuthenticationRoutes.Me}",
                ApiResponseClass<AuthResponseDTO>.Succeeded(response, "User registered successfully.", 201)
            );
        }
        catch (ValidationCException valEx)
        {
            _logger.LogWarning("Registration validation failed: {Message}", valEx.Message);
            return BadRequest(ApiResponseClass<AuthResponseDTO>.Failed(valEx.Message, valEx.ValidationErrors, 400));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred during user registration: {Email}", request?.Email);
            return StatusCode(500, ApiResponseClass<AuthResponseDTO>.Failed(
                "An unexpected error occurred while registering the user.",
                new List<string> { ex.Message },
                500
            ));
        }
    }

    [HttpPost(ApplicationRouteFactory.AuthenticationRoutes.RefreshToken)]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseClass<AuthResponseDTO>>> RefreshToken([FromBody] RefreshTokenRequestDTO? request)
    {
        try
        {
            AuthenticationAssertion.Current.CheckForNullRequest(request);
            AuthenticationAssertion.Current.AssertRefreshTokenRequest(request);

            AuthResponseDTO response = await _authenticationService.RefreshTokenAsync(request);
            return Ok(ApiResponseClass<AuthResponseDTO>.Succeeded(response, "Token refreshed successfully.", 200));
        }
        catch (ValidationCException valEx)
        {
            _logger.LogWarning("Token refresh validation failed: {Message}", valEx.Message);
            return BadRequest(ApiResponseClass<AuthResponseDTO>.Failed(valEx.Message, valEx.ValidationErrors, 400));
        }
        catch (UnauthorizedAccessException authEx)
        {
            _logger.LogWarning("Unauthorized token refresh: {Message}", authEx.Message);
            return Unauthorized(ApiResponseClass<AuthResponseDTO>.Failed(authEx.Message, null, 401));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while refreshing token.");
            return StatusCode(500, ApiResponseClass<AuthResponseDTO>.Failed(
                "An unexpected error occurred while refreshing token.",
                new List<string> { ex.Message },
                500
            ));
        }
    }

    [HttpGet(ApplicationRouteFactory.AuthenticationRoutes.Me)]
    [Authorize]
    public async Task<ActionResult<ApiResponseClass<UserProfileDTO>>> GetCurrentUser()
    {
        try
        {
            string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid userId = AuthenticationAssertion.Current.AssertValidUserId(userIdClaim);

            UserProfileDTO profile = await _authenticationService.GetCurrentUserAsync(userId);
            return Ok(ApiResponseClass<UserProfileDTO>.Succeeded(profile, "User profile retrieved.", 200));
        }
        catch (UnauthorizedAccessException authEx)
        {
            _logger.LogWarning("Unauthorized current user profile request: {Message}", authEx.Message);
            return Unauthorized(ApiResponseClass<UserProfileDTO>.Failed(authEx.Message, null, 401));
        }
        catch (EntityNotFoundCException notFoundEx)
        {
            _logger.LogWarning("User profile not found: {Message}", notFoundEx.Message);
            return NotFound(ApiResponseClass<UserProfileDTO>.Failed(notFoundEx.Message, null, 404));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while retrieving user profile.");
            return StatusCode(500, ApiResponseClass<UserProfileDTO>.Failed(
                "An unexpected error occurred while retrieving current user profile.",
                new List<string> { ex.Message },
                500
            ));
        }
    }
}
