using AssetsphereOrchestratorServiceLayerMSC.Models.Types;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class LoginRequestDTO
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public sealed class RegisterRequestDTO
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRoleType Role { get; set; } = UserRoleType.USER;
    public DepartmentType? Department { get; set; }
}

public sealed class RefreshTokenRequestDTO
{
    public string RefreshToken { get; set; } = string.Empty;
}

public sealed class UserProfileDTO
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public UserRoleType Role { get; set; } = UserRoleType.USER;
    public DepartmentType? Department { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public sealed class AuthResponseDTO
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserProfileDTO User { get; set; } = new();
}
