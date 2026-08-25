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

        if (!user.IsVerified)
        {
            throw new ValidationCException("VERIFICATION_PENDING: Your account is pending verification by an Operator. Please wait for approval or contact your administrator.");
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

    public async Task<RegisterResponseDTO> RegisterAsync(RegisterRequestDTO request)
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
            Role = UserRoleType.USER, // Strictly USER role for public registration
            Department = request.Department,
            IsActive = true,
            IsVerified = false, // Verification required by Operator
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "registration"
        };

        await _dbContext.Users.AddAsync(newUser);
        await _dbContext.SaveChangesAsync();

        return new RegisterResponseDTO
        {
            Message = "Your account creation request has been submitted to the Operator for review. Please wait for approval before logging in.",
            IsVerified = false,
            IsPendingApproval = true,
            User = MapToUserProfile(newUser)
        };
    }

    public async Task<List<PendingUserDTO>> GetPendingUsersAsync(string? status = "pending")
    {
        IQueryable<UserEntityClass> query = _dbContext.Users.AsQueryable();

        switch (status?.ToLowerInvariant())
        {
            case "approved":
                query = query.Where(u => u.IsVerified && !u.IsDeleted);
                break;
            case "rejected":
                query = query.Where(u => u.IsDeleted);
                break;
            case "all":
                // Retrieve all requests/users
                break;
            case "pending":
            default:
                query = query.Where(u => !u.IsVerified && !u.IsDeleted);
                break;
        }

        return await query
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new PendingUserDTO
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                Department = u.Department,
                CreatedAt = u.CreatedAt,
                IsVerified = u.IsVerified,
                IsDeleted = u.IsDeleted
            })
            .ToListAsync();
    }

    public async Task<UserProfileDTO> ApproveUserAsync(Guid id)
    {
        UserEntityClass? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
        {
            throw new EntityNotFoundCException("User", id);
        }

        user.IsVerified = true;
        user.IsActive = true;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = "operator_approval";

        await _dbContext.SaveChangesAsync();

        return MapToUserProfile(user);
    }

    public async Task<bool> RejectUserAsync(Guid id)
    {
        UserEntityClass? user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null)
        {
            throw new EntityNotFoundCException("User", id);
        }

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.UpdatedBy = "operator_rejection";

        await _dbContext.SaveChangesAsync();
        return true;
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
            IsVerified = user.IsVerified,
            LastLoginAt = user.LastLoginAt
        };
    }
}
