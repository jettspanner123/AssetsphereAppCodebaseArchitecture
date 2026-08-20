using AssetsphereOrchestratorServiceLayerMSC.Constants;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class UserEntityClass : BaseEntityClass
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = ApplicationCON.RoleManager;
    public string? Department { get; set; }
    public string? AvatarUrl { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
}
