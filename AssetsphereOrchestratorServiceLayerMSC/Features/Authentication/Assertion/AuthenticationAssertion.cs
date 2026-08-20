using System.Diagnostics.CodeAnalysis;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Assertion;

public sealed class AuthenticationAssertion
{
    private static readonly AuthenticationAssertion _current = new AuthenticationAssertion();
    public static AuthenticationAssertion Current => _current;

    private AuthenticationAssertion()
    {
    }

    public void CheckForNullRequest<T>([NotNull] T? request, string errorMessage = "Request body cannot be empty.")
    {
        if (request is null)
        {
            throw new ValidationCException(errorMessage);
        }
    }

    public void AssertLoginRequest([NotNull] LoginRequestDTO? request)
    {
        CheckForNullRequest(request, "Login request body cannot be empty.");

        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            throw new ValidationCException(new List<string>
            {
                "Both email and password must be provided."
            });
        }
    }

    public void AssertRegisterRequest([NotNull] RegisterRequestDTO? request)
    {
        CheckForNullRequest(request, "Registration request body cannot be empty.");

        List<string> missingFields = new List<string>();
        if (string.IsNullOrWhiteSpace(request.Email)) missingFields.Add("Email is required.");
        if (string.IsNullOrWhiteSpace(request.Password)) missingFields.Add("Password is required.");
        if (string.IsNullOrWhiteSpace(request.FirstName)) missingFields.Add("First name is required.");
        if (string.IsNullOrWhiteSpace(request.LastName)) missingFields.Add("Last name is required.");

        if (missingFields.Count > 0)
        {
            throw new ValidationCException(missingFields);
        }
    }

    public void AssertRefreshTokenRequest([NotNull] RefreshTokenRequestDTO? request)
    {
        CheckForNullRequest(request, "Refresh token request body cannot be empty.");

        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw new ValidationCException(new List<string>
            {
                "RefreshToken property cannot be null or empty."
            });
        }
    }

    public Guid AssertValidUserId(string? userIdClaim)
    {
        if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            throw new UnauthorizedAccessException("Invalid or missing user identity in security token.");
        }
        return userId;
    }
}
