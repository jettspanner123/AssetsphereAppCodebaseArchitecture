using AssetsphereOrchestratorServiceLayerMSC.Constants;
using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Constants;
using AssetsphereOrchestratorServiceLayerMSC.Helpers;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;
using AssetsphereOrchestratorServiceLayerMSC.Utilities;
using AssetsphereOrchestratorServiceLayerMSC.Validators;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Services;

public sealed class AuthenticationService
{
    private readonly AssetsphereDbContext _dbContext;

    public AuthenticationService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request)
    {
        if (!EmailSValidator.Current.Validate(request.Email))
        {
            throw new ValidationCException("A valid email address is required.");
        }

        UserEntityClass? user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower());

        if (user == null || !PasswordHashHelper.Current.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new ValidationCException(AuthenticationCON.InvalidCredentialsError);
        }

        if (!user.IsActive)
        {
            throw new ValidationCException("This account is currently inactive. Please contact your system administrator.");
        }

        string accessToken = JwtTokenHelper.Current.GenerateAccessToken(user);
        string refreshToken = JwtTokenHelper.Current.GenerateRefreshToken();
        int refreshDays = ENValidator.Current.GetIntValue("ASSETSPHERE_JWT_REFRESH_EXPIRY_DAYS", 7);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshDays);
        user.LastLoginAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return new AuthResponseDTO
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(ENValidator.Current.GetIntValue("ASSETSPHERE_JWT_EXPIRY_MINUTES", 1440)),
            User = MapToUserProfile(user)
        };
    }

    public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request)
    {
        if (!EmailSValidator.Current.Validate(request.Email))
        {
            throw new ValidationCException("A valid email address is required.");
        }

        if (!PasswordSValidator.Current.Validate(request.Password))
        {
            throw new ValidationCException("Password must be at least 8 characters long.");
        }

        bool exists = await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower());
        if (exists)
        {
            throw new ValidationCException(AuthenticationCON.UserAlreadyExistsError);
        }

        UserEntityClass newUser = new UserEntityClass
        {
            Id = Guid.NewGuid(),
            Email = request.Email.Trim().ToLower(),
            PasswordHash = PasswordHashHelper.Current.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Role = request.Role,
            Department = request.Department,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "registration"
        };

        string accessToken = JwtTokenHelper.Current.GenerateAccessToken(newUser);
        string refreshToken = JwtTokenHelper.Current.GenerateRefreshToken();
        int refreshDays = ENValidator.Current.GetIntValue("ASSETSPHERE_JWT_REFRESH_EXPIRY_DAYS", 7);

        newUser.RefreshToken = refreshToken;
        newUser.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshDays);
        newUser.LastLoginAt = DateTime.UtcNow;

        await _dbContext.Users.AddAsync(newUser);
        await _dbContext.SaveChangesAsync();

        return new AuthResponseDTO
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(ENValidator.Current.GetIntValue("ASSETSPHERE_JWT_EXPIRY_MINUTES", 1440)),
            User = MapToUserProfile(newUser)
        };
    }

    public async Task<UserProfileDTO> GetCurrentUserAsync(Guid userId)
    {
        UserEntityClass? user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            throw new EntityNotFoundCException("User", userId);
        }

        return MapToUserProfile(user);
    }

    public async Task<AuthResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw new ValidationCException("Refresh token is required.");
        }

        UserEntityClass? user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new ValidationCException(AuthenticationCON.InvalidTokenError);
        }

        string newAccessToken = JwtTokenHelper.Current.GenerateAccessToken(user);
        string newRefreshToken = JwtTokenHelper.Current.GenerateRefreshToken();
        int refreshDays = ENValidator.Current.GetIntValue("ASSETSPHERE_JWT_REFRESH_EXPIRY_DAYS", 7);

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshDays);

        await _dbContext.SaveChangesAsync();

        return new AuthResponseDTO
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(ENValidator.Current.GetIntValue("ASSETSPHERE_JWT_EXPIRY_MINUTES", 1440)),
            User = MapToUserProfile(user)
        };
    }

    private static UserProfileDTO MapToUserProfile(UserEntityClass user)
    {
        return new UserProfileDTO
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            Department = user.Department,
            AvatarUrl = user.AvatarUrl,
            LastLoginAt = user.LastLoginAt
        };
    }
}
